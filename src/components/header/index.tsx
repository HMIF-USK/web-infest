"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../libs/hooks/screenSizeValidation";
import { scrollIntoSection } from "@/libs/helpers/scrollIntoSection";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isDesktop, isTablet, isMobile } = useScreenSize();
  const pathname = usePathname();
  const notShowHeader = ["/login", "/auth/callback", "/dashboard"];

  const navbar = [
    { name: "Home", destinationSection: "/" },
    { name: "Competition", destinationSection: "competition" },
    { name: "National Seminar", destinationSection: "seminar" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setIsMenuShow(false);
    }
  };

  const toggleNavbar = () => {
    setIsMenuShow((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!notShowHeader.includes(pathname) && (
        <header className="header fixed top-0 left-0 right-0 w-full z-[100] overflow-x-hidden">
      <div
        className={`${isMobile ? "container--mobile" : ""} ${
          dm_serif_display.className
        }`}
      >
        <div
          className={`glass-container glass-container--large w-screen overflow-x-hidden border-b border-white/40 bg-gradient-to-r from-neutral_01 md:via-20% via-transparent to-transparent ${
            !isDesktop && "backdrop-blur"
          } px-4 md:px-16 py-4`}
        >
          <div className="glass-filter" />
          <div className="glass-specular" />
          <div className="glass-content justify-between">
            {/* <div className="bg-neutral_01 backdrop-blur-md border py-3 px-6 rounded-full border-brand_01 shadow-lg shadow-white/20 relative"> */}
            <Image
              src="/assets/images/Infest 2025 2nd Logo.png"
              alt="Logo Infest"
              width={100}
              height={100}
              className="object-cover w-24 h-8 md:w-28 md:h-12"
            />
            {/* </div> */}
            {isDesktop && (
              <div className="flex gap-10 tracking-wide items-center">
                {navbar.map((item) => (
                  <Link
                    key={item.name}
                    href={item.destinationSection}
                    className="glass-button text-white font-bold text-sm lg:text-xl lg:hover:-translate-y-1 duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            <Link
              href={"/auth/login"}
              className={`font-bold text-sm md:text-base py-2 md:py-0 text-brand_01 px-8 rounded-2xl bg-gradient-to-r from-neutral_02 to-neutral_01 shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] duration-200 flex items-center`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <filter
          id="lensFilter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="50"
            xChannelSelector="A"
            yChannelSelector="A"
          />
        </filter>
      </svg>
        </header>
      )}
    </>
  );
};
