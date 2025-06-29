"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import { ArrowLeft, UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, UserIcon } from "lucide-react";
import { validateEmail, validatePassword, logSecurityEvent, sanitizeInput } from "@/libs/security/utils";
import { SECURITY_CONFIG } from "@/libs/security/constants";
import GuestLayout from "@/app/(layouts)/guestLayout";

// Input Component with glass effect
const GlassInput = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  error,
  disabled = false,
  showPasswordToggle = false,
  onTogglePassword
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<any>;
  error?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}) => (
  <div className="relative mb-4">
    <div className="relative">
      <div className={`flex items-center w-full px-4 py-3 bg-neutral_01/10 backdrop-blur-md border ${error ? 'border-red-400/50' : 'border-neutral_01/20'} rounded-xl transition-all duration-300 focus-within:border-neutral_02/50 focus-within:bg-neutral_01/15`}>
        {Icon && <Icon className="w-5 h-5 text-neutral_01/60 mr-3" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent text-neutral_01 placeholder-neutral_01/60 outline-none disabled:opacity-50"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="text-neutral_01/60 hover:text-neutral_01 transition-colors ml-2"
          >
            {type === "password" ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
    {error && (
      <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

// Glass Effect Component
const GlassContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-container glass-container--rounded ${className}`}>
    <div className="glass-filter" />
    <div className="glass-specular" />
    <div className="glass-content flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

// Glowing Orb Effect
const GlowingOrb = ({
  size = 100,
  color = "brand_01",
  delay = 0,
}) => (
  <div
    className={`absolute rounded-full blur-3xl animate-pulse`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor:
        color === "brand_01"
          ? "rgba(76, 13, 40, 0.3)"
          : "rgba(242, 233, 197, 0.2)",
      animationDelay: `${delay}s`,
      animationDuration: "4s",
    }}
  />
);

// Loading component
function RegisterLoading() {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <GlowingOrb size={300} color="brand_01" delay={0} />
        <GlowingOrb size={200} color="neutral_01" delay={2} />
        <GlowingOrb size={150} color="brand_01" delay={4} />
      </div>
      
      <GlassContainer className="p-12 max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral_02 to-neutral_01 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-brand_01 to-brand_02"></div>
          </div>
          <p className="text-neutral_01 font-medium text-lg">Mengecek status...</p>
        </div>
      </GlassContainer>
    </div>
  );
}

// Main register page component
function RegisterPageContent() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const router = useRouter();

  const validateForm = () => {
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '', general: '' };
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nama lengkap minimal 2 karakter';
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Nama lengkap maksimal 100 karakter';
    }
    
    // Email validation using security utility
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || "Email tidak valid";
    }
    
    // Password validation using security utility
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error || "Password tidak valid";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsRegistering(true);
      setErrors({ fullName: '', email: '', password: '', confirmPassword: '', general: '' });
      
      // Log registration attempt
      logSecurityEvent({
        type: 'login_attempt',
        identifier: formData.email.trim().toLowerCase(),
        details: { method: 'register' }
      });
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(formData.email).toLowerCase();
      const sanitizedFullName = sanitizeInput(formData.fullName).trim();
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: sanitizedFullName,
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        
        if (error.message.includes('User already registered')) {
          setErrors(prev => ({ ...prev, general: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' }));
        } else if (error.message.includes('Invalid email')) {
          setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }));
        } else if (error.message.includes('Password')) {
          setErrors(prev => ({ ...prev, password: 'Password tidak memenuhi kriteria keamanan' }));
        } else {
          setErrors(prev => ({ ...prev, general: error.message }));
        }
        setIsRegistering(false);
        return;
      }

      if (data.user) {
        // Log successful registration
        logSecurityEvent({
          type: 'login_success',
          identifier: sanitizedEmail,
          details: { method: 'register' }
        });
        
        setRegistrationSuccess(true);
        // Auto redirect to login after successful registration
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors(prev => ({ ...prev, general: 'Terjadi kesalahan sistem. Silakan coba lagi.' }));
      setIsRegistering(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Input sanitization
    if (field === "email") {
      value = sanitizeInput(value).toLowerCase();
    } else if (field === "fullName") {
      value = sanitizeInput(value);
    } else if (field === "password" || field === "confirmPassword") {
      // For password, only remove control characters
      value = value.replace(/[\x00-\x1F\x7F]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error as well
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  if (registrationSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}>
        <div className="absolute inset-0 overflow-hidden">
          <GlowingOrb size={400} color="brand_01" delay={0} />
          <GlowingOrb size={300} color="neutral_01" delay={2} />
          <GlowingOrb size={200} color="brand_01" delay={4} />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <GlassContainer className="p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            
            <h1 className={`text-2xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}>
              Pendaftaran Berhasil!
            </h1>
            
            <div className="space-y-4 text-neutral_01/80">
              <p>
                Akun Anda telah berhasil dibuat. Silakan cek email Anda untuk verifikasi.
              </p>
              <p className="text-sm">
                Anda akan diarahkan ke halaman login dalam beberapa detik...
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Lanjut ke Login
            </Link>
          </GlassContainer>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowingOrb size={400} color="brand_01" delay={0} />
        <GlowingOrb size={300} color="neutral_01" delay={2} />
        <GlowingOrb size={200} color="brand_01" delay={4} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neutral_01/60 rounded-full animate-twinkle"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neutral_02/80 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-neutral_01/50 rounded-full animate-twinkle-slow"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-neutral_02/70 rounded-full animate-twinkle-fast"></div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/4">
          <Image
            src="/assets/images/goldconfet Infest USK.webp"
            alt="Background Pattern"
            fill
            className="object-cover"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>
      </div>

      {/* Back Button */}
      <Link 
        href="/auth/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral_01 hover:text-neutral_02 transition-colors duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Kembali ke Login</span>
      </Link>

      {/* Main Register Container - New Layout */}
      <div className="relative z-10 w-full max-w-5xl">
        <GlassContainer className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Logo and Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 mb-6 relative">
                <Image
                  src="/assets/images/Infest 2025 1st Logo Outline.png"
                  alt="InFest USK Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_30px_rgba(242,233,197,0.8)]"
                />
              </div>
              <div className="mb-8">
                <h1 className={`text-3xl lg:text-4xl font-bold text-neutral_01 mb-3 ${dm_serif_display.className}`}>
                  Buat Akun Baru
                </h1>
                <p className="text-neutral_01/80 text-base lg:text-lg">
                  Bergabung dengan InFest USK
                </p>
              </div>
              
              {/* Bottom Info - Moved inside card */}
              <div className="text-center lg:text-left">
                <p className="text-neutral_01/60 text-sm">
                  Informatics Festival XI 2025
                </p>
                <p className="text-neutral_01/40 text-xs mt-1">
                  Powered by HMIF USK
                </p>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="space-y-6 w-full">
                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4 w-full">
                  <GlassInput
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    icon={UserIcon}
                    error={errors.fullName}
                    disabled={isRegistering}
                  />

                  <GlassInput
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    icon={Mail}
                    error={errors.email}
                    disabled={isRegistering}
                  />
                  
                  <GlassInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    icon={Lock}
                    error={errors.password}
                    disabled={isRegistering}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <GlassInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    icon={Lock}
                    error={errors.confirmPassword}
                    disabled={isRegistering}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  />

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-bold text-lg rounded-2xl shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isRegistering ? (
                      <>
                        <div className="w-6 h-6 relative">
                          <div className="absolute inset-0 rounded-full border-2 border-brand_01/30"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-brand_01 border-t-transparent animate-spin"></div>
                        </div>
                        <span>Mendaftar...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-6 h-6" />
                        <span>Daftar</span>
                      </>
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-neutral_01/60 text-sm">
                      Sudah punya akun?{" "}
                      <Link 
                        href="/auth/login" 
                        className="text-neutral_02 hover:text-neutral_01 font-medium transition-colors"
                      >
                        Masuk di sini
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                  <p className="text-neutral_01/60 text-xs leading-relaxed">
                    Dengan mendaftar, Anda menyetujui{" "}
                    <Link href="/terms" className="text-neutral_02 hover:text-neutral_01 transition-colors">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-neutral_02 hover:text-neutral_01 transition-colors">
                      Kebijakan Privasi
                    </Link>{" "}
                    kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl"></div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <GuestLayout>
        <RegisterPageContent />
      </GuestLayout>
    </Suspense>
  );
}
