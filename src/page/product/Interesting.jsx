// src/page/homePage/components/Interesting.jsx
import React, { useEffect, useRef, useState } from "react";
import NextIcon from "../../assets/NewProducts/next.svg";
import PrevIcon from "../../assets/NewProducts/peret.svg";
import Cart from "../ui/Cart";
import ProductImg from "../../assets/NewProducts/note.svg";
import { getProducts } from "../../api/catalog";

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
});

const Interesting = ({ onAddToCart = () => {} }) => {
  const trackRef = useRef(null);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // берём первую страницу товаров, можно потом добавить спец. фильтр
        const data = await getProducts({ page: 1, page_size: 20 });

        if (cancelled) return;

        const results = Array.isArray(data?.results) ? data.results : [];
        setItems(results.map(mapProductToCard));
      } catch (e) {
        if (cancelled) return;
        console.error("Failed to load interesting products", e);
        setError("Не удалось загрузить товары.");
        setItems([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          if (trackRef.current) {
            // обновляем состояние кнопок после загрузки
            updateButtons(trackRef.current);
          }
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) updateButtons(trackRef.current);
  }, [items.length]);

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
    <section className="relative w-full bg-[#F7F7FF] overflow-hidden">
      <div className="relative mx-auto max-w-[1200px] px-3 sm:px-4 pb-[117px]">
        <h2 className="pt-[161px] text-[32px] sm:text-[36px] lg:text-[40px] leading-[1.1] font-normal text-[#111111]">
          Интересное
        </h2>

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

        <div className="mt-[107px] relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="
              flex gap-[20px]
              overflow-x-auto
              pb-4
              scroll-smooth
              no-scrollbar
              justify-start
              cursor-grab active:cursor-grabbing select-none
              [&.dragging]:scroll-auto
            "
          >
            {loading && !items.length && !error && (
              <p className="text-[14px] text-[#777]">Загрузка товаров...</p>
            )}

            {error && !items.length && (
              <p className="text-[14px] text-red-500">{error}</p>
            )}

            {!loading &&
              items.map((p) => (
                <div
                  key={p.id}
                  className="
                    flex-shrink-0
                    w-[220px] xs:w-[230px] sm:w-[240px] lg:w-[260px]
                  "
                >
                  <Cart {...p} onAddToCart={onAddToCart} />
                </div>
              ))}
          </div>

          {canPrev && (
            <button
              type="button"
              onClick={handlePrev}
              className="
                hidden md:flex
                items-center justify-center
                absolute top-1/2
                -translate-y-1/2
                -left-[35px]
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
                -right-[35px]
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

export default Interesting;
