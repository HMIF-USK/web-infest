#!/bin/bash

# 🔍 OAuth Debug Script untuk InFest USK
echo "🔍 OAuth Flow Debug - InFest USK"
echo "================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 Debugging OAuth Configuration...${NC}"
echo ""

echo -e "${YELLOW}1. Environment Variables Check:${NC}"
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
    
    # Check if variables are set (without showing actual values)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local; then
        URL_LINE=$(grep "NEXT_PUBLIC_SUPABASE_URL=" .env.local)
        if [[ $URL_LINE == *"your_supabase_project_url_here"* ]]; then
            echo "❌ NEXT_PUBLIC_SUPABASE_URL not configured (still has placeholder)"
        else
            echo "✅ NEXT_PUBLIC_SUPABASE_URL configured"
        fi
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL not found"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
        KEY_LINE=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local)
        if [[ $KEY_LINE == *"your_supabase_anon_key_here"* ]]; then
            echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured (still has placeholder)"
        else
            echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configured"
        fi
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found"
    fi
else
    echo "❌ .env.local not found"
fi

echo ""
echo -e "${YELLOW}2. Required Files Check:${NC}"

FILES=(
    "src/app/(sites)/login/page.tsx"
    "src/app/(sites)/auth/callback/page.tsx"
    "src/libs/services/supabaseClient.ts"
    "middleware.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo -e "${YELLOW}3. OAuth Flow Components Check:${NC}"

# Check login page for OAuth implementation
if grep -q "signInWithOAuth" src/app/(sites)/login/page.tsx; then
    echo "✅ OAuth login implementation found"
else
    echo "❌ OAuth login implementation missing"
fi

# Check callback page
if [ -f "src/app/(sites)/auth/callback/page.tsx" ]; then
    if grep -q "getSession" src/app/(sites)/auth/callback/page.tsx; then
        echo "✅ Callback page has session handling"
    else
        echo "❌ Callback page missing session handling"
    fi
else
    echo "❌ Callback page missing"
fi

# Check middleware
if [ -f "middleware.ts" ]; then
    if grep -q "auth/callback" middleware.ts; then
        echo "✅ Middleware allows callback route"
    else
        echo "⚠️ Middleware might block callback route"
    fi
else
    echo "❌ Middleware missing"
fi

echo ""
echo -e "${YELLOW}4. Supabase Client Configuration Check:${NC}"

if grep -q "detectSessionInUrl.*true" src/libs/services/supabaseClient.ts; then
    echo "✅ detectSessionInUrl enabled"
else
    echo "❌ detectSessionInUrl not enabled"
fi

if grep -q "persistSession.*true" src/libs/services/supabaseClient.ts; then
    echo "✅ persistSession enabled"
else
    echo "❌ persistSession not enabled"
fi

if grep -q "autoRefreshToken.*true" src/libs/services/supabaseClient.ts; then
    echo "✅ autoRefreshToken enabled"
else
    echo "❌ autoRefreshToken not enabled"
fi

echo ""
echo -e "${BLUE}🔧 Manual OAuth Testing:${NC}"
echo ""
echo "To test OAuth manually:"
echo "1. Start development server: npm run dev"
echo "2. Open browser console (F12)"
echo "3. Go to http://localhost:3000/login"
echo "4. Click 'Login dengan Google'"
echo "5. Watch console logs for debugging info"
echo ""

echo -e "${YELLOW}Expected Console Logs:${NC}"
echo "🔧 Supabase Client Configuration: ..."
echo "🚀 Initiating Google OAuth..."
echo "🔗 Redirect URL: http://localhost:3000/auth/callback"
echo "✅ Google OAuth initiated successfully"
echo "🔄 User should be redirected to Google..."
echo ""
echo "After Google redirect:"
echo "🔄 Auth callback initiated"
echo "🌐 Current URL: http://localhost:3000/auth/callback?code=..."
echo "📝 URL params: { code: '✅ Present', ... }"
echo "🔍 Getting session..."
echo "✅ Session found!"
echo "👤 User: user@example.com"
echo "🔄 Redirecting to dashboard..."
echo ""

echo -e "${RED}Common Issues & Solutions:${NC}"
echo ""
echo "❌ 'No session found':"
echo "   - Check Supabase OAuth provider configuration"
echo "   - Verify Google OAuth credentials in Supabase"
echo "   - Ensure redirect URL matches exactly"
echo ""
echo "❌ 'OAuth error':"
echo "   - Check Google Console OAuth setup"
echo "   - Verify authorized redirect URIs"
echo "   - Check if Google+ API is enabled"
echo ""
echo "❌ 'Redirect loop':"
echo "   - Check middleware configuration"
echo "   - Verify callback route is accessible"
echo "   - Check for JavaScript errors"
echo ""

echo -e "${BLUE}📚 Setup Checklist:${NC}"
echo ""
echo "Supabase Dashboard:"
echo "□ Authentication > Providers > Google enabled"
echo "□ Google Client ID & Secret configured"
echo "□ Authentication > URL Configuration:"
echo "  □ Site URL: http://localhost:3000 (dev) / https://yourdomain.com (prod)"
echo "  □ Redirect URLs: http://localhost:3000/auth/callback (dev)"
echo ""
echo "Google Console:"
echo "□ OAuth 2.0 credentials created"
echo "□ Authorized redirect URIs:"
echo "  □ https://yourproject.supabase.co/auth/v1/callback"
echo "□ Google+ API enabled"
echo ""

echo -e "${GREEN}🚀 Ready to test OAuth flow!${NC}"
