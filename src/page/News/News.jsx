// src/page/News/News.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import NewsImg from "../../assets/News/News.png";
import selectIcon from "../../assets/Catalog/select.svg";
import { getNewsList } from "../../api/news";

const sortOptions = [
  { value: "new", label: "Сначала новые" },
  { value: "popular", label: "Популярные" },
];

// маппер под swagger /main/news/
const mapNewsItem = (n) => {
  const date =
    n.published_at || n.created_at || n.date || new Date().toISOString();

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
    fullText: n.content || n.full_text || n.text || "",
    img: n.image_url || n.image || n.img || NewsImg,
    date,
    views: n.views ?? 0,
  };
};

// селект сортировки
const NewsSortSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const current = sortOptions.find((o) => o.value === value) || sortOptions[0];

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative inline-block font-['Roboto',sans-serif] text-[15px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[6px] text-[#91E456]"
      >
        <span>{current.label}</span>
        <img
          src={selectIcon}
          alt=""
          className={`w-[10px] h-[6px] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-[6px] min-w-[180px] rounded-[4px] bg-[#1F1F1F] text-white shadow-lg py-[6px] z-30">
          {sortOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => handleSelect(o.value)}
              className={`
                w-full text-left px-[14px] py-[6px] text-[14px]
                hover:bg-[#333333]
                ${o.value === value ? "text-[#91E456]" : "text-white"}
              `}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const NewsCard = ({ item }) => {
  const { img, title, text, slug } = item;

  // 80 символов + ...
  const preview =
    text && text.length > 80 ? text.slice(0, 80).trimEnd() + "..." : text;

  return (
    <Link
      to={`/news/${slug}`}
      className="
        bg-white
        shadow-[0_8px_18px_rgba(15,23,42,0.06)]
        rounded-[2px]
        border border-[#E5E5EE]
        flex flex-col
        w-[260px]
        xs:w-[280px]
        sm:w-[300px]
        md:w-[340px]
        lg:w-[375px]
        h-full
      "
    >
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

        <p
          className="
            mt-[12px]
            text-[13px] sm:text-[14px]
            leading-[1.4]
            text-[#444444]
            font-['Roboto',sans-serif]
            break-words
            max-h-[60px]
            overflow-hidden
          "
        >
          {preview}
        </p>

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
            cursor-pointer
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
    </Link>
  );
};

const News = () => {
  const [sort, setSort] = useState("new");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // грузим новости с бэка
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getNewsList({
          page: 1,
          page_size: 20,
        });

        if (cancelled) return;

        const results = Array.isArray(data.results) ? data.results : data;
        const mapped = (results || []).map(mapNewsItem);
        setItems(mapped);
      } catch (e) {
        console.error("Failed to load news", e);
        if (!cancelled) setError("Не удалось загрузить новости.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedNews = useMemo(() => {
    const arr = [...items];

    if (sort === "new") {
      return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sort === "popular") {
      return arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return arr;
  }, [sort, items]);

  return (
    <section className="w-full bg-[#F7F7FF]">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pb-[120px]">
        {/* Заголовок + селект */}
        <div
          className="
            flex flex-col
            sm:flex-row
            sm:items-start
            sm:justify-between
            gap-4
          "
        >
          <h2
            className="
              pt-[40px] sm:pt-[60px] lg:pt-[80px]
              font-['Roboto',sans-serif]
              font-normal
              text-[#111111]
              text-[28px] leading-[30px]
              sm:text-[32px] sm:leading-[34px]
              lg:text-[40px] lg:leading-[42px]
              text-center
              sm:text-left
            "
          >
            Новости
          </h2>

          <div
            className="
              pt-[24px]
              sm:pt-[60px]
              lg:pt-[80px]
              flex
              justify-center
              sm:justify-end
            "
          >
            <NewsSortSelect value={sort} onChange={setSort} />
          </div>
        </div>

        {error && (
          <p className="mt-6 text-[14px] text-[#E15241]">{error}</p>
        )}

        {/* карточки новостей */}
        <div
          className="
            mt-[40px] sm:mt-[60px] lg:mt-[82px]
            flex flex-wrap
            justify-center
            items-stretch
            gap-[20px]
          "
        >
          {loading && !items.length && !error && (
            <p className="text-[14px] text-[#777]">Загрузка новостей...</p>
          )}

          {!loading &&
            !error &&
            sortedNews.map((n) => <NewsCard key={n.id} item={n} />)}

          {!loading && !error && !sortedNews.length && (
            <p className="text-[14px] text-[#777]">Новостей пока нет.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;
