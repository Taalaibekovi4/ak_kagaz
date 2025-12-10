// src/page/checkout/CheckoutPage.jsx
import React, { useMemo, useState } from "react";
import NoteImg from "../../assets/NewProducts/note.svg";
import { createOrder } from "../../api/order";

// items и setItems приходят извне (из App.jsx)
const CheckoutPage = ({ items, setItems }) => {
  const safeItems = Array.isArray(items) ? items : [];

  // тип лица по swagger: individual | legal
  const [personType, setPersonType] = useState("individual");
  // тип доставки: pickup | courier
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [submitting, setSubmitting] = useState(false);

  // поля формы
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [extraPhone, setExtraPhone] = useState("");

  const [street, setStreet] = useState("");
  const [flat, setFlat] = useState("");
  const [house, setHouse] = useState("");
  const [deliveryComment, setDeliveryComment] = useState("");

  // ошибки по полям
  const [errors, setErrors] = useState({});

  const totals = useMemo(() => {
    const totalQty = safeItems.reduce((s, i) => s + (i.qty || 0), 0);
    const totalSum = safeItems.reduce(
      (s, i) => s + (i.qty || 0) * (i.price || 0),
      0
    );
    return { totalQty, totalSum };
  }, [safeItems]);

  // +/- в корзине — учитываем id + isWholesale,
  // и при qty=0 по минусу строку удаляем
  const changeQty = (id, isWholesale, delta) => {
    if (!setItems) return;
    setItems((prev) => {
      const updated = prev.map((i) => {
        if (i.id !== id || !!i.isWholesale !== !!isWholesale) return i;
        const newQty = Math.max(0, (i.qty || 0) + delta);
        return { ...i, qty: newQty };
      });

      // удаляем строки с qty=0
      return updated.filter((i) => (i.qty || 0) > 0);
    });
  };

  // ручной ввод количества — не удаляем строку при 0,
  // только меняем qty (удаление только через "-" до 0 или крестик)
  const handleQtyInput = (id, isWholesale) => (e) => {
    if (!setItems) return;
    const raw = e.target.value;
    const cleaned = raw.replace(/\D/g, "");
    const qtyNum = cleaned === "" ? 0 : Number(cleaned);

    setItems((prev) =>
      prev.map((i) =>
        i.id === id && !!i.isWholesale === !!isWholesale
          ? { ...i, qty: Math.max(0, qtyNum) }
          : i
      )
    );
  };

  const removeItem = (id, isWholesale) => {
    if (!setItems) return;
    setItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && !!i.isWholesale === !!isWholesale)
      )
    );
  };

  // не даём вводить буквы в телефонах
  const handlePhoneChange = (setter) => (e) => {
    const raw = e.target.value;
    // только цифры и плюс
    const cleaned = raw.replace(/[^0-9+]/g, "");
    setter(cleaned);
  };

  const validate = () => {
    const newErrors = {};

    const cartItems = safeItems.filter((i) => (i.qty || 0) > 0);
    if (!cartItems.length) {
      newErrors.items = "В корзине должен быть хотя бы один товар";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "Укажите имя";
    }

    if (!phone.trim()) {
      newErrors.phone = "Укажите телефон";
    } else if (phone.replace(/\D/g, "").length < 9) {
      newErrors.phone = "Телефон слишком короткий";
    }

    if (email.trim()) {
      // простая проверка email
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.trim())) {
        newErrors.email = "Некорректный email";
      }
    }

    if (!personType) {
      newErrors.personType = "Выберите тип лица";
    }

    if (!deliveryType) {
      newErrors.deliveryType = "Выберите тип доставки";
    }

    // если курьер — адрес обязателен
    if (deliveryType === "courier") {
      if (!street.trim()) {
        newErrors.street = "Укажите улицу";
      }
      if (!house.trim()) {
        newErrors.house = "Укажите дом";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const cartItems = safeItems.filter((i) => (i.qty || 0) > 0);

    // валидируем
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        first_name: firstName || "",
        last_name: lastName || "",
        phone: phone.trim(),
        email: email.trim() || "",
        extra_phone: extraPhone.trim() || "",
        person_type: personType, // individual | legal
        delivery_type: deliveryType, // pickup | courier
        street: street || "",
        house: house || "",
        flat: flat || "",
        delivery_comment: deliveryComment || "",
        items: cartItems.map((i) => ({
          product_id: i.id,
          quantity: i.qty || 1,
        })),
      };

      await createOrder(payload);

      // очистить корзину
      if (setItems) setItems([]);
      // очистить форму
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setExtraPhone("");
      setStreet("");
      setFlat("");
      setHouse("");
      setDeliveryComment("");
      setErrors({});

      alert("Заказ успешно оформлен");
    } catch (e) {
      console.error("Ошибка при создании заказа", e);
      alert("Не удалось оформить заказ, попробуйте ещё раз");
    } finally {
      setSubmitting(false);
    }
  };

  // вспомогательная функция для инпутов — красная рамка при ошибке
  const inputClass = (hasError) =>
    `h-[40px] rounded-[8px] border px-3 text-[13px] outline-none focus:border-[#000098] w-full ${
      hasError ? "border-[#E15241]" : "border-[#DADCE5]"
    }`;

  return (
    <main className="w-full bg-[#F7F7FF] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-4 pb-[103px]">
        {/* отступ до заголовка 66px */}
        <h1 className="pt-[40px] sm:pt-[66px] text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.1] text-[#111]">
          Оформление заказа
        </h1>

        {/* ОБЩАЯ СЕТКА: слева — колонка 811px, справа — сумма */}
        <div className="mt-[40px] lg:mt-[80px] flex flex-col lg:flex-row gap-[20px] items-start">
          {/* ЛЕВЫЙ СТОЛБЕЦ 811px: Корзина + формы */}
          <div className="w-full lg:w-[811px] flex flex-col gap-[30px]">
            {/* ==== КОРЗИНА ==== */}
            <section className="w-full bg-white rounded-[12px] shadow-[0_6px_18px_rgba(15,23,42,0.06)] border border-[#ECECF5]">
              <div className="px-[16px] sm:px-[25px] pt-[20px] sm:pt-[25px] pb-[25px] sm:pb-[35px]">
                <h2 className="text-[20px] sm:text-[22px] font-semibold mb-[20px] sm:mb-[25px]">
                  Корзина
                </h2>

                {errors.items && (
                  <p className="mb-2 text-[12px] text-[#E15241]">
                    {errors.items}
                  </p>
                )}

                {safeItems.length === 0 ? (
                  <p className="text-[14px] text-[#777]">
                    В корзине пока нет товаров.
                  </p>
                ) : (
                  <>
                    {/* заголовок таблицы (только на md+) */}
                    <div className="hidden md:flex text-[13px] text-[#555] mb-[20px] sm:mb-[25px]">
                      <div className="w-[80px]">Фото</div>
                      <div className="flex-1">Название</div>
                      <div className="w-[160px] text-center">Количество</div>
                      <div className="w-[90px] text-right pr-[24px]">
                        Цена
                      </div>
                      <div className="w-[24px]" />
                    </div>

                    <div className="space-y-[18px]">
                      {safeItems.map((item) => (
                        <div
                          key={`${item.id}-${item.isWholesale ? "wh" : "rt"}`}
                          className="border-t border-[#F0F0F5] pt-[16px] md:pt-[18px] flex flex-col md:flex-row md:items-center gap-[10px] md:gap-0"
                        >
                          {/* фото */}
                          <div className="w-full md:w-[80px] flex justify-start md:justify-center">
                            <img
                              src={item.img || NoteImg}
                              alt={item.title}
                              className="w-[48px] h-[64px] object-contain"
                            />
                          </div>

                          {/* название */}
                          <div className="flex-1 text-[13px] leading-[1.4] text-[#111]">
                            {item.title}
                            {item.isWholesale && (
                              <div className="mt-[4px] text-[11px] text-[#4CAF50]">
                                Оптовый товар
                              </div>
                            )}
                          </div>

                          {/* количество */}
                          <div className="w-full md:w-[160px] flex justify-start md:justify-center mt-[4px] md:mt-0">
                            <div className="flex items-center justify-between w-[130px] md:w-[110px] h-[34px] md:h-[30px] rounded-full bg-[#F5F5F8] text-[13px] px-2">
                              <button
                                type="button"
                                className="w-[28px] h-full flex items-center justify-center"
                                onClick={() =>
                                  changeQty(item.id, item.isWholesale, -1)
                                }
                              >
                                -
                              </button>

                              <input
                                type="text"
                                value={item.qty ?? 0}
                                onChange={handleQtyInput(
                                  item.id,
                                  item.isWholesale
                                )}
                                className="
                                  w-[48px]
                                  text-center
                                  bg-transparent
                                  outline-none
                                  text-[13px]
                                "
                              />

                              <button
                                type="button"
                                className="w-[28px] h-full flex items-center justify-center"
                                onClick={() =>
                                  changeQty(item.id, item.isWholesale, 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* цена + крестик */}
                          <div className="flex items-center justify-between md:justify-end gap-[8px] w-full md:w-[114px]">
                            <div className="text-right text-[15px] font-medium text-[#111] md:pr-[24px]">
                              {(item.price || 0) * (item.qty || 0)} c
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id, item.isWholesale)
                              }
                              className="w-[24px] h-[24px] flex items-center justify-center text-[#E15241] text-[18px]"
                              aria-label="Удалить"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ==== ОФОРМЛЕНИЕ ЗАКАЗА ==== */}
            <section
              className="
                w-full
                bg-white
                rounded-[12px]
                shadow-[0_6px_18px_rgba(15,23,42,0.06)]
                border border-[#ECECF5]
                px-[16px] sm:px-[25px] pt-[20px] sm:pt-[25px] pb-[20px] sm:pb-[25px]
                box-border
              "
            >
              <h2 className="text-[20px] sm:text-[22px] font-semibold mb-[20px] sm:mb-[25px]">
                Оформление заказа
              </h2>

              <div className="grid gap-[12px] sm:gap-[16px] md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass(!!errors.firstName)}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-[11px] text-[#E15241]">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Телефон"
                    value={phone}
                    onChange={handlePhoneChange(setPhone)}
                    className={inputClass(!!errors.phone)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-[#E15241]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-[#E15241]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    type="tel"
                    placeholder="Доп телефон"
                    value={extraPhone}
                    onChange={handlePhoneChange(setExtraPhone)}
                    className={inputClass(false)}
                  />
                </div>
              </div>
            </section>

            {/* ==== Я ==== */}
            <section
              className="
                w-full
                bg-white
                rounded-[12px]
                shadow-[0_6px_18px_rgba(15,23,42,0.06)]
                border border-[#ECECF5]
                px-[16px] sm:px-[25px] pt-[20px] sm:pt-[25px] pb-[20px] sm:pb-[25px]
                box-border
              "
            >
              <h2 className="text-[20px] sm:text-[22px] font-semibold mb-[16px] sm:mb-[20px]">
                Я
              </h2>

              {errors.personType && (
                <p className="mb-1 text-[11px] text-[#E15241]">
                  {errors.personType}
                </p>
              )}

              <div className="space-y-[10px] text-[14px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="personType"
                    value="individual"
                    checked={personType === "individual"}
                    onChange={(e) => setPersonType(e.target.value)}
                  />
                  <span>Физическое лицо</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="personType"
                    value="legal"
                    checked={personType === "legal"}
                    onChange={(e) => setPersonType(e.target.value)}
                  />
                  <span>Юридическое лицо</span>
                </label>
              </div>
            </section>

            {/* ==== ДОСТАВКА ==== */}
            <section
              className="
                w-full
                bg-white
                rounded-[12px]
                shadow-[0_6px_18px_rgба(15,23,42,0.06)]
                border border-[#ECECF5]
                px-[16px] sm:px-[25px] pt-[20px] sm:pt-[25px] pb-[20px] sm:pb-[25px]
                box-border
              "
            >
              <h2 className="text-[20px] sm:text-[22px] font-semibold mb-[16px] sm:mb-[20px]">
                Доставка
              </h2>

              {errors.deliveryType && (
                <p className="mb-1 text-[11px] text-[#E15241]">
                  {errors.deliveryType}
                </p>
              )}

              <div className="space-y-[10px] text-[14px] mb-[16px] sm:mb-[20px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === "pickup"}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  />
                  <span>Самовывоз</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="courier"
                    checked={deliveryType === "courier"}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  />
                  <span>Курьерская доставка</span>
                </label>
              </div>

              <div className="grid gap-[12px] sm:gap-[16px] md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Улица"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={inputClass(!!errors.street)}
                  />
                  {errors.street && (
                    <p className="mt-1 text-[11px] text-[#E15241]">
                      {errors.street}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Квартира"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className={inputClass(false)}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Дом"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className={inputClass(!!errors.house)}
                  />
                  {errors.house && (
                    <p className="mt-1 text-[11px] text-[#E15241]">
                      {errors.house}
                    </p>
                  )}
                </div>
              </div>

              <textarea
                placeholder="Комментарий"
                value={deliveryComment}
                onChange={(e) => setDeliveryComment(e.target.value)}
                className="
                  mt-[16px]
                  w-full h-[80px]
                  rounded-[8px]
                  border border-[#DADCE5]
                  px-3 py-2 text-[13px]
                  outline-none focus:border-[#000098]
                "
              />
            </section>
          </div>

          {/* ПРАВЫЙ СТОЛБЕЦ: СУММА */}
          <aside
            className="
              w-full lg:w-[340px]
              bg-white
              rounded-[12px]
              shadow-[0_6px_18px_rgба(15,23,42,0.06)]
              border border-[#ECECF5]
              px-[20px] sm:px-[25px] pt-[20px] sm:pt-[25px] pb-[24px] sm:pb-[30px]
              lg:sticky lg:top-[130px]
            "
          >
            <h2 className="text-[22px] font-semibold mb-[20px]">Сумма</h2>

            <div className="flex items-center justify-between text-[13px] mb-[20px]">
              <span>Товаров({totals.totalQty})</span>
              <span>{totals.totalSum} c</span>
            </div>

            <hr className="border-[#ECECF5] mb-[22px]" />

            <div className="flex items-center justify-between text-[18px] font-semibold mb-[22px]">
              <span>Итого</span>
              <span>{totals.totalSum} c</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="
                w-full h-[51px]
                rounded-[8px]
                bg-[#8DE44F]
                text-white text-[15px] font-medium
                hover:bg-[#7bd43f]
                transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {submitting ? "Отправка..." : "Подтвердить заказ"}
            </button>

            <p className="mt-[16px] text-[11px] text-center text-[#666] leading-[1.4]">
              Подтверждая заказ, я принимаю условия пользовательского
              соглашения
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
