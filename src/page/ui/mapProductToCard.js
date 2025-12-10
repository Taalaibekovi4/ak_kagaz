// src/utils/mapProductToCard.js
import NoteImg from "../assets/NewProducts/note.svg";

export const mapProductToCard = (p) => ({
  id: p.id,
  slug: p.slug,
  img: p.main_image || p.image || p.photo || NoteImg,
  status: p.is_available ? "В наличии" : "Нет в наличии",
  statusType: p.is_available ? "in" : "out",
  title: p.name,
  price:
    p.price !== null &&
    p.price !== undefined &&
    !Number.isNaN(Number(p.price))
      ? Number(p.price)
      : 0,
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
  category_id: p.category_id,
});
