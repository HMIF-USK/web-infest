"use client";

import { ThreeDMarquee } from "@/components/3dMarquee";
import { dm_serif_display, nuosu_sil } from "@/app/fonts/fonts";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glass";
import AOS from "aos";
import { AnimatedCountUp } from "@/components/AnimatedCountUp";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";
import { Sparkle, Speech, Trophy } from "lucide-react";
import { TextGenerateEffect } from "@/components/textGenerateEffect";

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
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  // Sample images for the 3D marquee
  const images = [
    "/assets/images/infest-24.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-2.webp",
    "/assets/images/infest-5.webp",
    "/assets/images/infest-19.webp",
    "/assets/images/infest-25.webp",
    "/assets/images/infest-3.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-6.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-26.webp",
    "/assets/images/infest-18.webp",
    "/assets/images/infest-9.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-8.webp",
    "/assets/images/infest-11.webp",
    "/assets/images/infest-10.webp",
    "/assets/images/infest-12.webp",
    "/assets/images/infest-13.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-16.webp",
    "/assets/images/infest-23.webp",
    "/assets/images/infest-27.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-15.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-27.webp",
    "/assets/images/infest-21.webp",
    "/assets/images/infest-27.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-25.webp",
    "/assets/images/infest-26.webp",
    "/assets/images/infest-24.webp",
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
      once: false,
    });
  }, []);

  return (
    <div className="w-full h-full text-neutral_01">
      {/* Hero Section */}
      <section
        id="hero"
        className="w-full min-h-[80vh] flex flex-col relative gap-10 md:gap-20 py-10 md:py-20 px-4 md:px-20"
      >
        <div className="absolute inset-0 overflow-hidden -z-10">
          <GlowingOrb size={200} color="neutral_01" delay={0} />
          <GlowingOrb size={150} color="brand_01" delay={2} />
        </div>
        <div className="mt-10 flex flex-col gap-6 items-center">
          {/* <h1
            className={`${dm_serif_display.className} text-glow text-[6.8rem] text-neutral_01 z-20 text-center  bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_01 bg-clip-text text-transparent`}
            style={{ lineHeight: "1" }}
          >
            Informatics Festival
            XI 2025
          </h1> */}
          <TextGenerateEffect
            className={`${dm_serif_display.className} text-glow z-20 text-center`}
            words={"Informatics Festival XI 2025"}
          />
          <div className="w-full flex flex-col md:flex-row justify-center items-center z-20 gap-4 md:gap-8 px-4" data-aos="fade-up" data-aos-delay="500">
            <p className="text-xs md:text-sm bg-gradient-to-r from-neutral_02 to-neutral_01 bg-clip-text text-transparent text-center md:text-left">
              Get ready for the biggest tech festival
            </p>
            <div
              className={`px-3 py-2.5 text-xs md:text-sm shadow-[0_0_40px_rgba(242,233,197,0.8)] border border-neutral_01/80 text-brand_01 rounded-full ${nuosu_sil.className} bg-gradient-to-r from-neutral_02 to-neutral_01`}
            >
              XI
            </div>
            <p className="text-xs md:text-sm bg-gradient-to-l from-neutral_02 to-neutral_01 bg-clip-text text-transparent text-center md:text-left">
              Where Innovation Meets Excellence
            </p>
          </div>
          <div className="flex gap-4 mx-auto w-1/2 font-semibold filter drop-shadow-[0_0_40px_rgba(242,233,197,0.8)]" data-aos="fade-up" data-aos-delay="700">
            <button className="flex-1 text-brand_01 rounded-xl shadow-xl px-6 py-3 bg-neutral_01 border border-white/20 flex justify-center items-center gap-4">
              <Trophy />
              Competitions
            </button>
            <button className="flex-1 text-neutral_01 rounded-xl shadow-xl px-6 py-3 bg-brand_01 border border-neutral_01 flex justify-center items-center gap-4">
              <Speech />
              <span>National Seminar</span>
            </button>
          </div>
        </div>
        {/* 3D Marquee Container */}
        <div
          className="m-auto w-full h-full rounded-3xl z-30 bg-gradient-radial from-neutral_01/60 via-transparent to-transparent p-2 md:p-4 flex ring-1 ring-neutral_01/10 relative overflow-hidden shadow-[0_0_40px_rgba(242,233,197,0.8)]"
          data-aos="fade-up"
          data-aos-delay="900"
        >
          {isMarqueeLoading ? (
            <div className="m-auto flex flex-col h-[40vh] md:h-[80vh] justify-center items-center animate-pulse">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-neutral_01/20 to-neutral_02/20 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-4xl">🎭</div>
              </div>
              <p className="font-bold text-neutral_01 text-center text-lg md:text-xl">
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
          <div className="absolute top-2 z-0 left-2 w-6 h-6 md:top-4 md:left-4 md:w-8 md:h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl"></div>
          <div className="absolute top-2 z-0 right-2 w-6 h-6 md:top-4 md:right-4 md:w-8 md:h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl"></div>
          <div className="absolute bottom-2 z-0 left-2 w-6 h-6 md:bottom-4 md:left-4 md:w-8 md:h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl"></div>
          <div className="absolute bottom-2 z-0 right-2 w-6 h-6 md:bottom-4 md:right-4 md:w-8 md:h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl"></div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div className="flex flex-col w-full md:w-1/2 gap-6 md:gap-8 z-10">
            <h2
              className={`text-5xl md:text-[7rem] ${dm_serif_display.className} bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_01 bg-clip-text text-transparent`}
              style={{
                lineHeight: "1",
              }}
              data-aos="fade-right"
            >
              Empowering the Digital Generation
            </h2>
            <p
              className="text-base md:text-lg"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              INFEST (Informatics Festival) XI 2025 is the biggest tech event in
              Aceh, bringing together students, professionals, and digital
              creators in one vibrant arena. Carrying the theme{" "}
              <b>
                "Digitopia: Designing a Seamlessly Connected, Inclusive, and
                Intelligent Future"
              </b>
              , INFEST is more than a competition — it's a movement to shape the
              future through innovation, collaboration, and real-world impact.
            </p>
          </div>
          <div
            className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-8 md:mt-0"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            {/* Multi-layered Glow Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute w-[120%] h-[120%] rounded-full bg-gradient-radial from-neutral_01/20 via-neutral_01/10 to-transparent blur-3xl animate-pulse-slow"></div>

              {/* Middle Glow Ring */}
              <div className="absolute w-[100%] h-[100%] rounded-full bg-gradient-radial from-brand_01/30 via-brand_01/15 to-transparent blur-2xl animate-ping-slow"></div>

              {/* Inner Glow Ring */}
              <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-radial from-neutral_02/40 via-neutral_02/20 to-transparent blur-xl animate-pulse-slower"></div>

              {/* Core Glow */}
              <div className="absolute w-[60%] h-[60%] rounded-full bg-gradient-radial from-neutral_01/50 to-transparent blur-lg animate-breathe"></div>
            </div>

            {/* Rotating Ring Effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[110%] h-[110%] border border-neutral_01/20 rounded-full animate-spin-slow"></div>
              <div className="absolute w-[90%] h-[90%] border border-brand_01/30 rounded-full animate-reverse-spin-slow"></div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neutral_01 rounded-full animate-twinkle"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-brand_01 rounded-full animate-twinkle-delayed"></div>
              <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-neutral_02 rounded-full animate-twinkle-slow"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-neutral_01 rounded-full animate-twinkle-fast"></div>
            </div>

            {/* Main Logo with Enhanced Effects */}
            <div className="relative z-10">
              <Image
                src="/assets/images/Infest 2025 1st Logo Outline.png"
                alt="Informatics Festival (Infest) HMIF USK Logo"
                width={500}
                height={500}
                className="object-contain  w-full md:w-[90%] floating-element filter drop-shadow-[0_0_30px_rgba(242,233,197,0.6)] hover:drop-shadow-[0_0_50px_rgba(242,233,197,0.8)] transition-all duration-500"
              />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-1 h-1 bg-neutral_01/60 rounded-full animate-float-1"></div>
              <div className="absolute w-0.5 h-0.5 bg-brand_01/80 rounded-full animate-float-2"></div>
              <div className="absolute w-1.5 h-1.5 bg-neutral_02/50 rounded-full animate-float-3"></div>
              <div className="absolute w-0.5 h-0.5 bg-neutral_01/70 rounded-full animate-float-4"></div>
            </div>
          </div>
        </div>
        <div
          className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${dm_serif_display.className}`}
        >
          <div
            className="w-full h-full order-2 md:order-1"
            data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
            data-aos-delay={`${isDesktop && "300"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center">
              <p className="text-lg md:text-2xl font-medium">Contributed By</p>
              <AnimatedCountUp
                end={900}
                suffix="+"
                className="text-4xl md:text-6xl font-bold text-glow"
              />
              <p className="text-lg md:text-2xl font-medium text-center w-4/5">
                Competitions & National Seminar
              </p>
            </Glass>
          </div>
          <div
            className="w-full h-full order-1 md:order-2"
            data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center">
              <p className="text-lg md:text-2xl font-medium">
                Rollback the Glory
              </p>
              <AnimatedCountUp
                end={2024}
                separator=""
                className="text-4xl md:text-6xl font-bold text-glow"
              />
              <p className="text-lg md:text-2xl font-medium text-center w-3/5">
                The Momentum Behind INFEST X
              </p>
            </Glass>
          </div>
          <div
            className="w-full h-full order-3"
            data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
            data-aos-delay={`${isDesktop && "300"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center">
              <p className="text-lg md:text-2xl font-medium">
                In Collaboration With
              </p>
              <AnimatedCountUp
                duration={4}
                end={25}
                suffix="+"
                className="text-4xl md:text-6xl font-bold text-glow"
              />
              <p className="text-lg md:text-2xl font-medium w-1/3 text-center">
                Partners & Sponsors
              </p>
            </Glass>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-3/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-[20%] w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* Competitions Section */}
      <section
        id="competition"
        className="w-full min-h-[80vh] md:min-h-screen relative flex flex-col py-10 md:py-20 px-4 md:px-20"
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2/3 right-1/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>

        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Section Title */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <h2
              className={`text-3xl md:text-5xl lg:text-8xl font-bold text-neutral_01 mb-2 md:mb-4 ${dm_serif_display.className}`}
            >
              Competitions
            </h2>
            <p className="text-base md:text-xl text-neutral_01/80 max-w-2xl mx-auto">
              Three exciting competitions await. Can you guess what they are?
            </p>
          </div>
          <div
            className="w-full h-[300px] md:h-[655px] relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-4 md:mt-0"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Image
              src="/assets/images/window.png"
              alt="Informatics Festival (Infest) HMIF USK"
              fill
              className="object-contain w-full h-full"
            />
            <div className="flex w-full gap-4 md:gap-12 justify-between items-center px-2 md:px-20 absolute top-0 left-0 h-full">
              <div
                className="w-1/4 h-1/3 hidden md:block"
                style={{ perspective: "600px" }}
              >
                <div className="w-full h-full bg-white/20 rounded-3xl shadow-lg perspective-left shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              </div>
              <div className="w-full md:w-1/3 h-1/3 bg-white/20 rounded-3xl shadow-lg shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              <div
                className="w-1/4 h-1/3 hidden md:block"
                style={{ perspective: "600px" }}
              >
                <div className="w-full h-full bg-white/20 rounded-3xl shadow-lg perspective-right shadow-black/60 backdrop-blur-sm border border-white/80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* Seminar Section */}
      <section
        id="seminar"
        className="w-full min-h-[80vh] md:min-h-screen relative flex flex-col py-10 md:py-20 px-4 md:px-20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2/3 right-1/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center gap-8 md:gap-16">
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <h2
              className={`text-3xl md:text-5xl lg:text-8xl font-bold text-neutral_01 mb-2 md:mb-4 ${dm_serif_display.className}`}
            >
              National Seminar
            </h2>
            <p className="text-base md:text-xl text-neutral_01/80 max-w-2xl mx-auto">
              A series of seminars and workshops will be held to provide
              knowledge and insights into the latest trends and developments in
              the field of informatics.
            </p>
          </div>

          <div
            className="flex flex-col items-center gap-2 md:gap-4 w-full"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-brand_01/80 text-neutral_01 text-xs md:text-sm font-semibold tracking-wide shadow-lg mb-2">
              Mystery Speaker
            </span>
            <div className="relative w-36 h-36 md:w-56 md:h-56 flex items-center justify-center">
              <Image
                src="/assets/images/man-1.png"
                alt="Mystery Speaker Silhouette"
                fill
                className="object-cover grayscale opacity-60 rounded-full border-4 border-brand_01 shadow-2xl"
                style={{ zIndex: 1 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-5xl md:text-[6rem] lg:text-[8rem] font-bold text-brand_01 drop-shadow-lg animate-pulse text-glow"
                  style={{ zIndex: 2 }}
                >
                  ?
                </span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-brand_01/10 to-transparent"></div>
            </div>
            <p
              className="text-base md:text-lg text-center max-w-xl text-neutral_01/90 mt-2"
              data-aos="fade-up"
            >
              Who will be the keynote speaker at INFEST XI National Seminar this
              year? Stay tuned as we will soon reveal an inspiring figure who
              will share their best insights and experiences. Follow us on{" "}
              <b>Social Media</b> for the latest updates!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 justify-center items-center">
            <div
              className="w-full md:h-40"
              data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
            >
              <Glass className="flex flex-col items-center justify-center h-full">
                <span className="text-2xl md:text-4xl">🎤</span>
                <p
                  className={`font-semibold text-lg md:text-2xl ${dm_serif_display.className}`}
                >
                  Latest Topics
                </p>
                <p className="text-center text-neutral_01/80 text-xs md:text-sm">
                  Insights from industry experts and academics on the newest
                  trends and innovations in technology.
                </p>
              </Glass>
            </div>
            <div
              className="w-full md:h-40"
              data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
              data-aos-delay="100"
            >
              <Glass className="flex flex-col items-center justify-center h-full">
                <span className="text-2xl md:text-4xl">🤝</span>
                <p
                  className={`font-semibold text-lg md:text-2xl ${dm_serif_display.className}`}
                >
                  Networking
                </p>
                <p className="text-center text-neutral_01/80 text-xs md:text-sm">
                  Opportunities to meet, discuss, and build connections with
                  fellow participants and speakers.
                </p>
              </Glass>
            </div>
            <div
              className="w-full md:h-40"
              data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
              data-aos-delay="200"
            >
              <Glass className="flex flex-col items-center justify-center h-full">
                <span className="text-2xl md:text-4xl">📜</span>
                <p
                  className={`font-semibold text-lg md:text-2xl ${dm_serif_display.className}`}
                >
                  E-Certificate
                </p>
                <p className="text-center text-neutral_01/80 text-xs md:text-sm">
                  Receive an exclusive e-certificate as proof of your
                  participation in the national seminar.
                </p>
              </Glass>
            </div>
          </div>

          <div
            className="mt-4 md:mt-8 flex justify-center"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <a
              href="#"
              className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-gradient-to-r from-brand_01 to-neutral_02 text-neutral_01 font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-neutral_01/30 text-base md:text-lg"
            >
              Get the Latest Updates
            </a>
          </div>
        </div>
      </section>

      <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01/50 to-transparent"></div>
    </div>
  );
};

export default InfestWebsite;
