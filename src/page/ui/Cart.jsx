// src/page/ui/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopIcon from "../../assets/Search/shop.svg";

const Cart = ({
  id,
  slug,
  img,
  status,
  statusType = "in",
  title,
  price,
  onAddToCart,
  initialQty = 0,

  // для акций
  promotion = false,
  discount = null,
  oldPrice = null,

  // флаг новинки
  isNew = false,

  // флаг оптовой карточки
  isWholesale = false,
}) => {
  const [qty, setQty] = useState(initialQty);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [toastVisible, setToastVisible] = useState(false);

  const navigate = useNavigate();
  const isOut = statusType === "out";
  const statusColor = isOut ? "#E15241" : "#4CAF50";

  const numericPrice =
    price !== null && price !== undefined && !Number.isNaN(Number(price))
      ? Number(price)
      : 0;

  const numericOldPrice =
    oldPrice !== null &&
    oldPrice !== undefined &&
    !Number.isNaN(Number(oldPrice))
      ? Number(oldPrice)
      : null;

  const isPromo =
    !!promotion ||
    (typeof discount === "number" && discount > 0) ||
    (numericOldPrice && numericOldPrice > numericPrice);

  const formattedPrice = numericPrice.toLocaleString("ru-RU");
  const formattedOldPrice = numericOldPrice
    ? numericOldPrice.toLocaleString("ru-RU")
    : null;

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const dec = () =>
    setQty((n) => {
      if (n <= 0) return 0;
      return n - 1;
    });

  const inc = () => setQty((n) => n + 1);

  // если это оптовая карточка — добавляем ?wholesale=1
  const openProduct = () => {
    if (!slug && !id) return;
    const base = `/product/${slug || id}`;
    const qs = isWholesale ? "?wholesale=1" : "";
    navigate(base + qs);
  };

  const showToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleCartClick = () => {
    if (isOut) {
      showToast("error", "Товара нет в наличии");
      return;
    }

    if (qty <= 0) {
      showToast("error", "Укажите количество товара");
      return;
    }

    if (onAddToCart) {
      onAddToCart({
        id,
        slug,
        img,
        title,
        price: numericPrice,
        qty,
        promotion,
        discount,
        oldPrice: numericOldPrice,
        isWholesale,
      });
    }

    setQty(0);
    showToast("success", "Товар добавлен в корзину");
  };

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const priceTextClass = isPromo ? "text-[#E15241]" : "text-[#111111]";

  return (
    <>
      <div
        className="
          relative
          w-[235px] h-[405px]
          bg-white
          border border-[#E5E5EE]/80
          rounded-[4px]
          shadow-[0_8px_18px_rgba(15,23,42,0.06)]
          flex flex-col
        "
      >
        {/* Новинка сверху слева (если будет) */}
        {isNew && (
          <div className="absolute left-[12px] top-[10px] flex flex-wrap items-center gap-2">
            <span className="px-2 py-[2px] rounded-[999px] bg-[#000098] text-white text-[11px] leading-[1.1]">
              Новинка
            </span>
          </div>
        )}

        {/* Блок картинки + бейджи акции внутри картинки в левом нижнем углу */}
        <div
          className="
            mt-[20px] ml-[26px]
            w-[183px] h-[183px]
            relative
            flex items-center justify-center
            cursor-pointer
          "
          onClick={openProduct}
        >
          <img
            src={img}
            alt={title}
            className="w-[183px] h-[183px] object-contain"
          />

          {isPromo && (
            <div className="absolute left-[8px] bottom-[8px] flex flex-col items-start gap-[4px]">
              {typeof discount === "number" && discount > 0 && (
                <span className="px-2 py-[2px] rounded-[999px] bg-[#E15241] text-white text-[11px] leading-[1.1]">
                  -{discount}%
                </span>
              )}
              <span className="px-2 py-[2px] rounded-[999px] bg-white text-[#E15241] text-[11px] leading-[1.1] border border-[#E15241]">
                Акция
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col px-[26px] pt-[6px]">
          <p
            className="text-[12px] leading-[1.2]"
            style={{ color: statusColor }}
          >
            {status}
          </p>

          <p
            className="
              mt-[4px]
              text-[14px] leading-[1.2] text-[#111111]
              cursor-pointer
            "
            onClick={openProduct}
          >
            {title}
          </p>

          {/* цены под картинкой */}
          <div className="mt-[24px] flex items-baseline gap-2">
            <p className={`text-[17px] font-semibold ${priceTextClass}`}>
              {formattedPrice} c
            </p>
            {isPromo && formattedOldPrice && (
              <p className="text-[14px] text-[#8A8BA0] line-through">
                {formattedOldPrice} c
              </p>
            )}
          </div>

          <div className="mt-[20px] flex items-center">
            <div
              className="
                flex items-center justify-between
                w-[94px] h-[28px]
                rounded-[999px]
                bg-[#F5F5F8]
                text-[13px]
              "
            >
              <button
                type="button"
                onClick={dec}
                className="
                  w-[28px] h-[28px]
                  flex items-center justify-center
                  cursor-pointer
                "
              >
                -
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={inc}
                className="
                  w-[28px] h-[28px]
                  flex items-center justify-center
                  cursor-pointer
                "
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleCartClick}
              disabled={isOut}
              className={`
                ml-auto
                w-[34px] h-[34px]
                rounded-[14px]
                border border-[#D5D7F0]
                bg-[#F7F7FF]
                flex items-center justify-center
                cursor-pointer
                ${isOut ? "opacity-60 cursor-not-allowed" : ""}
              `}
              aria-label="В корзину"
            >
              <img
                src={ShopIcon}
                alt="Корзина"
                className="w-[17px] h-[18px] object-contain"
              />
            </button>
          </div>
        </div>
      </div>

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

export default Cart;
