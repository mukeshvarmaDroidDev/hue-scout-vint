import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const images = [
    '/home-page-slide-img1.png',
    '/home-page-slide-img2.png',
    '/home-page-slide-img3.png',
    '/home-page-slide-img4.png'
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleScrollToShowroom = () => {
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-cream">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-brand-cream">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0.95, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.3, ease: 'easeInOut' },
              scale: { duration: 4.5, ease: 'linear' }
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[index]})`
            }}
          />
        </AnimatePresence>
      </div>

      {/* Elegant overlay gradient to guarantee text readability */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0c0f12]/80 via-[#0c0f12]/35 to-transparent z-10" />

      {/* Vertical Segmented Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className="relative h-12 w-[3px] bg-white/25 hover:bg-white/40 transition-colors duration-300 focus:outline-none cursor-pointer"
            title={`Slide ${idx + 1}`}
          >
            {index === idx && (
              <motion.div
                key={index}
                className="absolute inset-0 bg-white"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 6, ease: "linear" }}
                style={{ originY: 0 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-[15vh] z-20">
        <div className="editorial-container mx-auto w-full space-y-6 md:space-y-8 select-none">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] text-[#f8f8ff]/80">
            Premium Apparel Manufacturing & Global Export Solutions
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-[#f8f8ff] leading-[1.15] max-w-4xl">
            Crafted for Brands.  <br />
            <span className="italic">Produced for Scale.</span>
          </h1>
          <p className="text-xs md:text-sm text-[#f8f8ff]/70 tracking-[0.15em] font-light max-w-xl leading-relaxed">
            A premium digital showroom displaying bulk linen collections, dense cottons, and custom cashmere knitwear for high-end boutique houses and B2B retail groups.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleScrollToShowroom}
              className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0c0f12] bg-[#f8f8ff] px-8 py-4 border border-[#f8f8ff] hover:bg-transparent hover:text-[#f8f8ff] transition-all duration-300 w-fit cursor-pointer"
            >
              Browse Showroom
            </button>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-[0.25em] font-semibold text-[#f8f8ff] bg-transparent px-8 py-4 border border-[#f8f8ff]/30 hover:border-[#f8f8ff] transition-all duration-300 w-fit cursor-pointer flex items-center justify-center"
            >
              Consult Production
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        onClick={handleScrollToShowroom}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group z-20"
      >
        <span className="text-[8px] uppercase tracking-[0.3em] text-[#f8f8ff]/50 group-hover:text-[#f8f8ff] transition-colors">Scroll</span>
        <div className="w-[18px] h-[32px] rounded-full border border-[#f8f8ff]/25 flex justify-center p-1 group-hover:border-[#f8f8ff]/50 transition-colors">
          <div className="w-[3px] h-[3px] rounded-full bg-[#f8f8ff] scroll-indicator-dot" />
        </div>
      </div>
    </div>
  );
};
