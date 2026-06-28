import React from 'react';

export const Heritage: React.FC = () => {
  return (
    <section id="heritage" className="py-28 bg-brand-cream border-y border-brand-concrete/30 scroll-mt-20">
      <div className="editorial-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Cinematic Editorial Image Block */}
          <div className="lg:col-span-5 relative space-y-4">
            <div className="aspect-[4/5] bg-brand-beige overflow-hidden border border-brand-concrete/30">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800" 
                alt="Minimal fabric hanging" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[800ms] ease-out brightness-95 hover:brightness-100 opacity-90 hover:opacity-100 image-zoom-hover"
                loading="lazy"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-brand-charcoal/45 tracking-widest uppercase font-medium">
              <span>EST. 2012 / GHENT MILLS</span>
              <span>CERTIFIED ORGANIC FLAX</span>
            </div>
          </div>

          {/* Right Side: Editorial Copyset */}
          <div className="lg:col-span-7 lg:pl-12 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/40">Raw Materials & Sourcing</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-brand-charcoal leading-tight">
                Honoring the Fibers. <br />
                <span className="italic">Refining the Process.</span>
              </h2>
            </div>

            <div className="space-y-6 text-[11px] sm:text-xs text-brand-charcoal/70 tracking-wide leading-relaxed max-w-xl">
              <p>
                At HUESCOUT, our production philosophy starts at the source. We select only the highest grade Belgian flax and long-staple Indian Supima cotton. By owning the vertical pipeline—from raw fibers, carding, weaving, and sewing to B2B distribution—we verify ecological accountability at every stage.
              </p>
              <p>
                Our looms in Belgium combine centuries of weaving heritage with modern energy-saving technology, ensuring our fabrics maintain high tensile strength while retaining a soft, organic handle.
              </p>
            </div>

            {/* Compliance Stats Cards */}
            <div className="grid grid-cols-3 gap-6 border-t border-brand-charcoal/10 pt-8 max-w-xl">
              <div className="space-y-1">
                <span className="block font-display text-2xl font-light text-brand-charcoal">100%</span>
                <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/50 leading-normal font-bold">Traceable Source</span>
              </div>
              <div className="space-y-1">
                <span className="block font-display text-2xl font-light text-brand-charcoal">OEKO</span>
                <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/50 leading-normal font-bold">Standard 100</span>
              </div>
              <div className="space-y-1">
                <span className="block font-display text-2xl font-light text-brand-charcoal">GOTS</span>
                <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/50 leading-normal font-bold">Certified Cotton</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
