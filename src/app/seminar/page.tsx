import { Arrow } from '@/components/icons/arrow'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Seminar = () => {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-8 relative'>
        <Image
            src="/assets/images/Logo Infest USK.webp"
            width={500}
            height={500}
            className='w-[32vw] md:w-[8.6vw] absolute top-[22%]'
            alt='logo-infest-usk'
        />        
        <p className='font-bold text-white pr-2 text-7xl font-cattedrale tracking-wide'>SOON</p>
        <Link href={"/"} className='absolute top-[59%] flex gap-2 items-center bg-primary-yellow/20 px-4 py-3 rounded-xl shadow-lg shadow-black border-[1.6px] border-primary-yellow/60 md:hover:opacity-80 md:hover:scale-105 duration-200'>
            <Arrow className='rotate-180'/>
            <p className='text-white font-bold text-sm'>Kembali ke beranda</p>
        </Link>
    </div>
  )
}

export default Seminar