// src/page/homePage/components/Search.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import LogoFallback from "../../../../assets/Search/logo.png";
import KvIcon from "../../../../assets/Search/kv.svg";
import SelectIcon from "../../../../assets/Search/select.svg";
import LupaIcon from "../../../../assets/Search/lupa.svg";
import ShopIcon from "../../../../assets/Search/shop.svg";
import TelIcon from "../../../../assets/Header/tel.svg";

import { getCategories } from "../../../../api/catalog";
import { getPage } from "../../../../api/pages";

const NAV_ITEMS = [
  { label: "Главная", path: "/" },
  { label: "Каталог", path: "/Catalog" },
  { label: "Акции", path: "/promotions" },
  { label: "Популярные товары", path: "/popular-products" },
  { label: "Новинки", path: "/new" },
  { label: "Новости", path: "/News" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/Contacts" },
];

const DEFAULT_PHONES_STR = "0555 123 123 / +996 555 123 123";

const parsePhones = (value) => {
  const str = (value || DEFAULT_PHONES_STR).toString();
  return str
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
};

const makeTelHref = (phone) =>
  "tel:" + phone.replace(/[^\d+]/g, "");

// строим дерево категорий по parent
const buildCategoryTree = (flat) => {
  if (!Array.isArray(flat) || !flat.length) return [];

  const byId = {};
  flat.forEach((c) => {
    byId[c.id] = { ...c, children: [] };
  });

  const roots = [];
  flat.forEach((c) => {
    const node = byId[c.id];
    if (c.parent && byId[c.parent]) {
      byId[c.parent].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const Search = ({ cartCount = 0 }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // мегаменю каталога
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [activeRootId, setActiveRootId] = useState(null);
  const catalogCloseTimerRef = useRef(null);

  // телефон / лого из статических страниц
  const [phones, setPhones] = useState(parsePhones(DEFAULT_PHONES_STR));
  const [logoUrl, setLogoUrl] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const primaryPhone = phones[0] || "0555 123 123";
  const primaryPhoneHref = makeTelHref(primaryPhone);
  const logoSrc = logoUrl || LogoFallback;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleCartClick = () => {
    navigate("/checkout");
  };

  const handlePhoneClick = () => {
    window.location.href = primaryPhoneHref;
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const openMenu = () => {
    setMobileMenuVisible(true);
    requestAnimationFrame(() => setMobileMenuOpen(true));
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!mobileMenuOpen && mobileMenuVisible) {
      const timer = setTimeout(() => setMobileMenuVisible(false), 250);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [mobileMenuOpen, mobileMenuVisible]);

  // грузим категории в шапку
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getCategories({ page: 1, page_size: 200 });

        if (cancelled) return;

        let results = [];
        if (Array.isArray(data?.results)) results = data.results;
        else if (Array.isArray(data)) results = data;

        const active = results.filter((c) => c.is_active !== false);
        const hasChildrenField = active.some((c) => Array.isArray(c.children));
        const tree = hasChildrenField ? active : buildCategoryTree(active);

        setCategories(tree);
        if (tree.length) setActiveRootId(tree[0].id);
      } catch (e) {
        if (cancelled) return;
        console.error("Failed to load header categories", e);
        setCategoriesError("Не удалось загрузить категории.");
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // грузим телефоны и логотип из статических страниц
  useEffect(() => {
    let cancelled = false;

    const loadStatic = async () => {
      try {
        // контакты — телефон
        try {
          const contacts = await getPage("contacts");
          if (!cancelled && contacts && contacts.phone) {
            setPhones(parsePhones(contacts.phone));
          }
        } catch (e) {
          console.warn("Search: cannot load contacts page phone", e);
        }

        // о компании — логотип
        try {
          const about = await getPage("about");
          if (!cancelled && about && about.logo_url) {
            setLogoUrl(about.logo_url);
          }
        } catch (e) {
          console.warn("Search: cannot load about page logo", e);
        }
      } catch (e) {
        console.error("Search: static pages load error", e);
      }
    };

    loadStatic();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRoot = categories.find((c) => c.id === activeRootId) || null;
  const rootChildren = activeRoot?.children || [];

  // клик по подкатегории
  const handleCategoryClick = (categoryId) => {
    navigate(`/Catalog?category=${categoryId}`);
    setCatalogOpen(false);
  };

  // клик по РОДИТЕЛЬСКОЙ категории
  const handleRootClick = (rootId) => {
    navigate(`/Catalog?categoryTree=${rootId}`);
    setCatalogOpen(false);
  };

  // открыть меню каталога
  const openCatalogMenu = () => {
    if (catalogCloseTimerRef.current) {
      clearTimeout(catalogCloseTimerRef.current);
      catalogCloseTimerRef.current = null;
    }
    setCatalogOpen(true);
  };

  // отложенное закрытие меню каталога
  const scheduleCloseCatalogMenu = () => {
    if (catalogCloseTimerRef.current) {
      clearTimeout(catalogCloseTimerRef.current);
    }
    catalogCloseTimerRef.current = setTimeout(() => {
      setCatalogOpen(false);
    }, 200);
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-[#ECECF5] shadow-[0_4px_18px_rgba(0,0,0,0.06)] font-['Inter']">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 py-3">
        {/* DESKTOP / TABLET */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              {/* левая группа: лого + каталог + поиск */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* ЛОГО */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleLogoClick}
                    aria-label="На главную"
                    className="cursor-pointer focus:outline-none"
                  >
                    <img
                      src={logoSrc}
                      alt="logo"
                      className="w-[107px] h-[66px] object-cover bg-[#E3E3E3]"
                    />
                  </button>
                </div>

                {/* КАТАЛОГ */}
                <div
                  className="flex-shrink-0"
                  onMouseEnter={openCatalogMenu}
                  onMouseLeave={scheduleCloseCatalogMenu}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (catalogOpen) {
                        setCatalogOpen(false);
                      } else {
                        openCatalogMenu();
                      }
                    }}
                    className="
                      flex items-center justify-between
                      w-[132px] h-[43px]
                      rounded-[14px]
                      border border-[#000098]
                      bg-[#F7F7FF]
                      px-4
                      text-[14px] font-medium
                      text-[#000098]
                      cursor-pointer
                    "
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={KvIcon}
                        alt=""
                        className="w-[8px] h-[8px] object-contain"
                      />
                      <span>Каталог</span>
                    </span>
                    <img
                      src={SelectIcon}
                      alt=""
                      className={`w-[8px] h-[4px] object-contain transition-transform ${
                        catalogOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* ПОИСК */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="
                    flex items-center
                    h-[43px]
                    rounded-[14px]
                    border border-[#D5D7F0]
                    bg-[#F7F7FF]
                    px-4
                    flex-1 min-w-0
                    max-w-[550px]
                  "
                >
                  <div className="flex items-center w-full">
                    <button
                      type="submit"
                      className="flex items-center justify-center w-[20px] h-[20px] mr-3 cursor-pointer"
                      aria-label="Искать"
                    >
                      <img
                        src={LupaIcon}
                        alt=""
                        className="w-[15px] h-[15px] object-contain"
                      />
                    </button>

                    <input
                      type="text"
                      placeholder="Поиск товаров"
                      className="
                        w-full bg-transparent outline-none
                        text-[14px]
                        text-[#606266]
                        placeholder-[#606266]
                      "
                    />
                  </div>
                </form>
              </div>

              {/* КОРЗИНА */}
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCartClick}
                  className="
                    relative
                    flex items-center justify-center
                    w-[48px] h-[43px]
                    rounded-[14px]
                    border border-[#D5D7F0]
                    bg-[#F7F7FF]
                    cursor-pointer
                  "
                  aria-label="Корзина"
                >
                  <img
                    src={ShopIcon}
                    alt=""
                    className="w-[17px] h-[18px] object-contain"
                  />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute -top-[6px] -right-[2px]
                        flex items-center justify-center
                        w-[20px] h-[20px]
                        rounded-full
                        bg-[#000098]
                        text-white text-[11px] font-medium
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Мегаменю каталога */}
            {catalogOpen && (
              <div
                className="
                  absolute left-0 right-0 top-[calc(100%+6px)]
                  w-full
                  bg-white
                  rounded-[16px]
                  shadow-[0_0_20px_rgba(15,23,42,0.25)]
                  flex
                  overflow-hidden
                  z-30
                "
                onMouseEnter={openCatalogMenu}
                onMouseLeave={scheduleCloseCatalogMenu}
              >
                {/* левая колонка корней */}
                <div className="w-[260px] border-r border-[#ECECF5] py-3 px-2">
                  {categoriesLoading && !categories.length && (
                    <div className="px-2 text-[13px] text-[#777]">
                      Загрузка...
                    </div>
                  )}
                  {categoriesError && !categories.length && (
                    <div className="px-2 text-[13px] text-[#E15241]">
                      {categoriesError}
                    </div>
                  )}

                  {categories.map((cat) => {
                    const isActive = activeRootId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onMouseEnter={() => setActiveRootId(cat.id)}
                        onClick={() => handleRootClick(cat.id)}
                        className={`
                          flex items-center justify-between
                          w-full h-[40px]
                          px-3 mt-[4px]
                          text-left
                          text-[14px]
                          rounded-[14px]
                          transition-colors
                          ${
                            isActive
                              ? "bg-[#91E456] text-white"
                              : "bg-transparent text-[#111] hover:bg-[#F5F7FF]"
                          }
                        `}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[#C0C4CC] text-[16px]">
                          &gt;
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* правая часть — подкатегории */}
                <div className="flex-1 py-4 px-5">
                  {activeRoot && rootChildren.length === 0 && (
                    <div className="text-[13px] text-[#777]">
                      Подкатегории отсутствуют.
                    </div>
                  )}

                  {activeRoot && rootChildren.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {rootChildren.map((child) => (
                        <div key={child.id} className="text-[13px]">
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(child.id)}
                            className="font-semibold text-[#111] mb-[4px] hover:text-[#91E456]"
                          >
                            {child.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {!activeRoot &&
                    !categoriesLoading &&
                    !categoriesError && (
                      <div className="text-[13px] text-[#777]">
                        Категории не найдены.
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          {!mobileSearchOpen && (
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  aria-label="На главную"
                  className="cursor-pointer focus:outline-none"
                >
                  <img
                    src={logoSrc}
                    alt="logo"
                    className="w-[90px] h-[50px] object-cover bg-[#E3E3E3]"
                  />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePhoneClick}
                  className="
                    flex items-center justify-center
                    w-[34px] h-[34px]
                    rounded-[12px]
                    bg-[#FFFFFF]
                    border border-[#ECECF5]
                    cursor-pointer
                  "
                  aria-label="Позвонить"
                >
                  <img
                    src={TelIcon}
                    alt=""
                    className="w-[16px] h-[16px] object-contain"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(true)}
                  className="
                    flex items-center justify-center
                    w-[34px] h-[34px]
                    rounded-[12px]
                    bg-[#FFFFFF]
                    border border-[#ECECF5]
                    cursor-pointer
                  "
                  aria-label="Поиск"
                >
                  <img
                    src={LupaIcon}
                    alt=""
                    className="w-[16px] h-[16px] object-contain"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleCartClick}
                  className="
                    relative
                    flex items-center justify-center
                    w-[34px] h-[34px]
                    rounded-[12px]
                    bg-[#FFFFFF]
                    border border-[#ECECF5]
                    cursor-pointer
                  "
                  aria-label="Корзина"
                >
                  <img
                    src={ShopIcon}
                    alt=""
                    className="w-[16px] h-[17px] object-contain"
                  />
                  {cartCount > 0 && (
                    <span
                      className="
                        absolute -top-[6px] -right-[2px]
                        flex items-center justify-center
                        w-[18px] h-[18px]
                        rounded-full
                        bg-[#000098]
                        text-white text-[10px] font-medium
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={openMenu}
                  className="
                    flex items-center justify-center
                    w-[34px] h-[34px]
                    rounded-[12px]
                    bg-[#FFFFFF]
                    border border-[#ECECF5]
                    cursor-pointer
                  "
                  aria-label="Меню"
                >
                  <div className="flex flex-col gap-[3px]">
                    <span className="w-[16px] h-[2px] bg-[#333333]" />
                    <span className="w-[16px] h-[2px] bg-[#333333]" />
                    <span className="w-[16px] h-[2px] bg-[#333333]" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {mobileSearchOpen && (
            <form
              onSubmit={handleSearchSubmit}
              className="
                mt-1
                flex items-center
                h-[40px]
                rounded-[10px]
                border border-[#ECECF5]
                bg-[#F7F7FF]
                px-3
                w-full max-w-[550px] mx-auto
              "
            >
              <img
                src={LupaIcon}
                alt=""
                className="w-[16px] h-[16px] object-contain mr-2"
              />
              <input
                type="text"
                placeholder="Найти товар"
                className="
                  flex-1 bg-transparent outline-none
                  text-[14px] text-[#606266]
                  placeholder-[#606266]
                "
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="ml-2 text-[14px] text-[#C0392B] cursor-pointer"
              >
                Отмена
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Мобильное бургер-меню */}
      {mobileMenuVisible && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/30 cursor-pointer"
          />

          <div
            className={`
              absolute right-0 top-0
              w-[80%] max-w-[340px]
              bg-white
              shadow-[0_0_20px_rgba(15,23,42,0.35)]
              flex flex-col
              max-h-[90vh]
              mt-4 mb-4 mr-2
              rounded-l-2xl
              transform transition-transform duration-300 ease-out
              ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECECF5]">
              <span className="text-[15px] font-semibold">Меню</span>
              <button
                type="button"
                onClick={closeMenu}
                className="text-[22px] leading-none text-[#8A8BA0] hover:text-[#C0392B] cursor-pointer"
              >
                ×
              </button>
            </div>

            <nav className="px-4 py-3 space-y-2 text-[14px] max-h-[60vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      closeMenu();
                    }}
                    className={`
                      w-full text-left py-[6px]
                      hover:text-[#C0392B]
                      cursor-pointer
                      ${
                        isActive
                          ? "text-[#C0392B] font-semibold"
                          : "text-[#333333]"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[#ECECF5] px-4 py-3 text-[13px]">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2 text-[#C0392B] cursor-pointer"
                >
                  <img
                    src={TelIcon}
                    alt=""
                    className="w-[14px] h-[14px] object-contain"
                  />
                  <span>{primaryPhone}</span>
                </button>
                <a
                  href="mailto:info@kanzler.kg"
                  className="text-[#6B7280] hover:text-[#C0392B] cursor-pointer"
                >
                  info@kanzler.kg
                </a>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[#9CA3AF]">
                <button
                  type="button"
                  className="hover:text-[#C0392B] cursor-pointer"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  className="hover:text-[#C0392B] cursor-pointer"
                >
                  Instagram
                </button>
                <button
                  type="button"
                  className="hover:text-[#C0392B] cursor-pointer"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  className="hover:text-[#C0392B] cursor-pointer"
                >
                  Tiktok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
