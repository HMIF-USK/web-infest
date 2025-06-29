"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Trash2,
  Shield,
  Check
} from "lucide-react";
import Image from "next/image";

// Glass Effect Component
const GlassContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-container glass-container--rounded ${className}`}>
    <div className="glass-filter" />
    <div className="glass-specular" />
    <div className="glass-content">
      {children}
    </div>
  </div>
);

// Form Input Component
const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  icon: Icon
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ComponentType<any>;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-neutral_01/80">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral_01/40" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-neutral_01/10 border border-neutral_01/20 rounded-xl px-4 py-3 text-neutral_01 placeholder:text-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 focus:border-neutral_02 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          Icon ? 'pl-12' : ''
        }`}
      />
    </div>
  </div>
);

// Profile Picture Component
const ProfilePicture = ({ 
  user, 
  isEditing, 
  onImageChange 
}: { 
  user: User; 
  isEditing: boolean;
  onImageChange: (file: File | null) => void;
}) => {
  const userMetadata = user.user_metadata || {};
  const userAvatar = userMetadata.avatar_url || userMetadata.picture;
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    setPreview(null);
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 relative group">
          {preview || userAvatar ? (
            <Image
              src={preview || userAvatar}
              alt="Profile Picture"
              fill
              className="object-cover rounded-full border-4 border-neutral_02 shadow-[0_0_30px_rgba(242,233,197,0.3)]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral_02/20 to-brand_01/20 rounded-full flex items-center justify-center border-4 border-neutral_02">
              <UserIcon className="w-16 h-16 text-neutral_01/60" />
            </div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                <label htmlFor="profile-picture" className="p-2 bg-neutral_01/20 rounded-full cursor-pointer hover:bg-neutral_01/30 transition-colors">
                  <Camera className="w-5 h-5 text-neutral_01" />
                </label>
                {(preview || userAvatar) && (
                  <button
                    onClick={handleRemove}
                    className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={!isEditing}
          />
        </div>
        
        {/* Status indicator */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-brand_01 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  // Form state
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    institution: '',
    address: '',
    birth_date: '',
    nim: '',
    major: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          router.replace("/login");
          return;
        }

        setUser(session.user);
        
        // Load existing profile data
        const metadata = session.user.user_metadata || {};
        setProfileData({
          full_name: metadata.full_name || metadata.name || '',
          phone: metadata.phone || '',
          institution: metadata.institution || '',
          address: metadata.address || '',
          birth_date: metadata.birth_date || '',
          nim: metadata.nim || '',
          major: metadata.major || ''
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...profileData,
          ...(profileImage && { avatar_url: 'updating...' }) // Placeholder for image upload
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setIsEditing(false);
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (updatedUser) setUser(updatedUser);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Gagal memperbarui profil. Silakan coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    
    // Reset to original data
    const metadata = user.user_metadata || {};
    setProfileData({
      full_name: metadata.full_name || metadata.name || '',
      phone: metadata.phone || '',
      institution: metadata.institution || '',
      address: metadata.address || '',
      birth_date: metadata.birth_date || '',
      nim: metadata.nim || '',
      major: metadata.major || ''
    });
    setProfileImage(null);
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral_01/30 border-t-neutral_01 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral_01/60">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`space-y-8 ${montserrat.className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-neutral_01 mb-2 ${dm_serif_display.className}`}>
            Profil Saya
          </h1>
          <p className="text-neutral_01/70">
            Kelola informasi personal dan data kontak Anda
          </p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 rounded-xl hover:bg-neutral_01/20 transition-all duration-300"
            >
              <Edit className="w-4 h-4" />
              Edit Profil
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-400/20 text-green-400'
            : 'bg-red-500/10 border-red-400/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <GlassContainer className="p-8">
        <ProfilePicture 
          user={user} 
          isEditing={isEditing}
          onImageChange={setProfileImage}
        />
        
        {/* Account Info */}
        <div className="text-center mb-8 pb-8 border-b border-neutral_01/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Akun Terverifikasi</span>
          </div>
          <p className="text-neutral_01/60 text-sm">{user.email}</p>
          <p className="text-neutral_01/40 text-xs mt-1">
            Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nama Lengkap"
            value={profileData.full_name}
            onChange={(value) => setProfileData(prev => ({ ...prev, full_name: value }))}
            placeholder="Masukkan nama lengkap"
            disabled={!isEditing}
            required
            icon={UserIcon}
          />
          
          <FormInput
            label="Nomor Telepon"
            value={profileData.phone}
            onChange={(value) => setProfileData(prev => ({ ...prev, phone: value }))}
            placeholder="Masukkan nomor telepon"
            disabled={!isEditing}
            icon={Phone}
          />
          
          <FormInput
            label="Institusi/Universitas"
            value={profileData.institution}
            onChange={(value) => setProfileData(prev => ({ ...prev, institution: value }))}
            placeholder="Masukkan nama institusi"
            disabled={!isEditing}
            icon={School}
          />
          
          <FormInput
            label="NIM/NIS"
            value={profileData.nim}
            onChange={(value) => setProfileData(prev => ({ ...prev, nim: value }))}
            placeholder="Masukkan NIM atau NIS"
            disabled={!isEditing}
            icon={UserIcon}
          />
          
          <FormInput
            label="Jurusan/Program Studi"
            value={profileData.major}
            onChange={(value) => setProfileData(prev => ({ ...prev, major: value }))}
            placeholder="Masukkan jurusan"
            disabled={!isEditing}
            icon={School}
          />
          
          <FormInput
            label="Tanggal Lahir"
            value={profileData.birth_date}
            onChange={(value) => setProfileData(prev => ({ ...prev, birth_date: value }))}
            type="date"
            disabled={!isEditing}
            icon={Calendar}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Alamat"
              value={profileData.address}
              onChange={(value) => setProfileData(prev => ({ ...prev, address: value }))}
              placeholder="Masukkan alamat lengkap"
              disabled={!isEditing}
              icon={MapPin}
            />
          </div>
        </div>
      </GlassContainer>

      {/* Security Info */}
      <GlassContainer className="p-6">
        <h3 className={`text-xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
          Informasi Keamanan
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral_01/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral_01/60" />
              <div>
                <p className="font-medium text-neutral_01">Email</p>
                <p className="text-sm text-neutral_01/60">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Terverifikasi</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-neutral_01/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-neutral_01/60" />
              <div>
                <p className="font-medium text-neutral_01">Password</p>
                <p className="text-sm text-neutral_01/60">Terakhir diubah saat pendaftaran</p>
              </div>
            </div>
            <button className="text-sm text-neutral_02 hover:text-neutral_01 transition-colors">
              Ubah Password
            </button>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
} 