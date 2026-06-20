import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, ClipboardList, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, inquiryItems } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isOpen
      ? 'bg-brand-beige border-b border-brand-concrete/30 h-16 md:h-auto flex items-center md:block'
      : isScrolled
        ? 'bg-brand-beige shadow-sm border-b border-brand-concrete/20 h-16 md:h-auto py-0 md:py-4 flex items-center md:block'
        : 'bg-brand-beige md:bg-brand-beige/90 md:backdrop-blur-md border-b border-brand-concrete/10 h-16 md:h-auto py-0 md:py-6 flex items-center md:block'
      }`}>
      <div className="editorial-container mx-auto flex items-center justify-between w-full">
        {/* Brand Logo */}
        <Link to="/" className="hover:opacity-75 transition-opacity duration-300 flex items-center">
          <img src="/Asset 1.svg" alt="HUESCOUT Logo" className="h-10 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-xs font-medium uppercase tracking-[0.25em] text-brand-charcoal/80 transition-colors duration-300">
          <Link to="/collections" className="hover:text-brand-charcoal transition-colors uppercase">
            Collections
          </Link>
          <Link to="/story" className="hover:text-brand-charcoal transition-colors uppercase">
            Brand Story
          </Link>
          <button onClick={() => scrollToSection('production')} className="hover:text-brand-charcoal transition-colors cursor-pointer uppercase">
            Bulk Production
          </button>
          <Link to="/inquire" className="hover:text-brand-charcoal transition-colors uppercase">
            Inquire
          </Link>
        </div>

        {/* Action Items */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Inquiry Clipboard Badge */}
          <Link to="/inquire" className="relative p-2 text-brand-charcoal hover:opacity-75 transition-opacity duration-300" title="Active Inquiry List">
            <ClipboardList size={18} strokeWidth={1.5} />
            {inquiryItems.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans bg-brand-charcoal text-white transition-colors duration-300">
                {inquiryItems.length}
              </span>
            )}
          </Link>

          {/* Client Portal Link */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 text-sm uppercase tracking-[0.2em] font-medium text-brand-charcoal transition-colors duration-300">
              <Link to="/dashboard" className="hover:opacity-75 transition-opacity flex items-center gap-1">
                <UserIcon size={14} />
                Portal
              </Link>
              <span className="text-brand-charcoal/30">|</span>
              <button onClick={logout} className="hover:opacity-75 transition-opacity cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm uppercase tracking-[0.2em] font-semibold border-b pb-0.5 transition-colors duration-300 text-brand-charcoal border-brand-charcoal/30 hover:border-brand-charcoal">
              B2B Portal
            </Link>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/inquire" className="relative p-2 text-brand-charcoal hover:opacity-75 transition-opacity duration-300">
            <ClipboardList size={18} strokeWidth={1.5} />
            {inquiryItems.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center font-sans bg-brand-charcoal text-white transition-colors duration-300">
                {inquiryItems.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none cursor-pointer text-brand-charcoal hover:opacity-75 transition-opacity duration-300">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-[64px] bg-brand-beige z-40 flex flex-col justify-between px-6 py-12 transition-all duration-300 md:hidden animate-fade-in border-t border-brand-concrete/10">
          <div className="flex flex-col space-y-8 text-sm uppercase tracking-[0.25em] font-medium text-brand-charcoal">
            <Link to="/collections" onClick={() => setIsOpen(false)} className="text-left py-2 border-b border-brand-charcoal/5 uppercase hover:opacity-75">
              Collections
            </Link>
            <Link to="/story" onClick={() => setIsOpen(false)} className="text-left py-2 border-b border-brand-charcoal/5 uppercase hover:opacity-75">
              Brand Story
            </Link>
            <button onClick={() => scrollToSection('production')} className="text-left py-2 border-b border-brand-charcoal/5 uppercase hover:opacity-75">
              Bulk Production
            </button>
            <Link to="/inquire" onClick={() => setIsOpen(false)} className="text-left py-2 border-b border-brand-charcoal/5 uppercase hover:opacity-75">
              Inquire
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 border-b border-brand-charcoal/5 uppercase hover:opacity-75">
                  B2B Dashboard
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-left py-2 text-red-700 uppercase hover:text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)} className="py-2 border-b border-brand-charcoal/5 font-semibold hover:opacity-75">
                B2B Portal Login
              </Link>
            )}
          </div>
          <div className="text-[10px] text-brand-charcoal/40 tracking-[0.15em] leading-relaxed uppercase">
            HUESCOUT Bulk Manufacturing Showroom<br />
            © 2026 Atelier & Co.
          </div>
        </div>
      )}
    </nav>
  );
};
