import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { CustomCSSProperties } from "@/types/customCSSProps";
import { imagesForMobile } from "@/data/tentangInfestSection";


export const DocumentationMobile = () => {
  const swiperStyleDokumentasi: CustomCSSProperties = {
    "--swiper-pagination-color": "rgba(253, 208, 38, 1)",
    "--swiper-pagination-bullet-inactive-color": "rgba(253, 208, 38, 0.6)",
    "--swiper-pagination-bullet-size": "0.5rem",
    "--swiper-pagination-bottom": "1rem",
  };
  return (
    <Swiper
      autoHeight={true}
      slidesPerView={1}
      centeredSlides={true}
      slidesPerGroupSkip={1}
      grabCursor={true}
      keyboard={{
        enabled: true,
      }}
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Keyboard, Navigation, Pagination]}
      style={swiperStyleDokumentasi}
    >
      {imagesForMobile.map((image) => (
        <SwiperSlide key={image.id} className="px-2 relative">
          <div className="absolute inset-0 flex file:rounded-lg px-2">
            <div className="p-4 rounded-lg w-full h-full bg-gradient-to-t from-primary to-primary via-primary/40"></div>
          </div>
          <div className="absolute top-2 right-5 h-7 w-32">
            <Image
              fill
              sizes="40vw"
              src={"/assets/images/Gabungan Logo.webp"}
              alt="gabungan-logo-instansi-terkait-infest"
              className="object-cover"
            />
          </div>
          <Image
            width={500} 
            height={500}
            src={image.src}
            alt={image.alt}
            className="rounded-lg border border-primary shadow-md shadow-primary/30 w-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
