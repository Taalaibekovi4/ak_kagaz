// src/page/homePage/components/NewProducts.jsx
import React, { useEffect, useRef, useState } from "react";
import NextIcon from "../../../../assets/NewProducts/next.svg";
import PrevIcon from "../../../../assets/NewProducts/peret.svg";
import Cart from "../../../../page/ui/Cart";
import ProductImg from "../../../../assets/NewProducts/note.svg";
import { getProducts } from "../../../../api/catalog";

// добавляем oldPrice / discount / promotion / isNew
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

  // НОВИНКА (если бэк вернёт поле is_new)
  isNew: !!p.is_new,
});

const NewProducts = ({ onAddToCart = () => {} }) => {
  const [products, setProducts] = useState([]);
  const trackRef = useRef(null);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Загрузка новинок только с API
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getProducts({
          page: 1,
          page_size: 10,
          ordering: "-id", // новинки = новые товары
          // если появится отдельный флаг новинки — можно добавить:
          // is_new: true,
        });

        if (cancelled) return;

        const items = Array.isArray(data.results) ? data.results : [];
        setProducts(items.map(mapProductToCard));
      } catch (e) {
        console.error("New products error", e);
        setProducts([]);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateButtons = (el) => {
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanPrev(scrollLeft > 5);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const handleNext = () => {
    const el = trackRef.current;
    el?.scrollBy({ left: 260, behavior: "smooth" });
    updateButtons(el);
  };

  const handlePrev = () => {
    const el = trackRef.current;
    el?.scrollBy({ left: -260, behavior: "smooth" });
    updateButtons(el);
  };

  return (
    <section className="relative w-full bg-[#F7F7FF] overflow-hidden">
      <div className="relative mx-auto max-w-[1200px] px-3 sm:px-4 pb-[260px]">
        <h2 className="pt-[80px] sm:pt-[110px] lg:pt-[137px] text-[40px] leading-[42px] text-[#111] font-alumni">
          Новинки
        </h2>

        <div className="mt-[36px] sm:mt-[56px] lg:mt-[82px] relative">
          <div
            ref={trackRef}
            onScroll={(e) => updateButtons(e.currentTarget)}
            className="
              flex gap-[20px]
              overflow-x-auto no-scrollbar pb-4
              cursor-grab select-none
            "
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="
                  flex-shrink-0
                  w-[220px] xs:w-[230px] sm:w-[240px] lg:w-[260px]
                "
              >
                {/* прокидываем всё в Cart, чтобы работали акция/скидка/новинка */}
                <Cart {...p} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>

          {canPrev && (
            <button
              onClick={handlePrev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2"
            >
              <img src={PrevIcon} className="w-[32px] h-[32px]" alt="prev" />
            </button>
          )}

          {canNext && (
            <button
              onClick={handleNext}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2"
            >
              <img src={NextIcon} className="w-[32px] h-[32px]" alt="next" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
