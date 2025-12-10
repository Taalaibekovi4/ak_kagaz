// src/page/homePage/components/About.jsx
import React from "react";
import AboutImg from "../../assets/image.png";

const DEFAULT_TEXT =
  'Компания "KANZLER" (Канцлер) начала работу в 1999 году в качестве поставщика в Кыргызскую Республику от концерна BASF AG профессиональных носителей информации для телерадиокомпаний. В 2003 году начинает работу компания Bürger (Бюргер), осуществляя поставки расходных материалов для типографий Кыргызстана от ведущих производителей Европы.';

const About = ({ page }) => {
  const title = page?.title || "О нас";
  const contentHtml = page?.content || DEFAULT_TEXT;

  return (
    <section className="w-full bg-[#F5F5F5] font-['Roboto',sans-serif]">
      {/* верхний блок: фото + текст */}
      <div className="mx-auto max-w-[1040px] px-3 sm:px-4 pt-[80px] sm:pt-[100px] lg:pt-[120px] pb-[60px] sm:pb-[80px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-[28px] sm:gap-[32px] lg:gap-[56px]">
          {/* фото слева */}
          <div className="w-full max-w-[360px] lg:max-w-[380px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="bg-white rounded-[4px] shadow-[0_8px_18px_rgba(15,23,42,0.08)] overflow-hidden">
              <img
                src={page?.logo_url || AboutImg}
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* текст справа */}
          <div className="w-full lg:flex-1 flex justify-center">
            <div className="max-w-[520px] w-full">
              {/* заголовок + красная линия */}
              <div className="flex items-center gap-4 mb-[24px] sm:mb-[32px]">
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
                <span className="hidden sm:block h-[1px] w-[40px] bg-[#C0392B]" />
              </div>

              {/* текст из админки / дефолтный */}
              <p
                className="text-[14px] sm:text-[15px] leading-[1.6] text-[#111111]"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* нижний тёмный блок */}
      <div className="w-full bg-[#3A3A3A] text-white py-[50px] sm:py-[60px] lg:py-[70px]">
        <div className="mx-auto max-w-[760px] px-4 text-center">
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.7]">
            Сейчас компании поставляют товары более чем от 30 европейских
            производителей. Основные направления — бумага и расходные материалы
            для полиграфии, канцелярские товары, промо-сувениры, поставки
            элитного кофе и чая, немецкого премиум&nbsp;пива.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
