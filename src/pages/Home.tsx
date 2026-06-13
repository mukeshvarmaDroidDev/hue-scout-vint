import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { GridShowroom } from '../components/sections/GridShowroom';
import { BulkProduction } from '../components/sections/BulkProduction';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-beige flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-1">
        {/* Cinematic Hero Slider */}
        <HeroSection />

        {/* Asymmetric Showroom Fabric Grid */}
        <GridShowroom />

        {/* Production Steps Lifecycle */}
        <BulkProduction />

        {/* Final Editorial Call-To-Action */}
        <section className="py-24 bg-brand-cream border-t border-brand-concrete/30 flex flex-col items-center text-center space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-charcoal/45">Atelier Network</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-brand-charcoal max-w-2xl leading-normal">
            Ready to initiate a custom collection or bulk sourcing order?
          </h2>
          <p className="text-xs text-brand-charcoal/60 max-w-lg tracking-wider leading-relaxed">
            Submit your fabric requirements, estimated unit counts, and branding specifications. Our showroom managers will coordinate with our European weaving mill to verify logistics.
          </p>
          <div className="pt-4">
            <Link 
              to="/inquire" 
              className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-beige bg-brand-charcoal px-10 py-5 hover:bg-brand-obsidian transition-colors cursor-pointer inline-block"
            >
              Access Inquiry Form
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Home;
