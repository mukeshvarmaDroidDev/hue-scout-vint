import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-obsidian text-brand-beige py-20 mt-20 border-t border-brand-charcoal/10">
      <div className="editorial-container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

        {/* About Column */}
        <div className="space-y-4 md:col-span-2">
          <img src="/Asset 2.svg" alt="HUESCOUT Logo" className="h-6 w-auto object-contain" />
          <p className="text-xs text-brand-beige/60 tracking-wider leading-relaxed max-w-sm">
            A premium digital showroom displaying bulk linen collections, dense cottons, and custom cashmere knitwear for high-end boutique houses and verified B2B retail groups.
          </p>
        </div>

        {/* Production Hubs & Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-beige/80">Production Hubs</h4>
          <ul className="space-y-2 text-xs text-brand-beige/50 tracking-wider">
            <li>Weaving Mill: Andhra Pradesh, India</li>
            <li>Spinning Mill: Coimbatore, India</li>
            <li>Garment Assembly: Chennai, India</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-beige/80">Contact</h4>
          <ul className="space-y-2 text-xs text-brand-beige/50 tracking-wider">
            <li>Wholesale & Sourcing Desk</li>
            <li>
              <a href="mailto:huescoutcb@gmail.com" className="hover:text-brand-beige transition-colors">
                huescoutcb@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="editorial-container mx-auto mt-16 pt-8 border-t border-brand-beige/5 flex flex-col md:flex-row items-center justify-between text-[10px] text-brand-beige/45 tracking-[0.2em] uppercase space-y-4 md:space-y-0">
        <div>
          © 2026 HUESCOUT. All rights reserved.
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
