// src/page/News/NewsDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsDetail, getNewsList } from "../../api/news";
import { NewsCard } from "./News";
import NewsImg from "../../assets/News/News.png";

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
    fullText: n.content || n.full_text || n.text || "",
    img: n.image_url || n.image || n.img || NewsImg,
    date,
    views: n.views ?? 0,
  };
};

const NewsDetail = () => {
  const { slug } = useParams();

  const [current, setCurrent] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Некорректный идентификатор новости");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const detail = await getNewsDetail(slug);
        if (cancelled) return;
        const mappedDetail = mapNewsItem(detail);
        setCurrent(mappedDetail);

        const listData = await getNewsList({ page: 1, page_size: 6 });
        if (cancelled) return;

        const results = Array.isArray(listData.results)
          ? listData.results
          : listData;

        const mapped = (results || [])
          .map(mapNewsItem)
          .filter((n) => n.slug !== mappedDetail.slug);

        setOtherNews(mapped);
      } catch (e) {
        console.error("Failed to load news detail", e);
        if (!cancelled) {
          setError("Не удалось загрузить новость.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="w-full bg-[#F7F7FF]">
        <div className="mx-auto max-w-[1200px] px-3 sm:px-4 py-[80px]">
          <p className="text-[14px] text-[#777]">Загрузка новости...</p>
        </div>
      </section>
    );
  }

  if (error || !current) {
    return (
      <section className="w-full bg-[#F7F7FF]">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-[80px]">
          <p className="mb-4 text-[14px] text-[#E15241]">
            {error || "Новость не найдена."}
          </p>
          <Link to="/news" className="text-[#7BE241] underline text-sm">
            Вернуться к новостям
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F7F7FF]">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pb-[120px] pt-[40px] sm:pt-[60px] lg:pt-[80px]">
        {/* верхняя часть: картинка слева, текст справа */}
        <div className="flex flex-col sm:flex-row gap-[40px] mt-0">
          <div className="w-full sm:w-[360px] flex justify-center">
            <img
              src={current.img}
              alt={current.title}
              className="
                w-full
                max-w-[360px]
                h-[220px]
                xs:h-[260px]
                sm:h-auto
                object-cover
                rounded-[4px]
              "
            />
          </div>

          <div className="flex-1">
            <h1
              className="
                text-[28px] sm:text-[32px] lg:text-[38px]
                leading-[1.2]
                font-['Roboto',sans-serif]
                font-semibold
                text-[#111111]
                mb-[8px]
              "
            >
              {current.title}
            </h1>

            <p className="text-[13px] text-[#777777] mb-[24px]">
              {new Date(current.date).toLocaleDateString("ru-RU")}
            </p>

            <p className="text-[15px] leading-[1.6] text-[#333333] whitespace-pre-line">
              {current.fullText || current.text}
            </p>
          </div>
        </div>

        {/* блок "Другие новости" */}
        {!!otherNews.length && (
          <div className="mt-[50px]">
            <h2
              className="
                text-[22px]
                font-semibold
                font-['Roboto',sans-serif]
                mb-[24px]
              "
            >
              Другие новости
            </h2>

            <div className="flex flex-wrap gap-[20px]">
              {otherNews.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>

            <div className="mt-[48px] flex justify-center">
              <Link
                to="/news"
                className="
                  inline-flex items-center gap-[8px]
                  text-[13px]
                  font-['Roboto',sans-serif]
                  text-[#7BE241]
                  hover:text-[#C0392B]
                  group
                  cursor-pointer
                  transition-colors
                "
              >
                <span>Все новости</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-current group-hover:text-[#C0392B]"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsDetail;
