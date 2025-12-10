// src/page/homePage/components/Header.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PhoneIcon from "../../../../assets/Header/tel.svg";
import { getPage } from "../../../../api/pages";

const NAV_ITEMS = [
  { label: "Каталог", path: "/Catalog" },
  { label: "Популярные товары", path: "/popular-products" },
  { label: "Акции", path: "/promotions" },
  { label: "Новинки", path: "/new" },
  { label: "Новости", path: "/News" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

// парсим строку с телефонами вида "0555 123 123 / +996 555 123 123"
const DEFAULT_PHONES_STR = "0555 123 123 / +996 555 123 123";

const parsePhones = (value) => {
  const str = (value || DEFAULT_PHONES_STR).toString();
  return str
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
};

const makeTelHref = (phone) =>
  "tel:" + phone.replace(/[^\d+]/g, ""); // оставляем только цифры и +

const Header = () => {
  const [phones, setPhones] = useState(parsePhones(DEFAULT_PHONES_STR));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // тянем статическую страницу "Контакты"
        const data = await getPage("contacts");
        if (cancelled) return;

        if (data && data.phone) {
          setPhones(parsePhones(data.phone));
        }
      } catch (e) {
        console.error("Header: failed to load contacts page phone", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="w-full bg-[#F7F7FF] border-b border-[#ECECF5] font-['Inter']">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4">
        {/* md+ — полноценный хедер, на мобилке прячем (там уже Search) */}
        <div className="hidden md:flex h-[72px] items-center justify-between gap-4">
          {/* меню */}
          <nav className="flex items-center text-[11px] lg:text-[13px] xl:text-[14px] leading-none">
            {NAV_ITEMS.map((item, idx) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  font-normal tracking-[0.02em] whitespace-nowrap
                  ${
                    idx === 0
                      ? "ml-0"
                      : "ml-[20px] lg:ml-[28px] xl:ml-[40px] 2xl:ml-[50px]"
                  }
                  ${
                    isActive
                      ? "text-[#C0392B]"
                      : "text-[#333333] hover:text-[#C0392B]"
                  }
                  transition-colors
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* телефоны справа */}
          <div className="flex items-center shrink-0">
            <img
              src={PhoneIcon}
              alt="phone"
              className="w-[18px] h-[22.69px] object-contain flex-shrink-0"
            />
            <div className="ml-2 text-[11px] lg:text-[13px] xl:text-[14px] leading-[16px] xl:leading-[19px] text-[#000098]">
              {phones.map((p, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span> / </span>}
                  <a href={makeTelHref(p)} className="hover:underline">
                    {p}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
