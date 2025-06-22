'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { useScreenSize } from '../../libs/hooks/screenSizeValidation';
import { scrollIntoSection } from '@/libs/helpers/scrollIntoSection';

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<Boolean>(false);
  const [isUnmounting, setIsUnmounting] = useState<Boolean>(true);
  const navbarRef = useRef<HTMLDivElement>(null);
  const {isDesktop, isTablet, isMobile} = useScreenSize();

  const navbar = [
    {
      name: 'Beranda',
      destinationSection: '/'
    },
    {
      name: 'Seminar Nasional',
      destinationSection: 'seminar'
    },
    {
      name: 'Kompetisi',
      destinationSection: 'kompetisi'
    }
  ];

  const handleClickOutside = (event: Event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsMenuShow(false);
    }
  };

  const showNavbar = () => {
    setIsMenuShow((prev) => !prev);
    const isMenuShowAfterClick = !isMenuShow;
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    // <div ref={navbarRef} className='fixed left-1/2 -translate-x-1/2 w-4/5 h-14 md:h-16 top-6 z-[100] px-8 md:px-12 py-3 flex items-center justify-between text-white bg-secondary border border-white/80 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl shadow-black/20'> 
    <div ref={navbarRef} className='fixed left-1/2 -translate-x-1/2 w-4/5 h-14 md:h-16 top-6 z-[100] px-8 md:px-12 py-3 flex items-center justify-between text-white bg-secondary border border-white/80 rounded-2xl bg-[#272727]/40 backdrop-blur-md shadow-xl shadow-black/20'> 
      {/* <button onClick={() => scrollIntoSection("hero")} className='lg:hover:scale-110 duration-200'>
        <Image
          src='/assets/images/Logo Infest USK.webp'
          alt='Informatics Festival (Infest) HMIF USK'
          priority
          width={36}
          height={36}
          className='w-9 h-10 md:w-10 md:h-12'
        />
      </button> */}
      <button className='w-1/6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/80 h-full'>

      </button>
      {(isDesktop || isTablet) && (
        <div className='flex gap-8 justify-end items-center'>
          {navbar.map((item) => (
            <button key={item.name} onClick={() => scrollIntoSection(item.destinationSection)} className='text-sm font-semibold hover:scale-110 duration-200'>{item.name}</button>
          ))}
        </div>
      )}
      <a href="/login" className="ml-6 px-5 py-2 rounded-lg bg-primary-yellow text-secondary font-bold shadow-lg hover:bg-yellow-400 transition-colors duration-200 text-sm md:text-base">Login</a>
      {isMobile && (
        <div onClick={showNavbar} className="w-10 h-10 relative flex justify-end items-center">
          <span aria-hidden="true" className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isMenuShow ? 'rotate-45' : '-translate-y-1.5'}`}></span>
          <span aria-hidden="true" className={`block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isMenuShow && 'hidden'}`}></span>
          <span aria-hidden="true" className={`block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isMenuShow ? '-rotate-45' : 'translate-y-1.5'}`}></span>
        </div>
      )}
      <ul className={`${isMenuShow ? 'h-auto top-16' : 'top-0 -z-[100] -translate-y-56 opacity-0'} ease-in-out duration-300 fixed right-8 w-[44%] p-4 flex flex-col rounded-b-xl bg-secondary divide-y divide-primary-yellow/60`}>
        {navbar.map((item) => (
          <li key={item.name} onClick={() => setIsMenuShow(false)}>
            <button onClick={() => scrollIntoSection(item.destinationSection)} className='text-[0.8rem] font-semibold py-3 w-full text-start'>{item.name}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
