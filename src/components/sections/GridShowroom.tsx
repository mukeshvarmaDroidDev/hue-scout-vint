import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ClothingItem {
  id: number;
  collection_id: number;
  name: string;
  description: string;
  fabric_composition: string;
  gsm_weight: number;
  available_colors: ColorSwatch[];
  images: string[];
  knit_structure?: string;
  finish?: string;
}

export interface Collection {
  id: number;
  title: string;
  slug: string;
  description: string;
  season: string;
  cover_image_url: string;
  is_active: boolean;
}

const ImageZoom: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-zoom-in bg-brand-cream"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
      />
      {isHovered && (
        <div 
          className="absolute inset-0 bg-no-repeat transition-all duration-75 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: backgroundPosition,
            backgroundSize: '250%', // Premium 2.5x zoom
          }}
        />
      )}
    </div>
  );
};

export const GridShowroom: React.FC = () => {
  const { addToInquiry } = useApp();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);
  const [quantityInput, setQuantityInput] = useState<string>('100');
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [added, setAdded] = useState(false);

  const getGsmRangeText = (itemName: string, defaultGsm: number) => {
    if (itemName.toLowerCase().includes("hoodie")) return "300 - 360 GSM";
    if (itemName.toLowerCase().includes("oversized")) return "220 - 240 GSM";
    if (itemName.toLowerCase().includes("regular")) return "160 - 200 GSM";
    return `${defaultGsm} GSM`;
  };

  const getAvailableWeights = (itemName: string) => {
    if (itemName.toLowerCase().includes("hoodie")) return [300, 340, 360];
    if (itemName.toLowerCase().includes("oversized")) return [220, 240];
    if (itemName.toLowerCase().includes("regular")) return [160, 180, 200];
    return [220]; // Default/Polo
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Load all 3 T-shirt models
  useEffect(() => {
    const fetchAllTshirts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/collections');
        const collectionsData = res.data;
        
        // Fetch items for all collections to load the 3 t-shirts
        const itemsPromises = collectionsData.map((col: Collection) => 
          axios.get(`/api/v1/collections/${col.slug}`)
        );
        const detailResponses = await Promise.all(itemsPromises);
        
        let loadedItems: ClothingItem[] = [];
        detailResponses.forEach(res => {
          loadedItems = [...loadedItems, ...res.data.items];
        });
        
        // We ensure we only display the 3 primary types: Regular, Oversized, Polo
        const primaryItems = loadedItems.filter(item => 
          item.name.toLowerCase().includes("t-shirt")
        );
        setItems(primaryItems);
      } catch (err) {
        console.error('Error fetching all tshirts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTshirts();
  }, []);

  // Scroll to target hash once items are loaded to prevent layout shift offset
  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, [loading]);

  // Update selection details when a new item is selected
  useEffect(() => {
    if (selectedItem) {
      setSelectedColor(selectedItem.available_colors[0]);
      setQuantityInput('100');
      setActiveImgIdx(0);
      setAdded(false);
    }
  }, [selectedItem]);

  const handleAddToInquiry = () => {
    if (!selectedItem || !selectedColor) return;
    const finalQuantity = Math.max(100, parseInt(quantityInput) || 100);
    const defaultGsm = getAvailableWeights(selectedItem.name)[0];
    addToInquiry(selectedItem, selectedColor, finalQuantity, defaultGsm, 'Multiple');
    setAdded(true);
    setQuantityInput(finalQuantity.toString());
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-xs uppercase tracking-[0.25em] text-brand-charcoal/50 font-medium">
        Loading Digital Showroom...
      </div>
    );
  }

  // Get active images based on selected color
  const getActiveImages = () => {
    if (!selectedItem || !selectedColor) return [];
    const colorIdx = selectedItem.available_colors.findIndex(c => c.hex === selectedColor.hex);
    return (colorIdx > -1 && selectedItem.images.length >= (colorIdx + 1) * 4)
      ? selectedItem.images.slice(colorIdx * 4, (colorIdx + 1) * 4)
      : selectedItem.images.slice(0, 4);
  };

  const activeImages = getActiveImages();

  return (
    <section id="collections" className="py-24 bg-brand-beige scroll-mt-20">
      <div className="editorial-container mx-auto">
        
        {/* Title Section */}
        <div className="border-b border-brand-charcoal/10 pb-8 mb-16 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/40">Wholesale Catalog</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-brand-charcoal">The Digital Showroom</h2>
          <p className="text-xs text-brand-charcoal/50 tracking-wider">
            Explore our curated line of premium blank styles. Click a model below to configure sizes and specifications.
          </p>
        </div>

        {/* Symmetric 3-column T-Shirt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div 
                key={item.id} 
                className={`flex flex-col group cursor-pointer transition-all duration-500 border p-6 bg-white rounded-lg shadow-sm ${
                  isSelected 
                    ? 'border-brand-charcoal ring-1 ring-brand-charcoal/20 scale-[1.01]' 
                    : 'border-brand-concrete/30 hover:border-brand-charcoal/50 hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedItem(item);
                  setTimeout(() => {
                    const el = document.getElementById('showroom-spec-container');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }, 150);
                }}
              >
                {/* Image Card Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream border border-brand-concrete/20 mb-6 rounded-md">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover image-zoom-hover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-obsidian/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-beige w-full text-center">
                      Configure Specifications
                    </span>
                  </div>
                </div>

                {/* Info block */}
                <div className="flex items-start justify-between border-t border-brand-charcoal/5 pt-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-brand-charcoal font-medium group-hover:underline decoration-brand-charcoal/30 underline-offset-4">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest font-medium">
                      {item.fabric_composition} • {getGsmRangeText(item.name, item.gsm_weight)}
                    </p>
                  </div>
                  
                  {/* Swatches count indicator */}
                  <div className="flex space-x-1 mt-1.5">
                    {item.available_colors.slice(0, 3).map((col, cIdx) => (
                      <span 
                        key={cIdx} 
                        className="w-2.5 h-2.5 rounded-full border border-brand-charcoal/10" 
                        style={{ backgroundColor: col.hex }} 
                        title={col.name}
                      />
                    ))}
                    {item.available_colors.length > 3 && (
                      <span className="text-[8px] text-brand-charcoal/40 font-bold leading-none pl-0.5">
                        +{item.available_colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Size / Specifications Container */}
        <div id="showroom-spec-container" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {selectedItem && selectedColor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as const }}
                className="relative overflow-hidden border border-brand-concrete/40 bg-white rounded-lg shadow-sm"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-brand-beige/50 rounded-full transition-colors cursor-pointer z-10"
                  aria-label="Close configuration"
                >
                  <X size={18} />
                </button>
                <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                  
                  {/* Column 1: Media Preview Gallery */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto bg-brand-cream overflow-hidden border border-brand-concrete/30 rounded-md">
                      {activeImages.length > 0 && (
                        <ImageZoom 
                          src={activeImages[activeImgIdx]} 
                          alt={`${selectedItem.name} image ${activeImgIdx + 1}`} 
                        />
                      )}

                      {activeImages.length > 1 && (
                        <>
                          <button 
                            onClick={() => setActiveImgIdx(prev => (prev - 1 + activeImages.length) % activeImages.length)} 
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 border border-brand-concrete/30 rounded-full text-brand-charcoal hover:bg-brand-beige cursor-pointer transition-colors shadow-sm"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button 
                            onClick={() => setActiveImgIdx(prev => (prev + 1) % activeImages.length)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 border border-brand-concrete/30 rounded-full text-brand-charcoal hover:bg-brand-beige cursor-pointer transition-colors shadow-sm"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Active Image Angle Label */}
                    <div className="text-[9px] uppercase tracking-[0.2em] text-brand-charcoal/50 text-center font-bold">
                      {activeImgIdx === 0 ? "Front View" : activeImgIdx === 1 ? "Back View" : activeImgIdx === 2 ? "Branded View" : "Knit Structure"}
                    </div>

                    {/* Thumbnails row */}
                    <div className="flex justify-center gap-2 overflow-x-auto py-1">
                      {activeImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImgIdx(idx)}
                          className={`w-12 h-16 border bg-brand-cream transition-all flex-shrink-0 cursor-pointer rounded-sm ${
                            activeImgIdx === idx 
                              ? 'border-brand-charcoal ring-1 ring-brand-charcoal/50' 
                              : 'border-brand-concrete/40 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`angle ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Spec Configurator Options */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-charcoal/45">Showroom Specification Area</span>
                      <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-brand-charcoal">{selectedItem.name}</h2>
                    </div>

                    <p className="text-xs text-brand-charcoal/70 tracking-wide leading-relaxed">
                      {selectedItem.description}
                    </p>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-4 border-y border-brand-charcoal/10 py-5 text-xs tracking-wider">
                      <div>
                        <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Fabric Composition</span>
                        <span className="font-semibold text-brand-charcoal">{selectedItem.fabric_composition}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Available fabric weights</span>
                        <span className="font-semibold text-brand-charcoal">{getAvailableWeights(selectedItem.name).join(', ')} GSM</span>
                      </div>
                      {selectedItem.knit_structure && (
                        <div>
                          <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Knit Structure</span>
                          <span className="font-semibold text-brand-charcoal">{selectedItem.knit_structure}</span>
                        </div>
                      )}
                      {selectedItem.finish && (
                        <div>
                          <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Required Finish</span>
                          <span className="font-semibold text-brand-charcoal">{selectedItem.finish}</span>
                        </div>
                      )}
                    </div>

                    {/* Swatch Selector */}
                    <div className="space-y-3">
                      <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Select Production Color</span>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedItem.available_colors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedColor(color);
                              setActiveImgIdx(0);
                            }}
                            className={`flex items-center space-x-2 px-3 py-1.5 border text-xs tracking-wide cursor-pointer transition-all rounded-sm ${
                              selectedColor.hex === color.hex 
                                ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' 
                                : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal bg-white'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-brand-charcoal/10" style={{ backgroundColor: color.hex }} />
                            <span>{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fabric Weight Selector */}
                    <div className="space-y-3">
                      <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Fabric Weight</span>
                      <div className="flex flex-wrap gap-2.5">
                        {getAvailableWeights(selectedItem.name).map((weight) => (
                          <span
                            key={weight}
                            className="px-4 py-1.5 border border-brand-concrete text-xs tracking-wider text-brand-charcoal bg-white rounded-sm select-none"
                          >
                            {weight} GSM
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Garment Size Selection Container */}
                    <div className="space-y-3">
                      <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Size</span>
                      <div className="flex flex-wrap gap-2.5">
                        {sizes.map((sz) => (
                          <span
                            key={sz}
                            className="w-12 py-1.5 border border-brand-concrete text-xs tracking-wider font-semibold text-center text-brand-charcoal bg-white rounded-sm select-none"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions and success state */}
                    <div className="pt-4 border-t border-brand-charcoal/10 flex flex-col gap-3">
                      <button 
                        onClick={handleAddToInquiry}
                        disabled={added}
                        className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 rounded-sm ${
                          added 
                            ? 'bg-green-800 text-white' 
                            : 'bg-brand-charcoal text-brand-beige hover:bg-brand-obsidian'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check size={16} /> Added to Inquiry Clipboard
                          </>
                        ) : (
                          "Add to Bulk Inquiry"
                        )}
                      </button>
                      <div className="text-[8px] text-brand-charcoal/40 text-center tracking-widest uppercase">
                        No direct checkout. Submitting is processed as a manufacturing request.
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
export default GridShowroom;
