import { useState, useEffect } from "react";

export default function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    let timeout;
    const h = () => { clearTimeout(timeout); timeout = setTimeout(() => setW(window.innerWidth), 100); };
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("resize", h); clearTimeout(timeout); };
  }, []);
  return w;
}
