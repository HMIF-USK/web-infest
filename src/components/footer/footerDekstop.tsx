import Image from "next/image";
import React from "react";
import Link from "next/link";
import { scrollIntoSection } from "@/libs/helpers/scrollIntoSection";
import { socialAccounts } from "@/data/socialAccount";


const FooterDekstop = () => {
  return (
    <div className="bg-secondary border-t border-primary-yellow w-full flex justify-between px-8 md:px-12 py-6 text-white">    
        <div className="flex flex-col justify-end text-sm w-1/3">
          <p className="font-bold text-base uppercase">Alamat</p>
          <p className="text-sm mt-3 text-balance">
            Jl. Syech Abdurrauf No.3, Kopelma Darussalam, Kecamatan Syiah Kuala, Kota Banda Aceh, Aceh 23111, Indonesia
          </p>
        </div>
        <button onClick={() => scrollIntoSection("hero")} className="duration-200 hover:scale-110">
          <Image
            src={"/assets/images/Logo Infest USK.webp"}
            width={70}
            height={0}
            alt="logo-infest-usk"
          />
        </button>
        <div className="flex flex-col gap-2 justify-end text-sm items-end w-1/3">
          <div className="flex gap-2">
            {socialAccounts.map((account) => (
              <Link key={account.id} href={account.url} className={`hover:scale-110 duration-200`} target="_blank">
                {account.iconComponent}
              </Link>
            ))}
          </div>
          <p className="text-sm text-end">Hak Cipta © 2024 | Himpunan Mahasiswa Informatika</p>
        </div>
    </div>
  );
};

export default FooterDekstop;
