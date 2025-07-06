-- Fix RLS policies to avoid infinite recursion
-- Run this script in your Supabase SQL editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view team members of their teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can view registrations of their teams" ON public.competition_registrations;

-- Create new policies that avoid recursion
-- Policy for team_members - simplified to avoid recursion
CREATE POLICY "Users can view team members" ON public.team_members
    FOR SELECT USING (
        -- Users can see members of teams they belong to
        EXISTS (
            SELECT 1 FROM public.teams t 
            WHERE t.id = team_members.team_id 
            AND (
                t.created_by = auth.uid() OR 
                t.is_public = TRUE
            )
        )
    );

-- Alternative policy without subquery recursion
CREATE POLICY "Users can view their own team membership" ON public.team_members
    FOR SELECT USING (user_id = auth.uid());

-- Policy for teams - more permissive for public teams
CREATE POLICY "Users can view public teams and their own teams" ON public.teams
    FOR SELECT USING (
        is_public = TRUE OR 
        created_by = auth.uid()
    );

-- Policy for competition registrations - simplified
CREATE POLICY "Users can view their team registrations" ON public.competition_registrations
    FOR SELECT USING (
        team_id IN (
            SELECT tm.team_id FROM public.team_ members tm 
            WHERE tm.user_id = auth.uid()
        )
    );

-- Additional policy to allow team leaders to manage registrations
CREATE POLICY "Team leaders can manage registrations" ON public.competition_registrations
    FOR ALL USING (
        team_id IN (
            SELECT tm.team_id FROM public.team_members tm 
            WHERE tm.user_id = auth.uid() AND tm.role = 'leader'
        )
    );

-- Make sure user_profiles policies are correct
DROP POLICY IF EXISTS "Users can view team member profiles" ON public.user_profiles;
CREATE POLICY "Users can view team member profiles" ON public.user_profiles
    FOR SELECT USING (
        auth.uid() = id OR  -- Own profile
        id IN (  -- Teammates' profiles
            SELECT tm1.user_id 
            FROM public.team_members tm1 
            JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id 
            WHERE tm2.user_id = auth.uid()
        )
    );

-- Update the function to use proper security context
CREATE OR REPLACE FUNCTION get_user_current_team(user_uuid UUID)
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR,
    team_code VARCHAR,
    role team_member_role,
    member_count BIGINT
) 
SECURITY DEFINER  -- Run with function owner privileges
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.code,
        tm.role,
        COUNT(tm2.user_id) as member_count
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    LEFT JOIN team_members tm2 ON t.id = tm2.team_id
    WHERE tm.user_id = user_uuid
    AND t.status = 'active'
    GROUP BY t.id, t.name, t.code, tm.role;
END;
$$ LANGUAGE plpgsql;

-- Update join function with better error handling
CREATE OR REPLACE FUNCTION join_team_by_code(team_code_input VARCHAR, user_uuid UUID)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_team_id UUID;
    current_member_count INTEGER;
    max_team_members INTEGER;
    result JSON;
BEGIN
    -- Check if user is already in a team
    IF EXISTS (SELECT 1 FROM team_members WHERE user_id = user_uuid) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User is already in a team'
        );
    END IF;
    
    -- Get team info
    SELECT id, max_members INTO target_team_id, max_team_members
    FROM teams 
    WHERE code = UPPER(team_code_input) AND status = 'active';
    
    IF target_team_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Team not found or inactive'
        );
    END IF;
    
    -- Check current member count
    SELECT COUNT(*) INTO current_member_count
    FROM team_members 
    WHERE team_id = target_team_id;
    
    IF current_member_count >= max_team_members THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Team is full'
        );
    END IF;
    
    -- Add user to team
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (target_team_id, user_uuid, 'member');
    
    RETURN json_build_object(
        'success', true,
        'message', 'Successfully joined team',
        'team_id', target_team_id
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'message', 'Failed to join team: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- Create a simple function to create teams
CREATE OR REPLACE FUNCTION create_team(team_name VARCHAR, team_code VARCHAR, creator_id UUID)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_team_id UUID;
    result JSON;
BEGIN
    -- Check if user is already in a team
    IF EXISTS (SELECT 1 FROM team_members WHERE user_id = creator_id) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User is already in a team'
        );
    END IF;
    
    -- Check if team code already exists
    IF EXISTS (SELECT 1 FROM teams WHERE code = team_code) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Team code already exists'
        );
    END IF;
    
    -- Create team
    INSERT INTO teams (name, code, created_by)
    VALUES (team_name, team_code, creator_id)
    RETURNING id INTO new_team_id;
    
    -- Add creator as team leader
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (new_team_id, creator_id, 'leader');
    
    RETURN json_build_object(
        'success', true,
        'message', 'Team created successfully',
        'team_id', new_team_id,
        'team_code', team_code
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'message', 'Failed to create team: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql;
