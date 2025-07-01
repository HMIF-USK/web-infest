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

// Input Component with glass effect - Mobile optimized
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
  <div className="relative mb-3 md:mb-4">
    <div className="relative">
      <div className={`flex items-center w-full px-3 md:px-4 py-2.5 md:py-3 bg-neutral_01/10 backdrop-blur-md border ${error ? 'border-red-400/50' : 'border-neutral_01/20'} rounded-xl transition-all duration-300 focus-within:border-neutral_02/50 focus-within:bg-neutral_01/15`}>
        {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-neutral_01/60 mr-2 md:mr-3" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent text-neutral_01 placeholder-neutral_01/60 outline-none disabled:opacity-50 text-sm "
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="text-neutral_01/60 hover:text-neutral_01 transition-colors ml-2"
          >
            {type === "password" ? <Eye className="w-4 h-4 md:w-5 md:h-5" /> : <EyeOff className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        )}
      </div>
    </div>
    {error && (
      <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-red-400 text-xs md:text-sm">
        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
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

// Loading component - Mobile optimized
function RegisterLoading() {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}>
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <GlowingOrb size={300} color="brand_01" delay={0} />
        <GlowingOrb size={200} color="neutral_01" delay={2} />
        <GlowingOrb size={150} color="brand_01" delay={4} />
      </div>
      
      <GlassContainer className="p-8 md:p-12 max-w-sm md:max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral_02 to-neutral_01 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-brand_01 to-brand_02"></div>
          </div>
          <p className="text-neutral_01 font-medium text-base md:text-lg">Mengecek status...</p>
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
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <GlowingOrb size={400} color="brand_01" delay={0} />
          <GlowingOrb size={300} color="neutral_01" delay={2} />
          <GlowingOrb size={200} color="brand_01" delay={4} />
        </div>

        <div className="relative z-10 w-full max-w-sm md:max-w-md">
          <GlassContainer className="p-6 md:p-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
            </div>
            
            <h1 className={`text-xl md:text-2xl font-bold text-neutral_01 mb-3 md:mb-4 ${dm_serif_display.className}`}>
              Pendaftaran Berhasil!
            </h1>
            
            <div className="space-y-3 md:space-y-4 text-neutral_01/80">
              <p className="text-sm md:text-base">
                Akun Anda telah berhasil dibuat. Silakan cek email Anda untuk verifikasi.
              </p>
              <p className="text-xs md:text-sm">
                Anda akan diarahkan ke halaman login dalam beberapa detik...
              </p>
            </div>

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 mt-4 md:mt-6 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-bold text-sm md:text-base rounded-xl hover:scale-[1.02] md:hover:scale-105 transition-all duration-300"
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
      {/* Background Effects - Hidden on mobile for cleaner look */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <GlowingOrb size={400} color="brand_01" delay={0} />
        <GlowingOrb size={300} color="neutral_01" delay={2} />
        <GlowingOrb size={200} color="brand_01" delay={4} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neutral_01/60 rounded-full animate-twinkle"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neutral_02/80 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-neutral_01/50 rounded-full animate-twinkle-slow"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-neutral_02/70 rounded-full animate-twinkle-fast"></div>
      </div>

      {/* Background pattern - Simplified for mobile */}
      <div className="absolute inset-0 opacity-3 md:opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/4 hidden md:block">
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

      {/* Main Register Container - Mobile optimized */}
      <div className="relative z-10 w-full max-w-sm md:max-w-6xl">
        <GlassContainer className="p-4 md:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Logo and Info - Simplified for mobile */}
            <div className="flex-1 text-center lg:text-left">
              <div className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 mb-3 md:mb-6 relative">
                <Image
                  src="/assets/images/Infest 2025 1st Logo Outline.png"
                  alt="InFest USK Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_20px_rgba(242,233,197,0.6)] md:drop-shadow-[0_0_30px_rgba(242,233,197,0.8)]"
                />
              </div>
              <div className="mb-4 md:mb-8">
                <h1 className={`text-xl md:text-3xl lg:text-4xl font-bold text-neutral_01 mb-1 md:mb-3 ${dm_serif_display.className}`}>
                  Buat Akun Baru
                </h1>
                <p className="text-neutral_01/80 text-xs md:text-base lg:text-lg">
                  Bergabung dengan Infest USK
                </p>
              </div>
              
              {/* Bottom Info - Hidden on mobile to reduce clutter */}
              <div className="text-center lg:text-left hidden md:block">
                <p className="text-neutral_01/60 text-xs md:text-sm">
                  Informatics Festival XI 2025
                </p>
                <p className="text-neutral_01/40 text-xs mt-1">
                  Powered by HMIF USK
                </p>
              </div>
            </div>

            {/* Right Side - Register Form - Mobile optimized */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="space-y-3 md:space-y-6 w-full">
                <div className="text-center mb-3 md:mb-6">
                  <h2 className="text-base md:text-3xl font-bold text-neutral_01 mb-1 md:mb-2">Daftar</h2>
                  <p className="text-neutral_01/70 text-xs md:text-sm hidden md:block">Daftarkan akun anda dan bergabung bersama kami!</p>
                </div>
                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center gap-2 p-3 md:p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-400 text-xs md:text-sm">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Register Form - Compact mobile version */}
                <form onSubmit={handleRegister} className="flex flex-col w-full">
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-bold text-sm md:text-base rounded-xl shadow-[0_0px_20px_rgba(242,233,197,0.4)] md:shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_30px_rgba(242,233,197,0.6)] md:hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isRegistering ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 relative">
                          <div className="absolute inset-0 rounded-full border-2 border-brand_01/30"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-brand_01 border-t-transparent animate-spin"></div>
                        </div>
                        <span className="text-xs md:text-sm">Mendaftar...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm">Daftar</span>
                      </>
                    )}
                  </button>

                  {/* Login Link - Compact mobile */}
                  <div className="text-center">
                    <p className="text-neutral_01/60 text-xs md:text-sm mt-8">
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

                {/* Additional Info - Hidden on mobile for cleaner look */}
                <div className="mt-4 md:mt-8 text-center hidden md:block">
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

        {/* Decorative Elements - Hidden on mobile for cleaner look */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl hidden md:block"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl hidden md:block"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl hidden md:block"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl hidden md:block"></div>
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
