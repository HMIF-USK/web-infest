'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useScreenSize } from '../../libs/hooks/screenSizeValidation';
import { scrollIntoSection } from '@/libs/helpers/scrollIntoSection';

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isDesktop, isTablet, isMobile } = useScreenSize();

  const navbar = [
    { name: 'Beranda', destinationSection: '/' },
    { name: 'Seminar Nasional', destinationSection: 'seminar' },
    { name: 'Kompetisi', destinationSection: 'kompetisi' },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsMenuShow(false);
    }
  };

  const toggleNavbar = () => {
    setIsMenuShow((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="header fixed top-8 z-50 left-1/2 -translate-x-1/2 w-4/5">
      <div className={`${isMobile ? 'container--mobile' : ''}`}>
        <div className="glass-container glass-container--large border border-white/40 py-3">
          <div className="glass-filter" />
          <div className="glass-overlay" />
          <div className="glass-specular" />
          <div className="glass-content">
            {navbar.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollIntoSection(item.destinationSection)}
                className="glass-button text-white font-bold text-xl"
              >
                {item.name}
              </button>
            ))}            
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
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
  );
};