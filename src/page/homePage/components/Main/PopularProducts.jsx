// src/page/homePage/components/PopularProducts.jsx
import React, { useEffect, useRef, useState } from "react";

import FiguraRight from "../../../../assets/PopularProducts/1figura.svg";
import FiguraLeft from "../../../../assets/PopularProducts/2figura.svg";
import NextIcon from "../../../../assets/PopularProducts/next.svg";
import PrevIcon from "../../../../assets/PopularProducts/peret.svg";
import Cart from "../../../../page/ui/Cart";

import ProductImg from "../../../../assets/PopularProducts/note.svg";
import { getProducts } from "../../../../api/catalog";

// теперь сюда добавили oldPrice / discount / promotion / isNew
const mapProductToCard = (p) => ({
  id: p.id,
  slug: p.slug,
  img: p.main_image || ProductImg,
  status: p.is_available ? "В наличии" : "Нет в наличии",
  statusType: p.is_available ? "in" : "out",
  title: p.name,
  price: Number(p.price) || 0,

  // АКЦИИ
  oldPrice:
    p.old_price !== null &&
    p.old_price !== undefined &&
    !Number.isNaN(Number(p.old_price))
      ? Number(p.old_price)
      : null,
  discount:
    typeof p.discount === "number" && !Number.isNaN(p.discount)
      ? p.discount
      : null,
  promotion: !!p.promotion,

  // НОВИНКА
  isNew: !!p.is_new,
});

const PopularProducts = ({ onAddToCart = () => {} }) => {
  const trackRef = useRef(null);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateButtons = (el) => {
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 5);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const handleNext = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: 260, behavior: "smooth" });
    updateButtons(el);
  };

  const handlePrev = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: -260, behavior: "smooth" });
    updateButtons(el);
  };

  const handleScroll = (e) => {
    updateButtons(e.currentTarget);
  };

  useEffect(() => {
    if (trackRef.current) {
      updateButtons(trackRef.current);
    }
  }, []);

  // грузим популярные товары ТОЛЬКО с бэка
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getProducts({
          page: 1,
          page_size: 20,
          ordering: "-id", // при желании поменяешь на сортировку по популярности
        });

        if (cancelled) return;

        const results = Array.isArray(data.results) ? data.results : [];
        setProducts(results.map(mapProductToCard));
      } catch (e) {
        console.error("Failed to load popular products", e);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // drag ленты мышкой (desktop)
  const handleMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;

    dragRef.current.isDown = true;
    el.classList.add("dragging");

    dragRef.current.startX = e.pageX - el.offsetLeft;
    dragRef.current.scrollLeft = el.scrollLeft;
  };

  const handleMouseUp = () => {
    const el = trackRef.current;
    if (!el) return;

    dragRef.current.isDown = false;
    el.classList.remove("dragging");
  };

  const handleMouseLeave = () => {
    const el = trackRef.current;
    if (!el) return;

    dragRef.current.isDown = false;
    el.classList.remove("dragging");
  };

  const handleMouseMove = (e) => {
    const el = trackRef.current;
    if (!el) return;
    if (!dragRef.current.isDown) return;

    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragRef.current.startX) * 1;
    el.scrollLeft = dragRef.current.scrollLeft - walk;

    updateButtons(el);
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* фигура справа сверху */}
      <img
        src={FiguraRight}
        alt=""
        className="
          pointer-events-none select-none
          absolute top-0 right-0 z-0
          w-[260px] sm:w-[420px] lg:w-[650px]
          h-auto
        "
      />

      {/* фигура слева снизу */}
      <img
        src={FiguraLeft}
        alt=""
        className="
          pointer-events-none select-none
          absolute bottom-0 left-0 z-0
          w-[230px] sm:w-[580px] lg:w-[580px]
          h-auto
        "
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-3 sm:px-4 pb-[238px]">
        {/* Заголовок */}
        <h2
          className="
            pt-[80px] sm:pt-[110px] lg:pt-[137px]
            font-alumni font-normal text-[#111111]
            text-[28px] leading-[30px]
            sm:text-[32px] sm:leading-[34px]
            lg:text-[40px] lg:leading-[42px]
          "
        >
          Популярные товары
        </h2>

        {/* Навигация для маленьких экранов (над лентой) */}
        <div className="mt-6 mb-3 flex justify-end gap-3 md:hidden">
          {canPrev && (
            <button
              type="button"
              onClick={handlePrev}
              className="
                flex h-9 w-9 items-center justify-center
                bg-transparent
                rounded-full
                border-0 outline-none appearance-none
                transition-transform duration-150 ease-out
                hover:scale-110 active:scale-95
              "
              aria-label="Предыдущие товары"
            >
              <img
                src={PrevIcon}
                alt="Назад"
                className="h-6 w-6 object-contain"
              />
            </button>
          )}
          {canNext && (
            <button
              type="button"
              onClick={handleNext}
              className="
                flex h-9 w-9 items-center justify-center
                bg-transparent
                rounded-full
                border-0 outline-none appearance-none
                transition-transform duration-150 ease-out
                hover:scale-110 active:scale-95
              "
              aria-label="Следующие товары"
            >
              <img
                src={NextIcon}
                alt="Вперёд"
                className="h-6 w-6 object-contain"
              />
            </button>
          )}
        </div>

        {/* Лента карточек */}
        <div className="mt-[36px] sm:mt-[56px] lg:mt-[82px] relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="
              products-track
              flex gap-[20px]
              overflow-x-auto
              pb-4
              scroll-smooth
              no-scrollbar
              justify-start
              pl-3 sm:pl-0
              cursor-grab active:cursor-grabbing select-none
              [&.dragging]:scroll-auto
            "
          >
            {loading && products.length === 0 && (
              <p className="text-[14px] text-[#777]">
                Загрузка популярных товаров...
              </p>
            )}

            {products.map((p) => (
              <div
                key={p.id}
                className="
                  flex-shrink-0
                  w-[220px] xs:w-[230px] sm:w-[240px] lg:w-[260px]
                "
              >
                {/* тут просто прокидываем все поля в Cart */}
                <Cart {...p} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>

          {/* Стрелки по бокам для md+ (в пределах экрана) */}
          {canPrev && (
            <button
              type="button"
              onClick={handlePrev}
              className="
                hidden md:flex
                items-center justify-center
                absolute top-1/2
                -translate-y-1/2
                left-2
                h-[46px] w-[46px]
                bg-transparent
                rounded-full
                border-0 outline-none appearance-none
                transition-transform duration-150 ease-out
                hover:scale-110 active:scale-95
              "
              aria-label="Предыдущие товары"
            >
              <img
                src={PrevIcon}
                alt="Назад"
                className="w-[32px] h-[32px] object-contain"
              />
            </button>
          )}

          {canNext && (
            <button
              type="button"
              onClick={handleNext}
              className="
                hidden md:flex
                items-center justify-center
                absolute top-1/2
                -translate-y-1/2
                right-2
                h-[46px] w-[46px]
                bg-transparent
                rounded-full
                border-0 outline-none appearance-none
                transition-transform duration-150 ease-out
                hover:scale-110 active:scale-95
              "
              aria-label="Следующие товары"
            >
              <img
                src={NextIcon}
                alt="Вперёд"
                className="w-[32px] h-[32px] object-contain"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
