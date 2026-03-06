"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { createContext, useContext } from "react";

interface LightboxContextType {
  openLightbox: (src: string, allSrcs?: string[]) => void;
}

const LightboxContext = createContext<LightboxContextType>({ openLightbox: () => {} });

export const useLightbox = () => useContext(LightboxContext);

export default function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((src: string, allSrcs?: string[]) => {
    setCurrentSrc(src);
    if (allSrcs && allSrcs.length > 0) {
      setAllImages(allSrcs);
      setCurrentIndex(allSrcs.indexOf(src));
    } else {
      setAllImages([]);
      setCurrentIndex(0);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const goNext = useCallback(() => {
    if (allImages.length === 0) return;
    const next = (currentIndex + 1) % allImages.length;
    setCurrentIndex(next);
    setCurrentSrc(allImages[next]);
  }, [allImages, currentIndex]);

  const goPrev = useCallback(() => {
    if (allImages.length === 0) return;
    const prev = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(prev);
    setCurrentSrc(allImages[prev]);
  }, [allImages, currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close, goNext, goPrev]);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={close}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={currentSrc}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentSrc}
                alt=""
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            {/* Counter */}
            {allImages.length > 1 && (
              <p className="absolute bottom-4 text-white/50 text-sm">
                {currentIndex + 1} / {allImages.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
