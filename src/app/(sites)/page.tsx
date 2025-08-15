"use client";

import { ThreeDMarquee } from "@/components/3dMarquee";
import { dm_serif_display, nuosu_sil } from "@/app/fonts/fonts";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glass";
import AOS from "aos";
import { AnimatedCountUp } from "@/components/animatedCountUp";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";
import { Speech, Trophy } from "lucide-react";
import { Timeline } from "@/components/timeline";
import { timelineData } from "@/data/timeline";
import { competitionData } from "@/data/competitions";
import Link from "next/link";

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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Competition data helpers
  const slugMap: Record<string, string> = {
    "UI/UX Design": "uiux",
    Hackathon: "hackathon",
    COINS: "coins",
  };

  // const iconMap: Record<string, string> = {
  //   "UI/UX Design": "🎨",
  //   Hackathon: "💻",
  //   COINS: "🏆",
  // };

  // const displayName = (name: string) => name.replace(/ Design$/i, "");
  const getSlug = (name: string) =>
    slugMap[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "");

  // Optional meta to enrich content (kept static to preserve visual density)
  const meta: Record<
    string,
    {
      level?: string;
      type?: string;
      teamSize?: string;
      duration?: string;
      prize?: string;
    }
  > = {
    uiux: { level: "University", type: "Team/Individual" },
    hackathon: { prize: "IDR 15.000.000+", teamSize: "2-4 members" },
    coins: { level: "High School", duration: "3 hours" },
  };

  const competitions = competitionData;
  const featuredComp = competitions.find((c) => c.featured);
  const sideComps = competitions.filter((c) => !c.featured);

  return (
    <div className="w-full h-full text-neutral_01">
      {/* Hero Section */}
      <section
        id="hero"
        className="w-full min-h-[80vh] flex flex-col relative gap-10 md:gap-12 lg:gap-20 py-6 md:py-12 lg:py-20 px-4 md:px-8 lg:px-20"
      >
        <div className={`absolute inset-0 w-screen h-1/4`}>
          <Image
            src="/assets/images/goldconfet Infest USK.webp"
            alt="Informatics Festival (Infest) HMIF USK"
            fill
            priority
            className="object-cover w-full h-full opacity-50 lg:opacity-60"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden -z-10">
          <GlowingOrb size={200} color="neutral_01" delay={0} />
          <GlowingOrb size={150} color="brand_01" delay={2} />
        </div>
        <div className="mt-10 flex flex-col gap-6 items-center">
          <h1
            className={`${dm_serif_display.className} filter mt-6 drop-shadow-xl shadow-black text-5xl md:text-7xl lg:text-[6.8rem] text-neutral_01 z-20 text-center bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_02 bg-clip-text text-transparent`}
            style={{ lineHeight: "1" }}
          >
            Informatics Festival XI 2025
          </h1>
          <div className="w-full flex justify-center items-center z-20 gap-3 md:gap-6 lg:gap-8 px-4">
            <p className="text-xs md:text-sm lg:text-sm bg-gradient-to-r text-end from-neutral_02 to-neutral_01 bg-clip-text text-transparent md:text-left">
              Get ready for the biggest tech festival
            </p>
            <div
              className={`px-2.5 py-2 md:px-3 md:py-2.5 text-xs md:text-sm lg:text-sm shadow-[0_0_40px_rgba(242,233,197,0.8)] border border-neutral_01/80 text-brand_01 rounded-full ${nuosu_sil.className} bg-gradient-to-r from-neutral_02 to-neutral_01`}
            >
              XI
            </div>
            <p className="text-xs md:text-sm lg:text-sm bg-gradient-to-l from-neutral_02 to-neutral_01 bg-clip-text text-transparent text-start md:text-left">
              Where Innovation Meets Excellence
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 justify-center w-full md:w-3/4 lg:w-1/2 font-semibold filter drop-shadow-[0_0_40px_rgba(242,233,197,0.8)]">
            <Link
              href="/dashboard?menu=kompetisi"
              className="flex-1 text-brand_01 rounded-xl text-sm md:text-base shadow-xl px-4 md:px-6 py-3 bg-neutral_01 border border-white/20 flex justify-center items-center gap-2 md:gap-4"
            >
              <Trophy size={18} className="md:w-5 md:h-5" />
              Competitions
            </Link>
            <Link
              href="#seminar"
              className="flex-1 text-neutral_01 rounded-xl text-sm md:text-base shadow-xl px-4 md:px-6 py-3 bg-brand_01 border border-neutral_01 flex justify-center items-center gap-2 md:gap-4"
            >
              <Speech size={20} className="md:w-[22px] md:h-[22px]" />
              <span>National Seminar</span>
            </Link>
          </div>
        </div>
        {/* 3D Marquee Container */}
        <div
          className="m-auto w-full h-full rounded-3xl z-30 bg-gradient-radial from-neutral_01/60 via-transparent to-transparent p-2 md:p-3 lg:p-4 flex ring-1 ring-neutral_01/10 relative overflow-hidden shadow-[0_0_40px_rgba(242,233,197,0.8)]"
          data-aos="fade-up"
        >
          {isMarqueeLoading ? (
            <div className="m-auto flex flex-col h-[40vh] md:h-[60vh] lg:h-[80vh] w-full justify-center items-center animate-pulse bg-brand_02/60 rounded-xl">
              <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-neutral_01/20 to-neutral_02/20 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-2xl md:text-3xl lg:text-4xl">🎭</div>
              </div>
              <p className="font-bold text-neutral_01 text-center text-base md:text-lg lg:text-xl">
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
          <div className="absolute top-2 z-0 left-2 w-5 h-5 md:top-3 md:left-3 md:w-6 md:h-6 lg:top-4 lg:left-4 lg:w-8 lg:h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-xl"></div>
          <div className="absolute top-2 z-0 right-2 w-5 h-5 md:top-3 md:right-3 md:w-6 md:h-6 lg:top-4 lg:right-4 lg:w-8 lg:h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-xl"></div>
          <div className="absolute bottom-2 z-0 left-2 w-5 h-5 md:bottom-3 md:left-3 md:w-6 md:h-6 lg:bottom-4 lg:left-4 lg:w-8 lg:h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-xl"></div>
          <div className="absolute bottom-2 z-0 right-2 w-5 h-5 md:bottom-3 md:right-3 md:w-6 md:h-6 lg:bottom-4 lg:right-4 lg:w-8 lg:h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-xl"></div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 lg:gap-0">
          <div className="flex flex-col w-full md:w-1/2 gap-4 md:gap-6 lg:gap-8 z-10">
            <h2
              className={`text-4xl md:text-5xl lg:text-[7rem] ${dm_serif_display.className} bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_01 bg-clip-text text-transparent text-center md:text-start`}
              style={{
                lineHeight: "1",
              }}
              data-aos="fade-right"
            >
              Empowering the Digital Generation
            </h2>
            <p
              className="text-sm md:text-base lg:text-lg text-center md:text-start"
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
              , INFEST is more than a competition, it's a movement to shape the
              future through innovation, collaboration, and real-world impact.
            </p>
          </div>
          <div
            className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-6 md:mt-8 lg:mt-0"
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
              <div className="w-[86%] h-[100%] border border-neutral_01/20 rounded-full animate-spin-slow"></div>
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
                className="object-contain w-full md:w-[90%] lg:w-[90%] floating-element filter drop-shadow-[0_0_30px_rgba(242,233,197,0.6)] hover:drop-shadow-[0_0_50px_rgba(242,233,197,0.8)] transition-all duration-500"
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

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-3/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-[20%] w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* INFEST by Numbers Section */}
      <section className="bg-gradient-to-br from-neutral_01 via-neutral_01 to-neutral_02 py-10 md:py-20 px-4 md:px-8 lg:px-20 relative overflow-hidden">
        <div
          className="text-center mb-8 md:mb-12 relative z-20"
          data-aos="fade-up"
        >
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold text-brand_01 mb-2 md:mb-4 ${dm_serif_display.className}`}
          >
            INFEST by Numbers
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-brand_01/80 max-w-2xl mx-auto z-30">
            A decade of excellence in technology education and innovation
          </p>
        </div>
        <div
          className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${dm_serif_display.className}`}
        >
          <div
            className="w-full h-full order-2 md:order-1"
            data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
            data-aos-delay={`${isDesktop && "300"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-brand_01">
                Contributed By
              </p>
              <AnimatedCountUp
                end={900}
                suffix="+"
                className="text-4xl lg:text-6xl font-bold text-glow text-brand_01"
              />
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-center w-full lg:w-4/5 text-brand_01">
                Competitions & National Seminar
              </p>
            </Glass>
          </div>
          <div
            className="w-full h-full order-1 md:order-2"
            data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-brand_01">
                Rollback the Glory
              </p>
              <AnimatedCountUp
                end={2024}
                separator=""
                className="text-4xl lg:text-6xl font-bold text-glow text-brand_01"
              />
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-center w-full lg:w-3/5 text-brand_01">
                The Momentum Behind INFEST X
              </p>
            </Glass>
          </div>
          <div
            className="w-full h-full order-3"
            data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
            data-aos-delay={`${isDesktop && "300"}`}
          >
            <Glass className="h-40 md:h-56 flex flex-col items-center justify-center text-center">
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-brand_01">
                In Collaboration With
              </p>
              <AnimatedCountUp
                duration={4}
                end={25}
                suffix="+"
                className="text-4xl lg:text-6xl font-bold text-glow text-brand_01"
              />
              <p className="text-lg lg:text-2xl font-medium w-full lg:w-1/3 text-center text-brand_01">
                Partners & Sponsors
              </p>
            </Glass>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 z-0 h-64 bg-gradient-to-bl from-primary_yellow/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 z-0 h-48 bg-gradient-to-tr from-brand_01/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
      </section>

      <section
        id="timeline"
        className="w-full min-h-[80vh] md:min-h-screen relative flex flex-col py-10 md:py-20 px-4 md:px-8 lg:px-20"
      >
        <div className="max-w-full flex gap-8 items-center">
          <h2
            className={`text-5xl leading-none md:text-[6.6rem] mb-4 bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_01 bg-clip-text text-transparent ${dm_serif_display.className}`}
          >
            Timeline
          </h2>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full h-1 bg-gradient-to-r from-neutral_01 via-neutral_01 to-neutral_02 rounded-full"></div>
            <p className="text-xs md:text-base">
              Here's where our extraordinary journey through innovation,
              collaboration, and digital excellence unfolds
            </p>
          </div>
        </div>
        <div className="relative w-full overflow-clip mt-20">
          <Timeline data={timelineData} />
        </div>
      </section>

      <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* Competitions Section */}
      <section
        id="competition"
        className="w-full min-h-[80vh] md:min-h-screen relative flex flex-col py-10 md:py-20 px-4 md:px-8 lg:px-20"
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2/3 right-1/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/6 w-20 h-20 md:w-40 md:h-40 bg-primary-yellow/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32 md:w-60 md:h-60 bg-brand_01/5 rounded-full blur-3xl"></div>
        </div>

        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center gap-16">
          {/* Section Title */}
          <div
            className="text-center flex flex-col items-center gap-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2
              className={`text-3xl md:text-6xl lg:text-8xl font-bold text-neutral_01 ${dm_serif_display.className}`}
            >
              Competitions
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-neutral_01/80 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate showdown of innovation, skill, and creativity.
              Three challenging competitions designed to test your limits and
              showcase your talents in the digital realm.
            </p>
            <div className="w-1/2 h-1 bg-gradient-to-r from-neutral_02 via-neutral_01 to-neutral_02 rounded-full mt-4"></div>
          </div>

          {/* Competition Stats */}
          <div
            className="grid grid-cols-1 gap-4 md:gap-8 w-full mx-auto lg:mb-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="text-center relative">
              {/* Luxury background with multiple layers */}
              <div className="relative bg-gradient-to-br from-neutral_01/15 via-brand_01/5 to-neutral_02/10 p-6 md:p-8 rounded-3xl border border-neutral_01/30 backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden group hover:border-primary-yellow/50 transition-all duration-500">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-yellow/5 via-transparent to-brand_01/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary-yellow/30 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary-yellow/30 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary-yellow/30 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary-yellow/30 rounded-br-3xl"></div>

                {/* Floating sparkle elements */}
                <div className="absolute top-6 left-1/4 w-2 h-2 bg-primary-yellow/60 rounded-full animate-twinkle"></div>
                <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-neutral_01/80 rounded-full animate-twinkle-delayed"></div>
                <div className="absolute bottom-6 right-1/3 w-1.5 h-1.5 bg-brand_01/70 rounded-full animate-twinkle-slow"></div>

                <div className="relative z-10 w-full">
                  {/* Premium badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-primary-yellow/20 to-brand_01/20 rounded-full border border-primary-yellow/40">
                    <div className="w-2 h-2 bg-primary-yellow rounded-full animate-pulse"></div>
                    <span className="text-primary-yellow text-sm font-semibold tracking-wider">
                      EXCLUSIVE REWARDS
                    </span>
                    <div className="w-2 h-2 bg-primary-yellow rounded-full animate-pulse"></div>
                  </div>

                  {/* Elegant title with underline */}
                  <div className="mb-8">
                    <h3
                      className={`text-xl md:text-3xl lg:text-4xl font-bold text-neutral_01 mb-3 ${dm_serif_display.className}`}
                    >
                      Total Prize Pool
                    </h3>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary-yellow to-transparent mx-auto mb-2"></div>
                    {/* <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-neutral_01/60 to-transparent mx-auto"></div> */}
                  </div>

                  {/* Main prize display with enhanced styling */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-radial from-primary-yellow/20 via-transparent to-transparent blur-xl"></div>
                    <AnimatedCountUp
                      end={23000000}
                      separator="."
                      prefix="IDR "
                      suffix="+"
                      className="relative text-4xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary-yellow via-neutral_01 to-primary-yellow bg-clip-text text-transparent drop-shadow-lg font-mono tracking-wider"
                    />
                  </div>

                  {/* Elegant bottom note */}
                  <div className="mt-8 pt-6 border-t border-neutral_01/20">
                    <p className="text-xs md:text-sm text-neutral_01/60 italic">
                      *Additional prizes and bonuses available for special
                      categories
                    </p>
                  </div>
                </div>

                {/* Background geometric patterns */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary-yellow/20 rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-neutral_01/20 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-brand_01/10 to-transparent rounded-full blur-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Competition Display - Desktop (unchanged visual, lg+) */}
          <div
            className="hidden lg:flex w-full h-[36vh] lg:h-[50vh] relative flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12 mt-4 md:mt-0"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="flex w-full justify-between items-center absolute top-0 left-0 h-full">
              {/* Left Competition Card */}
              <div
                className="w-1/2 h-full hidden md:block group"
                style={{ perspective: "600px" }}
                data-aos="fade-right"
                data-aos-delay="800"
              >
                <div className="w-full h-full bg-gradient-to-br from-brand_01/20 to-neutral_01/10 rounded-3xl shadow-lg perspective-left shadow-black/60 backdrop-blur-sm border border-neutral_01/30 hover:border-primary-yellow/50 transition-all duration-500 group-hover:scale-[0.9] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand_01/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="p-6 h-full flex flex-col justify-between relative z-10">
                    <div>
                      <div className="relative w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <div className="relative w-2/3 h-2/3">
                          <Image
                            src={sideComps[0]?.iconUrl}
                            alt={sideComps[0]?.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-neutral_01 mb-2">
                        {sideComps[0]?.name ?? "UI/UX Design"}
                      </h3>
                      <p className="text-neutral_01/70 text-sm leading-relaxed">
                        {sideComps[0]?.description ??
                          "Design exceptional user experiences and interfaces for digital products. Showcase your creativity and design thinking skills!"}
                      </p>
                      {/* keywords */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(sideComps[0]?.keywords ?? [])
                          .slice(0, 3)
                          .map((k, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                            >
                              {k}
                            </span>
                          ))}
                      </div>
                      <div className="bg-neutral_01/10 rounded-xl p-3 mt-4 max-w-sm mx-auto">
                        {sideComps[0]?.prizepool && (
                          <div className="flex justify-between text-xs text-neutral_01/70 mb-1">
                            <span>Prize Pool</span>
                            <span className="text-primary-yellow font-semibold">
                              {sideComps[0]?.prizepool}
                            </span>
                          </div>
                        )}
                        {sideComps[0]?.teamMin && sideComps[0]?.teamMax && (
                          <div className="flex justify-between text-xs text-neutral_01/70">
                            <span>Team Size</span>
                            <span>
                              {sideComps[0]?.teamMin}-{sideComps[0]?.teamMax}{" "}
                              members
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard?menu=kompetisi&type=${getSlug(
                            sideComps[0]?.name ?? "uiux"
                          )}`}
                          className="px-3 py-1.5 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-xs font-semibold hover:bg-primary-yellow/90 transition-colors"
                        >
                          Daftar Sekarang
                        </Link>
                        <Link
                          href={
                            sideComps[0]?.guidebookLink ||
                            `/guidebook/${getSlug(
                              sideComps[0]?.name ?? "uiux"
                            )}`
                          }
                          className="px-3 py-1.5 border border-primary-yellow/40 text-primary-yellow rounded-lg text-xs font-semibold hover:bg-primary-yellow/10 transition-colors"
                        >
                          Guidebook
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-yellow/10 rounded-full blur-xl"></div>
                </div>
              </div>

              {/* Main Competition Card */}
              <div className="w-full md:w-[64%] h-full bg-gradient-to-br from-neutral_01/20 to-brand_01/10 rounded-2xl md:rounded-3xl shadow-xl shadow-black/60 backdrop-blur-sm border-2 border-primary-yellow/40 flex justify-center items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Featured Competition Content */}
                <div className="p-6 md:p-8 text-center relative z-20">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-primary-yellow rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto shadow-lg">
                    <div className="w-2/3 h-2/3 relative">
                      <Image
                        className="object-contain"
                        src={
                          featuredComp?.iconUrl ??
                          "/assets/images/competitions/hackathon.png"
                        }
                        fill
                        alt={featuredComp?.name ?? "Hackathon"}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral_01 mb-3">
                    {featuredComp?.name ?? "Hackathon"}
                  </h3>
                  <p className="text-neutral_01/80 text-sm md:text-base mb-4 leading-relaxed max-w-md mx-auto">
                    {featuredComp?.description ??
                      "48-hour intensive coding marathon where innovation meets implementation. Build solutions that matter."}
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    {(featuredComp?.keywords ?? []).slice(0, 3).map((k, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-xs"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  {/* small stats from data */}
                  {(featuredComp?.prizepool ||
                    (featuredComp?.teamMin && featuredComp?.teamMax)) && (
                    <div className="bg-neutral_01/10 rounded-xl p-3 mb-4 max-w-sm mx-auto">
                      {featuredComp?.prizepool && (
                        <div className="flex justify-between text-xs text-neutral_01/70 mb-1">
                          <span>Prize Pool</span>
                          <span className="text-primary-yellow font-semibold">
                            {featuredComp?.prizepool}
                          </span>
                        </div>
                      )}
                      {featuredComp?.teamMin && featuredComp?.teamMax && (
                        <div className="flex justify-between text-xs text-neutral_01/70">
                          <span>Team Size</span>
                          <span>
                            {featuredComp?.teamMin}-{featuredComp?.teamMax}{" "}
                            members
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* <div className="text-primary-yellow font-bold text-lg mb-3">Featured Competition</div> */}
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/dashboard?menu=kompetisi&type=${getSlug(
                        featuredComp?.name ?? "hackathon"
                      )}`}
                      className="px-5 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold hover:bg-primary-yellow/90 transition-colors"
                    >
                      Daftar Sekarang
                    </Link>
                    <Link
                      href={
                        featuredComp?.guidebookLink ||
                        `/guidebook/${getSlug(
                          featuredComp?.name ?? "hackathon"
                        )}`
                      }
                      className="px-5 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                    >
                      Guidebook
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary-yellow/50 rounded-tr-2xl"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary-yellow/50 rounded-bl-2xl"></div>
                <div className="absolute top-1/4 -left-4 w-8 h-8 bg-primary-yellow/20 rounded-full blur-md"></div>
                <div className="absolute bottom-1/4 -right-4 w-12 h-12 bg-neutral_01/10 rounded-full blur-lg"></div>
              </div>

              {/* Right Competition Card */}
              <div
                className="w-1/2 h-full hidden md:block group"
                style={{ perspective: "600px" }}
                data-aos="fade-left"
                data-aos-delay="800"
              >
                <div className="w-full h-full bg-gradient-to-bl from-neutral_02/20 to-brand_01/10 rounded-3xl shadow-lg perspective-right shadow-black/60 backdrop-blur-sm border border-neutral_01/30 hover:border-primary-yellow/50 transition-all duration-500 group-hover:scale-[0.9] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral_02/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="p-6 h-full flex flex-col justify-between relative z-10">
                    <div>
                      <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <div className="w-2/3 h-2/3 relative">
                          <Image
                            className="object-contain"
                            src={sideComps[1]?.iconUrl}
                            fill
                            alt={sideComps[1]?.name}
                          />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-neutral_01 mb-2">
                        {sideComps[1]?.name ?? "COINS"}
                      </h3>
                      <p className="text-neutral_01/70 text-sm leading-relaxed">
                        {sideComps[1]?.description ??
                          "Computer Olympiad of Infest. Algorithmic problem-solving competition designed for high school students."}
                      </p>
                      {/* keywords */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(sideComps[1]?.keywords ?? [])
                          .slice(0, 3)
                          .map((k, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                            >
                              {k}
                            </span>
                          ))}
                      </div>
                      <div className="bg-neutral_01/10 rounded-xl p-3 mt-4 max-w-sm mx-auto">
                        {sideComps[1]?.prizepool && (
                          <div className="flex justify-between text-xs text-neutral_01/70 mb-1">
                            <span>Prize Pool</span>
                            <span className="text-primary-yellow font-semibold">
                              {sideComps[1]?.prizepool}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard?menu=kompetisi&type=${getSlug(
                            sideComps[1]?.name ?? "coins"
                          )}`}
                          className="px-3 py-1.5 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-xs font-semibold hover:bg-primary-yellow/90 transition-colors"
                        >
                          Daftar Sekarang
                        </Link>
                        <Link
                          href={
                            sideComps[1]?.guidebookLink ||
                            `/guidebook/${getSlug(
                              sideComps[1]?.name ?? "coins"
                            )}`
                          }
                          className="px-3 py-1.5 border border-primary-yellow/40 text-primary-yellow rounded-lg text-xs font-semibold hover:bg-primary-yellow/10 transition-colors"
                        >
                          Guidebook
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-neutral_02/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Competition Display - Tablet (md to lg) */}
          <div className="hidden md:block lg:hidden w-full mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* UI/UX Card (first non-featured) */}
              <div
                className="bg-gradient-to-br from-brand_01/20 to-neutral_01/10 rounded-2xl shadow-lg border border-neutral_01/30 backdrop-blur-sm p-6 relative overflow-hidden"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-brand_01/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg">
                      <div className="relative w-2/3 h-2/3">
                        <Image
                          className="object-contain"
                          src={sideComps[0]?.iconUrl}
                          fill
                          alt={sideComps[0]?.name}
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">
                      {sideComps[0]?.name ?? "UI/UX Design"}
                    </h3>
                  </div>
                  <p className="text-neutral_01/80 text-sm leading-relaxed mb-3 flex-1">
                    {sideComps[0]?.description ??
                      "Design exceptional user experiences and interfaces for digital products. Showcase your creativity and design thinking skills!"}
                  </p>
                  {/* keywords */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(sideComps[0]?.keywords ?? []).slice(0, 3).map((k, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  {/* prize & team size */}
                  {(sideComps[0]?.prizepool ||
                    (sideComps[0]?.teamMin && sideComps[0]?.teamMax)) && (
                    <div className="bg-neutral_01/10 rounded-lg p-2 mb-4">
                      {sideComps[0]?.prizepool && (
                        <div className="flex justify-between text-[11px] text-neutral_01/70">
                          <span>Prize Pool</span>
                          <span className="text-primary-yellow font-semibold">
                            {sideComps[0]?.prizepool}
                          </span>
                        </div>
                      )}
                      {sideComps[0]?.teamMin && sideComps[0]?.teamMax && (
                        <div className="flex justify-between text-[11px] text-neutral_01/70">
                          <span>Team Size</span>
                          <span>
                            {sideComps[0]?.teamMin}-{sideComps[0]?.teamMax}{" "}
                            members
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={`/dashboard?menu=kompetisi&type=${getSlug(
                        sideComps[0]?.name ?? "uiux"
                      )}`}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold text-center hover:bg-primary-yellow/90 transition-colors"
                    >
                      Daftar Sekarang
                    </a>
                    <a
                      href={
                        sideComps[0]?.guidebookLink ||
                        `/guidebook/${getSlug(sideComps[0]?.name ?? "uiux")}`
                      }
                      className="px-3 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                    >
                      Guidebook
                    </a>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary-yellow/10 rounded-full blur-xl"></div>
              </div>

              {/* COINS Card */}
              <div
                className="bg-gradient-to-bl from-neutral_02/20 to-brand_01/10 rounded-2xl shadow-lg border border-neutral_01/30 backdrop-blur-sm p-6 relative overflow-hidden"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-neutral_02/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-2/3 h-2/3 relative">
                        <Image
                          className="object-contain"
                          src={sideComps[1]?.iconUrl}
                          fill
                          alt={sideComps[1]?.name}
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">
                      {sideComps[1]?.name ?? "COINS"}
                    </h3>
                  </div>
                  <p className="text-neutral_01/80 text-sm leading-relaxed mb-3 flex-1">
                    {sideComps[1]?.description ??
                      "Computer Olympiad of Infest. Algorithmic problem-solving competition designed for high school students."}
                  </p>
                  {/* keywords */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(sideComps[1]?.keywords ?? []).slice(0, 3).map((k, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  {/* prize & team size */}
                  {(sideComps[1]?.prizepool ||
                    (sideComps[1]?.teamMin && sideComps[1]?.teamMax)) && (
                    <div className="bg-neutral_01/10 rounded-lg p-2 mb-4">
                      {sideComps[1]?.prizepool && (
                        <div className="flex justify-between text-[11px] text-neutral_01/70">
                          <span>Prize Pool</span>
                          <span className="text-primary-yellow font-semibold">
                            {sideComps[1]?.prizepool}
                          </span>
                        </div>
                      )}
                      {sideComps[1]?.teamMin && sideComps[1]?.teamMax && (
                        <div className="flex justify-between text-[11px] text-neutral_01/70">
                          <span>Team Size</span>
                          <span>
                            {sideComps[1]?.teamMin}-{sideComps[1]?.teamMax}{" "}
                            members
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={`/dashboard?menu=kompetisi&type=${getSlug(
                        sideComps[1]?.name ?? "coins"
                      )}`}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold text-center hover:bg-primary-yellow/90 transition-colors"
                    >
                      Daftar Sekarang
                    </a>
                    <a
                      href={
                        sideComps[1]?.guidebookLink ||
                        `/guidebook/${getSlug(sideComps[1]?.name ?? "coins")}`
                      }
                      className="px-3 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                    >
                      Guidebook
                    </a>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-neutral_02/10 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Featured Hackathon below, full width */}
            <div
              className="mt-6 bg-gradient-to-br from-neutral_01/20 to-brand_01/10 rounded-2xl shadow-xl border-2 border-primary-yellow/40 backdrop-blur-sm p-8 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-yellow/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg mx-auto mb-2.5">
                  <div className="w-2/3 h-2/3 relative">
                    <Image
                      className="object-contain"
                      src={
                        featuredComp?.iconUrl ??
                        "/assets/images/competitions/hackathon.png"
                      }
                      fill
                      alt={featuredComp?.name ?? "Hackathon"}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {featuredComp?.name ?? "Hackathon"}
                </h3>
                <p className="text-neutral_01/80 text-sm md:text-base leading-relaxed mb-3 max-w-2xl mx-auto">
                  {featuredComp?.description ??
                    "48-hour intensive coding marathon where innovation meets implementation. Build solutions that matter."}
                </p>
                {/* keywords */}
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                  {(featuredComp?.keywords ?? []).slice(0, 3).map((k, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-xs"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                {/* prize & team size */}
                {(featuredComp?.prizepool ||
                  (featuredComp?.teamMin && featuredComp?.teamMax)) && (
                  <div className="bg-neutral_01/10 rounded-lg p-3 mb-4 max-w-md mx-auto">
                    {featuredComp?.prizepool && (
                      <div className="flex justify-between text-xs text-neutral_01/70">
                        <span>Prize Pool</span>
                        <span className="text-primary-yellow font-semibold">
                          {featuredComp?.prizepool}
                        </span>
                      </div>
                    )}
                    {featuredComp?.teamMin && featuredComp?.teamMax && (
                      <div className="flex justify-between text-xs text-neutral_01/70">
                        <span>Team Size</span>
                        <span>
                          {featuredComp?.teamMin}-{featuredComp?.teamMax}{" "}
                          members
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-center gap-3 flex-wrap">
                  <a
                    href={`/dashboard?menu=kompetisi&type=${getSlug(
                      featuredComp?.name ?? "hackathon"
                    )}`}
                    className="px-6 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-xl text-sm font-semibold hover:bg-primary-yellow/90 transition-colors"
                  >
                    Daftar Sekarang
                  </a>
                  <a
                    href={
                      featuredComp?.guidebookLink ||
                      `/guidebook/${getSlug(featuredComp?.name ?? "hackathon")}`
                    }
                    className="px-5 py-2 border border-primary-yellow/40 text-primary-yellow rounded-xl text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                  >
                    Guidebook
                  </a>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-yellow/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-neutral_01/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Competition Display - Mobile (< md) */}
          <div className="block md:hidden w-full mt-4 space-y-6">
            {/* Hackathon Featured first for mobile focus */}
            <div
              className="bg-gradient-to-br from-neutral_01/20 to-brand_01/10 rounded-2xl shadow-xl border-2 border-primary-yellow/40 backdrop-blur-sm p-6 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-yellow/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg">
                    <div className="relative w-2/3 h-2/3">
                      <Image
                        className="w-full h-full"
                        src={
                          featuredComp?.iconUrl ??
                          "/assets/images/competitions/hackathon.png"
                        }
                        fill
                        alt={featuredComp?.name ?? "Hackathon"}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {featuredComp?.name ?? "Hackathon"}
                    </h3>
                    {/* <p className="text-primary-yellow text-xs font-semibold">Featured Competition</p> */}
                  </div>
                </div>
                <p className="text-neutral_01/80 text-sm leading-relaxed mb-3">
                  {featuredComp?.description ??
                    "48-hour intensive coding marathon where innovation meets implementation. Build solutions that matter."}
                </p>
                {/* keywords */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(featuredComp?.keywords ?? []).slice(0, 3).map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                {/* prize & team size */}
                {(featuredComp?.prizepool ||
                  (featuredComp?.teamMin && featuredComp?.teamMax)) && (
                  <div className="bg-neutral_01/10 rounded-lg p-2 mb-4">
                    {featuredComp?.prizepool && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Prize Pool</span>
                        <span className="text-primary-yellow font-semibold">
                          {featuredComp?.prizepool}
                        </span>
                      </div>
                    )}
                    {featuredComp?.teamMin && featuredComp?.teamMax && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Team Size</span>
                        <span>
                          {featuredComp?.teamMin}-{featuredComp?.teamMax}{" "}
                          members
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <a
                    href={`/dashboard?menu=kompetisi&type=${getSlug(
                      featuredComp?.name ?? "hackathon"
                    )}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold text-center hover:bg-primary-yellow/90 transition-colors"
                  >
                    Daftar Sekarang
                  </a>
                  <a
                    href={
                      featuredComp?.guidebookLink ||
                      `/guidebook/${getSlug(featuredComp?.name ?? "hackathon")}`
                    }
                    className="px-4 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                  >
                    Guidebook
                  </a>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-yellow/10 rounded-full blur-xl"></div>
            </div>

            {/* UI/UX */}
            <div
              className="bg-gradient-to-br from-brand_01/20 to-neutral_01/10 rounded-2xl shadow-lg border border-neutral_01/30 backdrop-blur-sm p-6 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg">
                    <div className="relative w-2/3 h-2/3">
                      <Image
                        className="object-contain"
                        src={sideComps[0]?.iconUrl}
                        fill
                        alt={sideComps[0]?.name}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">
                    {sideComps[0]?.name ?? "UI/UX Design"}
                  </h3>
                </div>
                <p className="text-neutral_01/80 text-sm leading-relaxed mb-3">
                  {sideComps[0]?.description ??
                    "Design exceptional user experiences and interfaces for digital products. Showcase your creativity and design thinking skills!"}
                </p>
                {/* keywords */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(sideComps[0]?.keywords ?? []).slice(0, 3).map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                {/* prize & team size */}
                {(sideComps[0]?.prizepool ||
                  (sideComps[0]?.teamMin && sideComps[0]?.teamMax)) && (
                  <div className="bg-neutral_01/10 rounded-lg p-2 mb-4">
                    {sideComps[0]?.prizepool && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Prize Pool</span>
                        <span className="text-primary-yellow font-semibold">
                          {sideComps[0]?.prizepool}
                        </span>
                      </div>
                    )}
                    {sideComps[0]?.teamMin && sideComps[0]?.teamMax && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Team Size</span>
                        <span>
                          {sideComps[0]?.teamMin}-{sideComps[0]?.teamMax}{" "}
                          members
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <a
                    href={`/dashboard?menu=kompetisi&type=${getSlug(
                      sideComps[0]?.name ?? "uiux"
                    )}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold text-center hover:bg-primary-yellow/90 transition-colors"
                  >
                    Daftar Sekarang
                  </a>
                  <a
                    href={
                      sideComps[0]?.guidebookLink ||
                      `/guidebook/${getSlug(sideComps[0]?.name ?? "uiux")}`
                    }
                    className="px-4 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                  >
                    Guidebook
                  </a>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary-yellow/10 rounded-full blur-xl"></div>
            </div>

            {/* COINS */}
            <div
              className="bg-gradient-to-bl from-neutral_02/20 to-brand_01/10 rounded-2xl shadow-lg border border-neutral_01/30 backdrop-blur-sm p-6 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center shadow-lg">
                    <div className="relative w-2/3 h-2/3">
                      <Image
                        className="object-contain"
                        src={sideComps[1]?.iconUrl}
                        fill
                        alt={sideComps[1]?.name}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">
                    {sideComps[1]?.name ?? "COINS"}
                  </h3>
                </div>
                <p className="text-neutral_01/80 text-sm leading-relaxed mb-3">
                  {sideComps[1]?.description ??
                    "Computer Olympiad of Infest. Algorithmic problem-solving competition designed for high school students."}
                </p>
                {/* keywords */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(sideComps[1]?.keywords ?? []).slice(0, 3).map((k, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-[10px] font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                {/* prize & team size */}
                {(sideComps[1]?.prizepool ||
                  (sideComps[1]?.teamMin && sideComps[1]?.teamMax)) && (
                  <div className="bg-neutral_01/10 rounded-lg p-2 mb-4">
                    {sideComps[1]?.prizepool && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Prize Pool</span>
                        <span className="text-primary-yellow font-semibold">
                          {sideComps[1]?.prizepool}
                        </span>
                      </div>
                    )}
                    {sideComps[1]?.teamMin && sideComps[1]?.teamMax && (
                      <div className="flex justify-between text-[11px] text-neutral_01/70">
                        <span>Team Size</span>
                        <span>
                          {sideComps[1]?.teamMin}-{sideComps[1]?.teamMax}{" "}
                          members
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <a
                    href={`/dashboard?menu=kompetisi&type=${getSlug(
                      sideComps[1]?.name ?? "coins"
                    )}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-lg text-sm font-semibold text-center hover:bg-primary-yellow/90 transition-colors"
                  >
                    Daftar Sekarang
                  </a>
                  <a
                    href={
                      sideComps[1]?.guidebookLink ||
                      `/guidebook/${getSlug(sideComps[1]?.name ?? "coins")}`
                    }
                    className="px-4 py-2 border border-primary-yellow/40 text-primary-yellow rounded-lg text-sm font-semibold hover:bg-primary-yellow/10 transition-colors"
                  >
                    Guidebook
                  </a>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-neutral_02/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* Seminar Section */}
      <section
        id="seminar"
        className="w-full min-h-[80vh] md:min-h-screen relative flex flex-col py-8 md:py-12 lg:py-20 px-4 md:px-8 lg:px-20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 w-40 h-40 md:w-96 md:h-96 bg-neutral_01/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2/3 right-1/4 w-40 h-40 md:w-96 md:h-96 bg-neutral_02/10 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-12 lg:gap-16">
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <h2
              className={`text-3xl md:text-6xl lg:text-8xl font-bold text-neutral_01 mb-2 md:mb-4 ${dm_serif_display.className}`}
            >
              National Seminar
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-neutral_01/80 max-w-2xl mx-auto">
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
            <span className="inline-block px-3 md:px-4 py-1 rounded-full bg-brand_01/80 text-neutral_01 text-xs md:text-sm font-semibold tracking-wide shadow-lg mb-2">
              Mystery Speaker
            </span>
            <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
              <Image
                src="/assets/images/man-1.png"
                alt="Mystery Speaker Silhouette"
                fill
                className="object-cover grayscale opacity-60 rounded-full border-4 border-brand_01 shadow-2xl"
                style={{ zIndex: 1 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-4xl md:text-[5rem] lg:text-[6rem] xl:text-[8rem] font-bold text-brand_01 drop-shadow-lg animate-pulse text-glow"
                  style={{ zIndex: 2 }}
                >
                  ?
                </span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-brand_01/10 to-transparent"></div>
            </div>
            <p
              className="text-sm md:text-base lg:text-lg text-center max-w-xl text-neutral_01/90 mt-2"
              data-aos="fade-up"
            >
              Who will be the keynote speaker at INFEST XI National Seminar this
              year? Stay tuned as we will soon reveal an inspiring figure who
              will share their best insights and experiences. Follow us on{" "}
              <b>Social Media</b> for the latest updates!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 justify-center items-center">
            <div
              className="w-full md:h-36 lg:h-40"
              data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
            >
              <Glass className="flex flex-col items-center justify-center h-full p-4">
                <span className="text-xl md:text-2xl lg:text-4xl">🎤</span>
                <p
                  className={`font-semibold text-base md:text-lg lg:text-2xl ${dm_serif_display.className}`}
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
              className="w-full md:h-36 lg:h-40"
              data-aos={`${isMobile ? "fade-right" : "fade-up"}`}
              data-aos-delay="100"
            >
              <Glass className="flex flex-col items-center justify-center h-full p-4">
                <span className="text-xl md:text-2xl lg:text-4xl">🤝</span>
                <p
                  className={`font-semibold text-base md:text-lg lg:text-2xl ${dm_serif_display.className}`}
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
              className="w-full md:h-36 lg:h-40"
              data-aos={`${isMobile ? "fade-left" : "fade-up"}`}
              data-aos-delay="200"
            >
              <Glass className="flex flex-col items-center justify-center h-full p-4">
                <span className="text-xl md:text-2xl lg:text-4xl">📜</span>
                <p
                  className={`font-semibold text-base md:text-lg lg:text-2xl ${dm_serif_display.className}`}
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
            className="mt-4 md:mt-6 lg:mt-8 flex justify-center"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <a
              href="#"
              className="px-5 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-brand_01 to-neutral_02 text-neutral_01 font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-neutral_01/30 text-sm md:text-base lg:text-lg"
            >
              Get the Latest Updates
            </a>
          </div>
        </div>
      </section>

      {/* <div className="w-full md:w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01/50 to-transparent"></div> */}
    </div>
  );
};

export default InfestWebsite;
