// src/page/homePage/components/Contactstel.jsx
import React from "react";

// белые иконки
import InstagramIcon from "../../assets/Footer/intagram.svg";
import WhatsAppIcon from "../../assets/Footer/WHatsApp.svg";
import TelegramIcon from "../../assets/Footer/Telegram.svg";
import FacebookIcon from "../../assets/Footer/Facebook.svg";
import TikTokIcon from "../../assets/Footer/TikTok.svg";

// красные (hover)
import InstagramRedIcon from "../../assets/Footer/intagramRed.svg";
import WhatsAppRedIcon from "../../assets/Footer/WHatsAppRed.svg";
import TelegramRedIcon from "../../assets/Footer/TelegramRed.svg";
import FacebookRedIcon from "../../assets/Footer/FacebookRed.svg";
import TikTokRedIcon from "../../assets/Footer/TikTokRed.svg";

const DEFAULT_CONTENT =
  "Будем рады видеть вас у нас в офисе, ответить на любые вопросы, показать интересующий вас товар.";

const Contactstel = ({ page }) => {
  const title = page?.title || "Контакты";
  const contentHtml = page?.content || DEFAULT_CONTENT;

  // Иконка-ссылка (оптимизация, меньше повторов)
  const IconButton = ({ icon, iconRed, label }) => (
    <button
      type="button"
      className="group inline-flex items-center gap-[6px] cursor-pointer"
    >
      <span className="relative flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#333]">
        <img src={icon} alt="" className="w-[12px] h-[12px] group-hover:hidden" />
        <img src={iconRed} alt="" className="w-[12px] h-[12px] hidden group-hover:block" />
      </span>
      <span className="group-hover:text-[#C0392B]">{label}</span>
    </button>
  );

  return (
    <section className="w-full bg-white font-['Manrope',sans-serif] text-[#111]">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4">
        {/* Заголовок */}
        <h1 className="pt-[80px] sm:pt-[110px] lg:pt-[136px] text-[32px] sm:text-[36px] lg:text-[40px] font-medium leading-tight">
          {title}
        </h1>

        {/* Белый блок */}
        <div className="mt-[72px] mb-[80px] w-full bg-[#F8F8F8] rounded-[2px]">
          <div className="px-[24px] sm:px-[40px] lg:px-[52px] py-[24px] sm:py-[28px]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-[16px] md:gap-[32px]">
              {/* ТЕКСТ ИЗ АДМИНКИ */}
              <p
                className="max-w-[760px] text-[15px] leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* СОЦ СЕТИ */}
              <div className="flex flex-col items-start md:items-end gap-[8px] text-[14px]">
                <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px]">
                  <span className="mr-[6px] whitespace-nowrap">Мы в соц сетях:</span>

                  <IconButton
                    icon={WhatsAppIcon}
                    iconRed={WhatsAppRedIcon}
                    label="What’s App"
                  />

                  <IconButton
                    icon={InstagramIcon}
                    iconRed={InstagramRedIcon}
                    label="Instagram"
                  />

                  <IconButton
                    icon={FacebookIcon}
                    iconRed={FacebookRedIcon}
                    label="Facebook"
                  />

                  <IconButton
                    icon={TikTokIcon}
                    iconRed={TikTokRedIcon}
                    label="Tiktok"
                  />

                  <IconButton
                    icon={TelegramIcon}
                    iconRed={TelegramRedIcon}
                    label="Telegram"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full h-[3px] bg-[#F8F8F8]" />
    </section>
  );
};

export default Contactstel;
