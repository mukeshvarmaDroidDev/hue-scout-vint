import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import type { ClothingItem, Collection, ColorSwatch } from '../components/sections/GridShowroom';
import { SlidersHorizontal, ArrowUpRight, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

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

export const Collections: React.FC = () => {
  const { addToInquiry } = useApp();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [gsmFilter, setGsmFilter] = useState<string>('all');
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);
  const [selectedGsm, setSelectedGsm] = useState<number>(160);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantityInput, setQuantityInput] = useState<string>('100');
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [added, setAdded] = useState(false);

  const getAvailableWeights = (itemName: string) => {
    if (itemName.toLowerCase().includes("oversized")) return [220, 240];
    if (itemName.toLowerCase().includes("regular")) return [160, 180, 200];
    return [220]; // Default/Polo
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Fetch all collections and items on load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const colRes = await axios.get('/api/v1/collections');
        setCollections(colRes.data);

        // Fetch items for all collections to build the full catalog list
        const itemsPromises = colRes.data.map((col: Collection) => 
          axios.get(`/api/v1/collections/${col.slug}`)
        );
        const detailResponses = await Promise.all(itemsPromises);
        
        let loadedItems: ClothingItem[] = [];
        detailResponses.forEach(res => {
          loadedItems = [...loadedItems, ...res.data.items];
        });
        
        setAllItems(loadedItems);
        setFilteredItems(loadedItems);
      } catch (err) {
        console.error('Error loading full catalog', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...allItems];

    // Filter by Collection
    if (selectedCollection !== 'all') {
      const colId = collections.find(c => c.slug === selectedCollection)?.id;
      if (colId) {
        result = result.filter(item => item.collection_id === colId);
      }
    }

    // Filter by GSM fabric weight (tailored for T-shirt weights 160/180/200/220/240 GSM)
    if (gsmFilter === 'light') {
      result = result.filter(item => getAvailableWeights(item.name).includes(160));
    } else if (gsmFilter === 'medium') {
      result = result.filter(item => getAvailableWeights(item.name).includes(180) || getAvailableWeights(item.name).includes(200));
    } else if (gsmFilter === 'heavy220') {
      result = result.filter(item => getAvailableWeights(item.name).includes(220));
    } else if (gsmFilter === 'heavy240') {
      result = result.filter(item => getAvailableWeights(item.name).includes(240));
    }

    setFilteredItems(result);
    setVisibleCount(12); // Reset pagination count on filter change
    setSelectedItem(null); // Reset detail view when filters change
  }, [selectedCollection, gsmFilter, allItems, collections]);

  // Update detail states on selection change
  useEffect(() => {
    if (selectedItem) {
      setSelectedColor(selectedItem.available_colors[0]);
      setSelectedGsm(getAvailableWeights(selectedItem.name)[0]);
      setSelectedSize('M');
      setQuantityInput('100');
      setActiveImgIdx(0);
      setAdded(false);
    } else {
      setSelectedColor(null);
    }
  }, [selectedItem]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const handleAddToInquiry = () => {
    if (!selectedItem || !selectedColor) return;
    const finalQuantity = Math.max(100, parseInt(quantityInput) || 100);
    addToInquiry(selectedItem, selectedColor, finalQuantity, selectedGsm, selectedSize);
    setAdded(true);
    setQuantityInput(finalQuantity.toString());
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

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
    <div className="min-h-screen bg-brand-beige flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="editorial-container mx-auto space-y-12">
          
          {/* Header Block */}
          <div className="border-b border-brand-charcoal/10 pb-8 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/40">Wholesale Archive</span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-brand-charcoal">The Catalog Index</h1>
            <p className="text-xs text-brand-charcoal/50 tracking-wider">
              Browse our complete registry of {allItems.length} contract-dyed fabrics and structured garments.
            </p>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center items-center text-xs uppercase tracking-[0.25em] text-brand-charcoal/45">
              Syncing Showroom Catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Filter Sidebar (Desktop) */}
              <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                <div className="flex items-center gap-2 border-b border-brand-charcoal/10 pb-3">
                  <SlidersHorizontal size={14} className="text-brand-charcoal/60" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal">Catalog Filters</span>
                </div>

                {/* Collection Filter */}
                <div className="space-y-3">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/45">Select Collection</span>
                  <div className="flex flex-col space-y-2 text-xs tracking-wider">
                    <button
                      onClick={() => setSelectedCollection('all')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${selectedCollection === 'all' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      All Collections ({allItems.length})
                    </button>
                    {collections.map(col => {
                      const count = allItems.filter(item => item.collection_id === col.id).length;
                      return (
                        <button
                          key={col.id}
                          onClick={() => setSelectedCollection(col.slug)}
                          className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${selectedCollection === col.slug ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                        >
                          {col.title} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fabric Weight Filter */}
                <div className="space-y-3 pt-4 border-t border-brand-charcoal/5">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/45">Fabric Weight (GSM)</span>
                  <div className="flex flex-col space-y-2 text-xs tracking-wider">
                    <button
                      onClick={() => setGsmFilter('all')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${gsmFilter === 'all' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      All Weights
                    </button>
                    <button
                      onClick={() => setGsmFilter('light')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${gsmFilter === 'light' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      Lightweight (160 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('medium')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${gsmFilter === 'medium' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      Mid-weight (180 - 200 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('heavy220')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${gsmFilter === 'heavy220' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      Heavyweight (220 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('heavy240')}
                      className={`text-left px-3 py-2 border cursor-pointer transition-all duration-300 ${gsmFilter === 'heavy240' ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal/70 bg-white'}`}
                    >
                      Heavyweight (240 GSM)
                    </button>
                  </div>
                </div>
              </div>

              {/* Showroom Grid View (3 columns on Desktop) */}
              <div className="lg:col-span-3 space-y-12">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 border border-brand-concrete/30 bg-white text-xs text-brand-charcoal/40 tracking-wider">
                    No garments match the selected filter parameters.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                      {filteredItems.slice(0, visibleCount).map(item => {
                        const isSelected = selectedItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedItem(item);
                              setTimeout(() => {
                                const el = document.getElementById('catalog-spec-container');
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                              }, 150);
                            }}
                            className={`flex flex-col group cursor-pointer border p-4 bg-white rounded-lg shadow-sm transition-all duration-300 ${
                              isSelected 
                                ? 'border-brand-charcoal ring-1 ring-brand-charcoal/20' 
                                : 'border-brand-concrete/30 hover:border-brand-charcoal/50'
                            }`}
                          >
                            <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream border border-brand-concrete/20 mb-4 rounded-md">
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover image-zoom-hover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-brand-obsidian/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="flex justify-between items-center w-full text-brand-beige text-[9px] uppercase tracking-[0.2em] font-semibold">
                                  <span>Configure Specifications</span>
                                  <ArrowUpRight size={12} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-serif text-base text-brand-charcoal font-medium group-hover:underline underline-offset-4 decoration-brand-charcoal/30">
                                {item.name}
                              </h3>
                              <p className="text-[9px] text-brand-charcoal/50 uppercase tracking-widest font-semibold">
                                {item.fabric_composition} • {item.gsm_weight} GSM
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredItems.length && (
                      <div className="flex justify-center pt-8">
                        <button
                          onClick={handleLoadMore}
                          className="px-10 py-4 border border-brand-charcoal text-brand-charcoal text-xs uppercase tracking-[0.25em] font-bold hover:bg-brand-charcoal hover:text-brand-beige transition-colors cursor-pointer"
                        >
                          Load More Styles ({filteredItems.length - visibleCount} remaining)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          )}

          {/* Inline customization spec container */}
          <div id="catalog-spec-container" className="scroll-mt-24">
            <AnimatePresence mode="wait">
              {selectedItem && selectedColor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="relative overflow-hidden border border-brand-concrete/40 bg-white rounded-lg shadow-md mt-8"
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
                    
                    {/* Left gallery column */}
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

                      <div className="text-[9px] uppercase tracking-[0.2em] text-brand-charcoal/50 text-center font-bold">
                        {activeImgIdx === 0 ? "Front View" : activeImgIdx === 1 ? "Back View" : activeImgIdx === 2 ? "Branded View" : "Knit Structure"}
                      </div>

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

                    {/* Right spec options column */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-charcoal/45">Showroom Specification Area</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-brand-charcoal">{selectedItem.name}</h2>
                      </div>

                      <p className="text-xs text-brand-charcoal/70 tracking-wide leading-relaxed">
                        {selectedItem.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 border-y border-brand-charcoal/10 py-5 text-xs tracking-wider">
                        <div>
                          <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Fabric Composition</span>
                          <span className="font-semibold text-brand-charcoal">{selectedItem.fabric_composition}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-brand-charcoal/40 uppercase tracking-widest font-bold mb-1">Selected fabric weight</span>
                          <span className="font-semibold text-brand-charcoal">{selectedGsm} GSM</span>
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
                        <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Select Fabric Weight</span>
                        <div className="flex flex-wrap gap-2.5">
                          {getAvailableWeights(selectedItem.name).map((weight) => (
                            <button
                              key={weight}
                              onClick={() => setSelectedGsm(weight)}
                              className={`px-4 py-1.5 border text-xs tracking-wider cursor-pointer transition-all rounded-sm ${
                                selectedGsm === weight 
                                  ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' 
                                  : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal bg-white'
                              }`}
                            >
                              {weight} GSM
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Garment Size Selection Container */}
                      <div className="space-y-3">
                        <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Select Size</span>
                        <div className="flex flex-wrap gap-2.5">
                          {sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setSelectedSize(sz)}
                              className={`w-12 py-1.5 border text-xs tracking-wider font-semibold cursor-pointer transition-all text-center rounded-sm ${
                                selectedSize === sz 
                                  ? 'border-brand-charcoal bg-brand-charcoal text-brand-beige' 
                                  : 'border-brand-concrete hover:border-brand-charcoal/50 text-brand-charcoal bg-white'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* B2B volume selector (MOQ 100) */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="block text-[9px] text-brand-charcoal/45 uppercase tracking-widest font-bold">Estimated Production Volume</span>
                          <span className="text-[8px] uppercase tracking-wider text-brand-charcoal/40 font-bold">MOQ: 100 units per color</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input 
                            type="number" 
                            min={100}
                            step={50}
                            value={quantityInput}
                            onChange={(e) => setQuantityInput(e.target.value)}
                            onBlur={() => {
                              const parsed = parseInt(quantityInput);
                              if (isNaN(parsed) || parsed < 100) {
                                setQuantityInput('100');
                              } else {
                                setQuantityInput(parsed.toString());
                              }
                            }}
                            className="w-32 bg-white border border-brand-concrete px-4 py-2 text-xs tracking-widest font-medium focus:border-brand-charcoal focus:outline-none rounded-sm"
                          />
                          <span className="text-xs text-brand-charcoal/50 tracking-wider">Units</span>
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
      </main>

      <Footer />
    </div>
  );
};
export default Collections;
