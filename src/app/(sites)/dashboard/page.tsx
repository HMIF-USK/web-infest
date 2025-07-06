"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  authService,
  type UserProfile,
  type AuthResult,
} from "@/libs/services/authService";
import {
  competitionService,
  type Competition,
  type CompetitionRegistration,
} from "@/libs/services/competitionService";
import { teamService, type TeamWithMembers } from "@/libs/services/teamService";
import { validateEmail, sanitizeInput } from "@/libs/security/utils";
import type { User } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Trophy,
  Users,
  Save,
  Edit3,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Hash,
  Building2,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  DollarSign,
  Award,
  Eye,
  UserPlus,
  Filter,
  Search,
  Copy,
  LogOut,
  Settings,
  Shield,
  Clock as ClockIcon,
  Plus,
  Crown,
  UserMinus,
  EyeOff,
  Info,
} from "lucide-react";
import { TEAM_REQUIREMENTS } from "@/libs/security/constants";

// Helper function to check if profile is complete
const isProfileComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;

  const requiredFields = [
    "full_name",
    "email",
    "whatsapp",
    "date_of_birth",
    "gender",
    "university",
    "faculty",
    "major",
    "student_id",
    "semester",
    "graduation_year",
    "province",
    "city",
    "address",
    "postal_code",
  ];

  return requiredFields.every((field) => {
    const value = profile[field as keyof UserProfile];
    return value !== null && value !== undefined && String(value).trim() !== "";
  });
};

// Helper function to get missing profile fields
const getMissingProfileFields = (profile: UserProfile | null): string[] => {
  if (!profile) return ["Semua field profil"];

  const fieldLabels: Record<string, string> = {
    full_name: "Nama Lengkap",
    email: "Email",
    whatsapp: "WhatsApp",
    date_of_birth: "Tanggal Lahir",
    gender: "Jenis Kelamin",
    university: "Universitas",
    faculty: "Fakultas",
    major: "Jurusan",
    student_id: "NIM",
    semester: "Semester",
    graduation_year: "Tahun Angkatan",
    province: "Provinsi",
    city: "Kota",
    address: "Alamat",
    postal_code: "Kode Pos",
  };

  const missingFields: string[] = [];

  Object.entries(fieldLabels).forEach(([field, label]) => {
    const value = profile[field as keyof UserProfile];
    if (value === null || value === undefined || String(value).trim() === "") {
      missingFields.push(label);
    }
  });

  return missingFields;
};

