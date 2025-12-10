// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./locales/ru.json";
import ky from "./locales/ky.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      ky: { translation: ky },
      en: { translation: en },
    },
    // стартовый язык (можешь поменять)
    lng: "ru",
    fallbackLng: "ru",

    detection: {
      // чтобы не мешал кэш / localStorage
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
