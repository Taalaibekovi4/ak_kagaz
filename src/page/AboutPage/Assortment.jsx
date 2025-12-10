// src/page/homePage/components/Assortment.jsx
import React from "react";
import AssortmentImg from "../../assets/assortment.png";

// белые иконки
import InstagramIcon from "../../assets/Footer/intagram.svg";
import WhatsAppIcon from "../../assets/Footer/WHatsApp.svg";
import FacebookIcon from "../../assets/Footer/Facebook.svg";
import TikTokIcon from "../../assets/Footer/TikTok.svg";

// красные иконки (hover)
import InstagramRedIcon from "../../assets/Footer/intagramRed.svg";
import WhatsAppRedIcon from "../../assets/Footer/WHatsAppRed.svg";
import FacebookRedIcon from "../../assets/Footer/FacebookRed.svg";
import TikTokRedIcon from "../../assets/Footer/TikTokRed.svg";

const DEFAULT_HTML =
  'Благодаря доверию наших клиентов и качеству товаров,<br />' +
  "ассортимент продуктов, поставляемых компаниями<br />" +
  "Kanzler&amp;Bürger, постоянно расширяется: на сегодняшний день<br />" +
  "предлагается более 6000 наименований различных продуктов.";

const Assortment = ({ page }) => {
  const title = page?.title || "Ассортимент";
  const contentHtml = page?.content || DEFAULT_HTML;
  const image = page?.logo_url || AssortmentImg;

  return (
    <section className="w-full bg-white font-['Roboto',sans-serif] text-[#111111]">
      <div className="mx-auto max-w-[1040px] px-3 sm:px-4 pt-[80px] sm:pt-[100px] lg:pt-[120px] pb-[100px]">
        <div
          className="
            flex flex-col lg:flex-row
            items-start lg:items-center
            justify-center
            gap-[28px] sm:gap-[32px] lg:gap-[56px]
          "
        >
          {/* ЛЕВАЯ ЧАСТЬ: заголовок, текст, соц-сети */}
          <div className="w-full lg:flex-1 flex justify-center">
            <div className="max-w-[520px] w-full text-center lg:text-left">
              {/* заголовок + красная линия */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-[24px] sm:mb-[32px]">
                <span className="h-[1px] w-[40px] bg-[#C0392B]" />
                <h2
                  className="
                    font-['Alumni_Sans_SC','Alumni Sans SC',sans-serif]
                    text-[#111111]
                    text-[30px] leading-[32px]
                    sm:text-[34px] sm:leading-[36px]
                    lg:text-[38px] lg:leading-[40px]
                    font-normal
                  "
                >
                  {title}
                </h2>
              </div>

              {/* текст из админки / дефолтный, с переносами */}
              <p
                className="text-[14px] sm:text-[15px] leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* соц-сети */}
              <div className="mt-[24px] sm:mt-[28px] flex flex-wrap items-center justify-center lg:justify-start gap-x-[18px] gap-y-[10px] text-[14px]">
                {/* WhatsApp */}
                <button
                  type="button"
                  className="group inline-flex items-center gap-[6px] cursor-pointer"
                >
                  <span className="relative flex items-center justify-center w-[20px] h-[20px]  rounded-full bg-[#333333]">
                    <img
                      src={WhatsAppIcon}
                      alt=""
                      className="w-[12px] h-[12px] block group-hover:hidden"
                    />
                    <img
                      src={WhatsAppRedIcon}
                      alt=""
                      className="w-[12px] h-[12px] hidden group-hover:block"
                    />
                  </span>
                  <span className="group-hover:text-[#C0392B]">
                    What&apos;s App
                  </span>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  className="group inline-flex items-center gap-[6px] cursor-pointer"
                >
                  <span className="relative flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#333333]">
                    <img
                      src={InstagramIcon}
                      alt=""
                      className="w-[12px] h-[12px] block group-hover:hidden"
                    />
                    <img
                      src={InstagramRedIcon}
                      alt=""
                      className="w-[12px] h-[12px] hidden group-hover:block"
                    />
                  </span>
                  <span className="group-hover:text-[#C0392B]">
                    Instagram
                  </span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="group inline-flex items-center gap-[6px] cursor-pointer"
                >
                  <span className="relative flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#333333]">
                    <img
                      src={FacebookIcon}
                      alt=""
                      className="w-[12px] h-[12px] block group-hover:hidden"
                    />
                    <img
                      src={FacebookRedIcon}
                      alt=""
                      className="w-[12px] h-[12px] hidden group-hover:block"
                    />
                  </span>
                  <span className="group-hover:text-[#C0392B]">Facebook</span>
                </button>

                {/* Tiktok */}
                <button
                  type="button"
                  className="group inline-flex items-center gap-[6px] cursor-pointer"
                >
                  <span className="relative flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#333333]">
                    <img
                      src={TikTokIcon}
                      alt=""
                      className="w-[12px] h-[12px] block group-hover:hidden"
                    />
                    <img
                      src={TikTokRedIcon}
                      alt=""
                      className="w-[12px] h-[12px] hidden group-hover:block"
                    />
                  </span>
                  <span className="group-hover:text-[#C0392B]">Tiktok</span>
                </button>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: картинка */}
          <div className="w-full max-w-[360px] lg:max-w-[380px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="bg-white rounded-[4px] shadow-[0_8px_18px_rgba(15,23,42,0.08)] overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assortment;
