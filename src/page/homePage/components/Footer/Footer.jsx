// src/page/homePage/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

import FiguraRight from "../../../../assets/Footer/1footerfigores.svg";
import FiguraLeft from "../../../../assets/Footer/2footerfigores.svg";

// белые иконки
import InstagramIcon from "../../../../assets/Footer/intagram.svg";
import WhatsAppIcon from "../../../../assets/Footer/WHatsApp.svg";
import TelegramIcon from "../../../../assets/Footer/Telegram.svg";
import FacebookIcon from "../../../../assets/Footer/Facebook.svg";
import TikTokIcon from "../../../../assets/Footer/TikTok.svg";

// красные иконки (hover)
import InstagramRedIcon from "../../../../assets/Footer/intagramRed.svg";
import WhatsAppRedIcon from "../../../../assets/Footer/WHatsAppRed.svg";
import TelegramRedIcon from "../../../../assets/Footer/TelegramRed.svg";
import FacebookRedIcon from "../../../../assets/Footer/FacebookRed.svg";
import TikTokRedIcon from "../../../../assets/Footer/TikTokRed.svg";

// меню -> роуты
const menuItems = [
  { label: "Категории", to: "/Catalog" },
  { label: "Популярные товары", to: "/popular-products" },
  { label: "Новинки", to: "/new" },
  { label: "Акции", to: "/promotions" },
  { label: "Новости", to: "/News" },
  { label: "О компании", to: "/about" },
  { label: "Контакты", to: "/contacts" },
];

const categoriesItems = [
  "Письмо и графика",
  "Бумага",
  "Бумага",
  "Бумага",
  "Творчество",
  "Бумага",
  "Бумага",
];

const socials = [
  {
    label: "Instagram",
    icon: InstagramIcon,
    iconActive: InstagramRedIcon,
  },
  {
    label: "WHatsApp",
    icon: WhatsAppIcon,
    iconActive: WhatsAppRedIcon,
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    iconActive: TelegramRedIcon,
  },
  {
    label: "Facebook",
    icon: FacebookIcon,
    iconActive: FacebookRedIcon,
  },
  {
    label: "TikTok",
    icon: TikTokIcon,
    iconActive: TikTokRedIcon,
  },
];

const linkBaseClasses =
  "cursor-pointer text-[15px] sm:text-[16px] text-white hover:text-[#C0392B] active:text-[#C0392B] transition-colors";

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#1A1A1A] overflow-hidden text-white">
      {/* фигура справа – адаптивная, видна всегда */}
      <img
        src={FiguraRight}
        alt=""
        className="
          pointer-events-none select-none
          absolute top-4 right-0 z-0
          w-[220px] sm:w-[360px] lg:w-[540px]
          h-auto
        "
      />

      {/* фигура слева снизу – адаптивная, видна всегда */}
      <img
        src={FiguraLeft}
        alt=""
        className="
          pointer-events-none select-none
          absolute bottom-0 left-0 z-0
          w-[220px] sm:w-[380px] lg:w-[670px]
          h-auto
        "
      />

      <div
        className="
          relative z-10
          mx-auto max-w-[1200px]
          px-3 sm:px-4
          pt-[80px] sm:pt-[110px] lg:pt-[137px]
          pb-[250px]
          font-['Roboto',sans-serif]
        "
      >
        {/* заголовок Ак кагаз */}
        <h2
          className="
            text-[30px] leading-[32px]
            sm:text-[34px] sm:leading-[36px]
            lg:text-[42px] lg:leading-[44px]
            font-semibold
            font-['Alumni_Sans_SC','Alumni Sans SC',sans-serif]
          "
        >
          Ак кагаз
        </h2>

        {/* четыре колонки */}
        <div
          className="
            mt-[60px] sm:mt-[80px] lg:mt-[97px]
            flex flex-wrap
            justify-between
            items-start
            gap-y-[40px]
            gap-x-[32px]
            lg:gap-x-[80px]
          "
        >
          {/* Меню */}
          <div className="flex-[1_1_180px] max-w-[260px] text-left">
            <p className="text-[17px] sm:text-[18px] font-semibold mb-[26px] sm:mb-[30px]">
              Меню
            </p>
            <ul className="space-y-[16px] sm:space-y-[20px] lg:space-y-[24px]">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`${linkBaseClasses} block text-left`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Категории */}
          <div className="flex-[1_1_180px] max-w-[260px] text-left">
            <p className="text-[17px] sm:text-[18px] font-semibold mb-[26px] sm:mb-[30px]">
              Категории
            </p>
            <ul className="space-y-[16px] sm:space-y-[20px] lg:space-y-[24px]">
              {categoriesItems.map((item, idx) => (
                <li key={`${item}-${idx}`}>
                  <button
                    type="button"
                    className={`${linkBaseClasses} block text-left`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Соц сети */}
          <div className="flex-[1_1_180px] max-w-[260px] text-left">
            <p className="text-[17px] sm:text-[18px] font-semibold mb-[26px] sm:mb-[30px]">
              Соц сети
            </p>
            <ul className="space-y-[16px] sm:space-y-[20px] lg:space-y-[24px]">
              {socials.map((s) => (
                <li key={s.label}>
                  <button
                    type="button"
                    className="
                      group
                      inline-flex items-center
                      gap-[10px]
                      focus:outline-none
                    "
                  >
                    <span className="relative w-[16px] h-[16px]">
                      {/* белая иконка */}
                      <img
                        src={s.icon}
                        alt={s.label}
                        className="
                          absolute inset-0 w-[16px] h-[16px] object-contain
                          opacity-100 group-hover:opacity-0 group-active:opacity-0
                          transition-opacity
                        "
                      />
                      {/* красная иконка */}
                      <img
                        src={s.iconActive}
                        alt={s.label}
                        className="
                          absolute inset-0 w-[16px] h-[16px] object-contain
                          opacity-0 group-hover:opacity-100 group-active:opacity-100
                          transition-opacity
                        "
                      />
                    </span>

                    <span
                      className="
                        text-[15px] sm:text-[16px]
                        transition-colors
                        group-hover:text-[#C0392B]
                        group-active:text-[#C0392B]
                      "
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div className="flex-[1_1_210px] max-w-[280px] text-left">
            <p className="text-[17px] sm:text-[18px] font-semibold mb-[26px] sm:mb-[30px]">
              Контакты
            </p>
            <div className="space-y-[6px]">
              <button
                type="button"
                className={`${linkBaseClasses} block text-left`}
              >
                Аскар Шакиров, 258
              </button>
              <button
                type="button"
                className={`${linkBaseClasses} block text-left`}
              >
                0 555 123 123
              </button>
              <button
                type="button"
                className={`${linkBaseClasses} block text-left`}
              >
                0 555 123 123
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
