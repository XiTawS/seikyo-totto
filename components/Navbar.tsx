"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "La carte", href: "#carte" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-[var(--color-bg-dark)]/95 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#" className="font-display text-2xl text-white">TOTTO</a>
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-white/50 hover:text-[var(--color-orange)] text-xs tracking-[0.15em] uppercase transition-colors duration-300">
                {l.label}
              </a>
            ))}
            <a href="tel:0422915477"
              className="bg-[var(--color-orange)] text-white px-5 py-2 text-xs tracking-[0.15em] uppercase hover:bg-[var(--color-orange-dark)] transition-colors">
              Réserver
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-[var(--color-bg-dark)]/98 flex flex-col items-center justify-center gap-10">
            {links.map((l, i) => (
              <motion.a key={l.href} href={l.href}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                exit={{ opacity: 0 }} onClick={() => setOpen(false)}
                className="font-display text-3xl text-white">{l.label}</motion.a>
            ))}
            <motion.a href="tel:0422915477"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              exit={{ opacity: 0 }} onClick={() => setOpen(false)}
              className="bg-[var(--color-orange)] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase">
              Réserver
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}