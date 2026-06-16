import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ItemDetailsModal } from '../components/sections/ItemDetailsModal';
import type { ClothingItem, Collection } from '../components/sections/GridShowroom';
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [gsmFilter, setGsmFilter] = useState<string>('all');
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

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

    // Filter by GSM fabric weight (tailored for T-shirt weights 160/180/220/240 GSM)
    if (gsmFilter === 'light') {
      result = result.filter(item => item.gsm_weight === 160);
    } else if (gsmFilter === 'medium') {
      result = result.filter(item => item.gsm_weight === 180);
    } else if (gsmFilter === 'heavy220') {
      result = result.filter(item => item.gsm_weight === 220);
    } else if (gsmFilter === 'heavy240') {
      result = result.filter(item => item.gsm_weight === 240);
    }

    setFilteredItems(result);
    setVisibleCount(12); // Reset pagination count on filter change
  }, [selectedCollection, gsmFilter, allItems, collections]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

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
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${selectedCollection === 'all' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
                    >
                      All Collections ({allItems.length})
                    </button>
                    {collections.map(col => {
                      const count = allItems.filter(item => item.collection_id === col.id).length;
                      return (
                        <button
                          key={col.id}
                          onClick={() => setSelectedCollection(col.slug)}
                          className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${selectedCollection === col.slug ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
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
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${gsmFilter === 'all' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
                    >
                      All Weights
                    </button>
                    <button
                      onClick={() => setGsmFilter('light')}
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${gsmFilter === 'light' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
                    >
                      Lightweight (160 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('medium')}
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${gsmFilter === 'medium' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
                    >
                      Mid-weight (180 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('heavy220')}
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${gsmFilter === 'heavy220' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
                    >
                      Heavyweight (220 GSM)
                    </button>
                    <button
                      onClick={() => setGsmFilter('heavy240')}
                      className={`text-left hover:text-brand-charcoal cursor-pointer transition-colors ${gsmFilter === 'heavy240' ? 'text-brand-charcoal font-bold' : 'text-brand-charcoal/50'}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                      {filteredItems.slice(0, visibleCount).map(item => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="flex flex-col group cursor-pointer"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream border border-brand-concrete/20 mb-4">
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="w-full h-full object-cover image-zoom-hover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-brand-obsidian/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <div className="flex justify-between items-center w-full text-brand-beige text-[9px] uppercase tracking-[0.2em] font-semibold">
                                <span>Inspect Spec Sheet</span>
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
                      ))}
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

        </div>
      </main>

      {selectedItem && (
        <ItemDetailsModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <Footer />
    </div>
  );
};
export default Collections;
