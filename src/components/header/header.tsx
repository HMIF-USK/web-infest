import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { useScreenSize } from '../../utils/hooks/screenSizeValidation';
import { scrollIntoSection } from '@/utils/helpers/scrollIntoSection';

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<Boolean>(false);
  const [isUnmounting, setIsUnmounting] = useState<Boolean>(true);
  const navbarRef = useRef<HTMLDivElement>(null);
  const {isDesktop, isTablet, isMobile} = useScreenSize();

  const navbar = [
    {
      name: 'Tentang Infest',
      destinationSection: 'tentang-infest'
    },
    {
      name: 'Seminar',
      destinationSection: 'seminar'
    },
    {
      name: 'Kompetisi',
      destinationSection: 'kompetisi'
    },
    {
      name: 'Kerja Sama',
      destinationSection: 'kerja-sama'
    },    
    {
      name: 'Kontak',
      destinationSection: 'kontak'
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
    <div ref={navbarRef} className='fixed w-screen h-16 md:h-20 top-0 z-[80] px-8 md:px-12 py-4 flex items-center justify-between text-white bg-secondary border-b border-primary-yellow'> 
      <button onClick={() => scrollIntoSection("hero")} className='lg:hover:scale-110 duration-200'>
        <Image
          src='/assets/images/Logo Infest USK.webp'
          alt='logo-infest-usk'
          priority
          width={36}
          height={36}
          className='w-9 h-10 md:w-10 md:h-12'
        />
      </button>
      {(isDesktop || isTablet) && (
        <div className='flex gap-8 justify-end items-center'>
          {navbar.map((item) => (
            <button key={item.name} onClick={() => scrollIntoSection(item.destinationSection)} className='text-sm uppercase font-semibold hover:scale-110 duration-200'>{item.name}</button>
          ))}
        </div>
      )}
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
            <button onClick={() => scrollIntoSection(item.destinationSection)} className='text-[0.8rem] uppercase font-semibold py-3 w-full text-start'>{item.name}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
