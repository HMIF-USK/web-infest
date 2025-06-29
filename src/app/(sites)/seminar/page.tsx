"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";
import { Calendar, Clock, MapPin, Users, Award, ArrowLeft } from "lucide-react";
import { SeminarSwiperImages } from "@/components/seminarSection/seminarSwiperImages";

const GlowingOrb = ({
  size = 100,
  color = "brand_01",
  opacity = 0.3,
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

const SeminarPage = () => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const speakers = [
    {
      id: 1,
      name: "Dr. Ahmad Rahman",
      title: "AI Research Scientist",
      company: "Google Indonesia",
      image: "/assets/images/speaker-1.jpg",
      topic: "Future of Artificial Intelligence in Indonesia",
    },
    {
      id: 2,
      name: "Sarah Wijaya",
      title: "Chief Technology Officer",
      company: "Gojek",
      image: "/assets/images/speaker-2.jpg",
      topic: "Building Scalable Tech Solutions",
    },
    {
      id: 3,
      name: "Prof. Budi Santoso",
      title: "Computer Science Professor",
      company: "ITB",
      image: "/assets/images/speaker-3.jpg",
      topic: "Innovation in Computer Science Education",
    },
  ];

  const schedule = [
    { time: "08:00 - 08:30", activity: "Registrasi & Welcome Coffee" },
    { time: "08:30 - 09:00", activity: "Opening Ceremony" },
    { time: "09:00 - 10:30", activity: "Keynote Speech: Dream Big - Strategies for Achieving Greatness" },
    { time: "10:30 - 11:00", activity: "Coffee Break & Networking" },
    { time: "11:00 - 12:30", activity: "Panel Discussion: Future of Technology in Indonesia" },
    { time: "12:30 - 13:30", activity: "Lunch Break" },
    { time: "13:30 - 15:00", activity: "Workshop: Innovation & Entrepreneurship" },
    { time: "15:00 - 15:30", activity: "Closing Ceremony & Networking" },
  ];

  return (
    <div className="w-full min-h-screen text-neutral_01 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <GlowingOrb size={300} color="brand_01" delay={0} />
        <GlowingOrb size={200} color="neutral_01" delay={2} />
        <GlowingOrb size={150} color="brand_01" delay={4} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-20 py-20">
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src="/assets/images/Seminar Infest USK.webp"
            alt="Seminar Nasional InFest USK"
            fill
            priority
            className="object-cover w-full h-full opacity-20"
          />
        </div>
        
        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-24 left-4 md:left-20 flex items-center gap-2 bg-neutral_01/10 backdrop-blur-md border border-neutral_01/20 px-4 py-2 rounded-full hover:bg-neutral_01/20 transition-all duration-300"
          data-aos="fade-right"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </Link>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div data-aos="fade-up" data-aos-delay="200">
            <h1 className={`text-6xl md:text-8xl lg:text-9xl font-bold mb-6 ${dm_serif_display.className} bg-gradient-to-r from-neutral_01 via-neutral_02 to-neutral_01 bg-clip-text text-transparent`}>
              SEMINAR
            </h1>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${dm_serif_display.className}`}>
              NASIONAL
            </h2>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="400">
            <p className="text-xl md:text-2xl mb-6 font-medium">
              Dream Big: Strategies for Achieving Greatness
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-4xl mx-auto">
              Bergabunglah dengan para ahli, praktisi, dan peneliti terkemuka untuk membahas strategi mencapai prestasi luar biasa di era teknologi modern
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="600" className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] hover:scale-105 transition-all duration-300">
              Daftar Sekarang
            </button>
            <button className="border-2 border-neutral_01 text-neutral_01 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-neutral_01 hover:text-brand_01 transition-all duration-300">
              Download Brosur
            </button>
          </div>

          {/* Quick Info */}
          <div data-aos="fade-up" data-aos-delay="800" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-container glass-container--rounded p-6 text-center">
              <div className="glass-filter" />
              <div className="glass-specular" />
              <div className="glass-content flex-col items-center">
                <Calendar className="w-8 h-8 mb-3 text-neutral_02" />
                <h3 className="font-bold text-lg mb-2">Tanggal</h3>
                <p className="text-neutral_01/80">28 September 2025</p>
              </div>
            </div>
            
            <div className="glass-container glass-container--rounded p-6 text-center">
              <div className="glass-filter" />
              <div className="glass-specular" />
              <div className="glass-content flex-col items-center">
                <Clock className="w-8 h-8 mb-3 text-neutral_02" />
                <h3 className="font-bold text-lg mb-2">Waktu</h3>
                <p className="text-neutral_01/80">08:00 - 15:30 WIB</p>
              </div>
            </div>
            
            <div className="glass-container glass-container--rounded p-6 text-center">
              <div className="glass-filter" />
              <div className="glass-specular" />
              <div className="glass-content flex-col items-center">
                <MapPin className="w-8 h-8 mb-3 text-neutral_02" />
                <h3 className="font-bold text-lg mb-2">Lokasi</h3>
                <p className="text-neutral_01/80">Auditorium FMIPA USK</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${dm_serif_display.className}`}>
                Tentang Seminar
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                Seminar Nasional InFest adalah platform prestisius yang mempertemukan para pemimpin teknologi, peneliti, dan innovator untuk berbagi wawasan tentang masa depan teknologi informasi di Indonesia.
              </p>
              <p className="text-lg mb-8 leading-relaxed">
                Dengan tema "Dream Big: Strategies for Achieving Greatness", acara ini dirancang untuk menginspirasi peserta agar berani bermimpi besar dan memberikan strategi konkret untuk mencapai prestasi yang luar biasa.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral_02 mb-2">500+</div>
                  <div className="text-neutral_01/80">Peserta</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral_02 mb-2">10+</div>
                  <div className="text-neutral_01/80">Pembicara Expert</div>
                </div>
              </div>
            </div>
            
            <div data-aos="fade-left">
              <SeminarSwiperImages />
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${dm_serif_display.className}`}>
              Pembicara Utama
            </h2>
            <p className="text-lg text-neutral_01/80 max-w-2xl mx-auto">
              Belajar langsung dari para ahli dan praktisi terkemuka di bidang teknologi informasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <div key={speaker.id} data-aos="fade-up" data-aos-delay={index * 200} className="group">
                <div className="glass-container glass-container--rounded p-6 hover:scale-105 transition-all duration-500">
                  <div className="glass-filter" />
                  <div className="glass-specular" />
                  <div className="glass-content flex-col text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-neutral_02 shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-neutral_02/20 to-brand_01/20 flex items-center justify-center">
                        <Users className="w-16 h-16 text-neutral_01/60" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{speaker.name}</h3>
                    <p className="text-neutral_02 font-medium mb-1">{speaker.title}</p>
                    <p className="text-neutral_01/80 text-sm mb-4">{speaker.company}</p>
                    <p className="text-sm leading-relaxed">{speaker.topic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${dm_serif_display.className}`}>
              Jadwal Acara
            </h2>
            <p className="text-lg text-neutral_01/80">
              Susunan acara seminar nasional yang telah dirancang dengan cermat
            </p>
          </div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100} className="group">
                <div className="glass-container glass-container--rounded p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="glass-filter" />
                  <div className="glass-specular" />
                  <div className="glass-content justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-neutral_02 text-brand_01 px-4 py-2 rounded-full font-bold text-sm">
                        {item.time}
                      </div>
                      <div className="text-lg font-medium">{item.activity}</div>
                    </div>
                    <div className="hidden md:block">
                      <Clock className="w-5 h-5 text-neutral_01/60" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${dm_serif_display.className}`}>
              Manfaat Mengikuti Seminar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: "Sertifikat Resmi",
                description: "Dapatkan sertifikat kehadiran yang dapat menunjang karir Anda"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Networking",
                description: "Bertemu dan berinteraksi dengan profesional di bidang teknologi"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Knowledge Update",
                description: "Wawasan terbaru tentang tren dan perkembangan teknologi"
              }
            ].map((benefit, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 200}>
                <div className="glass-container glass-container--rounded p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="glass-filter" />
                  <div className="glass-specular" />
                  <div className="glass-content flex-col items-center">
                    <div className="text-neutral_02 mb-4">{benefit.icon}</div>
                    <h3 className="font-bold text-xl mb-3">{benefit.title}</h3>
                    <p className="text-neutral_01/80">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${dm_serif_display.className}`}>
              Jangan Lewatkan Kesempatan Ini!
            </h2>
            <p className="text-lg mb-8 text-neutral_01/80">
              Segera daftarkan diri Anda dan jadilah bagian dari transformasi teknologi Indonesia
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] hover:scale-105 transition-all duration-300">
                Daftar Sekarang - Gratis!
              </button>
              <button className="border-2 border-neutral_01 text-neutral_01 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-neutral_01 hover:text-brand_01 transition-all duration-300">
                Hubungi Panitia
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeminarPage;
