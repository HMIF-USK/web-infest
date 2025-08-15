"use client";
import { dm_serif_display } from "@/app/fonts/fonts";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative mx-auto pb-24 w-full">
        {data.map((item, index) => (
          <div key={index} className="relative mb-12 md:mb-16">
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div 
                className="flex items-start gap-4 mb-4"
                data-aos="fade-right"
                data-aos-delay={`${index * 150}`}
                data-aos-duration="800"
              >
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary-yellow to-brand_01 shadow-[0_0_10px_rgba(253,208,38,0.6)] flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className={`text-lg font-bold text-neutral_01 mb-2 ${dm_serif_display.className}`}>
                    {item.title}
                  </h3>
                  <div className="w-20 h-px bg-gradient-to-r from-neutral_01/50 to-transparent mb-4"></div>
                </div>
              </div>
              <div 
                className="ml-8 bg-gradient-to-br from-neutral_01/5 to-brand_01/5 rounded-2xl p-5 border border-neutral_01/20 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                data-aos="fade-up"
                data-aos-delay={`${index * 150 + 100}`}
                data-aos-duration="800"
              >
                {item.content}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-start gap-8 lg:gap-12">
              {/* Timeline Date/Title - Left Side */}
              <div 
                className="sticky flex flex-col items-start top-40 self-start w-64 lg:w-80 flex-shrink-0"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary-yellow to-brand_01 shadow-[0_0_10px_rgba(253,208,38,0.6)] flex-shrink-0"></div>
                  <div className="w-full h-px bg-gradient-to-r from-primary-yellow/50 to-transparent"></div>
                </div>
                <h3 className={`text-xl lg:text-2xl font-bold text-neutral_01 mb-2 leading-tight ${dm_serif_display.className}`}>
                  {item.title}
                </h3>
                <div className="w-full h-px bg-gradient-to-r from-neutral_01/50 to-transparent mt-2"></div>
              </div>

              {/* Timeline Content - Right Side */}
              <div 
                className="w-full"
                data-aos="fade-left"
                data-aos-delay={`${index * 50 + 100}`}
                data-aos-duration="800"
              >
                <div className="bg-gradient-to-br from-neutral_01/5 to-brand_01/5 rounded-2xl p-6 lg:p-8 border border-neutral_01/20 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Vertical Line - Mobile */}
        <div 
          className="block md:hidden absolute left-2 top-0 w-0.5 bg-gradient-to-b from-transparent via-neutral_01/30 to-transparent" 
          style={{ height: height + "px" }}
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-t from-primary-yellow via-brand_01/50 to-transparent rounded-full shadow-[0_0_8px_rgba(253,208,38,0.6)]"
          />
        </div>
        
        {/* Vertical Line - Desktop */}
        <div
          className="hidden md:block absolute left-8 lg:left-12 top-0 w-0.5 bg-gradient-to-b from-transparent via-neutral_01/50 to-transparent"
          style={{ height: height + "px" }}
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-t from-primary-yellow/40 via-brand_01/20 to-transparent rounded-full shadow-[0_0_8px_rgba(253,208,38,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};