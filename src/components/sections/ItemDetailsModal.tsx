import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ClothingItem, ColorSwatch } from './GridShowroom';

interface ItemDetailsModalProps {
  item: ClothingItem;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  const { addToInquiry } = useApp();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(item.available_colors[0]);
  const [quantity, setQuantity] = useState(100); // B2B MOQ defaults to 100
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const idx = item.available_colors.findIndex(c => c.hex === selectedColor.hex);
    if (idx > -1 && idx < item.images.length) {
      setActiveImgIdx(idx);
    }
  }, [selectedColor, item.available_colors, item.images]);

  const handleAddToInquiry = () => {
    addToInquiry(item, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleNextImage = () => {
    setActiveImgIdx(prev => (prev + 1) % item.images.length);
  };

  const handlePrevImage = () => {
    setActiveImgIdx(prev => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-obsidian/30 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Sheet Panel */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative z-10 w-full max-w-2xl md:max-w-4xl h-full bg-brand-beige flex flex-col justify-between shadow-2xl overflow-y-auto"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-brand-charcoal hover:opacity-60 transition-opacity z-20 cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex-1 p-6 md:p-12 space-y-10">
            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
              
              {/* Left Column: Gallery Section (decreased width and height) */}
              <div className="md:col-span-5 space-y-4">
                <div className="relative aspect-[3/4] w-full max-w-sm mx-auto bg-brand-cream overflow-hidden border border-brand-concrete/30">
                  <img 
                    src={item.images[activeImgIdx]} 
                    alt={`${item.name} image ${activeImgIdx + 1}`} 
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {item.images.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevImage} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-brand-beige/80 border border-brand-concrete/30 rounded-full text-brand-charcoal hover:bg-brand-beige cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        onClick={handleNextImage} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-brand-beige/80 border border-brand-concrete/30 rounded-full text-brand-charcoal hover:bg-brand-beige cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Content Specifications & Swatches */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-charcoal/45">Showroom Specification Card</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-brand-charcoal">{item.name}</h2>
                </div>

                <p className="text-xs text-brand-charcoal/70 tracking-wide leading-relaxed">
                  {item.description}
                </p>

                {/* Fabric Specs Grid */}
                <div className="grid grid-cols-2 gap-4 border-y border-brand-charcoal/10 py-5 text-xs tracking-wider">
                  <div>
                    <span className="block text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Fabric Composition</span>
                    <span className="font-semibold text-brand-charcoal">{item.fabric_composition}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Fabric Weight</span>
                    <span className="font-semibold text-brand-charcoal">{item.gsm_weight} GSM</span>
                  </div>
                  {item.knit_structure && (
                    <div>
                      <span className="block text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Knit Structure</span>
                      <span className="font-semibold text-brand-charcoal">{item.knit_structure}</span>
                    </div>
                  )}
                  {item.finish && (
                    <div>
                      <span className="block text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Required Finish</span>
                      <span className="font-semibold text-brand-charcoal">{item.finish}</span>
                    </div>
                  )}
                </div>

                {/* Swatch Selector */}
                <div className="space-y-3">
                  <span className="block text-[10px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Select Production Color</span>
                  <div className="flex flex-wrap gap-2.5">
                    {item.available_colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center space-x-2 px-3 py-1.5 border text-xs tracking-wide cursor-pointer transition-all ${selectedColor.hex === color.hex ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal bg-white'}`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-brand-charcoal/10" style={{ backgroundColor: color.hex }} />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* B2B Volume Selector (Minimum Order Quantity) */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="block text-[10px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Estimated Production Volume</span>
                    <span className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold">MOQ: 100 units per color</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      min={100}
                      step={50}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                      className="w-32 bg-white border border-brand-concrete px-4 py-2 text-xs tracking-widest font-medium focus:border-brand-charcoal focus:outline-none"
                    />
                    <span className="text-xs text-brand-charcoal/50 tracking-wider">Units</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 md:px-12 md:py-8 border-t border-brand-charcoal/10 bg-brand-cream/40 flex flex-col gap-4">
            <button 
              onClick={handleAddToInquiry}
              disabled={added}
              className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 ${added ? 'bg-green-800 text-white' : 'bg-brand-charcoal text-brand-beige hover:bg-brand-obsidian'}`}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Inquiry Clipboard
                </>
              ) : (
                "Add to Bulk Inquiry"
              )}
            </button>
            <div className="text-[9px] text-brand-charcoal/40 text-center tracking-widest uppercase">
              No direct checkout. Submitting is processed as a manufacturing request.
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
