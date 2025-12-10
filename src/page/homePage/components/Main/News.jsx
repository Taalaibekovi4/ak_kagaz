// src/page/homePage/components/News.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// картинка по умолчанию
import NewsImg from "../../../../assets/News/News.png";
import { getNewsList } from "../../../../api/news";

// Маппер под swagger
const mapNewsItem = (n) => {
  const date =
    n.published_at ||
    n.created_at ||
    n.date ||
    new Date().toISOString();

  return {
    id: n.id,
    slug: n.slug,
    title: n.title || n.name || "Новость",
    text:
      n.preview_text ||
      n.short_text ||
      n.preview ||
      n.description ||
      n.text ||
      "",
    img: n.image_url || n.image || n.img || NewsImg,
    date,
  };
};

// ======================
// К А Р Т О Ч К А
// ======================
const NewsCard = ({ id, slug, img, title, text }) => {
  // Обрезка текста (80 символов)
  const preview =
    text && text.length > 80 ? text.slice(0, 80).trimEnd() + "..." : text;

  return (
    <Link to={`/news/${slug || id}`} className="no-underline">
      <article
        className="
          bg-white
          border border-[#E5E5EE]
          shadow-[0_8px_18px_rgba(15,23,42,0.06)]
          rounded-[2px]
          flex flex-col
          w-[260px]
          xs:w-[280px]
          sm:w-[300px]
          md:w-[340px]
          lg:w-[375px]
          h-full
        "
      >
        {/* Картинка */}
        <img
          src={img}
          alt={title}
          className="
            w-full
            h-[200px]
            xs:h-[220px]
            sm:h-[240px]
            md:h-[260px]
            lg:h-[317px]
            object-cover
          "
        />

        <div className="flex-1 flex flex-col px-[20px] pb-[16px]">

          {/* Заголовок */}
          <h3
            className="
              mt-[16px]
              text-[16px] sm:text-[18px]
              leading-[1.25]
              font-semibold
              text-[#111111]
              font-['Roboto',sans-serif]
              text-center
              break-words
            "
          >
            {title}
          </h3>

          {/* Текст превью */}
          <p
            className="
              mt-[12px]
              text-[13px] sm:text-[14px]
              leading-[1.4]
              text-[#444444]
              font-['Roboto',sans-serif]
              break-words         /* НЕ ДАЁТ ТЕКСТУ ВЫЛЕТАТЬ */
              max-h-[60px]        /* фикс высоты */
              overflow-hidden
            "
          >
            {preview}
          </p>

          {/* Кнопка */}
          <button
            type="button"
            className="
              mt-[24px]
              mb-[20px]
              inline-flex items-center gap-[8px]
              text-[13px]
              font-medium
              text-[#7BE241]
              font-['Roboto',sans-serif]
              cursor-pointer        /* КУРСОР РУКА */
            "
          >
            <span>Читать далее</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7BE241"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </article>
    </Link>
  );
};

// ==========================
// Г Л А В Н Ы Й   Б Л О К
// ==========================
const News = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // грузим только 3 новости
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getNewsList({
          page: 1,
          page_size: 3,
        });

        if (cancelled) return;

        const results = Array.isArray(data.results) ? data.results : data;
        const mapped = (results || []).map(mapNewsItem).slice(0, 3);

        setItems(mapped);
      } catch (e) {
        console.error("Failed to load home news", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full bg-[#F7F7FF]">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pb-[255px]">

        {/* Заголовок */}
        <h2
          className="
            pt-[80px] sm:pt-[110px] lg:pt-[137px]
            font-['Roboto',sans-serif]
            font-normal
            text-[#111111]
            text-[28px] leading-[30px]
            sm:text-[32px] sm:leading-[34px]
            lg:text-[40px] lg:leading-[42px]
          "
        >
          Новости
        </h2>

        {/* Карточки */}
        <div
          className="
            mt-[40px] sm:mt-[60px] lg:mt-[82px]
            flex flex-wrap
            justify-center
            items-stretch
            gap-[20px]
          "
        >
          {loading && !items.length && (
            <p className="text-[14px] text-[#777]">Загрузка новостей...</p>
          )}

          {!loading &&
            items.map((n) => <NewsCard key={n.id} {...n} />)}
        </div>

      </div>
    </section>
  );
};

export default News;
