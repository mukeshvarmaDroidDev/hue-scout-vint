import React from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const handleScrollToShowroom = () => {
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-cream">
      {/* Editorial Parallax Lookbook Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-100 scale-105 transition-transform duration-[6000ms] ease-out animate-pulse-slow"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1800')",
        }}
      />

      {/* Elegant overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-brand-cream/10 to-transparent" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-[15vh]">
        <div className="editorial-container mx-auto w-full space-y-6 md:space-y-8 select-none">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] text-brand-charcoal/70">
            A Atelier & Co. Production Facility
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-brand-charcoal leading-[1.15] max-w-4xl">
            Architectural Form. <br />
            <span className="italic">Ethical Sourcing.</span>
          </h1>
          <p className="text-xs md:text-sm text-brand-charcoal/70 tracking-[0.15em] font-light max-w-xl leading-relaxed">
            A premium digital showroom displaying bulk linen collections, dense cottons, and custom cashmere knitwear for high-end boutique houses and verified B2B retail groups.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleScrollToShowroom}
              className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-beige bg-brand-charcoal px-8 py-4 border border-brand-charcoal hover:bg-transparent hover:text-brand-charcoal transition-all duration-300 w-fit cursor-pointer"
            >
              Browse Showroom
            </button>
            <Link 
              to="/inquire"
              className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-charcoal bg-transparent px-8 py-4 border border-brand-charcoal/30 hover:border-brand-charcoal transition-all duration-300 w-fit cursor-pointer flex items-center justify-center"
            >
              Consult Production
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={handleScrollToShowroom}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="text-[8px] uppercase tracking-[0.3em] text-brand-charcoal/50 group-hover:text-brand-charcoal transition-colors">Scroll</span>
        <div className="w-[18px] h-[32px] rounded-full border border-brand-charcoal/25 flex justify-center p-1 group-hover:border-brand-charcoal/50 transition-colors">
          <div className="w-[3px] h-[3px] rounded-full bg-brand-charcoal scroll-indicator-dot" />
        </div>
      </div>
    </div>
  );
};
