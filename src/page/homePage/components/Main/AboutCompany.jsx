// src/page/homePage/components/AboutCompany.jsx
import React, { useState } from "react";
import FiguraTop from "../../../../assets/AboutCompany/1figura.svg";
import FiguraBottom from "../../../../assets/AboutCompany/2figura.svg";
import ZoomInIcon from "../../../../assets/AboutCompany/1gis.svg";
import ZoomOutIcon from "../../../../assets/AboutCompany/2gis.svg";

const AboutCompany = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen((p) => !p);

  return (
    <>
      <section className="relative w-full bg-white overflow-hidden font-['Roboto',sans-serif] text-[#000000]">
        {/* фигуры — видны и на маленьких */}
        <img
          src={FiguraTop}
          alt=""
          className="pointer-events-none select-none absolute top-0 right-0 z-0 w-[240px] sm:w-[420px] lg:w-[680px] h-auto"
        />
        <img
          src={FiguraBottom}
          alt=""
          className="pointer-events-none select-none absolute bottom-0 left-0 z-0 w-[220px] sm:w-[380px] lg:w-[620px] h-auto"
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-3 sm:px-4 pb-[250px]">
          <h2 className="pt-[80px] sm:pt-[110px] lg:pt-[136px] text-[28px] leading-[30px] sm:text-[32px] sm:leading-[34px] lg:text-[40px] lg:leading-[42px] font-medium">
            О компании
          </h2>

          <div className="mt-[60px] sm:mt-[80px] lg:mt-[101px] flex flex-col lg:flex-row items-start gap-[32px] lg:gap-[75px]">
            {/* ЛЕВЫЙ БЛОК */}
            <div className="w-full lg:w-[260px] text-[16px] leading-[1.4] font-medium">
              {/* здесь магия: на маленьких — горизонтально, на lg+ — вертикально */}
              <div
                className="
                  flex flex-row justify-center text-center gap-[32px]
                  lg:flex-col lg:items-start lg:text-left lg:gap-[32px]
                "
              >
                {/* Режим работы */}
                <div>
                  <p className="text-[16px] font-medium text-[#000098]">
                    Режим работы
                  </p>
                  <div className="mt-[16px] space-y-[4px]">
                    <p>Пн - Сб 9:00 - 20:00</p>
                    <p>Сб 9:00 - 18:00</p>
                    <p>Воскресенье выходной</p>
                  </div>
                </div>

                {/* Филиалы */}
                <div>
                  <p className="text-[16px] font-medium text-[#000098]">
                    Филиалы
                  </p>
                  <div className="mt-[16px] space-y-[4px]">
                    <p>Аскар Шакиров, 258</p>
                    <p>0 555 123 123</p>
                    <p>0 555 123 123</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА — карта */}
            <div className="w-full lg:flex-1">
              <div
                className="
                  relative
                  bg-[#E5E5E5]
                  overflow-hidden
                  border border-[#E5E5EE]
                  shadow-[0_8px_18px_rgba(15,23,42,0.06)]
                  mx-auto
                  rounded-[2px]
                  h-[300px] sm:h-[360px] lg:h-[470px]
                "
                style={{ width: "100%", maxWidth: "800px" }}
              >
                <iframe
                  title="Карта офиса"
                  src="https://maps.google.com/?q=Osh&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-[10px] right-[10px] w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white/90"
                  aria-label={
                    isFullscreen
                      ? "Вернуть карту к обычному размеру"
                      : "Развернуть карту на весь экран"
                  }
                >
                  <img
                    src={isFullscreen ? ZoomOutIcon : ZoomInIcon}
                    alt="переключить режим карты"
                    className="w-[24px] h-[24px] object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="relative w-[96vw] max-w-[1100px] h-[70vh] bg-[#E5E5E5] border border-[#E5E5EE] shadow-[0_8px_18px_rgba(15,23,42,0.3)] rounded-[4px] overflow-hidden">
            <iframe
              title="Карта офиса (полноэкранный режим)"
              src="https://maps.google.com/?q=Osh&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-[10px] right-[10px] w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white/95"
              aria-label="Закрыть полноэкранную карту"
            >
              <img
                src={ZoomOutIcon}
                alt="закрыть карту"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutCompany;
