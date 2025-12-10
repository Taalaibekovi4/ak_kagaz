// src/page/homePage/components/Categories.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Cat1 from "../../../../assets/Categories/1catigor.svg";
import Cat2 from "../../../../assets/Categories/2catigor.svg";
import Cat3 from "../../../../assets/Categories/3catigor.svg";
import Cat4 from "../../../../assets/Categories/4catigor.svg";
import Cat5 from "../../../../assets/Categories/5catigor.svg";
import Cat6 from "../../../../assets/Categories/6catigor.svg";
import Cat7 from "../../../../assets/Categories/7catigor.svg";
import Cat8 from "../../../../assets/Categories/8catigor.svg";

const CATEGORIES = [
  { id: 1, title: "Полиграфия", icon: Cat1 },
  { id: 2, title: "Сувенирная\nпродукция", icon: Cat2 },
  { id: 3, title: "Канц товары", icon: Cat3 },
  { id: 4, title: "Письмо и графика", icon: Cat4 },
  { id: 5, title: "Офисное\nоборудование", icon: Cat5 },
  { id: 6, title: "Художественные\nтовары", icon: Cat6 },
  { id: 7, title: "Игры и игрушки", icon: Cat7 },
  { id: 8, title: "Творчество", icon: Cat8 },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    // только первая карточка
    if (id === 1) {
      navigate("/wholesale-products");
    }
    // для остальных пока ничего не делаем
  };

  return (
    <section className="w-full bg-[#F7F7FF]">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-[48px] pb-[72px] sm:pt-[56px] sm:pb-[80px] lg:pt-[62px] lg:pb-[90px]">
        {/* Заголовок */}
        <h2
          className="
            font-alumni font-normal text-[#111111]
            text-[28px] leading-[30px]
            sm:text-[32px] sm:leading-[34px]
            lg:text-[36px] lg:leading-[38px]
          "
        >
          Категории
        </h2>

        {/* Сетка карточек */}
        <div
          className="
            mt-[40px] sm:mt-[60px] lg:mt-[72px]
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-x-[20px]
            gap-y-[25px]
          "
        >
          {CATEGORIES.map(({ id, title, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleCategoryClick(id)}
              className="
                group
                w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[299px]
                min-h-[260px] sm:min-h-[280px] lg:h-[334px]
                bg-white
                border border-[#F1F1F8]
                shadow-[0_10px_30px_rgba(15,23,42,0.06)]
                rounded-[4px]
                flex flex-col items-center justify-center
                mx-auto
                transition-transform duration-150
                hover:-translate-y-[2px]
                cursor-pointer
              "
            >
              <img
                src={icon}
                alt={title.replace(/\n/g, " ")}
                className="w-[120px] h-[110px] sm:w-[125px] sm:h-[115px] lg:w-[130px] lg:h-[125px] object-contain"
              />

              {/* отступ от иконки до текста: 62px */}
              <p
                className="
                  mt-[90px]
                  text-center text-[#111111]
                  text-[22px] leading-[25px]
                  whitespace-pre-line
                  font-['Roboto',sans-serif]
                "
              >
                {title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
