import Image from "next/image";
import React from "react";
import Link from "next/link";
import { scrollIntoSection } from "@/libs/helpers/scrollIntoSection";
import { socialAccounts } from "@/data/socialAccount";


const FooterMobile = () => {
  return (
    <div className="bg-secondary border-t border-primary-yellow w-full flex flex-col px-8 py-6 gap-4 text-white items-center">
      <button onClick={() => scrollIntoSection("hero")} className="duration-200 hover:scale-110">
        <Image
          src={"/assets/images/Logo Infest USK.webp"}
          width={60}
          height={0}
          alt="logo-infest-usk"
        />
      </button>
      <div className="flex gap-2 mt-2">
        {socialAccounts.map((account) => (
          <Link          
            key={account.id}
            href={account.url}
            target="_blank"
            className="hover:scale-110 duration-200"
          >
            {account.iconComponent}
          </Link>
        ))}
      </div>
      <div className="text-sm text-center">
        <p className="font-bold uppercase">Alamat</p>
        <p className="mt-2.5 text-xs">
          Jl. Syech Abdurrauf No.3, Kopelma Darussalam, Kecamatan Syiah Kuala, Kota Banda Aceh, Aceh 23111, Indonesia
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2.5">
        <p className="text-xs text-center">
          Hak Cipta © 2024 | Himpunan Mahasiswa Informatika
        </p>
      </div>
    </div>
  );
};

export default FooterMobile;
