import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Policy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="editorial-container mx-auto max-w-[1000px] space-y-16">
          
          {/* Header Block */}
          <div className="space-y-4 border-b border-brand-concrete/30 pb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/45">Legal & Compliance</span>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-brand-charcoal uppercase leading-tight">
              Policy & Terms
            </h1>
            <p className="text-xs text-brand-charcoal/60 tracking-wider">
              Last updated: June 2026. Standard B2B supply agreements and corporate privacy guidelines.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12 text-xs md:text-sm text-brand-charcoal/80 leading-relaxed tracking-wider">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-light text-brand-charcoal uppercase">1. B2B Client Privacy</h3>
              <p>
                HUESCOUT values the intellectual property and corporate privacy of our boutique houses and retail group clients. Any technical specifications, custom sizing files, label designs, and fabric construction ratios submitted through our B2B inquiry sheet are treated as strictly confidential and will not be shared with third parties.
              </p>
              <p>
                We collect company details, emails, and phone records solely to manage custom sourcing workflows, coordinate logistics, and verify cargo shipping details.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-light text-brand-charcoal uppercase">2. Minimum Order Quantities (MOQ)</h3>
              <p>
                Our standard minimum order quantity (MOQ) is 100 units per style/colorway. This requirement is necessary to set up dye lots at our vat-dyeing plants and configure our automated weaving loom frameworks. For custom sizing profiles or premium high-GSM cashmere knits, MOQs may be adjusted by a dedicated sourcing manager.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-light text-brand-charcoal uppercase">3. Production Timelines & Logistics</h3>
              <p>
                Standard production cycles range between 15 to 30 business days from the approval of the custom tech pack and deposit verification. Shipping schedules are managed through international logistics lines from our manufacturing hubs in India. HUESCOUT is not liable for custom delays, port congestions, or local courier delays post-cargo handoff.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-light text-brand-charcoal uppercase">4. Return & Quality Control (QC) Policy</h3>
              <p>
                Every garment is subject to triple-pass inspection at our QC facility before packaging. Because all runs are custom-dyed and cut-and-sewn to client specifications, we do not accept returns or offer refunds unless a fabric structural defect or sizing variance exceeding standard tolerance (±1.5cm) is verified.
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Policy;
