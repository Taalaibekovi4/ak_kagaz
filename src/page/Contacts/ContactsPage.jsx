// src/page/homePage/components/ContactsPage.jsx
import React, { useEffect, useState } from "react";

import Contactstel from "./Contactstel";
import Contactsgis from "./Contactsgis";

const ContactsPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      try {
        setLoading(true);

        // ВАЖНО: slug = "contacts" (как в админке)
        const res = await fetch("/main/pages/contacts/");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        if (!cancelled) {
          setPage(data);
          // console.log("contacts page from API:", data);
        }
      } catch (e) {
        console.error("ContactsPage: cannot load /main/pages/contacts/", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadContacts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Заголовок + текст (берёт title/content из page, или дефолт) */}
      <Contactstel page={page} />
      {/* Карта и блок «Филиалы» – тоже читают address/phone/email из page */}
      <Contactsgis page={page} />
    </>
  );
};

export default ContactsPage;
