"use client";

import { ThreeDMarquee } from "@/components/3dMarquee";
import React, { useEffect, useState, useRef } from "react";

// Floating Animation Component
const FloatingElement = ({
  children,
  delay = 0,
  amplitude = 20,
}: {
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

// Glowing orb component for background effects
const GlowingOrb = ({ size = 100, color = "brand_01", opacity = 0.3, delay = 0 }) => (
  <div
    className={`absolute rounded-full blur-3xl animate-pulse`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color === "brand_01" ? "rgba(76, 13, 40, 0.3)" : "rgba(242, 233, 197, 0.2)",
      animationDelay: `${delay}s`,
      animationDuration: "4s",
    }}
  />
);

// Enhanced Competition Card Component
interface CompetitionCardProps {
  title: string;
  icon: string;
  description: string;
  delay?: number;
  isRevealed?: boolean;
  index: number;
}

const CompetitionCard = ({
  title,
  icon,
  description,
  delay = 0,
  isRevealed = false,
  index,
}: CompetitionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 200);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const perspectives = ['perspective-left', '', 'perspective-right'];
  const perspective = perspectives[index] || '';

  return (
    <div
      ref={cardRef}
      className={`relative group cursor-pointer transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${delay}s`,
        perspective: index === 0 || index === 2 ? '600px' : 'none'
      }}
    >
      <div className={`w-full h-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg shadow-black/40 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-neutral_01/20 hover:scale-105 hover:bg-white/20 overflow-hidden relative ${
        index === 0 ? 'transform rotateY-12' : index === 2 ? 'transform -rotateY-12' : ''
      }`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral_01/20 via-transparent to-brand_01/20"></div>
          <div
            className={`absolute inset-0 transition-transform duration-700 ${
              isHovered ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-neutral_01/30 to-transparent skew-x-12"></div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neutral_01/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Mystery overlay */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">❓</div>
            <div className="text-neutral_01 font-semibold text-lg">Coming Soon...</div>
            <div className="text-neutral_01/70 text-sm mt-2">Something big awaits</div>
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <div
            className="text-5xl mb-4 animate-bounce"
            style={{ animationDelay: `${delay + 0.5}s` }}
          >
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-neutral_01 mb-3">{title}</h3>
          <p className="text-neutral_01/80 text-sm leading-relaxed">
            {description}
          </p>

          {/* Progress indicator */}
          <div className="mt-4 w-full">
            <div className="w-full bg-neutral_01/20 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-neutral_02 to-neutral_01 h-1 rounded-full transition-all duration-1000"
                style={{ width: isHovered ? '100%' : '30%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(var(--float-amplitude, -20px)); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .rotateY-12 {
          transform: rotateY(12deg);
        }
        .-rotateY-12 {
          transform: rotateY(-12deg);
        }
        .perspective-left {
          transform: perspective(600px) rotateY(12deg);
        }
        .perspective-right {
          transform: perspective(600px) rotateY(-12deg);
        }
        @media (max-width: 768px) {
          .perspective-left,
          .perspective-right,
          .rotateY-12,
          .-rotateY-12 {
            transform: none;
          }
        }
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(76, 13, 40, 0.1);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(242, 233, 197, 0.3);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(242, 233, 197, 0.5);
        }
        @media (max-width: 640px) {
          .text-8xl { font-size: 4rem; }
          .text-9xl { font-size: 5rem; }
          .text-7xl { font-size: 3.5rem; }
          .text-5xl { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

// Enhanced Hero Section Component
const HeroSection = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="w-full min-h-screen flex relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand_01 via-brand_01/90 to-brand_02"></div>
      {/* Interactive mouse-following gradient */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(242, 233, 197, 0.1) 0%, transparent 50%)`
        }}
      />
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-neutral_01/20 rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="flex relative w-full h-full">
          <div className="w-full h-screen bg-gradient-to-b from-transparent via-transparent to-brand_01/50 relative">
            {/* Coming Soon Text with glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-neutral_01 via-neutral_02 to-neutral_01 bg-clip-text text-transparent mb-6 animate-pulse">
                  Coming Soon
                </h1>
                <div className="text-2xl text-neutral_01/80 mb-8">
                  The Tech Revolution Begins
                </div>
              </div>
            </div>
          </div>
          <div className="w-full justify-center items-center flex z-20 absolute bottom-[8%] gap-8">
            <div className="flex items-center gap-8 backdrop-blur-md bg-white/10 px-8 py-4 rounded-full border border-white/20">
              <p className="text-sm bg-gradient-to-l from-neutral_02 to-neutral_01 bg-clip-text text-transparent font-medium">
                Get ready for the biggest tech festival
              </p>
              <div className="px-4 py-3 text-lg shadow-[0_0_40px_rgba(242,233,197,0.8)] border border-neutral_01/80 text-brand_01 rounded-full bg-gradient-to-r from-neutral_02 to-neutral_01 font-bold">
                XI
              </div>
              <p className="text-sm bg-gradient-to-l from-neutral_02 to-neutral_01 bg-clip-text text-transparent font-medium">
                Where Innovation Meets Excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced About Section
const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 px-8 md:px-20 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowingOrb size={200} color="neutral_01" delay={0} />
        <GlowingOrb size={150} color="brand_01" delay={2} />
      </div>
      <div className={`relative z-10 max-w-6xl mx-auto transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-neutral_01 mb-6">
            About Infest XI
          </h2>
          <p className="text-xl text-neutral_01/80 max-w-4xl mx-auto leading-relaxed">
            Informatics Festival (Infest) adalah acara teknologi terbesar yang diselenggarakan oleh 
            Himpunan Mahasiswa Informatika USK. Tahun ini, kami menghadirkan tiga kompetisi unggulan 
            dan seminar nasional yang akan menghadirkan pembicara terkemuka dalam bidang teknologi 
            dan pengembangan diri.
          </p>
        </div>
        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🏆", title: "3 Kompetisi Unggulan", desc: "COINS, Hackathon, dan UI/UX Competition" },
            { icon: "🎤", title: "Seminar Nasional", desc: "Pembicara terkenal membahas self development" },
            { icon: "🌟", title: "Networking", desc: "Bertemu dengan talenta tech dari seluruh Indonesia" }
          ].map((item, index) => (
            <div 
              key={index}
              className={`text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-700 hover:scale-105 hover:bg-white/10 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-neutral_01 mb-2">{item.title}</h3>
              <p className="text-neutral_01/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Seminar Section
const SeminarSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 px-8 md:px-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-brand_01/50 via-transparent to-brand_01/50"></div>
      <div className={`relative z-10 max-w-6xl mx-auto transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-neutral_01 mb-6">
            Seminar Nasional
          </h2>
          <p className="text-xl text-neutral_01/80 max-w-3xl mx-auto">
            Bergabunglah dengan para ahli teknologi dan pembicara inspiratif dalam seminar nasional 
            yang akan membahas tren terkini dalam teknologi dan pengembangan diri.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neutral_01/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neutral_02/20 to-transparent rounded-full blur-2xl"></div>
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6">🎤</div>
            <h3 className="text-3xl font-bold text-neutral_01 mb-4">
              Speakers Coming Soon
            </h3>
            <p className="text-neutral_01/80 max-w-2xl mx-auto mb-8">
              Kami sedang mengonfirmasi lineup pembicara terkemuka yang akan berbagi 
              pengalaman dan wawasan tentang industri teknologi dan pengembangan karir.
            </p>
            {/* Topic highlights */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[
                "Self Development in Tech Industry",
                "Future of Technology",
                "Career Growth Strategies", 
                "Innovation & Entrepreneurship"
              ].map((topic, index) => (
                <div 
                  key={index}
                  className={`p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-500 hover:bg-white/10 ${
                    isVisible ? 'translate-x-0 opacity-100' : index % 2 === 0 ? 'translate-x-10 opacity-0' : '-translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="text-neutral_01 font-medium">{topic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mock 3D Marquee Component (simplified for demonstration)
// const ThreeDMarquee = ({ images }: { images: string[] }) => {
//   return (
//     <div className="w-full h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/20 to-black/40">
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="grid grid-cols-4 gap-4 transform rotate-12 scale-75">
//           {images.slice(0, 12).map((_, index) => (
//             <div
//               key={index}
//               className="w-32 h-24 bg-gradient-to-br from-neutral_01/20 to-neutral_02/30 rounded-lg animate-pulse border border-white/10"
//               style={{ 
//                 animationDelay: `${index * 0.2}s`,
//                 transform: `translateZ(${Math.random() * 50}px) rotateY(${Math.random() * 30 - 15}deg)`
//               }}
//             />
//           ))}
//         </div>
//       </div>
//       <div className="absolute inset-0 bg-gradient-to-t from-brand_01/80 via-transparent to-brand_01/80"></div>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="text-center text-neutral_01">
//           <div className="text-4xl mb-4">📸</div>
//           <div className="text-xl font-bold">Memories Gallery</div>
//           <div className="text-sm opacity-80">Infest 2024 Moments</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Main App Component
const InfestWebsite = () => {
  const [isMarqueeLoading, setIsMarqueeLoading] = useState(true);
  const [competitionsRevealed, setCompetitionsRevealed] = useState(false);

  // Sample images for the 3D marquee
  const images = Array(30).fill("/placeholder-image.jpg");

  const competitions = [
    {
      title: "COINS",
      icon: "🏅",
      description: "Computer Olympiad of Infest - Kompetisi pemrograman bergengsi"
    },
    {
      title: "HACKATHON", 
      icon: "💻",
      description: "Kompetisi unggulan - 48 jam membangun solusi inovatif"
    },
    {
      title: "UI/UX",
      icon: "🎨", 
      description: "Design Competition - Ciptakan pengalaman pengguna terbaik"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMarqueeLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-brand_01 to-brand_02 text-neutral_01 overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <HeroSection />
      {/* Divider with animation */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent animate-pulse"></div>
      {/* About Section */}
      <AboutSection />
      {/* Divider */}
      <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01/50 to-transparent"></div>
      {/* Enhanced Competitions Section */}
      <section className="px-8 md:px-20 w-full min-h-screen relative flex flex-col py-20 bg-gradient-to-b from-transparent via-brand_01/30 to-transparent">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neutral_01/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neutral_02/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-brand_01/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          {/* Enhanced Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-neutral_01 mb-6 bg-gradient-to-r from-neutral_01 via-neutral_02 to-neutral_01 bg-clip-text text-transparent">
              Competitions
            </h2>
            <p className="text-xl text-neutral_01/80 max-w-3xl mx-auto leading-relaxed">
              Tiga kompetisi menarik menanti Anda. Bersiaplah untuk menunjukkan kemampuan terbaik 
              dalam bidang teknologi dan inovasi!
            </p>
          </div>
          {/* Enhanced Competition Cards */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {competitions.map((comp, index) => (
                <CompetitionCard
                  key={index}
                  title={comp.title}
                  icon={comp.icon}
                  description={comp.description}
                  delay={index * 0.2}
                  isRevealed={competitionsRevealed}
                  index={index}
                />
              ))}
            </div>
          </div>
          {/* Call to action */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral_02 to-neutral_01 text-brand_01 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <span>Stay Tuned</span>
              <span className="animate-bounce">🚀</span>
            </div>
          </div>
        </div>
      </section>
      {/* Seminar Section */}
      <SeminarSection />
      {/* Divider */}
      <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01/50 to-transparent"></div>
      {/* Enhanced Rollback the Glory Section */}
      <section className="w-full min-h-screen flex flex-col gap-12 py-20 px-8 md:px-20">
        {/* Section Header */}
        <div className="flex flex-col gap-4 justify-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral_01/5 to-transparent blur-3xl"></div>
          <h2 className="relative text-5xl md:text-7xl font-bold text-neutral_01 leading-tight mb-4">
            Rollback the Glory.
          </h2>
          <p className="relative text-xl text-neutral_01/80 max-w-3xl mx-auto">
            Relive the amazing moments from Informatics Festival 2024 - where innovation met excellence 
            and memories were made that will last a lifetime.
          </p>
        </div>
        {/* Enhanced 3D Marquee Container */}
        <div className="m-auto w-full h-[80vh] rounded-3xl bg-white/5 backdrop-blur-md p-4 flex ring-1 ring-neutral_01/10 relative overflow-hidden shadow-[0_0_60px_rgba(242,233,197,0.6)]">
          {/* Enhanced Loading state */}
          {isMarqueeLoading ? (
            <div className="m-auto flex flex-col items-center animate-pulse">
              <div className="w-40 h-40 bg-gradient-to-br from-neutral_01/20 to-neutral_02/20 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral_01/30 to-transparent animate-pulse"></div>
                <div className="text-6xl relative z-10">🎭</div>
              </div>
              <p className="font-bold text-neutral_01 text-center text-2xl mb-2">
                Loading Memories...
              </p>
              <p className="text-neutral_01/70 text-center mb-6">
                Preparing the best moments from Infest 2024
              </p>
              <div className="flex space-x-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-neutral_01 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <ThreeDMarquee images={images} />
          )}
          {/* Enhanced decorative elements */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-neutral_01/40 rounded-tl-xl"></div>
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-neutral_01/40 rounded-tr-xl"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-neutral_01/40 rounded-bl-xl"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-neutral_01/40 rounded-br-xl"></div>
          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-neutral_01/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-neutral_02/20 to-transparent rounded-full blur-2xl"></div>
        </div>
      </section>
      {/* Enhanced Footer */}
      <footer className="w-full py-16 text-center border-t border-neutral_01/20 bg-gradient-to-t from-brand_02 to-transparent">
        <div className="text-neutral_01/60 max-w-4xl mx-auto px-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-neutral_01 mb-4">
              Stay Connected
            </h3>
            <p className="text-lg mb-6">
              Follow our journey and be the first to know about updates!
            </p>
            {/* Social media placeholders */}
            <div className="flex justify-center gap-6 mb-8">
              {['📱', '💬', '📧', '🌐'].map((icon, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                >
                  <span className="text-xl">{icon}</span>
                </div>
              ))}
            </div>
          </div>
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