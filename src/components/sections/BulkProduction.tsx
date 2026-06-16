import React from 'react';
import { Layers, Palette, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BulkProduction: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <Layers size={18} strokeWidth={1.5} />,
      title: "Sampling & Fitting",
      desc: "Develop fit samples and fabric prototypes in our design atelier. Adjust patterns, weights, and fits within 10-14 days before starting production."
    },
    {
      num: "02",
      icon: <Palette size={18} strokeWidth={1.5} />,
      title: "Custom Dyeing & Weaving",
      desc: "Custom Pantone-matched yarn dyeing and weaving. Choose from standard catalog colors or request custom runs with minimum loom requirements."
    },
    {
      num: "03",
      icon: <ShieldCheck size={18} strokeWidth={1.5} />,
      title: "Assembly & Audit",
      desc: "Precision garment assembly, hand-finished detailing, and individual audits. Every batch is certified under standard luxury group specifications."
    },
    {
      num: "04",
      icon: <Globe size={18} strokeWidth={1.5} />,
      title: "Cargo & Compliance",
      desc: "Customs-cleared consolidated air or ocean shipping directly to your retail warehouse. Full linesheets and certificate documentation provided."
    }
  ];

  return (
    <section id="production" className="py-32 bg-[#FAF9F6] border-t border-brand-charcoal/5 scroll-mt-20">
      <div className="editorial-container mx-auto space-y-24">
        
        {/* Title and Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-charcoal/10 pb-8 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/40">Vertical Pipeline</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-charcoal">The Production Lifecycle</h2>
          </div>
          <p className="text-xs text-brand-charcoal/50 max-w-sm tracking-wider leading-relaxed">
            From textile mill to finished cargo delivery, we coordinate a seamless custom contract manufacturing process.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Showcase (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative overflow-hidden border border-brand-charcoal/10 aspect-square group shadow-sm bg-brand-cream">
              <img 
                src="/cotton-rolls-atelier.png" 
                alt="Textile Weaving Atelier" 
                className="w-full h-full object-cover image-zoom-hover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-obsidian/5 transition-opacity duration-300 group-hover:opacity-0" />
              {/* Glass Tag */}
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/80 border border-white/20 p-4 shadow-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-charcoal">Cotton Yarn Studio</p>
                  <p className="text-[10px] text-brand-charcoal/60 font-serif italic">Chennai Atelier Facility</p>
                </div>
                <span className="text-[9px] uppercase tracking-[0.15em] text-brand-charcoal/40 font-semibold">100% Traceable</span>
              </div>
            </div>
          </div>

          {/* Timeline Steps (7 Columns) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {steps.map((step, idx) => (
                <div key={idx} className="group relative space-y-4 border-l border-brand-charcoal/10 pl-6 hover:border-brand-charcoal transition-colors duration-500">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-4xl font-light text-brand-charcoal/20 group-hover:text-brand-charcoal/40 transition-colors duration-500">
                      {step.num}
                    </span>
                    <div className="text-brand-charcoal/60 group-hover:text-brand-charcoal transition-colors duration-500">
                      {step.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-brand-charcoal font-medium">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-brand-charcoal/65 tracking-wider leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Premium Dark Capacity Highlight Card */}
        <div className="relative overflow-hidden bg-brand-charcoal text-brand-beige border border-brand-charcoal/10 px-8 py-12 md:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 max-w-6xl mx-auto shadow-xl group">
          {/* Background subtle mesh glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          
          <div className="space-y-3 z-10">
            <span className="inline-block text-[9px] uppercase tracking-[0.25em] font-bold text-[#E3E1DB]/60 bg-white/5 border border-white/10 px-3 py-1">
              Custom Manufacturing Inquiries
            </span>
            <h4 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-brand-beige leading-snug">
              Need customized fabrics, weights, or branding?
            </h4>
            <p className="text-xs text-[#E3E1DB]/65 max-w-2xl tracking-wider leading-relaxed">
              We offer bespoke labeling, custom hardware attachments, and specific GSM adjustments (160/180/200 weights) for contract runs exceeding 300 units per style.
            </p>
          </div>
          
          <div className="z-10 w-full lg:w-auto pt-2 lg:pt-0">
            <Link
              to="/inquire"
              className="w-full lg:w-auto text-xs uppercase tracking-[0.25em] font-bold text-brand-charcoal bg-[#FAF9F6] border border-transparent px-10 py-5 hover:bg-transparent hover:text-[#FAF9F6] hover:border-[#FAF9F6]/20 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 group-hover:translate-x-1 transform transition-transform"
            >
              Request Specs & Pricing
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
