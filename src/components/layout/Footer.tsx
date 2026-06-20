import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-obsidian text-brand-beige py-20 mt-20 border-t border-brand-charcoal/10">
      <div className="editorial-container mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">

        {/* About Column */}
        <div className="space-y-4 max-w-sm w-full">
          <img src="/Asset 2.svg" alt="HUESCOUT Logo" className="h-9 w-auto object-contain" />
          <p className="text-xs text-brand-beige/60 tracking-wider leading-relaxed">
            A premium digital showroom displaying bulk linen collections, dense cottons, and custom cashmere knitwear for high-end boutique houses and verified B2B retail groups.
          </p>
        </div>

        {/* Contact & Socials Column */}
        <div className="flex flex-row justify-between items-start gap-8 md:gap-20 w-full md:w-auto">
          {/* Contact Details */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-beige/80">Contact</h4>
            <ul className="space-y-2 text-xs text-brand-beige/50 tracking-wider">
              <li>Wholesale & Sourcing Desk</li>
              <li>
                <a href="tel:1234567890" className="hover:text-brand-beige transition-colors">
                  1234567890
                </a>
              </li>
              <li>
                <a href="mailto:huescoutcb@gmail.com" className="hover:text-brand-beige transition-colors">
                  huescoutcb@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links (Stacked vertically on the complete right) */}
          <div className="flex flex-col items-end gap-6 text-brand-beige/50 pt-1">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-brand-beige transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-beige transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter (X)" className="hover:text-brand-beige transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
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
