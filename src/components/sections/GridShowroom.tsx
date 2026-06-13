import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { ItemDetailsModal } from './ItemDetailsModal';

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

export const GridShowroom: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  // Load active collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/collections');
        setCollections(res.data);
        if (res.data.length > 0) {
          setActiveCollection(res.data[0]);
        }
      } catch (err) {
        console.error('Error fetching collections', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Load items for the active collection
  useEffect(() => {
    if (!activeCollection) return;
    const fetchCollectionItems = async () => {
      try {
        const res = await axios.get(`/api/v1/collections/${activeCollection.slug}`);
        setItems(res.data.items);
      } catch (err) {
        console.error('Error fetching collection items', err);
      }
    };
    fetchCollectionItems();
  }, [activeCollection]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-xs uppercase tracking-[0.25em] text-brand-charcoal/50 font-medium">
        Loading Digital Showroom...
      </div>
    );
  }

  return (
    <section id="collections" className="py-24 bg-brand-beige scroll-mt-20">
      <div className="editorial-container mx-auto">
        {/* Editorial Subheader & Collection Selector */}
        <div className="border-b border-brand-charcoal/10 pb-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/40">Wholesale Catalog</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-brand-charcoal">The Digital Showroom</h2>
          </div>
          
          {/* Collection Tab Links */}
          <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-charcoal">
            {collections.map(col => (
              <button
                key={col.id}
                onClick={() => setActiveCollection(col)}
                className={`pb-2 relative cursor-pointer transition-colors ${activeCollection?.id === col.id ? 'text-brand-charcoal' : 'text-brand-charcoal/40 hover:text-brand-charcoal/70'}`}
              >
                {col.title}
                {activeCollection?.id === col.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-charcoal animate-fade-in" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Description Callout */}
        {activeCollection && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-charcoal/60">
                {activeCollection.season} Lookbook
              </p>
              <p className="font-serif text-lg md:text-xl text-brand-charcoal/85 leading-relaxed max-w-4xl">
                "{activeCollection.description}"
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-end text-xs uppercase tracking-[0.15em] font-medium text-brand-charcoal/50">
              Vertical Production Cycle: ~6-8 Weeks
            </div>
          </div>
        )}

        {/* Asymmetric Showroom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 lg:gap-x-12">
          {items.slice(0, 6).map((item, idx) => {
            // Asymmetric grid spanning logic:
            // Index 0: spans 7 columns (large)
            // Index 1: spans 5 columns
            // Index 2: spans 4 columns
            // Index 3: spans 8 columns (large)
            // Index 4: spans 6 columns
            // Index 5: spans 6 columns
            const spanClass = [
              'md:col-span-7',
              'md:col-span-5',
              'md:col-span-4',
              'md:col-span-8',
              'md:col-span-6',
              'md:col-span-6'
            ][idx % 6];

            return (
              <div 
                key={item.id} 
                className={`${spanClass} flex flex-col group cursor-pointer`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Wrap */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream border border-brand-concrete/20 mb-6">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover image-zoom-hover"
                    loading="lazy"
                  />
                  {/* Subtle hover specs reveal */}
                  <div className="absolute inset-0 bg-brand-obsidian/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex justify-between items-center w-full text-brand-beige">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium">View Spec Sheet</span>
                      <ArrowRight size={14} className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex items-start justify-between border-t border-brand-charcoal/5 pt-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-brand-charcoal font-medium group-hover:underline decoration-brand-charcoal/30 underline-offset-4">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest font-medium">
                      {item.fabric_composition} • {item.gsm_weight} GSM
                    </p>
                  </div>
                  
                  {/* Swatches Count indicator */}
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
      </div>

      {/* Garment Details Modal Overlay */}
      {selectedItem && (
        <ItemDetailsModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </section>
  );
};
