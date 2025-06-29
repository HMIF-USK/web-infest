"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/libs/services/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import {
  ArrowLeft,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { validateEmail, validatePassword, logSecurityEvent, sanitizeInput } from "@/libs/security/utils";
import { SECURITY_CONFIG } from "@/libs/security/constants";
import GuestLayout from "@/app/(layouts)/guestLayout";
import useRateLimit from "@/libs/hooks/useRateLimit";

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
  onTogglePassword,
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
      <div
        className={`flex items-center w-full px-4 py-3 bg-neutral_01/10 backdrop-blur-md border ${
          error ? "border-red-400/50" : "border-neutral_01/20"
        } rounded-xl transition-all duration-300 focus-within:border-neutral_02/50 focus-within:bg-neutral_01/15`}
      >
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
            {type === "password" ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
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
const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
      active
        ? "bg-neutral_01/20 text-neutral_01 border border-neutral_01/30"
        : "text-neutral_01/60 hover:text-neutral_01/80 hover:bg-neutral_01/10"
    }`}
  >
    {children}
  </button>
);

const GlassContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`glass-container glass-container--rounded ${className}`}>
    <div className="glass-filter" />
    <div className="glass-specular" />
    <div className="glass-content flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

// Glowing Orb Effect
const GlowingOrb = ({ size = 100, color = "brand_01", delay = 0 }) => (
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

// Loading component for session check
function LoginLoading() {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl animate-pulse"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "rgba(76, 13, 40, 0.3)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl animate-pulse"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "rgba(242, 233, 197, 0.2)",
            animationDelay: "2s",
            animationDuration: "4s",
          }}
        />
      </div>
      
      <div className="glass-container glass-container--rounded p-12 max-w-md w-full">
        <div className="glass-filter" />
        <div className="glass-specular" />
        <div className="glass-content flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral_02 to-neutral_01 animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-b from-brand_01 to-brand_02"></div>
            </div>
            <p className="text-neutral_01 font-medium text-lg">Mengecek status login...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main login page component
function LoginPageContent() {
  const [activeTab, setActiveTab] = useState<"email" | "google">("email");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const router = useRouter();
  const rateLimit = useRateLimit();

  // Clear errors when switching tabs or changing input
  useEffect(() => {
    setErrors({ email: "", password: "", general: "" });
  }, [activeTab]);

  // Check for OAuth callback errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const details = urlParams.get("details");

    if (error) {
      let errorMessage = "";
      switch (error) {
        case "oauth_failed":
          errorMessage = details
            ? `Login Google gagal: ${details}`
            : "Login Google gagal. Silakan coba lagi.";
          break;
        case "code_exchange_failed":
          errorMessage = details
            ? `Gagal memproses login Google: ${details}`
            : "Gagal memproses login Google. Silakan coba lagi.";
          break;
        case "session_failed":
          errorMessage = details
            ? `Gagal membuat session: ${details}`
            : "Gagal membuat session. Silakan coba lagi.";
          break;
        case "no_session":
          errorMessage =
            "Login Google tidak berhasil. Session tidak ditemukan. Silakan coba lagi.";
          break;
        case "callback_failed":
          errorMessage = details
            ? `Terjadi kesalahan saat memproses login: ${details}`
            : "Terjadi kesalahan saat memproses login. Silakan coba lagi.";
          break;
        default:
          errorMessage = details
            ? `Terjadi kesalahan: ${details}`
            : "Terjadi kesalahan. Silakan coba lagi.";
      }

      console.log("🔔 Login page error:", error, details);
      setErrors((prev) => ({ ...prev, general: errorMessage }));

      // Clear error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };

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

    setErrors(newErrors);
    return emailValidation.isValid && passwordValidation.isValid;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log login attempt
    logSecurityEvent({
      type: 'login_attempt',
      identifier: formData.email.trim().toLowerCase(),
      details: { method: 'email' }
    });
    
    // Check rate limiting
    if (rateLimit.isLocked) {
      setErrors(prev => ({ 
        ...prev, 
        general: `Terlalu banyak percobaan login gagal. Coba lagi dalam ${Math.ceil(rateLimit.remainingTime / 60)} menit.` 
      }));
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      setIsLoggingIn(true);
      setErrors({ email: "", password: "", general: "" });
      
      const sanitizedEmail = sanitizeInput(formData.email).toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error);
        
        // Record failed attempt
        rateLimit.recordFailedAttempt();
        
        // Handle specific error cases for better UX
        if (error.message.includes('Invalid login credentials')) {
          setErrors(prev => ({ 
            ...prev, 
            general: `Email atau password salah. Percobaan ke-${rateLimit.attempts + 1} dari ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}.` 
          }));
        } else if (error.message.includes('Email not confirmed')) {
          setErrors(prev => ({ ...prev, general: 'Email belum diverifikasi. Silakan cek email Anda untuk konfirmasi.' }));
        } else if (error.message.includes('Too many requests')) {
          setErrors(prev => ({ ...prev, general: 'Terlalu banyak percobaan login. Silakan tunggu beberapa menit.' }));
        } else {
          setErrors(prev => ({ ...prev, general: error.message }));
        }
        setIsLoggingIn(false);
        return;
      }

      if (data.user) {
        console.log("Login berhasil");
        // Reset attempts on successful login
        rateLimit.resetAttempts();
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      rateLimit.recordFailedAttempt();
      setErrors(prev => ({ ...prev, general: 'Terjadi kesalahan sistem. Silakan coba lagi.' }));
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Log login attempt
    logSecurityEvent({
      type: 'login_attempt',
      identifier: 'google_oauth',
      details: { method: 'google' }
    });

    // Check rate limiting
    if (rateLimit.isLocked) {
      setErrors(prev => ({ 
        ...prev, 
        general: `Terlalu banyak percobaan login gagal. Coba lagi dalam ${Math.ceil(rateLimit.remainingTime / 60)} menit.` 
      }));
      return;
    }

    try {
      setIsLoggingIn(true);
      setErrors({ email: "", password: "", general: "" });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        console.error("Google login error:", error);
        rateLimit.recordFailedAttempt();
        setErrors((prev) => ({
          ...prev,
          general: `Gagal login dengan Google: ${error.message}`,
        }));
        setIsLoggingIn(false);
      } else if (data.url) {
        // Redirect ke OAuth provider
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("💥 Google login failed:", error);
      rateLimit.recordFailedAttempt();
      setErrors((prev) => ({
        ...prev,
        general: "Terjadi kesalahan saat memulai login Google.",
      }));
      setIsLoggingIn(false);
    }
  };

  const handleInputChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Input sanitization using security utility
      if (field === "email") {
        value = sanitizeInput(value).toLowerCase();
      } else if (field === "password") {
        // For password, only remove control characters
        value = value.replace(/[\x00-\x1F\x7F]/g, '');
      }
      
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field-specific error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      
      // Clear general error as well
      if (errors.general) {
        setErrors((prev) => ({ ...prev, general: "" }));
      }
    };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-brand_01 to-brand_02 p-4 relative overflow-hidden ${montserrat.className}`}
    >
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
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral_01 hover:text-neutral_02 transition-colors duration-300 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Kembali ke Beranda</span>
      </Link>

      {/* Main Login Container - New Layout */}
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
                <h1
                  className={`text-3xl lg:text-4xl font-bold text-neutral_01 mb-3 ${dm_serif_display.className}`}
                >
                  Welcome Back
                </h1>
                <p className="text-neutral_01/80 text-base lg:text-lg">
                  Masuk ke Dashboard InFest USK
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

            {/* Right Side - Login Form */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="space-y-6 w-full">
                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-neutral_01/10 rounded-xl">
                  <TabButton
                    active={activeTab === "email"}
                    onClick={() => setActiveTab("email")}
                  >
                    Email & Password
                  </TabButton>
                  <TabButton
                    active={activeTab === "google"}
                    onClick={() => setActiveTab("google")}
                  >
                    Google
                  </TabButton>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Rate Limiting Warning */}
                {rateLimit.attempts > 0 && !rateLimit.isLocked && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-xl text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Percobaan login gagal: {rateLimit.attempts}/{SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}. 
                      {rateLimit.attempts >= 3 && ` Hati-hati, akun akan terkunci setelah ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS} percobaan gagal.`}
                    </span>
                  </div>
                )}

                {/* Email Login Form */}
                {activeTab === "email" && (
                  <form onSubmit={handleEmailLogin} className="space-y-4 w-full">
                    <GlassInput
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      icon={Mail}
                      error={errors.email}
                      disabled={isLoggingIn}
                    />

                    <GlassInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      icon={Lock}
                      error={errors.password}
                      disabled={isLoggingIn}
                      showPasswordToggle={true}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />

                    <button
                      type="submit"
                      disabled={isLoggingIn || !!rateLimit.isLocked}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-bold text-lg rounded-2xl shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {rateLimit.isLocked ? (
                        <>
                          <AlertCircle className="w-6 h-6" />
                          <span>Terkunci ({Math.ceil(rateLimit.remainingTime / 60)} menit)</span>
                        </>
                      ) : isLoggingIn ? (
                        <>
                          <div className="w-6 h-6 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-brand_01/30"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-brand_01 border-t-transparent animate-spin"></div>
                          </div>
                          <span>Sedang Masuk...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-6 h-6" />
                          <span>Masuk</span>
                        </>
                      )}
                    </button>

                    {/* Register Link */}
                    <div className="text-center space-y-2">
                      <p className="text-neutral_01/60 text-sm">
                        Belum punya akun?{" "}
                        <Link
                          href="/auth/register"
                          className="text-neutral_02 hover:text-neutral_01 font-medium transition-colors"
                        >
                          Daftar di sini
                        </Link>
                      </p>
                      <p className="text-neutral_01/60 text-sm">
                        <Link
                          href="/forgot-password"
                          className="text-neutral_02 hover:text-neutral_01 font-medium transition-colors"
                        >
                          Lupa password?
                        </Link>
                      </p>
                    </div>
                  </form>
                )}

                {/* Google Login */}
                {activeTab === "google" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-neutral_01/60 text-sm mb-4">
                        Masuk dengan mudah menggunakan akun Google Anda
                      </p>
                    </div>

                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoggingIn || !!rateLimit.isLocked}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border border-neutral_01/20 text-neutral_01 font-bold text-lg rounded-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {rateLimit.isLocked ? (
                        <>
                          <AlertCircle className="w-6 h-6" />
                          <span>Terkunci ({Math.ceil(rateLimit.remainingTime / 60)} menit)</span>
                        </>
                      ) : isLoggingIn ? (
                        <>
                          <div className="w-6 h-6 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-neutral_01/30"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-neutral_01 border-t-transparent animate-spin"></div>
                          </div>
                          <span>Sedang Masuk...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Masuk dengan Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-8 text-center">
                  <p className="text-neutral_01/60 text-xs leading-relaxed">
                    Dengan masuk, Anda menyetujui{" "}
                    <Link
                      href="/terms"
                      className="text-neutral_02 hover:text-neutral_01 transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      href="/privacy"
                      className="text-neutral_02 hover:text-neutral_01 transition-colors"
                    >
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <GuestLayout>
        <LoginPageContent />
      </GuestLayout>
    </Suspense>
  );
}
