"use client";

import { ThreeDMarquee } from "@/components/3dMarquee";
import { dm_serif_display, nuosu_sil } from "@/app/fonts/fonts";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glass";
import AOS from "aos";
import { AnimatedCountUp } from "@/components/AnimatedCountUp";

// Glowing orb component for background effects
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

// Main App Component
const InfestWebsite = () => {
  const [isMarqueeLoading, setIsMarqueeLoading] = useState(true);
  const [competitionsRevealed, setCompetitionsRevealed] = useState(false);

  // Sample images for the 3D marquee
  const images = [
    "/assets/images/infest-24.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-2.webp",
    "/assets/images/infest-5.webp",
    "/assets/images/infest-11.webp",
    "/assets/images/infest-25.webp",
    "/assets/images/infest-3.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-6.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-26.webp",
    "/assets/images/infest-18.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-8.webp",
    "/assets/images/infest-19.webp",
    "/assets/images/infest-9.webp",
    "/assets/images/infest-10.webp",
    "/assets/images/infest-12.webp",
    "/assets/images/infest-13.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-16.webp",
    "/assets/images/infest-15.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-27.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-20.webp",
    "/assets/images/infest-21.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-23.webp",
    // "/assets/images/infest-25.webp",
    // "/assets/images/infest-26.webp",
    // "/assets/images/infest-27.webp",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMarqueeLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="w-full h-full text-neutral_01">
      {/* Hero Section */}
      <section id="hero" className="w-full h-screen relative overflow-hidden">
        <Image
          src="/assets/images/comingsoon.webp"
          alt="Informatics Festival (Infest) HMIF USK"
          fill
          priority
          className="object-cover w-full h-full"
        />
        <div className="w-full justify-center items-center flex z-20 absolute bottom-[8%] gap-8">
          <p className="text-sm bg-gradient-to-r from-neutral_02 to-neutral_01 bg-clip-text text-transparent">
            Get ready for the biggest tech festival
          </p>
          <div
            className={`px-3 py-2.5 text-sm shadow-[0_0_40px_rgba(242,233,197,0.8)] border border-neutral_01/80 text-brand_01 rounded-full ${nuosu_sil.className} bg-gradient-to-r from-neutral_02 to-neutral_01`}
          >
            XI
          </div>
          <p className="text-sm bg-gradient-to-l from-neutral_02 to-neutral_01 bg-clip-text text-transparent">
            Where Innovation Meets Excellence
          </p>
        </div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-brand_02/20 to-transparent"></div>
      </section>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      <section
        id="about"
        className="w-full min-h-screen flex flex-col p-16 relative gap-20"
      >
        <div className="w-full flex gap-20 justify-between items-center">
          <div className="absolute inset-0 overflow-hidden">
            <GlowingOrb size={200} color="neutral_01" delay={0} />
            <GlowingOrb size={150} color="brand_01" delay={2} />
          </div>
          <div className="flex flex-col w-1/2 gap-8">
            <h2
              className={`text-8xl ${dm_serif_display.className} bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_01 bg-clip-text text-transparent`}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Empowering the Digital Generation
            </h2>
            <p className="text-lg" data-aos="fade-right" data-aos-delay="200">
              INFEST (Informatics Festival) XI 2025 is the biggest tech event in
              Aceh, bringing together students, professionals, and digital
              creators in one vibrant arena. Carrying the theme “Digitopia:
              Designing a Seamlessly Connected, Inclusive, and Intelligent
              Future”, INFEST is more than a competition — it’s a movement to
              shape the future through innovation, collaboration, and real-world
              impact.
            </p>
          </div>
          <div className="w-1/2 h-full relative rounded-3xl overflow-hidden grid grid-cols-2 gap-6 p-6">
            <div
              className="h-1/2 w-full"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <Glass className="w-full h-full flex flex-col">
                <p className="text-4xl">🏆</p>
                <p className="font-bold text-2xl text-center">
                  3 Kompetisi Unggulan
                </p>
              </Glass>
            </div>
            <div
              className="h-1/2 w-full"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <Glass className="w-full h-full flex flex-col">
                <p className="text-4xl">🏆</p>
                <p className="font-bold text-2xl text-center">
                  3 Kompetisi Unggulan
                </p>
              </Glass>
            </div>
            <div
              className="h-1/2 w-full col-span-2"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <Glass className="w-full h-full flex flex-col">
                <p className="text-4xl">🏆</p>
                <p className="font-bold text-2xl text-center">
                  3 Kompetisi Unggulan
                </p>
              </Glass>
            </div>
          </div>
        </div>
        <div className={`w-full flex gap-4 ${dm_serif_display.className}`}>
          <div className="w-1/3 h-full" data-aos="fade-up" data-aos-delay="300">
            <Glass className="h-56 flex flex-col">
              <p className="text-2xl font-medium">Contributed By</p>
              <AnimatedCountUp
                end={900}
                suffix="+"
                className="text-6xl font-bold text-glow"                
              />
              <p className="text-2xl font-medium text-center">
                Competitions & National Seminar
              </p>
            </Glass>
          </div>
          <div className="w-1/3 h-full" data-aos="fade-up" data-aos-delay="100">
            <Glass className="h-56 flex flex-col">
              <p className="text-2xl font-medium">Rollback the Glory</p>
              <AnimatedCountUp
                end={2024}
                separator=""
                className="text-6xl font-bold text-glow"                
              />
              <p className="text-2xl font-medium text-center">
                The Momentum Behind INFEST X
              </p>
            </Glass>
          </div>
          <div className="w-1/3 h-full" data-aos="fade-up" data-aos-delay="300">
            <Glass className="h-56 flex flex-col">
              <p className="text-2xl font-medium">In Collaboration With</p>
              <AnimatedCountUp
                duration={4}
                end={25}
                suffix="+"
                className="text-6xl font-bold text-glow"                
              />
              <p className="text-2xl font-medium">Partners & Sponsors</p>
            </Glass>
          </div>
        </div>

        {/* 3D Marquee Container */}
        <div
          className="m-auto w-full h-full rounded-3xl z-30 bg-white/5 p-4 backdrop-blur-md flex ring-1 ring-neutral_01/10 relative overflow-hidden shadow-[0_0_40px_rgba(242,233,197,0.8)]"
          data-aos="fade-up"
        >
          {isMarqueeLoading ? (
            <div className="m-auto flex flex-col h-[80vh] justify-center items-center animate-pulse">
              <div className="w-32 h-32 bg-gradient-to-br from-neutral_01/20 to-neutral_02/20 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-4xl">🎭</div>
              </div>
              <p className="font-bold text-neutral_01 text-center text-xl">
                Loading Memories...
              </p>
              <div className="mt-4 flex space-x-2">
                <div className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : (
            <ThreeDMarquee images={images} />
          )}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl"></div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[30%] left-3/4 w-96 h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-[20%] w-96 h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      <div className="w-full mx-auto h-[1px] bg-gradient-to-r from-brand_01 via-neutral_01 to-brand_01"></div>

      {/* Competitions Section */}
      <section
        id="competition"
        className="px-8 md:px-20 w-full min-h-screen relative flex flex-col py-20"
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-96 h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2/3 right-1/4 w-96 h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>

        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Section Title */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <h2
              className={`text-5xl md:text-8xl font-bold text-neutral_01 mb-4 ${dm_serif_display.className}`}
              style={{
                animation: "textGlow 3s ease-in-out infinite alternate",
              }}
            >
              Competitions
            </h2>
            <p className="text-xl text-neutral_01/80 max-w-2xl mx-auto">
              Three exciting competitions await. Can you guess what they are?
            </p>
          </div>
          <div
            className="w-[90vw] h-[655px] relative flex "
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Image
              src="/assets/images/window.png"
              alt="Informatics Festival (Infest) HMIF USK"
              fill
              className="object-contain w-full h-full"
            />
            <div className="flex w-full gap-12 justify-between items-center px-20">
              <div className="w-[24%] h-1/3" style={{ perspective: "600px" }}>
                <div className="w-full h-full bg-white/20 rounded-3xl shadow-lg perspective-left shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              </div>
              <div className="w-1/3 h-1/3 bg-white/20 rounded-3xl shadow-lg shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              <div className="w-[24%] h-1/3" style={{ perspective: "600px" }}>
                <div className="w-full h-full bg-white/20 rounded-3xl shadow-lg perspective-right shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01/50 to-transparent"></div>

      {/* Rollback the Glory Section */}
      <section className="w-full min-h-screen flex flex-col gap-12 py-20 px-8 md:px-20">
        {/* Section Header */}
        <div className="flex flex-col gap-4 justify-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral_01/5 to-transparent blur-3xl"></div>
          <h2 className="relative text-5xl md:text-7xl font-bold text-neutral_01 leading-tight">
            Rollback the Glory.
          </h2>
          <p className="relative text-xl text-neutral_01/80">
            Relive the amazing moments from Informatics Festival 2024
          </p>
        </div>

        {/* 3D Marquee Container */}
        <div className="m-auto w-full h-[80vh] rounded-3xl bg-white/5 backdrop-blur-md p-4 flex ring-1 ring-neutral_01/10 relative overflow-hidden shadow-[0_0_40px_rgba(242,233,197,0.8)]">
          {/* Loading state */}
          {isMarqueeLoading ? (
            <div className="m-auto flex flex-col items-center animate-pulse">
              <div className="w-32 h-32 bg-gradient-to-br from-neutral_01/20 to-neutral_02/20 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-4xl">🎭</div>
              </div>
              <p className="font-bold text-neutral_01 text-center text-xl">
                Loading Memories...
              </p>
              <div className="mt-4 flex space-x-2">
                <div className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral_01 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : (
            <ThreeDMarquee images={images} />
          )}

          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center border-t border-neutral_01/20">
        <div className="text-neutral_01/60">
          <p className="mb-2">© 2025 Himpunan Mahasiswa Informatika USK</p>
          <p className="text-sm">
            Preparing for the greatest tech festival ever
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InfestWebsite;
