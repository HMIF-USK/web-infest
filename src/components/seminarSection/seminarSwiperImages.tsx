import Image from "next/image";
import React from "react";
import { seminarImages } from "@/data/seminarSection";
import { CustomCSSProperties } from "@/types/customCSSProps";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";

export const SeminarSwiperImages = () => {
  const {isDesktop, isTablet} = useScreenSize();
  const swiperStyleSeminar: CustomCSSProperties = {
    "--swiper-pagination-color": "rgba(253, 208, 38, 1)",
    "--swiper-navigation-size": "2rem",
    "--swiper-navigation-color": "rgba(253, 208, 38, 0.6)",
    "--swiper-pagination-bullet-inactive-color": "rgba(253, 208, 38, 0.6)",
    "--swiper-pagination-bullet-size": "0.5rem",
    "--swiper-pagination-bottom": "1rem",
    "--swiper-navigation-sides-offset": "24px",
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
      loop={true}
      pagination={{
        dynamicBullets: true,
      }}
      navigation={(isDesktop || isTablet) ? true : false}
      modules={[Keyboard, Navigation, Pagination]}
      style={swiperStyleSeminar}
      className="lg:w-1/2 w-full border-2 border-primary-yellow seminar-swiper rounded-xl"
    >
      {seminarImages.map((image) => (
        <SwiperSlide key={image.id} className=" relative">
          <div className="absolute inset-0 flex file:rounded-lg ">
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
            alt="Dokumentasi Seminar Infest USK"
            className="rounded-lg border border-primary w-full h-full lg:h-[30rem] object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
