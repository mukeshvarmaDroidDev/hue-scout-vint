import React from 'react';
import { motion } from 'framer-motion';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Printing Options',
      description: 'Premium printing techniques including screen, DTG, puff, embroidery and more.',
      image: '/service-printing.png'
    },
    {
      title: 'Fabric Variety',
      description: 'Wide range of premium fabrics crafted for comfort, durability and elevated quality.',
      image: '/service-fabric.png'
    },
    {
      title: 'Custom Colours',
      description: 'Match your brand perfectly with unlimited custom colour development.',
      image: '/service-colours.png'
    },
    {
      title: 'Custom Sizing',
      description: "Bespoke sizing tailored to your brand's fit, style and target audience.",
      image: '/service-sizing.png'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },
  };

  return (
    <section id="services" className="py-24 bg-brand-beige scroll-mt-20 border-b border-brand-charcoal/5">
      <div className="editorial-container mx-auto space-y-16">
        
        {/* Title Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/45">What We Offer</span>
          <h2 className="font-serif text-2.5xl sm:text-3.5xl md:text-5xl font-light tracking-wide text-brand-charcoal">Our Services</h2>
          <p className="text-[11px] sm:text-xs text-brand-charcoal/55 tracking-wider leading-relaxed">
            Everything you need for premium bulk apparel — from custom printing to bespoke fabric and sizing.
          </p>
        </div>

        {/* 4-Card Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ 
                y: -4, 
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } 
              }}
              className="flex flex-col items-center text-center p-8 bg-white border border-brand-concrete/25 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.035)] hover:border-brand-charcoal/20 transition-all duration-500 ease-out group"
            >
              {/* Circular Icon Wrapper */}
              <div className="w-24 h-24 flex items-center justify-center mb-6 select-none">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-contain transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-108"
                />
              </div>

              {/* Service Details */}
              <h3 className="font-serif text-base text-brand-charcoal font-medium mb-3">
                {service.title}
              </h3>
              <p className="text-[11px] text-brand-charcoal/65 tracking-wider leading-relaxed max-w-xs">
                {service.description}
              </p>

              {/* Dot Indicators */}
              <div className="flex gap-1.5 justify-center mt-6">
                {[0, 1, 2, 3].map((dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      dotIdx === idx ? 'bg-brand-charcoal scale-110' : 'bg-brand-charcoal/10'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
export default ServicesSection;
