// src/page/catalog/zzzz.jsx
import React, { useEffect, useMemo, useState } from "react";
import Cart from "../ui/Cart";

import SelectIcon from "../../assets/Catalog/select.svg";
import NoteImg from "../../assets/Catalog/note.svg";
import { getProducts, getCategories } from "../../api/catalog";

const SORT_OPTIONS = [
  "Сначала новые",
  "Популярные",
  "Цена по убыванию",
  "Цена по возрастанию",
];

// ДОБАВИЛ: oldPrice / discount / promotion / isNew
const mapProductToCard = (p) => ({
  id: p.id,
  slug: p.slug,
  img: p.main_image || NoteImg,
  status: p.is_available ? "В наличии" : "Нет в наличии",
  statusType: p.is_available ? "in" : "out",
  title: p.name,
  price: Number(p.price) || 0,
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
  isNew: !!p.is_new, // если поле появится на бэке — сразу заработает
  category_id: p.category_id,
});

// строим дерево по parent (если бэк вернёт плоский список)
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

// рекурсивно собираем id всей ветки
const collectSubtreeIds = (cat, acc) => {
  acc.push(cat.id);
  if (Array.isArray(cat.children)) {
    cat.children.forEach((child) => collectSubtreeIds(child, acc));
  }
};

const NewsPage = ({ onAddToCart = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("Сначала новые");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // категории
  const [categories, setCategories] = useState([]); // дерево
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // режим фильтра: null | "tree" | "single"
  const [categoryFilterMode, setCategoryFilterMode] = useState(null);
  // все id в выбранной ветке (для режима tree)
  const [activeTreeIds, setActiveTreeIds] = useState([]);

  // какие категории раскрыты
  const [expandedIds, setExpandedIds] = useState([]);

  const isExpanded = (id) => expandedIds.includes(id);
  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---------- КАТЕГОРИИ ----------
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getCategories({ page: 1, page_size: 200 });

        if (cancelled) return;

        let results = [];
        if (Array.isArray(data?.results)) {
          results = data.results;
        } else if (Array.isArray(data)) {
          results = data;
        }

        const active = results.filter((c) => c.is_active !== false);

        const hasChildrenField = active.some((c) => Array.isArray(c.children));
        const tree = hasChildrenField ? active : buildCategoryTree(active);

        setCategories(tree);
      } catch (e) {
        if (cancelled) return;
        console.error("Failed to load categories", e);
        setCategoriesError("Не удалось загрузить категории.");
        setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- ТОВАРЫ (новинки) ----------
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: currentPage,
          // если появится фильтр для новинок — раскомментируешь:
          // is_new: true,
        };

        if (categoryFilterMode === "single" && activeCategoryId) {
          params.category = activeCategoryId;
        } else if (categoryFilterMode === "tree") {
          params.page_size = 300;
        }

        const data = await getProducts(params);
        if (cancelled) return;

        if (!data || typeof data !== "object") {
          setProducts([]);
          setCount(0);
          return;
        }

        let results = Array.isArray(data.results) ? data.results : [];
        results = results.map(mapProductToCard);

        if (categoryFilterMode === "tree" && activeTreeIds.length) {
          results = results.filter((p) =>
            activeTreeIds.includes(p.category_id)
          );
        }

        setProducts(results);
        setCount(results.length);
        if (results.length) setPageSize(results.length);
      } catch (e) {
        if (cancelled) return;
        console.error("Failed to load new products", e);
        setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, activeCategoryId, categoryFilterMode, activeTreeIds]);

  const totalPages = useMemo(
    () => (pageSize ? Math.max(1, Math.ceil(count / pageSize)) : 1),
    [count, pageSize]
  );

  const sortedProducts = useMemo(() => {
    let items = [...products];

    if (sort === "Цена по убыванию") {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === "Цена по возрастанию") {
      items.sort((a, b) => a.price - b.price);
    }
    return items;
  }, [sort, products]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ---------- дерево категорий ----------

  const renderCategoryBlock = (cat, level = 0, isRoot = false) => {
    const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
    const expanded = isExpanded(cat.id);
    const isActiveParent =
      activeCategoryId === cat.id && categoryFilterMode === "tree";

    const rootBase =
      "flex h-[40px] w-full items-center justify_between rounded-[10px] px-3 text-[14px] font-medium transition-colors cursor-pointer";
    const childBase =
      "flex h-[32px] w-full items-center justify_between rounded-[4px] px-3 text-[13px] transition-colors cursor-pointer";

    const headerClass = isRoot
      ? `${rootBase} ${
          expanded
            ? "bg-[#91E456] text-white"
            : "bg-[#E0E1F6] text-[#111111] hover:bg-[#d3d4f2]"
        }`
      : `${childBase} ${
          expanded
            ? "bg-[#00009833] text-[#111111]"
            : "bg-[#0000981A] text-[#111111] hover:bg-[#00009833]"
        }`;

    return (
      <div key={cat.id} className={isRoot ? "mb-[6px]" : "mt-[4px]"}>
        {/* шапка группы */}
        <button
          type="button"
          onClick={() => hasChildren && toggleExpanded(cat.id)}
          className={headerClass}
          style={
            !isRoot
              ? {
                  paddingLeft: 12 + level * 12,
                }
              : undefined
          }
        >
          <span className="truncate">{cat.name}</span>
          {hasChildren && (
            <img
              src={SelectIcon}
              alt=""
              className={`w-[10px] h-[6px] flex-shrink-0 ml-2 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* контент внутри раскрытого блока */}
        {hasChildren && expanded && (
          <div className="mt-[4px]">
            {/* "Посмотреть все товары" по этой группе */}
            <button
              type="button"
              onClick={() => {
                const ids = [];
                collectSubtreeIds(cat, ids);
                setActiveCategoryId(cat.id);
                setCategoryFilterMode("tree");
                setActiveTreeIds(ids);
                setCurrentPage(1);
              }}
              className={`flex h-[28px] w_full items-center justify_between rounded-[4px] px-3 text-[13px] mb-[4px] ${
                isActiveParent
                  ? "text-[#91E456] font-semibold"
                  : "text-[#111111] hover:text-[#91E456]"
              }`}
              style={{
                paddingLeft: isRoot ? 16 : 24 + level * 12,
              }}
            >
              <span className="truncate">Посмотреть все товары</span>
            </button>

            {/* дети */}
            {cat.children.map((child) => {
              const childHasChildren =
                Array.isArray(child.children) && child.children.length > 0;
              const childActive =
                activeCategoryId === child.id &&
                categoryFilterMode === "single";

              if (childHasChildren) {
                return renderCategoryBlock(child, level + 1, false);
              }

              // листовые подкатегории
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(child.id);
                    setCategoryFilterMode("single");
                    setActiveTreeIds([]);
                    setCurrentPage(1);
                  }}
                  className={`flex h-[28px] w_full items-center justify_between rounded-[4px] px-3 text-[13px] mb-[2px] ${
                    childActive
                      ? "text-[#91E456] font-semibold"
                      : "text-[#111111] hover:text-[#91E456]"
                  }`}
                  style={{
                    paddingLeft: isRoot ? 16 : 24 + level * 12,
                  }}
                >
                  <span className="truncate">{child.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderFilters = () => {
    if (categoriesLoading && !categories.length) {
      return (
        <div className="text-[13px] text[#777] px-1">
          Загрузка категорий...
        </div>
      );
    }

    if (categoriesError && !categories.length) {
      return (
        <div className="text-[13px] text[#E15241] px-1">
          {categoriesError}
        </div>
      );
    }

    if (!categories.length) {
      return (
        <div className="text-[13px] text[#777] px-1">
          Категории не найдены.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {/* Все категории */}
        <button
          type="button"
          onClick={() => {
            setActiveCategoryId(null);
            setCategoryFilterMode(null);
            setActiveTreeIds([]);
            setCurrentPage(1);
          }}
          className={`
            flex h-[40px] w_full items-center
            rounded-[10px]
            px-3
            text-[14px]
            bg-[#E0E1F6]
            transition-colors
            ${
              activeCategoryId === null
                ? "text-[#91E456] font-semibold"
                : "text-[#111111] hover:bg[#d3d4f2]"
            }
          `}
        >
          <span className="truncate">Все категории</span>
        </button>

        {/* корневые категории */}
        {categories.map((cat) => renderCategoryBlock(cat, 0, true))}
      </div>
    );
  };

  const showPagination = count > 0;

  return (
    <section className="w_full bg-[#F7F7FF] font-['Open_Sans']">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 pb-[30px]">
        {/* Заголовок */}
        <div className="pt-[40px]">
          <h1 className="text-[40px] sm:text-[44px] text[#111] font-['Alumni_Sans_SC']">
            Новинки
          </h1>
          <p className="mt-1 text-[14px] text[#8A8BA0]">
            {count || 0} товаров
          </p>
        </div>

        {/* Линия: слева Категории, справа сортировка */}
        <div className="mt-4 flex items-center justify_between gap-4">
          {/* кнопка Категории — только на мобильных */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="
              inline-flex items-center gap-2
              rounded-[6px]
              bg[#91E456]
              px-5 py-2.5
              text-[14px] text-white
              active:scale-[0.98]
              lg:hidden
            "
          >
            <span>Категории</span>
            <img
              src={SelectIcon}
              alt=""
              className="w-[10px] h-[6px] invert brightness-0"
            />
          </button>

          {/* справа — сортировка */}
          <div className="ml-auto relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="
                flex items-center gap-2
                text-[14px]
                text[#333333]
                hover:text[#91E456]
              "
            >
              <span>{sort}</span>
              <img
                src={SelectIcon}
                alt=""
                className={`
                  w-[10px] h-[6px] opacity-60
                  transition-transform
                  ${sortOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {sortOpen && (
              <div
                className="
                  absolute right-0 mt-[6px] z-20
                  w-[220px]
                  rounded-[4px]
                  bg[#2F2F2F]
                  text-white
                  shadow-[0_8px_18px_rgba(15,23,42,0.25)]
                "
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSort(option);
                      setSortOpen(false);
                    }}
                    className={`
                      w_full px-4 py-2 text-left text-[14px]
                      ${
                        option === sort
                          ? "text[#91E456]"
                          : "hover:text[#91E456]"
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Контент */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify_between">
          {/* Левая колонка — фильтры */}
          <div className="hidden w-[190px] shrink-0 lg:block">
            {renderFilters()}
          </div>

          {/* Правая часть */}
          <div className="flex-1 min-w-0">
            {/* состояние ошибки */}
            {error && (
              <p className="mb-4 text-[14px] text-red-500">{error}</p>
            )}

            {/* Сетка карточек */}
            <div
              className="
                grid place-items-center
                grid-cols-1
                min-[568px]:grid-cols-2
                md:grid-cols-3
                xl:grid-cols-4
                gap-x-5 gap-y-8
              "
            >
              {loading && products.length === 0 && !error && (
                <p className="text-[14px] text[#777] col-span-full">
                  Загрузка товаров...
                </p>
              )}

              {!loading &&
                sortedProducts.map((p) => (
                  <Cart key={p.id} {...p} onAddToCart={onAddToCart} />
                ))}

              {!loading && !error && sortedProducts.length === 0 && (
                <p className="text-[14px] text[#777] col-span-full">
                  Товары не найдены.
                </p>
              )}
            </div>

            {/* Пагинация с зелёным квадратом */}
            {showPagination && (
              <div className="mt-10 mb-[30px] flex justify_center">
                <div className="flex items-center justify_center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="
                      w-[34px] h-[34px]
                      flex items-center justify_center
                      rounded-[6px]
                      border border[#ECECF5]
                      bg-white
                      text-[14px]
                      disabled:bg[#F5F5F5] disabled:text[#C0C0C0]
                    "
                  >
                    &lt;
                  </button>

                  <div
                    className="
                      w-[34px] h-[34px]
                      flex items-center justify_center
                      rounded-[6px]
                      bg[#91E456]
                      text-white
                      text-[14px] font-medium
                    "
                  >
                    {currentPage}
                  </div>

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="
                      w-[34px] h-[34px]
                      flex items-center justify_center
                      rounded-[6px]
                      border border[#ECECF5]
                      bg-white
                      text-[14px]
                      disabled:bg[#F5F5F5] disabled:text[#C0C0C0]
                    "
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Мобильная модалка категорий */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* затемнение */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          {/* прямоугольник справа */}
          <div
            className="
              absolute right-4 top-[150px]
              w_[90%] max-w-[420px]
              h_[450px]
              bg-white
              rounded-[16px]
              shadow-[0_0_20px_rgba(15,23,42,0.35)]
              flex flex-col
            "
          >
            <div className="flex items-center justify_between px-4 py-3 border-b border[#ECECF5]">
              <span className="text-[15px] font-semibold text[#111111]">
                Категории
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[20px] leading-none text[#8A8BA0] hover:text[#C0392B]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {renderFilters()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsPage;
