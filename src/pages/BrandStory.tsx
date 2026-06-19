import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrandStory: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="editorial-container mx-auto max-w-[1440px] space-y-28">
          
          {/* Section 1: Intro Header & Meaning */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/40">The Etymology</span>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-charcoal leading-tight">
                <img src="/Asset 3.svg" alt="HUESCOUT Logo Mark" className="h-12 w-auto mb-4 object-contain" />
                HUE &amp; SCOUT
              </h1>
              <div className="w-12 h-[1px] bg-brand-charcoal/30 pt-1" />
            </div>

            <div className="lg:col-span-7 lg:pl-6 space-y-6">
              <p className="font-serif text-xl md:text-2xl font-light text-brand-charcoal/80 leading-relaxed italic">
                "We define color as an architectural element; we define sourcing as an act of absolute standards."
              </p>
              <p className="text-xs text-brand-charcoal/70 tracking-wider leading-relaxed">
                The name <strong>HUESCOUT</strong> is born from two distinct pursuits. 
                <span className="block mt-4">
                  <strong>HUE</strong> represents the spectrum of color—curated, refined, and extracted using natural vat-dyeing techniques to capture raw concrete grays, off-whites, and deep obsidian charcoal. 
                </span>
                <span className="block mt-2">
                  <strong>SCOUT</strong> is our promise to search, source, and secure only the highest-grade raw materials—Belgian flax flax, GOTS-certified Supima cotton, and extrafine merino cashmere blends.
                </span>
              </p>
            </div>
          </section>

          {/* Section 2: Asymmetric Editorial Gallery */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Large Image Left */}
            <div className="md:col-span-7 aspect-[4/3] bg-brand-cream overflow-hidden border border-brand-concrete/30">
              <img 
                src="/cotton-sourcing-detail.png" 
                alt="Sourcing Raw Materials" 
                className="w-full h-full object-cover image-zoom-hover"
                loading="lazy"
              />
            </div>
            
            {/* Text and Small Image Right */}
            <div className="md:col-span-5 space-y-6 md:pl-6">
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-charcoal/45">The Search (Scouting)</span>
              <h3 className="font-serif text-2xl font-light text-brand-charcoal">The Pursuit of Raw Textures</h3>
              <p className="text-xs text-brand-charcoal/65 leading-relaxed tracking-wider">
                We search the globe for mills that preserve heritage techniques. Our sourcing team visits flax farms in northern Europe and organic cotton fields in southern India, selecting fibers based on length, strength, and environmental footprint.
              </p>
              <div className="aspect-[3/4] w-2/3 bg-brand-cream overflow-hidden border border-brand-concrete/30">
                <img 
                  src="/draped-cotton-texture.png" 
                  alt="Draped Cotton Fabric" 
                  className="w-full h-full object-cover image-zoom-hover"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* Section 3: The Three Pillars */}
          <section className="border-t border-brand-charcoal/10 pt-16">
            <div className="text-center mb-16 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/40">Our Foundation</span>
              <h2 className="font-serif text-3xl font-light text-brand-charcoal">The HUESCOUT Manifesto</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <span className="text-xs font-serif italic text-brand-charcoal/50">01 / Pure Palette</span>
                <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-brand-charcoal">HUE SELECTION</h4>
                <p className="text-xs text-brand-charcoal/65 leading-relaxed tracking-wider">
                  Colors are selected to evoke architectural harmony. We avoid loud, artificial pigments, focusing on a curated, monochrome, and earthy palette that coordinates effortlessly.
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-serif italic text-brand-charcoal/50">02 / Relentless Sourcing</span>
                <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-brand-charcoal">SCOUT DISCOVERY</h4>
                <p className="text-xs text-brand-charcoal/65 leading-relaxed tracking-wider">
                  Every thread is certified. From weft to warp, we partner with vertically integrated mills that pay fair wages, recycle water, and utilize zero toxic additives.
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-serif italic text-brand-charcoal/50">03 / Sculptural Form</span>
                <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-brand-charcoal">TAILORED INTEGRITY</h4>
                <p className="text-xs text-brand-charcoal/65 leading-relaxed tracking-wider">
                  Our garment structures are designed to hold their form. We select heavy GSM yarn densities that drape elegantly without losing shape over cycles.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Call to Action */}
          <section className="bg-white border border-brand-concrete/30 p-8 md:p-12 text-center space-y-6 max-w-5xl mx-auto">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/45">Partnering with HUESCOUT</span>
            <h3 className="font-serif text-2xl font-light text-brand-charcoal">Experience Custom Weaving</h3>
            <p className="text-xs text-brand-charcoal/65 leading-relaxed tracking-wider max-w-xl mx-auto">
              Ready to construct custom runs or source our stock collection fabrics? Fill out our B2B inquiry sheet, and a showroom manager will verify availability.
            </p>
            <div className="pt-2">
              <Link 
                to="/inquire" 
                className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-beige bg-brand-charcoal px-8 py-4 hover:bg-brand-obsidian transition-colors inline-block"
              >
                Inquire For Production <ArrowRight size={12} className="inline-block ml-1" />
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default BrandStory;
