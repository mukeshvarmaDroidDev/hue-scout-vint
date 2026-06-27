import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const Faqs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "Do you supply only plain T-shirts?",
      answer: "No, HUESCOUT manufactures a premium range of blanks including regular t-shirts, oversized t-shirts, polo t-shirts, and regular plain hoodies. We also offer custom fabric weaving and dye lots for boutique collections."
    },
    {
      question: "Can HUESCOUT support private labels?",
      answer: "Yes, we support full private label programs. We can integrate custom neck prints, woven tags, branded hangtags, care labels, and custom poly-packaging to deliver retail-ready products."
    },
    {
      question: "Do you work with export buyers?",
      answer: "Absolutely. We manage international cargo shipping, customs clearances, and delivery logistics, exporting regularly to streetwear labels, B2B retail groups, and boutique houses globally."
    },
    {
      question: "Can you create garments with our branding?",
      answer: "Yes. We offer professional custom branding options including high-mesh screen printing, puff prints, Direct-To-Garment (DTG), and high-density flat/3D embroidery."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1">
        {/* Top Banner Area */}
        <div className="py-20 border-b border-brand-concrete/20 bg-white">
          <div className="editorial-container mx-auto">
            <div className="space-y-4 max-w-4xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/45">Faqs</span>
              <h2 className="font-serif text-4xl md:text-5.5xl font-light tracking-tight text-[#08060D] uppercase leading-none">
                Frequently Asked<br className="hidden md:inline" /> Questions
              </h2>
              <p className="text-xs md:text-sm text-brand-charcoal/60 tracking-wider">
                Everything buyers ask before placing bulk orders.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Split Area */}
        <div className="py-24 editorial-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left copy column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-charcoal/45">
                <span className="text-red-500 font-sans text-xs">?</span>
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="font-serif text-3xl font-light text-[#08060D] leading-snug uppercase">
                Have Questions?<br />We Have Answers.
              </h3>
              <p className="text-xs tracking-wider text-brand-charcoal/65">
                Reach out at <a href="mailto:sales@huescout.com" className="underline font-semibold hover:text-brand-charcoal text-brand-charcoal/90 transition-colors">sales@huescout.com</a>
              </p>
            </div>

            {/* Right accordion column */}
            <div className="lg:col-span-8 space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white border border-brand-concrete/40 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:border-brand-charcoal/30"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none group"
                    >
                      <span className="font-serif text-sm md:text-base font-light text-[#08060D] group-hover:text-black transition-colors duration-300">
                        {faq.question}
                      </span>
                      <span className="ml-4 text-brand-charcoal/60 transition-transform duration-300">
                        {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                      </span>
                    </button>

                    <div
                      className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
                      style={{
                        maxHeight: isOpen ? '250px' : '0px',
                        opacity: isOpen ? 1 : 0
                      }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-brand-concrete/10 text-xs md:text-sm text-brand-charcoal/70 leading-relaxed tracking-wider">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Faqs;
