import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-obsidian text-brand-beige py-20 mt-20 border-t border-brand-charcoal/10">
      <div className="editorial-container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* About Column */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="font-display font-semibold text-lg tracking-[0.2em] uppercase">HUESCOUT</h4>
          <p className="text-xs text-brand-beige/60 tracking-wider leading-relaxed max-w-sm">
            Partnering with premium global retail groups, luxury boutique labels, and hospitality brands to design, manufacture, and ship tailored garments. Operating state-of-the-art, vertically integrated facilities in compliance with international environmental standards.
          </p>
        </div>

        {/* Showrooms & Mills */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-beige/80">Production Hubs</h4>
          <ul className="space-y-2 text-xs text-brand-beige/50 tracking-wider">
            <li>Weaving Mill: Ghent, Belgium</li>
            <li>Spinning Mill: Coimbatore, India</li>
            <li>Garment Assembly: Porto, Portugal</li>
            <li>Sourcing Center: Istanbul, Turkey</li>
          </ul>
        </div>

        {/* Corporate Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-beige/80">Showrooms</h4>
          <ul className="space-y-2 text-xs text-brand-beige/50 tracking-wider">
            <li>Paris: Place des Vosges</li>
            <li>New York: SOHO Showroom</li>
            <li>Milan: Via Montenapoleone</li>
            <li>London: Savile Row Sourcing</li>
          </ul>
        </div>

      </div>

      <div className="editorial-container mx-auto mt-16 pt-8 border-t border-brand-beige/5 flex flex-col md:flex-row items-center justify-between text-[10px] text-brand-beige/45 tracking-[0.2em] uppercase space-y-4 md:space-y-0">
        <div>
          © 2026 Atelier & Co. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#privacy" className="hover:text-brand-beige transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-brand-beige transition-colors">Terms of Supply</a>
          <Link to="/auth" className="hover:text-brand-beige transition-colors">B2B Portal</Link>
        </div>
      </div>
    </footer>
  );
};
