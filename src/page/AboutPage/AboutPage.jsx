// src/page/homePage/components/AboutPage.jsx
import React, { useEffect, useState } from "react";
import About from "./About";
import Assortment from "./Assortment";

const AboutPage = () => {
  const [aboutPage, setAboutPage] = useState(null);
  const [assortmentPage, setAssortmentPage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // 1) страница "О компании" (slug = about)
        const aboutRes = await fetch("/main/pages/about/");
        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          if (!cancelled) setAboutPage(aboutData);
        } else {
          console.error("AboutPage: /main/pages/about/ HTTP", aboutRes.status);
        }

        // 2) опционально отдельная страница для ассортимента (slug = assortment)
        // если такого слага нет, просто отработают дефолтные тексты/картинка
        try {
          const assRes = await fetch("/main/pages/assortment/");
          if (assRes.ok) {
            const assData = await assRes.json();
            if (!cancelled) setAssortmentPage(assData);
          }
        } catch (e) {
          // если 404/ошибка — не критично, просто оставляем дефолты
          console.warn("Assortment page not found, using defaults");
        }
      } catch (e) {
        console.error("AboutPage: failed to load static pages", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* О компании — берёт заголовок, текст и картинку из /main/pages/about/ */}
      <About page={aboutPage} />

      {/* Ассортимент — если есть /main/pages/assortment/, берёт оттуда, иначе дефолты */}
      <Assortment page={assortmentPage} />
    </>
  );
};

export default AboutPage;
