import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    function onScroll() { setVisible(main.scrollTop > 400); }
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button className={`back-to-top ${visible ? "visible" : ""}`} onClick={() => document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })} title="Back to top">↑</button>
  );
}
