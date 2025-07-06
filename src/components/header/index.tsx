"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useScreenSize } from "../../libs/hooks/screenSizeValidation";
import { scrollIntoSection } from "@/libs/helpers/scrollIntoSection";
import { dm_serif_display, montserrat } from "@/app/fonts/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/libs/services/authService";
import { Key, LayoutDashboard } from "lucide-react";

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isDesktop, isMobile } = useScreenSize();
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const pathname = usePathname();
  const notShowHeader = ["/auth", "/dashboard"];

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
    const userCheck = async () => {
      const user = await authService.getCurrentUser();
      setIsUserAuthenticated(!!user);
    };
    userCheck();
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!notShowHeader.some((path) => pathname.startsWith(path)) && (
        <header className="header fixed top-0 left-0 right-0 w-full z-[100] overflow-x-hidden">
          <div
            className={`${isMobile ? "container--mobile" : ""} ${
              dm_serif_display.className
            }`}
          >
            <div
              className={`glass-container glass-container--large w-screen overflow-x-hidden border-b border-white/40 bg-gradient-to-r from-neutral_01 via-35% md:via-20% via-transparent to-transparent ${
                !isDesktop && "backdrop-blur"
              } px-4 md:px-8 lg:px-20 py-4`}
            >
              <div className="glass-filter" />
              <div className="glass-specular" />
              <div className="glass-content flex flex-col">
                <div className="flex w-full justify-between items-center">
                  {/* <div className="bg-neutral_01 backdrop-blur-md border py-3 px-6 rounded-full border-brand_01 shadow-lg shadow-white/20 relative"> */}
                  <Image
                    src="/assets/images/Infest 2025 2nd Logo.png"
                    alt="Logo Infest"
                    width={100}
                    height={100}
                    className="object-cover w-24 h-8 md:w-28 md:h-12"
                  />
                  {/* </div> */}
                  {!isMobile && (
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
                  <div className="flex gap-5 items-center">
                    <Link
                      href={isUserAuthenticated ? "/dashboard" : "/auth/login"}
                      className={`font-bold text-sm md:text-base h-full py-2.5 text-brand_01 px-6 rounded-xl bg-gradient-to-r from-neutral_02 to-neutral_01 shadow-[0_0px_30px_rgba(242,233,197,0.6)] hover:shadow-[0_0px_40px_rgba(242,233,197,0.8)] duration-200 flex items-center gap-2`}
                    >
                      {isUserAuthenticated ? (
                        <>
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </>
                      ) : (
                        <>
                          <Key size={14} />
                          <span>Login</span>
                        </>
                      )}
                    </Link>
                    {isMobile && (
                      <button
                        className="w-6 flex flex-col gap-1.5"
                        onClick={toggleNavbar}
                      >
                        <span
                          className={`w-full h-[2px] bg-neutral_01 transition-transform duration-200 ${
                            isMenuShow && "rotate-45 translate-y-1"
                          }`}
                        ></span>
                        <span
                          className={`w-full h-[2px] bg-neutral_01 transition-opacity duration-200 ${
                            isMenuShow && "hidden"
                          }`}
                        ></span>
                        <span
                          className={`w-full h-[2px] bg-neutral_01 transition-transform duration-200 ${
                            isMenuShow && "-rotate-45 -translate-y-1"
                          }`}
                        ></span>
                      </button>
                    )}
                  </div>
                </div>
                {isMobile && isMenuShow && (
                  <div className="flex flex-col items-center gap-2 mt-4 text-neutral_01">
                    {navbar.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.destinationSection}
                        onClick={() => setIsMenuShow(false)}
                        className={`glass-button font-bold text-sm md:text-xl lg:hover:-translate-y-1 duration-200 border-b border-neutral_01/40 py-2 ${
                          index === navbar.length - 1 && "border-b-0"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
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
