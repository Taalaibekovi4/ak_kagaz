// src/page/product/ProductPage.jsx
import Interesting from "./Interesting";
import Products from "./Products";

const ProductPage = ({ onAddToCart }) => {
  return (
    <>
      {/* пробрасываем коллбек дальше в Products */}
      <Products onAddToCart={onAddToCart} />
      <Interesting onAddToCart={onAddToCart} />
    </>
  );
};

export default ProductPage;
