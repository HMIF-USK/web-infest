// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { ThreeDMarquee } from "@/components/3dMarquee";

// const Home = () => {
//   const [isMarqueeLoading, setIsMarqueeLoading] = useState(true);
//   const images = [
//     "/assets/images/infest-1.webp",
//     "/assets/images/infest-2.webp",
//     "/assets/images/infest-3.webp",
//     "/assets/images/infest-4.webp",
//     "/assets/images/infest-25.webp",
//     "/assets/images/infest-5.webp",
//     "/assets/images/infest-6.webp",
//     "/assets/images/infest-22.webp",
//     "/assets/images/infest-7.webp",
//     "/assets/images/infest-26.webp",
//     "/assets/images/infest-8.webp",
//     "/assets/images/infest-4.webp",
//     "/assets/images/infest-9.webp",
//     "/assets/images/infest-10.webp",
//     "/assets/images/infest-24.webp",
//     "/assets/images/infest-12.webp",
//     "/assets/images/infest-1.webp",
//     "/assets/images/infest-13.webp",
//     "/assets/images/infest-11.webp",
//     "/assets/images/infest-7.webp",
//     "/assets/images/infest-15.webp",
//     "/assets/images/infest-4.webp",
//     "/assets/images/infest-16.webp",
//     "/assets/images/infest-24.webp",
//     "/assets/images/infest-27.webp",
//     "/assets/images/infest-4.webp",
//     "/assets/images/infest-19.webp",
//     "/assets/images/infest-18.webp",
//     "/assets/images/infest-7.webp",
//     "/assets/images/infest-20.webp",
//     "/assets/images/infest-21.webp",
//     "/assets/images/infest-22.webp",
//     "/assets/images/infest-1.webp",
//     "/assets/images/infest-23.webp",
//     "/assets/images/infest-24.webp",
//     "/assets/images/infest-25.webp",
//     "/assets/images/infest-26.webp",
//     "/assets/images/infest-27.webp",
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsMarqueeLoading(false);
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);
//   return (
//     <div className="w-full h-full flex flex-col">
//       <section className="w-full h-screen flex">
//         <div className="bg-neutral_01 rounded-2xl shadow-lg m-auto w-4/5 h-[70%] translate-y-10 relative">
//           <Image
//             src="/assets/images/tongkat.png"
//             alt="Informatics Festival (Infest) HMIF USK"
//             width={800}
//             height={800}
//             className="object-cover absolute w-2/3 md:w-1/3 bottom-0"
//           />
//         </div>
//       </section>
//       <div className="w-full h-24 bg-neutral_01 shadow-2xl shadow-neutral_01"></div>
//       <section className="px-20 w-full h-screen relative flex">
//         <Image
//           src="/assets/images/shine.png"
//           alt="Informatics Festival (Infest) HMIF USK"
//           width={800}
//           height={800}
//           className="object-cover w-full h-full z-0 absolute inset-0 opacity-50"
//         />
//         <div className="w-full h-screen absolute inset-0 z-10 bg-gradient-to-t from-brand_01 via-transparent to-transparent"></div>
//         <div className="flex justify-center gap-20 items-center w-full h-full z-20">
//           <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
//           <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
//           <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
//         </div>
//       </section>
//       <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>
//       <section className="w-full h-screen flex flex-col gap-12 mt-12 px-20">
//         <div className="flex flex-col gap-2 justify-center text-center">
//           <h2 className="font-bold text-7xl text-neutral_01">
//             Rollback the Glory.
//           </h2>
//           <p className="text-neutral_01">Informatics Festival 2024</p>
//         </div>
//         <div className="m-auto w-full h-[80vh] rounded-3xl bg-white/10 backdrop-blur-md p-2 flex ring-1 ring-neutral-700/10 dark:bg-neutral_01 relative shadow-[0_0_40px_rgba(242,233,197,0.8)]">
//           {!isMarqueeLoading ? (
//             <ThreeDMarquee images={images} />
//           ) : (
//             <div className="m-auto flex flex-col animate-blink">
//               <Image
//                 src="/assets/images/logo-2025.png"
//                 alt="Loading"
//                 width={150}
//                 height={150}
//                 className="m-auto mb-2"
//               />
//               <p className="font-bold text-brand_01 text-center">Loading...</p>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

"use client";

import { ThreeDMarquee } from "@/components/3dMarquee";
import React, {
  useEffect,
  useState,
} from "react";

// Floating Animation Component
const FloatingElement = ({ children, delay = 0, amplitude = 20 }: { 
  children: React.ReactNode;
  delay?: number;
  amplitude?: number;
}) => {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        ["--float-amplitude" as string]: `${amplitude}px`,
      }}
    >
      {children}
    </div>
  );
};

// Competition Card Component
interface CompetitionCardProps {
  title: string;
  icon: string;
  delay?: number;
  isRevealed?: boolean;
}

