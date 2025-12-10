// src/page/homePage/components/Contactsgis.jsx
import React, { useState } from "react";
import FiguraTop from "../../assets/AboutCompany/1figura.svg";
import FiguraBottom from "../../assets/AboutCompany/2figura.svg";
import ZoomInIcon from "../../assets/AboutCompany/1gis.svg";
import ZoomOutIcon from "../../assets/AboutCompany/2gis.svg";

const DEFAULT_ADDRESS = "Аскар Шакиров, 258";
const DEFAULT_PHONE = "0 555 123 123";

const Contactsgis = ({ page }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen((p) => !p);

  // данные из API + дефолты
  const address = page?.address || DEFAULT_ADDRESS;
  const phone = page?.phone || DEFAULT_PHONE;
  const email = page?.email || "";

  const rawMap = (page?.map_iframe || "").trim();

  const renderMapEmbed = () => {
    if (!rawMap) {
      // дефолтная карта
      return (
        <iframe
          title="Карта офиса"
          src="https://maps.google.com/?q=Osh&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      );
    }

    if (rawMap.startsWith("<iframe")) {
      // в админке сохранён готовый iframe
      return (
        <div
          className="absolute inset-0 w-full h-full"
          dangerouslySetInnerHTML={{ __html: rawMap }}
        />
      );
    }

    // в админке сохранена только ссылка
    return (
      <iframe
        title="Карта офиса"
        src={rawMap}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  };

  return (
    <>
      <section className="relative w-full bg-white overflow-hidden font-['Roboto',sans-serif] text-[#000000]">
        {/* фигуры */}
        <img
          src={FiguraTop}
          alt=""
          className="pointer-events-none select-none absolute top-0 right-0 z-0 w-[240px] sm:w-[420px] lg:w-[680px]"
        />
        <img
          src={FiguraBottom}
          alt=""
          className="pointer-events-none select-none absolute bottom-0 left-0 z-0 w-[220px] sm:w-[380px] lg:w-[620px]"
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-3 sm:px-4 pb-[250px]">
          <h2 className="pt-[80px] sm:pt-[110px] lg:pt-[136px] text-[28px] sm:text-[32px] lg:text-[40px] font-medium">
            О компании
          </h2>

          <div className="mt-[60px] sm:mt-[80px] lg:mt-[101px] flex flex-col lg:flex-row items-start gap-[32px] lg:gap-[75px]">
            {/* ЛЕВЫЙ БЛОК */}
            <div className="w-full lg:w-[260px] text-[16px] leading-[1.4] font-medium">
              <div className="flex flex-row justify-center text-center gap-[32px] lg:flex-col lg:items-start lg:text-left">
                {/* Режим работы (статично) */}
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

                {/* Филиалы — уже из бекенда */}
                <div>
                  <p className="text-[16px] font-medium text-[#000098]">
                    Филиалы
                  </p>
                  <div className="mt-[16px] space-y-[4px]">
                    <p>{address}</p>
                    <p>{phone}</p>
                    {email && <p>{email}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА — карта */}
            <div className="w-full lg:flex-1">
              <div
                className="
                  relative bg-[#E5E5E5] overflow-hidden border border-[#E5E5EE]
                  shadow-[0_8px_18px_rgba(15,23,42,0.06)]
                  rounded-[2px]
                  h-[300px] sm:h-[360px] lg:h-[470px]
                  mx-auto
                "
                style={{ maxWidth: "800px" }}
              >
                {renderMapEmbed()}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-[10px] right-[10px] w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white/90"
                >
                  <img
                    src={isFullscreen ? ZoomOutIcon : ZoomInIcon}
                    alt=""
                    className="w-[24px] h-[24px]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="relative w-[96vw] max-w-[1100px] h-[70vh] bg-[#E5E5E5] border border-[#E5E5EE] rounded-[4px] overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.3)]">
            {renderMapEmbed()}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-[10px] right-[10px] w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white/95"
            >
              <img src={ZoomOutIcon} alt="" className="w-[24px] h-[24px]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contactsgis;
