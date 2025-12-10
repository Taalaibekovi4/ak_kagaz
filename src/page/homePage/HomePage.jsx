// src/page/homePage/HomePage.jsx
import React from "react";
import Banner from "./components/Main/Banner";
import Categories from "./components/Main/Categories";
import PopularProducts from "./components/Main/PopularProducts";
import NewProducts from "./components/Main/NewProducts";
import SaleProducts from "./components/Main/SaleProducts";
import News from "./components/Main/News";
import AboutCompany from "./components/Main/AboutCompany";

const HomePage = ({ onAddToCart }) => {
  return (
    <>
      <Banner />
      <Categories />
      {/* Популярные товары на главной — передаём onAddToCart в блок с карточками */}
      <PopularProducts onAddToCart={onAddToCart} />
      {/* Новинки — тоже могут использовать Cart с onAddToCart, если внутри подключено */}
      <NewProducts onAddToCart={onAddToCart} />
      {/* Акции — так же готовы к корзине */}
      <SaleProducts onAddToCart={onAddToCart} />
      <News />
      <AboutCompany />
    </>
  );
};

export default HomePage;