// Components for each menu
const ProfilContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Data Dasar
    fullName: "",
    email: "",
    whatsapp: "",
    dateOfBirth: "",
    gender: "",

    // Data Akademik
    university: "",
    faculty: "",
    major: "",
    studentId: "",
    semester: "",
    graduationYear: "",

    // Data Alamat
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  // Load user data saat component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const result = await authService.getCurrentUser();

      if (result.error) {
        console.error("Error loading user:", result.error);
        // Jika user tidak terautentikasi, redirect ke login
        router.push("/auth/login");
        return;
      }

      if (result.user) {
        setUser(result.user);

        if (result.profile) {
          setProfile(result.profile);
          // Populate form dengan data profile yang ada
          setFormData({
            fullName: result.profile.full_name || "",
            email: result.profile.email || "",
            whatsapp: result.profile.whatsapp || "",
            dateOfBirth: result.profile.date_of_birth || "",
            gender: result.profile.gender || "",
            university: result.profile.university || "",
            faculty: result.profile.faculty || "",
            major: result.profile.major || "",
            studentId: result.profile.student_id || "",
            semester: result.profile.semester?.toString() || "",
            graduationYear: result.profile.graduation_year?.toString() || "",
            province: result.profile.province || "",
            city: result.profile.city || "",
            address: result.profile.address || "",
            postalCode: result.profile.postal_code || "",
          });
        } else {
          // Jika belum ada profile, set email dari auth user
          setFormData((prev) => ({
            ...prev,
            email: result.user?.email || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validasi data wajib
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Nama lengkap minimal 2 karakter";
    }

    // Validasi email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || "Email tidak valid";
    }

    if (
      formData.whatsapp &&
      !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.whatsapp.replace(/\s/g, ""))
    ) {
      newErrors.whatsapp = "Format nomor WhatsApp tidak valid";
    }

    if (
      formData.semester &&
      (parseInt(formData.semester) < 1 || parseInt(formData.semester) > 14)
    ) {
      newErrors.semester = "Semester harus antara 1-14";
    }

    if (formData.graduationYear) {
      const year = parseInt(formData.graduationYear);
      const currentYear = new Date().getFullYear();
      if (year < 2020 || year > currentYear + 10) {
        newErrors.graduationYear = `Tahun angkatan harus antara 2020-${
          currentYear + 10
        }`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Sanitize input berdasarkan jenis field
    let sanitizedValue = value;
    if (name === "email") {
      sanitizedValue = sanitizeInput(value).toLowerCase();
    } else if (name === "phone" || name === "whatsapp") {
      // Hanya angka, +, dan spasi untuk nomor telepon
      sanitizedValue = value.replace(/[^0-9+\s]/g, "");
    } else if (name === "semester" || name === "graduationYear") {
      // Hanya angka untuk semester dan tahun
      sanitizedValue = value.replace(/[^0-9]/g, "");
    } else {
      // Untuk field text lainnya, sanitize basic
      sanitizedValue = sanitizeInput(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear save message
    if (saveMessage) {
      setSaveMessage(null);
    }
  };

  const handleSave = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!validateForm()) {
      setSaveMessage({
        type: "error",
        message: "Mohon periksa kembali data yang Anda masukkan",
      });
      return;
    }

    if (!user) {
      setSaveMessage({
        type: "error",
        message: "User tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Prepare data untuk update profile
      const updateData: Partial<UserProfile> = {
        full_name: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        whatsapp: formData.whatsapp.trim() || null,
        date_of_birth: formData.dateOfBirth || null,
        gender: (formData.gender as "male" | "female") || null,
        university: formData.university.trim() || null,
        faculty: formData.faculty.trim() || null,
        major: formData.major.trim() || null,
        student_id: formData.studentId.trim() || null,
        semester: formData.semester ? parseInt(formData.semester) : null,
        graduation_year: formData.graduationYear
          ? parseInt(formData.graduationYear)
          : null,
        province: formData.province.trim() || null,
        city: formData.city.trim() || null,
        address: formData.address.trim() || null,
        postal_code: formData.postalCode.trim() || null,
      };

      const result = await authService.updateProfile(user.id, updateData);

      if (result.error) {
        console.error("Error updating profile:", result.error);
        setSaveMessage({
          type: "error",
          message: result.error,
        });
        return;
      }

      if (result.profile) {
        setProfile(result.profile);
        setIsEditing(false);
        setSaveMessage({
          type: "success",
          message: "Profil berhasil diperbarui!",
        });

        // Clear success message setelah 3 detik
        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage({
        type: "error",
        message: "Terjadi kesalahan sistem. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    // Reset form ke data profile yang tersimpan
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        whatsapp: profile.whatsapp || "",
        dateOfBirth: profile.date_of_birth || "",
        gender: profile.gender || "",
        university: profile.university || "",
        faculty: profile.faculty || "",
        major: profile.major || "",
        studentId: profile.student_id || "",
        semester: profile.semester?.toString() || "",
        graduationYear: profile.graduation_year?.toString() || "",
        province: profile.province || "",
        city: profile.city || "",
        address: profile.address || "",
        postalCode: profile.postal_code || "",
      });
    }
    setIsEditing(false);
    setErrors({});
    setSaveMessage(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-neutral_02 animate-spin" />
            <p className="text-neutral_01/60 text-sm sm:text-base">
              Memuat data profil...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-neutral_02 to-neutral_01 rounded-xl flex items-center justify-center">
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand_01" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral_01">
              Profil
            </h1>
            <p className="text-neutral_01/60 text-sm sm:text-base">
              Kelola informasi profil Anda
            </p>
          </div>
        </div>
        <button
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
          className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto justify-center ${
            !isEditing
              ? "bg-neutral_02 hover:bg-neutral_02/80"
              : "bg-red-800 hover:bg-red-800/80"
          } border border-neutral_01/20 rounded-xl transition-colors w-fit`}
        >
          {!isEditing ? (
            <Edit3 className="w-4 h-4 text-neutral_01" />
          ) : (
            <X className="w-4 h-4 text-neutral_01" />
          )}
          <span className="text-sm font-medium text-neutral_01">
            {isEditing ? "Batal" : "Edit"}
          </span>
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Success/Error Message */}
        {saveMessage && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              saveMessage.type === "success"
                ? "bg-green-500/10 border-green-400/20 text-green-400"
                : "bg-red-500/10 border-red-400/20 text-red-400"
            }`}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{saveMessage.message}</span>
          </div>
        )}

        {/* Data Dasar */}
        <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral_01 mb-4 sm:mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-neutral_02" />
            Data Dasar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border ${
                  errors.fullName ? "border-red-400/50" : "border-neutral_01/20"
                } rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "focus:ring-red-400/50"
                    : "focus:ring-neutral_02/50"
                } transition-all duration-200`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className={`w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200`}
                placeholder="contoh@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                No. WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border ${
                  errors.whatsapp ? "border-red-400/50" : "border-neutral_01/20"
                } rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 ${
                  errors.whatsapp
                    ? "focus:ring-red-400/50"
                    : "focus:ring-neutral_02/50"
                } transition-all duration-200`}
                placeholder="08123456789"
              />
              {errors.whatsapp && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.whatsapp}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Jenis Kelamin
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
              >
                <option className="text-brand_02" value="">
                  Pilih Jenis Kelamin
                </option>
                <option className="text-brand_02" value="male">
                  Laki-laki
                </option>
                <option className="text-brand_02" value="female">
                  Perempuan
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Akademik */}
        <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral_01 mb-4 sm:mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-neutral_02" />
            Data Akademik
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Universitas/Institusi
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="Universitas Syiah Kuala"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Fakultas
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="Fakultas Matematika dan Ilmu Pengetahuan Alam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Jurusan/Program Studi
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="Teknik Informatika"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                NIM/NIS
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="2108107010001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Semester
              </label>
              <input
                type="number"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="1"
                max="14"
                className={`w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border ${
                  errors.semester ? "border-red-400/50" : "border-neutral_01/20"
                } rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 ${
                  errors.semester
                    ? "focus:ring-red-400/50"
                    : "focus:ring-neutral_02/50"
                } transition-all duration-200`}
                placeholder="1-14"
              />
              {errors.semester && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.semester}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Tahun Angkatan
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="2020"
                max="2030"
                className={`w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border ${
                  errors.graduationYear
                    ? "border-red-400/50"
                    : "border-neutral_01/20"
                } rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 ${
                  errors.graduationYear
                    ? "focus:ring-red-400/50"
                    : "focus:ring-neutral_02/50"
                } transition-all duration-200`}
                placeholder="2025"
              />
              {errors.graduationYear && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.graduationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Data Alamat */}
        <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral_01 mb-4 sm:mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neutral_02" />
            Data Alamat
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Provinsi
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="Aceh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Kabupaten/Kota
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="Banda Aceh"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 resize-none transition-all duration-200"
                placeholder="Jl. Contoh No. 123, Kecamatan, Kelurahan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral_01 mb-2">
                Kode Pos
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                placeholder="23111"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 font-semibold rounded-xl hover:bg-neutral_01/15 transition-all duration-300 disabled:opacity-50 order-2 sm:order-1"
            >
              <X className="w-4 h-4" />
              <span>Batal</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-semibold rounded-xl hover:opacity-70 transition-all duration-200 disabled:opacity-50 order-1 sm:order-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const KompetisiContent = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<
    CompetitionRegistration[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "closed" | "ongoing">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const userResult = await authService.getCurrentUser();
      if (userResult.user) {
        setUser(userResult.user);
      }

      // Load competitions
      const competitionsResult =
        await competitionService.getActiveCompetitions();
      if (competitionsResult.competitions) {
        setCompetitions(competitionsResult.competitions);
      }

      // Load user registrations if user is logged in
      if (userResult.user) {
        const registrationsResult =
          await competitionService.getUserRegistrations(userResult.user.id);
        if (registrationsResult.registrations) {
          setUserRegistrations(registrationsResult.registrations);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search competitions
  const filteredCompetitions = competitions.filter((comp) => {
    const now = new Date();
    const regEnd = new Date(comp.registration_end);
    const compStart = new Date(comp.competition_start);
    const compEnd = new Date(comp.competition_end);

    let matchesFilter = true;
    if (filter === "open") {
      matchesFilter = now <= regEnd && comp.status === "open";
    } else if (filter === "closed") {
      matchesFilter = now > regEnd && now < compStart;
    } else if (filter === "ongoing") {
      matchesFilter = now >= compStart && now <= compEnd;
    }

    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Check if user is registered for a competition
  const isRegistered = (competitionId: string) => {
    return userRegistrations.some(
      (reg) =>
        reg.competition_id === competitionId && reg.status !== "cancelled"
    );
  };

  // Get registration status for a competition
  const getRegistrationStatus = (competitionId: string) => {
    const registration = userRegistrations.find(
      (reg) =>
        reg.competition_id === competitionId && reg.status !== "cancelled"
    );
    return registration?.status || null;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if registration is still open
  const isRegistrationOpen = (competition: Competition) => {
    const now = new Date();
    const regEnd = new Date(competition.registration_end);
    return now <= regEnd;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "programming":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "design":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "gaming":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-neutral_02 animate-spin" />
            <p className="text-neutral_01/60 text-sm sm:text-base">
              Memuat data kompetisi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-neutral_02 to-primary-yellow rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-brand_01" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral_01">
            Kompetisi
          </h1>
          <p className="text-neutral_01/60 text-sm sm:text-base">
            Daftar dan kelola kompetisi Anda
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral_01/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari kompetisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["all", "open", "closed", "ongoing"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? "bg-neutral_02 text-brand_01"
                    : "bg-neutral_01/10 text-neutral_01/60 hover:bg-neutral_01/20"
                }`}
              >
                {status === "all"
                  ? "Semua"
                  : status === "open"
                  ? "Terbuka"
                  : status === "closed"
                  ? "Tertutup"
                  : status === "ongoing"
                  ? "Berlangsung"
                  : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Registrations */}
      {userRegistrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral_01 mb-4">
            Registrasi Saya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-neutral_01 text-sm line-clamp-2">
                    {registration.competition?.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                      registration.status
                    )} ml-2 flex-shrink-0`}
                  >
                    {registration.status}
                  </span>
                </div>

                {/* Registration Info - Improved Layout with Icons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                        Nama Tim
                      </p>
                      <p className="text-sm text-neutral_01/90 font-medium">
                        {registration.team_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                        Status Pembayaran
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          registration.payment_status === "paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {registration.payment_status === "paid"
                          ? "Sudah Bayar"
                          : "Belum Bayar"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                        Tanggal Daftar
                      </p>
                      <p className="text-sm text-neutral_01/90 font-medium">
                        {formatDate(registration.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Competitions */}
      <div>
        <h2 className="text-xl font-bold text-neutral_01 mb-4">
          Kompetisi Tersedia ({filteredCompetitions.length})
        </h2>

        {filteredCompetitions.length === 0 ? (
          <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-8 text-center">
            <Trophy className="w-12 h-12 text-neutral_01/40 mx-auto mb-4" />
            <p className="text-neutral_01/60">
              Tidak ada kompetisi yang ditemukan
            </p>
            <p className="text-sm text-neutral_01/40 mt-2">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => {
              const registered = isRegistered(competition.id);
              const registrationStatus = getRegistrationStatus(competition.id);
              const regOpen = isRegistrationOpen(competition);

              return (
                <div
                  key={competition.id}
                  className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl overflow-hidden hover:border-neutral_02/30 transition-all duration-300"
                >
                  {/* Image */}
                  {competition.poster_image_url && (
                    <div className="h-48 bg-gradient-to-r from-brand_01 to-brand_02 relative overflow-hidden">
                      <img
                        src={competition.poster_image_url}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                            competition.status
                          )}`}
                        >
                          {competition.status}
                        </span>
                      </div>
                      {registered && (
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                              registrationStatus!
                            )}`}
                          >
                            Terdaftar
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral_01 mb-2">
                      {competition.name}
                    </h3>
                    <p className="text-neutral_01/60 text-sm mb-6 line-clamp-3">
                      {competition.description}
                    </p>

                    {/* Competition Info - Improved Layout with Icons */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {/* Registration Fee */}
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                        <div className="space-y-1 flex-1">
                          <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                            Biaya Pendaftaran
                          </p>
                          <p className="text-sm text-neutral_01/90 font-medium">
                            {competition.registration_fee === 0
                              ? "Gratis"
                              : formatCurrency(competition.registration_fee)}
                          </p>
                        </div>
                      </div>

                      {/* Registration Period */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                        <div className="space-y-1 flex-1">
                          <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                            Periode Pendaftaran
                          </p>
                          <p className="text-sm text-neutral_01/90 font-medium">
                            {formatDate(competition.registration_start)} -{" "}
                            {formatDate(competition.registration_end)}
                          </p>
                        </div>
                      </div>

                      {/* Competition Date */}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                        <div className="space-y-1 flex-1">
                          <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                            Tanggal Kompetisi
                          </p>
                          <p className="text-sm text-neutral_01/90 font-medium">
                            {formatDate(competition.competition_start)}
                            {competition.competition_end !==
                              competition.competition_start &&
                              ` - ${formatDate(competition.competition_end)}`}
                          </p>
                        </div>
                      </div>

                      {/* Prize Information */}
                      {competition.first_prize_amount && (
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                              Total Hadiah
                            </p>
                            <p className="text-sm text-neutral_01/90 font-medium">
                              {formatCurrency(
                                competition.first_prize_amount +
                                  competition.second_prize_amount! +
                                  competition?.third_prize_amount!
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ">
                      {competition.guidebook_url && (
                        <button
                          onClick={() => {
                            window.open(competition.guidebook_url, "_blank");
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral_01/10 border border-neutral_01/20 text-neutral_01 text-sm font-medium rounded-lg hover:bg-neutral_01/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Guidebook
                        </button>
                      )}

                      {!registered && regOpen && user && (
                        <button
                          onClick={() => {
                            setSelectedCompetition(competition);
                            setShowRegistrationModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          <UserPlus className="w-4 h-4" />
                          Daftar
                        </button>
                      )}

                      {!regOpen && !registered && (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral_01/5 border border-neutral_01/10 text-neutral_01/40 text-sm font-medium rounded-lg cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          Tutup
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TODO: Add Registration Modal */}
      {/* TODO: Add Competition Detail Modal */}
    </div>
  );
};

const TimContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showKickModal, setShowKickModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const [memberToKick, setMemberToKick] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    position?: "insideCard" | "outsideCard";
    text: string;
  } | null>(null);
  const router = useRouter();

  // Form states
  const [createTeamForm, setCreateTeamForm] = useState({
    name: "",
    description: "",
    maxMembers: 3,
    isPublic: true,
  });

  const [joinTeamForm, setJoinTeamForm] = useState({
    teamCode: "",
  });

  const [previewTeam, setPreviewTeam] = useState<TeamWithMembers | null>(null);

  // Load data saat component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const userResult = await authService.getCurrentUser();
      if (userResult.error || !userResult.user) {
        router.push("/auth/login");
        return;
      }

      setUser(userResult.user);
      setProfile(userResult.profile);

      // Get user's team
      const teamResult = await teamService.getUserTeam(userResult.user.id);
      if (teamResult.error) {
        setMessage({ type: "error", text: teamResult.error });
      } else {
        setTeam(teamResult.data || null);
      }
    } catch (error) {
      console.error("Error loading team data:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat memuat data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check if profile is complete for team actions
  const canAccessTeamActions = isProfileComplete(profile);
  const missingFields = getMissingProfileFields(profile);

  // Handle team action with profile check
  const handleTeamAction = (action: "create" | "join") => {
    if (!canAccessTeamActions) {
      setShowProfileWarning(true);
      return;
    }

    if (action === "create") {
      setShowCreateModal(true);
    } else if (action === "join") {
      setShowJoinModal(true);
    }
  };

  // Handle create team
  const handleCreateTeam = async () => {
    if (!user) return;
    if (!createTeamForm.name.trim()) {
      setMessage({ type: "error", text: "Nama tim harus diisi." });
      return;
    }

    setIsCreatingTeam(true);
    try {
      const result = await teamService.createTeam(user.id, {
        name: createTeamForm.name.trim(),
        description: createTeamForm.description.trim() || undefined,
        is_public: createTeamForm.isPublic,
      });

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Tim berhasil dibuat!" });
        setShowCreateModal(false);
        setCreateTeamForm({
          name: "",
          description: "",
          maxMembers: 3,
          isPublic: true,
        });
        await loadData(); // Reload team data
      }
    } catch (error) {
      console.error("Error creating team:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat membuat tim.",
      });
    } finally {
      setIsCreatingTeam(false);
    }
  };

  // Handle join team - preview first
  const handlePreviewTeam = async () => {
    if (!joinTeamForm.teamCode.trim()) {
      setMessage({ type: "error", text: "Kode tim harus diisi." });
      return;
    }

    try {
      const result = await teamService.getTeamByCode(
        joinTeamForm.teamCode.trim()
      );
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (!result.data) {
        setMessage({
          type: "error",
          position: "insideCard",
          text: "Tim dengan kode tersebut tidak ditemukan.",
        });
      } else {
        setPreviewTeam(result.data);
      }
    } catch (error) {
      console.error("Error previewing team:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat mencari tim.",
      });
    }
  };

  // Handle join team
  const handleJoinTeam = async () => {
    if (!user || !previewTeam) return;

    setIsJoiningTeam(true);
    try {
      const result = await teamService.joinTeam(user.id, previewTeam.code);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Berhasil bergabung dengan tim!" });
        setShowJoinModal(false);
        setJoinTeamForm({ teamCode: "" });
        setPreviewTeam(null);
        await loadData(); // Reload team data
      }
    } catch (error) {
      console.error("Error joining team:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat bergabung dengan tim.",
      });
    } finally {
      setIsJoiningTeam(false);
    }
  };

  // Handle leave team
  const handleLeaveTeam = async () => {
    if (!user || !team) return;
    setShowLeaveModal(true);
  };

  const confirmLeaveTeam = async () => {
    if (!user) return;

    try {
      const result = await teamService.leaveTeam(user.id);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Berhasil keluar dari tim." });
        setShowLeaveModal(false);
        await loadData(); // Reload team data
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat keluar dari tim.",
      });
    }
  };

  // Handle kick member
  const handleKickMember = async (memberId: string, memberName: string) => {
    if (!user || !team) return;
    setMemberToKick({ id: memberId, name: memberName });
    setShowKickModal(true);
  };

  const confirmKickMember = async () => {
    if (!user || !memberToKick) return;

    try {
      const result = await teamService.kickMember(user.id, memberToKick.id);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: `${memberToKick.name} berhasil dikeluarkan dari tim.`,
        });
        setShowKickModal(false);
        setMemberToKick(null);
        await loadData(); // Reload team data
      }
    } catch (error) {
      console.error("Error kicking member:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat mengeluarkan anggota.",
      });
    }
  };

  // Copy team code to clipboard
  const copyTeamCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      setIsCopied(true);

      // Reset icon setelah 2 detik
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  // Get user's role in team
  const getUserRole = () => {
    if (!user || !team?.members) return null;
    const member = team.members.find((m) => m.id === user.id);
    return member?.is_team_leader ? "leader" : "member";
  };

  const userRole = getUserRole();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-neutral_02 animate-spin" />
            <p className="text-neutral_01/60 text-sm sm:text-base">
              Memuat data tim...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-neutral_02 to-primary-yellow rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand_01" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral_01">
              Tim Anda
            </h1>
            <p className="text-neutral_01/60 text-sm sm:text-base">
              Kelola tim dan anggota tim
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!team && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleTeamAction("join")}
              disabled={!canAccessTeamActions}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral_01/20 rounded-xl transition-colors ${
                canAccessTeamActions
                  ? "bg-neutral_01/10 text-neutral_01 hover:bg-neutral_01/20"
                  : "bg-neutral_01/5 text-neutral_01/40 cursor-not-allowed"
              }`}
              title={
                !canAccessTeamActions
                  ? "Lengkapi profil Anda terlebih dahulu"
                  : ""
              }
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Gabung Tim</span>
            </button>
            <button
              onClick={() => handleTeamAction("create")}
              disabled={!canAccessTeamActions}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                canAccessTeamActions
                  ? "bg-neutral_02 hover:bg-neutral_02/80 text-brand_01"
                  : "bg-neutral_01/10 text-neutral_01/40 cursor-not-allowed"
              }`}
              title={
                !canAccessTeamActions
                  ? "Lengkapi profil Anda terlebih dahulu"
                  : ""
              }
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Buat Tim</span>
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message && message.position === "outsideCard" && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-400/20 text-green-400"
              : "bg-red-500/10 border-red-400/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Completeness Warning */}
      {!team && !canAccessTeamActions && (
        <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-yellow-400 font-medium mb-2">
                Profil Belum Lengkap
              </h4>
              <p className="text-yellow-400/80 text-sm mb-3">
                Lengkapi profil Anda terlebih dahulu untuk dapat membuat atau
                bergabung dengan tim.
              </p>
              <button
                onClick={() => router.push("/dashboard?menu=profil")}
                className="text-sm bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                Lengkapi Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Content */}
      {team ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Team Info */}
          <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral_01 truncate">
                    {team.name}
                  </h2>
                  {userRole === "leader" && (
                    <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-neutral_01/60 mb-4 text-sm sm:text-base">
                  {team.description || "Tidak ada deskripsi"}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-neutral_01/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {team.current_members}/{TEAM_REQUIREMENTS.MAX_MEMBERS}{" "}
                      anggota
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 flex-shrink-0" />
                    <span>Kode: {team.code}</span>
                    <button
                      onClick={copyTeamCode}
                      className={`p-1 hover:bg-neutral_01/10 rounded transition-all duration-200 text-neutral_01`}
                      title={isCopied ? "Disalin!" : "Salin kode tim"}
                    >
                      {isCopied ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {team.is_public ? (
                      <Eye className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{team.is_public ? "Publik" : "Private"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {userRole === "leader" && (
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="p-2 flex justify-center sm:p-2.5 bg-neutral_01/10 border border-neutral_01/20 rounded-xl text-neutral_01 hover:bg-neutral_01/20 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleLeaveTeam}
                  className="p-2 flex justify-center sm:p-2.5 bg-red-500/10 border border-red-400/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-neutral_01 mb-4 sm:mb-6">
              Anggota Tim
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {team.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-neutral_01/5 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral_02 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand_01" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-neutral_01 text-sm sm:text-base truncate">
                          {member.full_name}
                        </h4>
                        {member.is_team_leader && (
                          <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral_01/60 truncate">
                        {member.email}
                      </p>
                      {member.university && (
                        <p className="text-xs text-neutral_01/40 truncate">
                          {member.university} - {member.major}
                        </p>
                      )}
                    </div>
                  </div>

                  {userRole === "leader" && !member.is_team_leader && (
                    <button
                      onClick={() =>
                        handleKickMember(member.id, member.full_name)
                      }
                      className="p-2 bg-red-500/10 border border-red-400/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors touch-target flex-shrink-0 ml-2"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // No Team State
        <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl p-8 text-center">
          <Users className="w-16 h-16 text-neutral_01/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral_01 mb-2">
            Belum Bergabung Tim
          </h3>
          <p className="text-neutral_01/60 mb-6">
            Anda belum bergabung dengan tim manapun. Buat tim baru atau
            bergabung dengan tim yang sudah ada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleTeamAction("join")}
              disabled={!canAccessTeamActions}
              className={`flex items-center justify-center gap-2 px-6 py-3 border border-neutral_01/20 rounded-xl transition-colors ${
                canAccessTeamActions
                  ? "bg-neutral_01/10 text-neutral_01 hover:bg-neutral_01/20"
                  : "bg-neutral_01/5 text-neutral_01/40 cursor-not-allowed"
              }`}
              title={
                !canAccessTeamActions
                  ? "Lengkapi profil Anda terlebih dahulu"
                  : ""
              }
            >
              <UserPlus className="w-5 h-5" />
              <span>Gabung Tim</span>
            </button>
            <button
              onClick={() => handleTeamAction("create")}
              disabled={!canAccessTeamActions}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                canAccessTeamActions
                  ? "bg-neutral_02 hover:bg-neutral_02/80 text-brand_01"
                  : "bg-neutral_01/10 text-neutral_01/40 cursor-not-allowed border border-neutral_01/20"
              }`}
              title={
                !canAccessTeamActions
                  ? "Lengkapi profil Anda terlebih dahulu"
                  : ""
              }
            >
              <Plus className="w-5 h-5" />
              <span>Buat Tim Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/30 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral_01">
                Buat Tim Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-neutral_01/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral_01" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral_01 mb-2">
                  Nama Tim <span className="text-red-500">*</span>
                </label>
                <p className="text-white/40 text-sm mb-2">
                  Anda tidak dapat mengubah nama tim setelah dibuat.
                </p>
                <input
                  type="text"
                  value={createTeamForm.name}
                  onChange={(e) =>
                    setCreateTeamForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                  placeholder="Masukkan nama tim"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral_01 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={createTeamForm.description}
                  onChange={(e) =>
                    setCreateTeamForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 resize-none transition-all duration-200"
                  placeholder="Deskripsi tim (opsional)"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <p className="text-white/40 text-sm ">
                Setiap tim hanya bisa memiliki maksimal{" "}
                <b>{TEAM_REQUIREMENTS.MAX_MEMBERS} anggota.</b>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 hover:bg-neutral_01/20 transition-colors text-center"
              >
                Batal
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={isCreatingTeam || !createTeamForm.name.trim()}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_02 hover:bg-neutral_02/80 rounded-lg text-brand_01 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCreatingTeam ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat...</span>
                  </>
                ) : (
                  <span>Buat Tim</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/30 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral_01">
                Bergabung dengan Tim
              </h3>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinTeamForm({ teamCode: "" });
                  setPreviewTeam(null);
                }}
                className="p-2 hover:bg-neutral_01/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral_01" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral_01 mb-2">
                  Kode Tim
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinTeamForm.teamCode}
                    onChange={(e) =>
                      setJoinTeamForm((prev) => ({
                        ...prev,
                        teamCode: e.target.value.toUpperCase(),
                      }))
                    }
                    className="flex-1 px-3 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 placeholder-neutral_01/40 focus:outline-none focus:ring-2 focus:ring-neutral_02/50 transition-all duration-200"
                    placeholder="Masukkan kode tim"
                    maxLength={8}
                  />
                  <button
                    onClick={handlePreviewTeam}
                    disabled={!joinTeamForm.teamCode.trim()}
                    className="px-4 py-2 bg-neutral_02 hover:bg-neutral_02/80 rounded-lg text-brand_01 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cari
                  </button>
                </div>
              </div>
              {(message && message.position === "insideCard") && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 bg-${
                    message.type === "success"
                      ? "green-500/10 border-green-400/20 text-green-400"
                      : "red-500/10 border-red-400/20 text-red-400"
                  } rounded-lg`}
                >
                  {message.text}
                </div>
              )}
              {/* Team Preview */}
              {previewTeam && (
                <div className="p-4 bg-neutral_01/10 border border-neutral_01/20 rounded-lg">
                  <h4 className="font-medium text-neutral_01 mb-2">
                    {previewTeam.name}
                  </h4>
                  <p className="text-sm text-neutral_01/60 mb-3">
                    {previewTeam.description || "Tidak ada deskripsi"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-neutral_01/80">
                    <span>
                      {previewTeam.current_members}/
                      {TEAM_REQUIREMENTS.MAX_MEMBERS} anggota
                    </span>
                    <span
                      className={
                        previewTeam.is_full ? "text-red-400" : "text-green-400"
                      }
                    >
                      {previewTeam.is_full ? "Penuh" : "Tersedia"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinTeamForm({ teamCode: "" });
                  setPreviewTeam(null);
                }}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 hover:bg-neutral_01/20 transition-colors text-center"
              >
                Batal
              </button>
              <button
                onClick={handleJoinTeam}
                disabled={isJoiningTeam || !previewTeam || previewTeam.is_full}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_02 hover:bg-neutral_02/80 rounded-lg text-brand_01 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isJoiningTeam ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Bergabung...</span>
                  </>
                ) : (
                  <span>Bergabung</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kick Member Confirmation Modal */}
      {showKickModal && memberToKick && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/30 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center">
                <UserMinus className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral_01">
                  Keluarkan Anggota
                </h3>
                <p className="text-sm text-neutral_01/60">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="bg-neutral_01/10 border border-neutral_01/20 rounded-xl p-4 mb-6">
              <p className="text-neutral_01 mb-2">
                Anda yakin ingin mengeluarkan{" "}
                <span className="font-semibold text-red-400">
                  {memberToKick.name}
                </span>{" "}
                dari tim?
              </p>
              <p className="text-sm text-neutral_01/60">
                Anggota yang dikeluarkan tidak akan bisa mengakses tim lagi dan
                harus bergabung ulang jika ingin kembali.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowKickModal(false);
                  setMemberToKick(null);
                }}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 hover:bg-neutral_01/20 transition-colors text-center"
              >
                Batal
              </button>
              <button
                onClick={confirmKickMember}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserMinus className="w-4 h-4" />
                Keluarkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Team Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/30 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-800/20 border border-red-400/30 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-red-600/60" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral_01">
                  Keluar dari Tim
                </h3>
                <p className="text-sm text-neutral_01/60">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="bg-neutral_01/10 border border-neutral_01/20 rounded-xl p-4 mb-6">
              {userRole === "leader" ? (
                <div>
                  <p className="text-neutral_01 mb-2">
                    Anda adalah{" "}
                    <span className="font-semibold text-yellow-400">
                      leader tim
                    </span>
                    . Jika Anda keluar:
                  </p>
                  <ul className="text-sm text-neutral_01/80 space-y-1 ml-4">
                    <li>
                      • Kepemimpinan akan dialihkan ke anggota lain secara
                      otomatis
                    </li>
                    <li>• Anda harus bergabung ulang jika ingin kembali</li>
                    <li>• Tim akan tetap berjalan tanpa Anda</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-neutral_01 mb-2">
                    Anda yakin ingin keluar dari tim{" "}
                    <span className="font-semibold text-neutral_02">
                      {team?.name}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-neutral_01/60">
                    Anda harus bergabung ulang jika ingin kembali ke tim ini.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 hover:bg-neutral_01/20 transition-colors text-center"
              >
                Batal
              </button>
              <button
                onClick={confirmLeaveTeam}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-red-900 hover:bg-red-900/80 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar Tim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Incomplete Warning Modal */}
      {showProfileWarning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/30 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral_01">
                  Profil Belum Lengkap
                </h3>
                <p className="text-sm text-neutral_01/60">
                  Lengkapi profil untuk mengakses fitur tim
                </p>
              </div>
            </div>

            <div className="bg-neutral_01/10 border border-neutral_01/20 rounded-xl p-4 mb-6">
              <p className="text-neutral_01 mb-3">
                Untuk membuat atau bergabung dengan tim, Anda harus melengkapi
                semua field profil terlebih dahulu.
              </p>

              <div className="mb-4">
                <p className="text-neutral_01/80 text-sm mb-2">
                  Field yang belum diisi:
                </p>
                <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                  {missingFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                      <span className="text-neutral_01/70">{field}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  💡 <strong>Tips:</strong> Pastikan semua informasi pribadi,
                  akademik, dan alamat telah diisi dengan benar.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowProfileWarning(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral_01/10 border border-neutral_01/20 rounded-lg text-neutral_01 hover:bg-neutral_01/20 transition-colors text-center"
              >
                Nanti Saja
              </button>
              <button
                onClick={() => {
                  setShowProfileWarning(false);
                  router.push("/dashboard?menu=profil");
                }}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Lengkapi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMenu = searchParams.get("menu");

  // Set default menu with localStorage support
  useEffect(() => {
    if (!currentMenu) {
      // Get last visited menu from localStorage, default to "profil"
      const lastMenu = localStorage.getItem("dashboard-last-menu") || "profil";
      router.replace(`/dashboard?menu=${lastMenu}`);
    } else {
      // Save current menu to localStorage
      localStorage.setItem("dashboard-last-menu", currentMenu);
    }
  }, [currentMenu, router]);

  // Render content based on current menu
  const renderContent = () => {
    switch (currentMenu) {
      case "profil":
        return <ProfilContent />;
      case "kompetisi":
        return <KompetisiContent />;
      case "tim":
        return <TimContent />;
      default:
        return <ProfilContent />;
    }
  };

  return (
    <main className="w-full">
      <div className="w-full">{renderContent()}</div>
    </main>
  );
};

export default Dashboard;
