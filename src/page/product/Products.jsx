// src/page/product/Products.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import NoteImg from "../../assets/NewProducts/note.svg";
import Next from "../../assets/NewProducts/next.svg"; // иконка вправо
import Peret from "../../assets/NewProducts/peret.svg"; // иконка влево
import { getProduct } from "../../api/catalog";

// основная картинка, если нужно быстро взять одну
const getProductImage = (product) => {
  if (!product || typeof product !== "object") return NoteImg;

  if (product.main_image) return product.main_image;
  if (product.image) return product.image;
  if (product.photo) return product.photo;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const imgObj = product.images[0];

    if (typeof imgObj === "string") return imgObj;
    if (imgObj.image_url) return imgObj.image_url;
    if (imgObj.main_image) return imgObj.main_image;
    if (imgObj.image) return imgObj.image;
    if (imgObj.photo) return imgObj.photo;
    if (imgObj.file) return imgObj.file;
    if (imgObj.url) return imgObj.url;
  }

  return NoteImg;
};

// полный список картинок для галереи
const getProductImages = (product) => {
  const urls = [];
  const push = (url) => {
    if (url && typeof url === "string" && !urls.includes(url)) {
      urls.push(url);
    }
  };

  if (!product || typeof product !== "object") {
    push(NoteImg);
    return urls;
  }

  // main_image + базовые поля
  push(product.main_image);
  push(product.image);
  push(product.photo);

  if (Array.isArray(product.images)) {
    product.images.forEach((imgObj) => {
      if (!imgObj) return;
      if (typeof imgObj === "string") {
        push(imgObj);
      } else {
        push(imgObj.image_url);
        push(imgObj.image);
        push(imgObj.main_image);
        push(imgObj.photo);
        push(imgObj.file);
        push(imgObj.url);
      }
    });
  }

  if (!urls.length) push(NoteImg);
  return urls;
};

