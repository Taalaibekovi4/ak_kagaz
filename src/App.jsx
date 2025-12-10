// src/App.jsx
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import "./App.css";
import HomePage from "./page/homePage/HomePage";
import Header from "./page/homePage/components/Header/header";
import Search from "./page/homePage/components/Header/Search";
import Footer from "./page/homePage/components/Footer/Footer";
import Catalog from "./page/catalog/Catalog";
import ProductPage from "./page/product/ProductPage";
import CheckoutPage from "./page/checkout/CheckoutPage";
import NewsPage from "./page/News/NewsPage";
import SaleProductsPage from "./page/Sale/SaleProductsPage";
import PopularProducts from "./page/Popular/PopularProducts";
import ContactsPage from "./page/Contacts/ContactsPage";
import AboutPage from "./page/AboutPage/AboutPage";
import News from "./page/News/News";
import NewsDetail from "./page/News/NewsDetail";
import WholesaleProduct from "./page/wholesale/WholesaleProduct";

// ключ для localStorage
const CART_STORAGE_KEY = "ak_kagaz_cart";

// компонент, который скроллит страницу наверх при смене маршрута
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

function App() {
  // ===== общий стейт корзины для всего приложения =====
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  }); // [{id,title,price,img,qty,isWholesale}, ...]

  // при каждом изменении корзины — сохраняем её в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // добавление товара из карточек / страниц
  const handleAddToCart = (item) => {
    const isWholesale = !!item.isWholesale;

    setCartItems((prev) => {
      // ИЩЕМ по id + типу (оптовый/обычный),
      // чтобы один и тот же товар мог лежать в корзине двумя строками
      const idx = prev.findIndex(
        (p) => p.id === item.id && !!p.isWholesale === isWholesale
      );

      if (idx === -1) {
        return [
          ...prev,
          {
            ...item,
            qty: item.qty || 1,
            isWholesale,
          },
        ];
      }

      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        qty: (copy[idx].qty || 0) + (item.qty || 1),
      };
      return copy;
    });
  };

  // суммарное количество для кружочка в шапке
  const cartCount = useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.qty || 0), 0),
    [cartItems]
  );

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Header />
      <Search cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={<HomePage onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/Catalog"
          element={<Catalog onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/popular-products"
          element={<PopularProducts onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/wholesale-products"
          element={<WholesaleProduct onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/promotions"
          element={<SaleProductsPage onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/new"
          element={<NewsPage onAddToCart={handleAddToCart} />}
        />
        <Route path="/News" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/Contacts" element={<ContactsPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/product/:id"
          element={<ProductPage onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage items={cartItems} setItems={setCartItems} />
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
