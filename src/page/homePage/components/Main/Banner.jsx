// src/page/homePage/components/Banner.jsx
import React from "react";
import BanerImg from "../../../../assets/Banner/baner.png";

const Banner = () => {
  return (
    <section
      className="w-full bg-white lg:h-[659px]"
      style={{
        backgroundImage: `url(${BanerImg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right top",
        backgroundSize: "auto 100%",
      }}
    >
      <div className="mx-auto max-w-[1200px] h-full px-3 sm:px-4">
        <div
          className="
            flex h-full flex-col
            items-center justify-center
            pt-10 pb-10
            sm:pt-14 sm:pb-14
            lg:pt-[120px] lg:pb-0 lg:items-start lg:justify-start
          "
        >
          <div className="max-w-[800px] text-center lg:text-left">
            {/* Заголовок — чуть меньше */}
            <h1
              className="
                font-alumni font-normal text-[#111111]
                text-[26px] leading-[28px]
                sm:text-[32px] sm:leading-[34px]
                md:text-[40px] md:leading-[42px]
                lg:text-[64px] lg:leading-[60px]
              "
            >
              Канцелярские товары для офиса, школы и дома
            </h1>

            {/* Описание */}
            <p
              className="
                mt-3 sm:mt-4 lg:mt-5
                font-manrope font-semibold text-[#4B4B4B]
                text-[12px] leading-[17px]
                sm:text-[13px] sm:leading-[19px]
                md:text-[14px] md:leading-[20px]
                lg:text-[15px] lg:leading-[20px]
                max-w-[520px] mx-auto lg:mx-0
              "
            >
              Широкий ассортимент канцелярских товаров: ручки, бумага, тетради,
              папки, органайзеры и многое другое. Подходит для офиса, школы и
              домашнего использования. Удобная доставка и выгодные цены.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
