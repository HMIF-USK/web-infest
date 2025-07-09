"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/libs/services/authService";
import {
  competitionService,
  type Competition,
  type CompetitionRegistration,
} from "@/libs/services/competitionService";
import { teamService, type TeamWithMembers } from "@/libs/services/teamService";
import { PaymentProofUpload } from "@/components/uploadFile/PaymentProofUpload";
import type { User } from "@supabase/supabase-js";
import {
  Trophy,
  Users,
  Calendar,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Clock,
  DollarSign,
  Award,
  Eye,
  UserPlus,
  Info,
} from "lucide-react";
import Image from "next/image";

const CompetitionContent = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userRegistration, setUserRegistration] =
    useState<CompetitionRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userTeam, setUserTeam] = useState<TeamWithMembers | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [currentRegistration, setCurrentRegistration] =
    useState<CompetitionRegistration | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<
    "confirm" | "payment" | "complete"
  >("confirm");
  const [registrationMessage, setRegistrationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "bank_transfer" as "bank_transfer" | "e_wallet" | "cash",
    paymentDate: "",
    accountName: "",
    notes: "",
    file: null as File | null,
  });

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

        // Get user's team
        const teamResult = await teamService.getUserTeam(userResult.user.id);
        if (teamResult.data) {
          setUserTeam(teamResult.data);
        }
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
          setUserRegistration(registrationsResult.registrations);
          console.log(
            "User registrations loaded:",
            registrationsResult.registrations
          );
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user's team is registered for a competition
  const isRegistered = (competitionId: string) => {
    if (!userTeam || !userRegistration) return false;
    return (
      userRegistration.competition_id === competitionId &&
      userRegistration.team_id === userTeam.id &&
      userRegistration.status !== "cancelled"
    );
  };

  // Check if user has any registration (for disabling other competitions)
  const hasAnyRegistration = () => {
    return userRegistration && userRegistration.status !== "cancelled";
  };

  // Get registration status for a competition
  const getRegistrationStatus = (competitionId: string) => {
    if (!userTeam || !userRegistration) return null;
    if (
      userRegistration.competition_id === competitionId &&
      userRegistration.team_id === userTeam.id &&
      userRegistration.status !== "cancelled"
    ) {
      return userRegistration.status;
    }
    return null;
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

  // Get status color and text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
          text: "Proses Verifikasi",
        };
      case "approved":
        return {
          color: "bg-green-500/20 text-green-400 border-green-400/30",
          text: "Terdaftar",
        };
      case "rejected":
        return {
          color: "bg-red-500/20 text-red-400 border-red-400/30",
          text: "Ditolak",
        };
      case "cancelled":
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-400/30",
          text: "Dibatalkan",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-400/30",
          text: status,
        };
    }
  };

  const handleTeamRegistration = async () => {
    if (!selectedCompetition || !userTeam || !user) return;

    setIsRegistering(true);
    setRegistrationMessage(null);

    try {
      // Check if team already has active registration
      const hasActiveReg = await competitionService.hasActiveRegistration(
        userTeam.id
      );
      if (hasActiveReg.hasRegistration) {
        setRegistrationMessage({
          type: "error",
          text: "Tim sudah terdaftar untuk kompetisi lain. Setiap tim hanya bisa mendaftar satu kompetisi.",
        });
        setIsRegistering(false);
        return;
      }

      // Check if competition is still open for registration
      const regOpen = isRegistrationOpen(selectedCompetition);
      if (!regOpen) {
        setRegistrationMessage({
          type: "error",
          text: "Pendaftaran kompetisi sudah ditutup.",
        });
        setIsRegistering(false);
        return;
      }

      // Just move to payment step without saving to database yet
      setRegistrationStep("payment");
      setRegistrationMessage({
        type: "success",
        text: "Silakan upload bukti pembayaran untuk melanjutkan pendaftaran.",
      });
    } catch (error) {
      console.error("Error checking registration:", error);
      setRegistrationMessage({
        type: "error",
        text: "Terjadi kesalahan saat memeriksa pendaftaran. Silakan coba lagi.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle registration with payment proof
  const handleRegistrationWithPayment = async (paymentUrl: string) => {
    if (!selectedCompetition || !userTeam) return;

    try {
      // Registration and payment already handled by PaymentProofUpload
      // Just provide success feedback and update UI
      setUploadMessage({
        type: "success",
        text: "Pendaftaran berhasil! Tim Anda telah terdaftar untuk kompetisi dengan bukti pembayaran.",
      });
      setRegistrationStep("complete");

      // Reload data after successful registration
      setTimeout(() => {
        loadData();
      }, 2000);
    } catch (error) {
      console.error("Error completing registration:", error);
      setUploadMessage({
        type: "error",
        text: "Terjadi kesalahan saat menyelesaikan pendaftaran.",
      });
    }
  };

  // Reset modal state
  const resetRegistrationModal = (isAfterRegistration = false) => {
    setShowRegistrationModal(false);
    setSelectedCompetition(null);
    setCurrentRegistration(null);
    setRegistrationStep("confirm");
    setRegistrationMessage(null);
    setUploadMessage(null);
    setPaymentForm({
      paymentMethod: "bank_transfer",
      paymentDate: "",
      accountName: "",
      notes: "",
      file: null,
    });

    console.log("IS AFTER REGISTRATION:", isAfterRegistration);

    isAfterRegistration && loadData();
  };

  // Loading state
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

      {/* My Registration */}
      {userRegistration ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral_01 mb-4">
            {userRegistration.status === "approved"
              ? "Registrasi Saya"
              : "Pendaftaran Proses Verifikasi"}
          </h2>
          <div className="bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-neutral_01 text-lg">
                {userRegistration.competition?.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border ${
                  getStatusDisplay(userRegistration.status).color
                } ml-2 flex-shrink-0`}
              >
                {getStatusDisplay(userRegistration.status).text}
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
                    {userRegistration.team?.name || "Tim tidak ditemukan"}
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
                      userRegistration.status === "approved"
                        ? "text-green-400"
                        : userRegistration.status === "pending"
                        ? "text-yellow-400"
                        : !userRegistration.payment_proof_url
                        ? "text-yellow-400"
                        : "text-orange-400"
                    }`}
                  >
                    {userRegistration.status === "approved"
                      ? "Sudah Diverifikasi"
                      : userRegistration.status === "pending"
                      ? "Proses Verifikasi"
                      : !userRegistration.payment_proof_url
                      ? "Belum Upload Bukti"
                      : "Menunggu Persetujuan Pendaftaran"}
                  </p>
                </div>
                {userRegistration.status === "approved" &&
                  !userRegistration.payment_proof_url && (
                    <button
                      onClick={() => {
                        setCurrentRegistration(userRegistration);
                        setSelectedCompetition(
                          userRegistration.competition || null
                        );
                        setRegistrationStep("payment");
                        setShowRegistrationModal(true);
                      }}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      Upload Bukti
                    </button>
                  )}
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral_02 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-medium text-neutral_01/80 tracking-wide">
                    Tanggal Daftar
                  </p>
                  <p className="text-sm text-neutral_01/90 font-medium">
                    {formatDate(userRegistration.registration_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full border-b border-neutral_01/10 pb-8 mb-8 mt-9">
          <p className="text-xs sm:text-sm md:text-base font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full text-center text-neutral_02">
            Anda Belum terdaftar untuk kompetisi apa pun. Silakan pilih
            kompetisi yang tersedia di bawah ini untuk mendaftar!
          </p>
        </div>
      )}

      {/* Available Competitions */}
      <div>
        {competitions.length === 0 ? (
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
            {competitions.map((competition) => {
              const registered = isRegistered(competition.id);
              const registrationStatus = getRegistrationStatus(competition.id);
              const regOpen = isRegistrationOpen(competition);
              const hasOtherRegistration = hasAnyRegistration() && !registered;

              return (
                <div
                  key={competition.id}
                  className={`bg-neutral_01/5 backdrop-blur-sm border border-neutral_01/10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                    hasOtherRegistration
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-neutral_02/30"
                  }`}
                >
                  {/* Image */}
                  {competition.poster_image_url && (
                    <div className="h-48 bg-gradient-to-r from-brand_01 to-brand_02 relative overflow-hidden">
                      <Image
                        src={competition.poster_image_url}
                        alt={competition.name}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Disabled overlay for other competitions */}
                    {hasOtherRegistration && (
                      <div className="mb-4 bg-orange-500/10 border border-orange-400/20 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-orange-400 font-medium text-sm mb-1">
                              Tidak Dapat Mendaftar
                            </p>
                            <p className="text-orange-400/80 text-xs">
                              Tim Anda sudah terdaftar untuk kompetisi "
                              {userRegistration?.competition?.name}". Setiap tim
                              hanya dapat mendaftar satu kompetisi.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-neutral_01 mb-2">
                      {competition.name}
                    </h3>
                    <p className="text-neutral_01/60 text-sm mb-6 line-clamp-3">
                      {competition.description}
                    </p>

                    {/* Competition Info - Improved Layout with Icons */}
                    <div className="flex flex-col gap-4 mb-6 flex-1">
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
                            Jadwal Kompetisi
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

                    {/* Buttons - Always at the bottom */}
                    <div className="flex gap-2 mt-auto">
                      {competition.guidebook_url && (
                        <button
                          onClick={() => {
                            window.open(competition.guidebook_url, "_blank");
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral_01/15 border border-neutral_01/10 text-neutral_01 text-sm font-medium rounded-lg hover:bg-neutral_01/10 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Guidebook
                        </button>
                      )}

                      {!registered &&
                        regOpen &&
                        user &&
                        !hasOtherRegistration && (
                          <button
                            onClick={() => {
                              // If it's Google Form registration, open the form URL
                              if (
                                competition.is_google_form_registration &&
                                competition.google_form_registration_url
                              ) {
                                window.open(
                                  competition.google_form_registration_url,
                                  "_blank"
                                );
                              } else {
                                // Otherwise, handle team-based registration
                                setSelectedCompetition(competition);
                                setShowRegistrationModal(true);
                              }
                            }}
                            className="flex-1 flex items-center hover:opacity-75 justify-center gap-2 px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 text-sm font-semibold rounded-lg hover:shadow-lg duration-200"
                          >
                            <UserPlus className="w-4 h-4" />
                            Daftar
                          </button>
                        )}

                      {!regOpen && !registered && !hasOtherRegistration && (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral_01/5 border border-neutral_01/10 text-neutral_01/40 text-sm font-medium rounded-lg cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          Tutup
                        </button>
                      )}

                      {registrationStatus === "pending" && (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 text-sm font-medium rounded-lg cursor-default"
                        >
                          <Clock className="w-4 h-4" />
                          Proses Verifikasi
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

      {/* Team Registration Modal */}
      {showRegistrationModal && selectedCompetition && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white/5 backdrop-blur-md border border-neutral_01/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-neutral_01">
                  {registrationStep === "confirm" && "Daftar Kompetisi"}
                  {registrationStep === "payment" && "Upload Bukti Pembayaran"}
                  {registrationStep === "complete" && "Registrasi Berhasil"}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      registrationStep === "confirm"
                        ? "bg-neutral_02"
                        : "bg-green-500"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full ${
                      registrationStep === "payment"
                        ? "bg-neutral_02"
                        : registrationStep === "complete"
                        ? "bg-green-500"
                        : "bg-neutral_01/20"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full ${
                      registrationStep === "complete"
                        ? "bg-green-500"
                        : "bg-neutral_01/20"
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={() => resetRegistrationModal()}
                className="p-2 hover:bg-neutral_01/20 rounded-lg text-neutral_01/60 hover:text-neutral_01 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Confirmation */}
            {registrationStep === "confirm" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral_01 mb-2">
                    {selectedCompetition.name}
                  </h4>
                  <p className="text-sm text-neutral_01/80 mb-4">
                    {selectedCompetition.description}
                  </p>
                </div>

                {/* Team Check */}
                {!userTeam ? (
                  <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium mb-1">
                          Tim Diperlukan
                        </p>
                        <p className="text-red-400/80 text-sm">
                          Anda harus bergabung dengan tim terlebih dahulu untuk
                          mendaftar kompetisi.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-neutral_01/5 border border-neutral_01/10 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-neutral_02 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-neutral_01 font-medium mb-1">
                            {userTeam.name}
                          </p>
                          <p className="text-neutral_01/60 text-sm">
                            {userTeam.current_members} anggota • Kode:{" "}
                            {userTeam.code}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral_01/5 border border-neutral_01/10 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-neutral_02 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-neutral_01 font-medium mb-1">
                            Biaya Pendaftaran
                          </p>
                          <p className="text-neutral_01/60 text-sm">
                            {formatCurrency(
                              selectedCompetition.registration_fee
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Message */}
                {registrationMessage && (
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      registrationMessage.type === "success"
                        ? "bg-green-500/10 border-green-400/20 text-green-400"
                        : "bg-red-500/10 border-red-400/20 text-red-400"
                    }`}
                  >
                    {registrationMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">
                      {registrationMessage.text}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => resetRegistrationModal()}
                    className="flex-1 px-4 py-2 border border-neutral_01/20 rounded-lg text-neutral_01/80 bg-neutral_01/20 hover:bg-neutral_01/10 transition-colors"
                  >
                    Batal
                  </button>
                  {userTeam && (
                    <button
                      onClick={handleTeamRegistration}
                      disabled={isRegistering}
                      className="flex-1 px-4 py-2 bg-gradient-to-r hover:opacity-50 from-neutral_02 to-neutral_01 text-brand_01 rounded-lg hover:shadow-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mendaftar...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Daftar
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Payment Upload */}
            {registrationStep === "payment" && (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-400 font-medium mb-1">
                        Perhatian
                      </p>
                      <p className="text-blue-400/80 text-sm">
                        Pendaftaran akan tersimpan ke database setelah Anda
                        berhasil mengupload bukti pembayaran. Pastikan semua
                        informasi pembayaran sudah benar sebelum upload.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Message */}
                {uploadMessage && (
                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border mb-4 ${
                      uploadMessage.type === "success"
                        ? "bg-green-500/10 border-green-400/20 text-green-400"
                        : "bg-red-500/10 border-red-400/20 text-red-400"
                    }`}
                  >
                    {uploadMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-medium">
                      {uploadMessage.text}
                    </span>
                  </div>
                )}

                <PaymentProofUpload
                  registrationId={currentRegistration?.id}
                  competitionId={selectedCompetition?.id}
                  teamId={userTeam?.id}
                  onSuccess={(url) => {
                    // Call the registration with payment handler
                    handleRegistrationWithPayment(url);
                  }}
                  onError={(error) => {
                    setUploadMessage({
                      type: "error",
                      text: error,
                    });
                  }}
                />

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setRegistrationStep("confirm")}
                    className="flex-1 px-4 py-2 border border-neutral_01/20 rounded-lg text-neutral_01/80 bg-neutral_01/20 hover:bg-neutral_01/10 transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {registrationStep === "complete" && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-neutral_01 mb-2">
                    Registrasi Berhasil!
                  </h4>
                  <p className="text-neutral_01/80 text-sm mb-4">
                    Tim Anda telah berhasil mendaftar untuk kompetisi{" "}
                    {selectedCompetition.name} dan bukti pembayaran telah
                    diupload. Tunggu verifikasi dari admin.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-blue-400 font-medium mb-1">
                        Langkah Selanjutnya
                      </p>
                      <p className="text-blue-400/80 text-sm">
                        1. Admin akan memverifikasi pembayaran Anda
                        <br />
                        2. Anda akan mendapat notifikasi jika pembayaran
                        disetujui
                        <br />
                        3. Jika ada masalah, admin akan menghubungi Anda
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => resetRegistrationModal(false)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* TODO: Add Competition Detail Modal */}
    </div>
  );
};

export default CompetitionContent;