const CompetitionCard = ({ title, icon, delay = 0, isRevealed = false }: CompetitionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg shadow-black/30 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-brand_01/20 hover:scale-105 hover:bg-white/15 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral_01/20 via-transparent to-brand_01/20"></div>
          <div
            className={`absolute inset-0 transition-transform duration-700 ${
              isHovered ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-neutral_01/30 to-transparent skew-x-12"></div>
          </div>
        </div>

        {/* Mystery overlay */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">❓</div>
            <div className="text-neutral_01 font-semibold">Coming Soon...</div>
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <div
            className="text-4xl mb-4 animate-bounce"
            style={{ animationDelay: `${delay + 0.5}s` }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-neutral_01 mb-2">{title}</h3>
          <div className="text-neutral_01/80 text-sm">
            Stay tuned for details...
          </div>

          {/* Glowing effect */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neutral_01/5 via-neutral_01/10 to-neutral_01/5 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <section className="w-full min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand_01 via-brand_01/90 to-brand_02"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neutral_01/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="bg-neutral_01 rounded-3xl shadow-2xl m-auto w-4/5 max-w-6xl h-[70vh] relative overflow-hidden group">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand_01 via-neutral_02 to-brand_01 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute inset-1 bg-neutral_01 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            {/* Logo placeholder */}
            <FloatingElement delay={0} amplitude={15}>
              <div className="w-32 h-32 mb-8 bg-gradient-to-br from-brand_01 to-brand_02 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-4xl font-bold text-neutral_01">IF</div>
              </div>
            </FloatingElement>

            {/* Main title */}
            <FloatingElement delay={0.5} amplitude={20}>
              <h1 className="text-6xl md:text-8xl font-bold text-brand_01 text-center mb-4 leading-tight">
                INFEST
                <span className="block text-4xl md:text-6xl text-neutral_02 font-normal">
                  {currentYear + 1}
                </span>
              </h1>
            </FloatingElement>

            {/* Subtitle */}
            <FloatingElement delay={1} amplitude={10}>
              <p className="text-xl text-brand_01/80 text-center mb-8 max-w-2xl">
                Informatics Festival - Where Innovation Meets Excellence
              </p>
            </FloatingElement>

            {/* Call to action */}
            <FloatingElement delay={1.5} amplitude={25}>
              <div className="flex flex-col items-center space-y-4">
                <div className="px-8 py-4 bg-gradient-to-r from-brand_01 to-brand_02 rounded-full text-neutral_01 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  Coming Soon 2025
                </div>
                <div className="text-brand_01/60 text-sm animate-pulse">
                  Get ready for the biggest tech festival
                </div>
              </div>
            </FloatingElement>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full bg-gradient-to-tl from-brand_01 to-transparent rounded-tl-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-neutral_02 to-transparent rounded-br-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const InfestWebsite = () => {
  const [isMarqueeLoading, setIsMarqueeLoading] = useState(true);
  const [competitionsRevealed, setCompetitionsRevealed] = useState(false);

  // Sample images for the 3D marquee
  const images = [
    "/assets/images/infest-1.webp",
    "/assets/images/infest-2.webp",
    "/assets/images/infest-3.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-25.webp",
    "/assets/images/infest-5.webp",
    "/assets/images/infest-6.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-26.webp",
    "/assets/images/infest-8.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-9.webp",
    "/assets/images/infest-10.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-12.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-13.webp",
    "/assets/images/infest-11.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-15.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-16.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-27.webp",
    "/assets/images/infest-4.webp",
    "/assets/images/infest-19.webp",
    "/assets/images/infest-18.webp",
    "/assets/images/infest-7.webp",
    "/assets/images/infest-20.webp",
    "/assets/images/infest-21.webp",
    "/assets/images/infest-22.webp",
    "/assets/images/infest-1.webp",
    "/assets/images/infest-23.webp",
    "/assets/images/infest-24.webp",
    "/assets/images/infest-25.webp",
    "/assets/images/infest-26.webp",
    "/assets/images/infest-27.webp",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMarqueeLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const competitions = [
    { title: "Competition Alpha", icon: "🏆", delay: 0.2 },
    { title: "Competition Beta", icon: "💻", delay: 0.4 },
    { title: "Competition Gamma", icon: "🚀", delay: 0.6 },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand_01 to-brand_02 text-neutral_01">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--float-amplitude, -20px));
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(242, 233, 197, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(242, 233, 197, 0.6);
          }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection />

      {/* Divider */}
      {/* <div className="w-full h-24 bg-gradient-to-b from-neutral_01 to-transparent"></div> */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* Competitions Section */}
      <section className="px-8 md:px-20 w-full min-h-screen relative flex flex-col py-20 bg-gradient-to-bl from-brand_02 via-transparent to-transparent">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral_01/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neutral_02/5 rounded-full blur-3xl"></div>
        </div>

        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-neutral_01/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-neutral_01 mb-4">
              Competitions
            </h2>
            <p className="text-xl text-neutral_01/80 max-w-2xl mx-auto">
              Three exciting competitions await. Can you guess what they are?
            </p>
            <div className="mt-8">
              <button
                onClick={() => setCompetitionsRevealed(!competitionsRevealed)}
                className="px-8 py-3 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {competitionsRevealed ? "Hide Details" : "Reveal Mysteries"}
              </button>
            </div>
          </div>

          {/* Competition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {competitions.map((comp, index) => (
              <CompetitionCard
                key={index}
                title={comp.title}
                icon={comp.icon}
                delay={comp.delay}
                isRevealed={competitionsRevealed}
              />
            ))}
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
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neutral_01/30 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neutral_01/30 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neutral_01/30 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neutral_01/30 rounded-br-lg"></div>
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