const Products = ({ onAddToCart = () => {} }) => {
  const { id } = useParams(); // /product/:id или /product/:slug
  const location = useLocation();

  // режим:
  // /product/1              -> обычный
  // /product/1?wholesale=1  -> оптовый
  const isWholesaleView =
    new URLSearchParams(location.search).get("wholesale") === "1";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [toastVisible, setToastVisible] = useState(false);

  // активная картинка в галерее
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // реф + состояние для вертикального drag-скролла превью
  const thumbsRef = useRef(null);
  const thumbsDragRef = useRef({
    isDown: false,
    startY: 0,
    scrollTop: 0,
  });

  const dec = () => setQty((n) => (n > 0 ? n - 1 : 0));
  const inc = () => setQty((n) => n + 1);

  const showToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);
  };

  // грузим товар по id или slug (бэк принимает строку)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setProduct(null);
        setError("Товар не найден");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id); // id или slug — не важно
        if (cancelled) return;

        setProduct(data);
      } catch (e) {
        console.error("Failed to load product", e);
        if (!cancelled) {
          setError("Не удалось загрузить товар");
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // сбрасываем активную картинку при смене товара
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  const mapped = useMemo(() => {
    if (!product) {
      return {
        title: "",
        descriptionHtml: "",
        characteristics: [],
        price: 0,
        inStock: false,
        stockLabel: "",
        stockQty: null,
        img: NoteImg,
        promotion: false,
        discount: null,
        oldPrice: null,
      };
    }

    // ====== ЛОГИКА ЦЕНЫ ======
    const wholesaleRaw = product.wholesale_price;
    const wholesale =
      wholesaleRaw !== null &&
      wholesaleRaw !== undefined &&
      !Number.isNaN(Number(wholesaleRaw)) &&
      Number(wholesaleRaw) > 0
        ? Number(wholesaleRaw)
        : null;

    const basePrice =
      product.price !== null &&
      product.price !== undefined &&
      !Number.isNaN(Number(product.price)) &&
      Number(product.price) > 0
        ? Number(product.price)
        : null;

    // если есть и обычная, и оптовая:
    //  - /product/:id              -> basePrice
    //  - /product/:id?wholesale=1  -> wholesale
    const useWholesalePrice = isWholesaleView && wholesale !== null;

    const price = useWholesalePrice
      ? wholesale
      : basePrice !== null
      ? basePrice
      : wholesale !== null
      ? wholesale
      : 0;
    // ====== /ЛОГИКА ЦЕНЫ ======

    const inStock = !!product.is_available;

    const stockRaw =
      product.stock ?? product.quantity ?? product.available_qty ?? null;

    let stockQty = null;
    if (stockRaw !== null && !Number.isNaN(Number(stockRaw))) {
      stockQty = Number(stockRaw);
    }

    const stockLabel = inStock
      ? stockQty
        ? `На складе ${stockQty} шт`
        : "В наличии"
      : "Нет в наличии";

    const oldPrice =
      product.old_price && !Number.isNaN(Number(product.old_price))
        ? Number(product.old_price)
        : null;

    const discount =
      typeof product.discount === "number" && !Number.isNaN(product.discount)
        ? product.discount
        : null;

    const promotion = !!product.promotion;

    const imgUrl = getProductImage(product);

    // ====== ОПИСАНИЕ (HTML из админки) ======
    let descriptionHtml =
      product.description ||
      product.full_description ||
      product.content ||
      product.text ||
      "";

    if (!descriptionHtml) {
      descriptionHtml = "Описание товара будет доступно позже.";
    }

    // ====== ХАРАКТЕРИСТИКИ ======
    const characteristics = [];
    const pushChar = (name, value) => {
      if (!name && !value) return;
      characteristics.push({
        name: String(name || "").trim(),
        value: String(value || "").trim(),
      });
    };

    const charSources = [
      product.characteristics,
      product.characteristics_list,
      product.characteristics_items,
    ];

    charSources.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((ch) => {
        if (!ch) return;
        if (typeof ch === "string") {
          pushChar(ch, "");
          return;
        }
        const name =
          ch.name || ch.title || ch.key || ch.characteristic || "";
        const value =
          ch.value ||
          ch.val ||
          ch.text ||
          ch.description ||
          ch.value_display ||
          "";
        pushChar(name, value);
      });
    });

    return {
      title: product.name || "Товар",
      descriptionHtml,
      characteristics,
      price,
      inStock,
      stockLabel,
      stockQty,
      img: imgUrl,
      promotion,
      discount,
      oldPrice,
    };
  }, [product, isWholesaleView]);

  // список картинок для галереи
  const galleryImages = useMemo(
    () => getProductImages(product),
    [product]
  );

  const handleCartClick = () => {
    if (!product) {
      showToast("error", "Товар ещё не загрузился");
      return;
    }

    if (qty <= 0) {
      showToast("error", "Укажите количество товара");
      return;
    }

    if (product.is_available === false) {
      showToast("error", "Товар недоступен для заказа");
      return;
    }

    // в корзину кладём первую картинку из галереи
    const imgUrl = galleryImages[0] || getProductImage(product);

    // ТА ЖЕ ЛОГИКА ЦЕНЫ, ЧТО И В mapped
    const wholesaleRaw = product.wholesale_price;
    const wholesale =
      wholesaleRaw !== null &&
      wholesaleRaw !== undefined &&
      !Number.isNaN(Number(wholesaleRaw)) &&
      Number(wholesaleRaw) > 0
        ? Number(wholesaleRaw)
        : null;

    const basePrice =
      product.price !== null &&
      product.price !== undefined &&
      !Number.isNaN(Number(product.price)) &&
      Number(product.price) > 0
        ? Number(product.price)
        : null;

    const useWholesalePrice = isWholesaleView && wholesale !== null;

    const finalPrice = useWholesalePrice
      ? wholesale
      : basePrice !== null
      ? basePrice
      : wholesale !== null
      ? wholesale
      : 0;

    onAddToCart({
      id: product.id,
      slug: product.slug,
      img: imgUrl,
      title: product.name,
      price: finalPrice,
      qty,
      promotion: !!product.promotion,
      discount:
        typeof product.discount === "number" ? product.discount : null,
      oldPrice: product.old_price ? Number(product.old_price) : null,
      isWholesale: useWholesalePrice, // различаем в корзине
    });

    setQty(0);
    showToast("success", "Товар добавлен в корзину");
  };

  // переключение картинок стрелками (главная картинка)
  const goPrevImage = () => {
    if (!galleryImages.length) return;
    setActiveImageIndex((prev) =>
      prev <= 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goNextImage = () => {
    if (!galleryImages.length) return;
    setActiveImageIndex((prev) =>
      prev >= galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  // drag-скролл превью (вертикальный)
  const handleThumbsMouseDown = (e) => {
    const el = thumbsRef.current;
    if (!el) return;
    thumbsDragRef.current.isDown = true;
    thumbsDragRef.current.startY = e.clientY;
    thumbsDragRef.current.scrollTop = el.scrollTop;
  };

  const handleThumbsMouseUp = () => {
    thumbsDragRef.current.isDown = false;
  };

  const handleThumbsMouseLeave = () => {
    thumbsDragRef.current.isDown = false;
  };

  const handleThumbsMouseMove = (e) => {
    const el = thumbsRef.current;
    if (!el) return;
    if (!thumbsDragRef.current.isDown) return;

    e.preventDefault();
    const y = e.clientY;
    const walk = y - thumbsDragRef.current.startY;
    el.scrollTop = thumbsDragRef.current.scrollTop - walk;
  };

  // автоскрытие тоста
  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-[80px] pb-[80px]">
          <p className="text-[14px] text-[#777]">Загрузка товара…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-[80px] pb-[80px]">
          <p className="text-[14px] text-[#E15241]">{error}</p>
        </div>
      </section>
    );
  }

  const hasPromo =
    mapped.promotion ||
    (typeof mapped.discount === "number" && mapped.discount > 0) ||
    (mapped.oldPrice && mapped.oldPrice > mapped.price);

  const activeImage =
    galleryImages[activeImageIndex] || mapped.img || NoteImg;

  return (
    <>
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-[68px]">
          <div className="mt-[26px] flex flex-col lg:flex-row lg:items-start gap-[40px] lg:gap-[80px]">
            {/* левая колонка — галерея */}
            <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
              <div className="flex items-start gap-4 w-full justify-center lg:justify-start max-w-full">
                {/* вертикальная колонка превью */}
                {galleryImages.length > 1 && (
                  <div className="hidden sm:flex flex-col items-center w-[80px] h-[440px]">
                    <div
                      ref={thumbsRef}
                      onMouseDown={handleThumbsMouseDown}
                      onMouseUp={handleThumbsMouseUp}
                      onMouseLeave={handleThumbsMouseLeave}
                      onMouseMove={handleThumbsMouseMove}
                      className="
                        h-full
                        flex flex-col gap-2
                        overflow-y-auto
                        no-scrollbar
                        w-full px-2
                        cursor-default
                        select-none
                      "
                    >
                      {galleryImages.map((url, idx) => (
                        <button
                          key={url || idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`
                            mx-auto
                            w-[70px] h-[60px]
                            rounded-[8px]
                            border
                            flex items-center justify-center
                            bg-white
                            overflow-hidden
                            ${
                              idx === activeImageIndex
                                ? "border-[#7ED957]"
                                : "border-[#E5E5EE]"
                            }
                          `}
                        >
                          <img
                            src={url}
                            alt={`Изображение ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* основная картинка */}
                <div
                  className="
                    relative
                    w-[440px] h-[440px]
                    bg-[#F5F5F8]
                    rounded-[12px]
                    flex items-center justify-center
                    overflow-hidden
                  "
                >
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goPrevImage}
                        className="
                          absolute left-3 top-1/2
                          -translate-y-1/2
                          w-9 h-9
                          flex items-center justify-center
                          cursor-pointer
                        "
                      >
                        <img
                          src={Peret}
                          alt="Назад"
                          className="w-5 h-5 object-contain"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={goNextImage}
                        className="
                          absolute right-3 top-1/2
                          -translate-y-1/2
                          w-9 h-9
                          flex items-center justify-center
                          cursor-pointer
                        "
                      >
                        <img
                          src={Next}
                          alt="Вперёд"
                          className="w-5 h-5 object-contain"
                        />
                      </button>
                    </>
                  )}

                  <img
                    src={activeImage}
                    alt={mapped.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* мобильная карусель */}
              {galleryImages.length > 1 && (
                <div
                  className="
                    mt-3
                    w-full
                    flex sm:hidden
                    items-center gap-2
                    overflow-x-auto no-scrollbar
                    px-1
                  "
                >
                  {galleryImages.map((url, idx) => (
                    <button
                      key={url || idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`
                        flex-shrink-0
                        w-[70px] h-[60px]
                        rounded-[8px]
                        border
                        flex items-center justify-center
                        bg-white
                        overflow-hidden
                        ${
                          idx === activeImageIndex
                            ? "border-[#7ED957]"
                            : "border-[#E5E5EE]"
                        }
                      `}
                    >
                      <img
                        src={url}
                        alt={`Изображение ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* правая колонка — текст и управление */}
            <div className="flex-1 min-w-0">
              <h1
                className="
                  mt-[40px] lg:mt-[48px]
                  text-[32px] sm:text-[36px] lg:text-[48px]
                  leading-[1.2] text-[#111111]
                "
              >
                {mapped.title}
              </h1>

              <p className="mt-[34px] text-[14px] text-[#111111]">
                Описание
              </p>

              <div
                className="mt-[16px] text-[13px] leading-[1.6] text-[#111111] max-w-[600px]"
                dangerouslySetInnerHTML={{ __html: mapped.descriptionHtml }}
              />

              <div className="mt-[60px] flex flex-col gap-[18px]">
                <div className="flex flex-wrap items-center gap-[27px] gap-y-4">
                  <div
                    className="
                      flex items-center justify-between
                      w-[88px] h-[30px]
                      rounded-[15px]
                      bg-[#F5F5F8]
                      text-[14px]
                    "
                  >
                    <button
                      type="button"
                      onClick={dec}
                      className="w-[28px] h-[30px] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={inc}
                      className="w-[28px] h-[30px] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-[16px]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-semibold text-[#111111]">
                        {mapped.price.toLocaleString("ru-RU")} c
                      </span>
                      {hasPromo && mapped.oldPrice && (
                        <span className="text-[14px] text-[#8A8BA0] line-through">
                          {mapped.oldPrice.toLocaleString("ru-RU")} c
                        </span>
                      )}
                    </div>

                    {hasPromo && (
                      <>
                        <span className="px-3 py-[4px] rounded-[999px] bg-[#E15241] text-white text-[12px] leading-none">
                          Акция
                        </span>
                        {typeof mapped.discount === "number" &&
                          mapped.discount > 0 && (
                            <span className="px-3 py-[4px] rounded-[999px] bg-[#FFE5E0] text-[#E15241] text-[12px] leading-none">
                              -{mapped.discount}%
                            </span>
                          )}
                      </>
                    )}

                    <span
                      className="text-[12px]"
                      style={{
                        color: mapped.inStock ? "#4CAF50" : "#E15241",
                      }}
                    >
                      {mapped.inStock ? "В наличии" : "Нет в наличии"}
                      {mapped.inStock && mapped.stockQty
                        ? ` • ${mapped.stockQty} шт`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCartClick}
                disabled={!mapped.inStock}
                className={`
                  mt-[23px]
                  inline-flex items-center justify-center gap-[8px]
                  w-[209px] h-[51px]
                  rounded-[6px]
                  text-white text-[14px]
                  transition-colors
                  ${
                    mapped.inStock
                      ? "bg-[#7ED957] hover:bg-[#6ACD4C]"
                      : "bg-[#C0C0C0] cursor-not-allowed"
                  }
                `}
              >
                В корзину
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <path d="M9 6l-1-3H4" />
                  <circle cx="10" cy="19" r="1" />
                  <circle cx="17" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Характеристики */}
          <div className="mt-[100px] mb-[121px]">
            <div
              className="
                rounded-[12px]
                border border-[#E5E5EE]
                bg-white
                pt-[14px] pr-[32px] pb-[37px] pl-[32px]
              "
            >
              <h2 className="text-[16px] font-semibold text-[#111111]">
                Характеристики
              </h2>

              {mapped.characteristics && mapped.characteristics.length > 0 ? (
                <div className="mt-[23px] space-y-[8px] text-[13px] text-[#111111]">
                  {mapped.characteristics.map((ch, idx) => (
                    <div
                      key={`${ch.name}_${idx}`}
                      className="
                        flex flex-wrap
                        items-baseline
                        gap-x-2 gap-y-1
                        border-b border-[#F0F0F5]
                        pb-[6px]
                      "
                    >
                      {ch.name && (
                        <span className="font-medium">{ch.name}</span>
                      )}
                      {ch.value && (
                        <span className="text-[#555555]">
                          {ch.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-[23px] text-[13px] leading-[1.6] text-[#111111]">
                  Характеристики товара будут доступны позже.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {toastMessage && toastVisible && (
        <>
          <style>{`
            @keyframes toast-bottom-slide-shake {
              0% {
                transform: translate(-50%, 120%);
                opacity: 0;
              }
              15% {
                transform: translate(-50%, 0);
                opacity: 1;
              }
              30% {
                transform: translate(-52%, 0);
              }
              45% {
                transform: translate(-48%, 0);
              }
              60% {
                transform: translate(-51%, 0);
              }
              75% {
                transform: translate(-49%, 0);
              }
              90% {
                transform: translate(-50%, 0);
                opacity: 1;
              }
              100% {
                transform: translate(-50%, 120%);
                opacity: 0;
              }
            }
            .toast-bottom-anim {
              animation: toast-bottom-slide-shake 2s ease-in-out forwards;
            }
          `}</style>

          <div
            className={`
              fixed left-1/2 bottom-4 z-[999]
              max-w-[90%] sm:max-w-sm
              px-4 py-3
              text-white text-[13px]
              shadow-[0_8px_18px_rgba(0,0,0,0.25)]
              rounded-[4px]
              flex items-center justify-between gap-4
              ${toastType === "error" ? "bg-[#E15241]" : "bg-[#4CAF50]"}
              toast-bottom-anim
            `}
          >
            <span className="leading-snug">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="text-white/80 hover:text-white text-[16px] leading-none"
            >
              ×
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Products;
