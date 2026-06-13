import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft, Trash2, CheckCircle, FileSignature, ArrowRight } from 'lucide-react';

export const Inquire: React.FC = () => {
  const { user, token, inquiryItems, removeFromInquiry, clearInquiry } = useApp();
  const navigate = useNavigate();

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [estimatedVolume, setEstimatedVolume] = useState('100-500');
  const [messageText, setMessageText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill user details if authenticated
  useEffect(() => {
    if (user) {
      setCompanyName(user.company_name);
      setContactEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare requested items list payload
    const itemsPayload = inquiryItems.map(item => ({
      item_id: item.id,
      name: item.name,
      color: item.selectedColor.name,
      quantity: item.quantity
    }));

    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post('/api/v1/inquiries', {
        company_name: companyName,
        contact_email: contactEmail,
        estimated_volume: estimatedVolume,
        message_text: messageText,
        items_inquired: itemsPayload.length > 0 ? itemsPayload : null
      }, { headers });

      setSubmitted(true);
      clearInquiry();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Failed to submit inquiry request. Please verify inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="editorial-container mx-auto max-w-6xl space-y-12">
          
          {/* Back Trigger */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-brand-charcoal/50 hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft size={12} /> Back to showroom
          </button>

          {submitted ? (
            /* Submission success screen */
            <div className="bg-white border border-brand-concrete/30 p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm animate-fade-in">
              <div className="text-green-800 flex justify-center"><CheckCircle size={48} strokeWidth={1} /></div>
              <h2 className="font-serif text-2xl text-brand-charcoal font-medium">Inquiry Submitted</h2>
              <p className="text-xs text-brand-charcoal/65 tracking-wider leading-relaxed">
                Thank you for submitting your custom B2B manufacturing specifications. An Atelier sourcing manager will review your requested items, volume estimates, and raw fabric sheets, and contact you via your corporate email within 24 business hours.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-xs uppercase tracking-[0.2em] font-semibold bg-brand-charcoal text-brand-beige py-3.5 hover:bg-brand-obsidian transition-colors cursor-pointer"
                  >
                    Go to Portal Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/')}
                    className="text-xs uppercase tracking-[0.2em] font-semibold bg-brand-charcoal text-brand-beige py-3.5 hover:bg-brand-obsidian transition-colors cursor-pointer"
                  >
                    Return to Showroom
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Multi-part inquiry structure */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Form Input Side */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/45">Atelier Sourcing Request</span>
                  <h1 className="font-serif text-3xl font-light text-brand-charcoal">Request Production Specs</h1>
                  <p className="text-xs text-brand-charcoal/50 tracking-wider">
                    Submit your customized fabric drapes and estimated runs directly to our loom network.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-800 text-xs p-4 border-l-2 border-red-800 tracking-wide">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Atelier & Co."
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Corporate Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. buyer@atelier.com"
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Estimated Order Volume Bracket</label>
                    <select
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    >
                      <option value="100-500">100 - 500 Units (Standard MOQ)</option>
                      <option value="500-1000">500 - 1000 Units (Bulk Run)</option>
                      <option value="1000+">1000+ Units (Enterprise Mill Run)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Custom Requirements / Fabric specifications</label>
                    <textarea 
                      rows={6}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="State any adjustments to lengths, custom coloring codes, label weaving, hanger loops, or packaging requirements."
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-charcoal text-brand-beige py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-brand-obsidian transition-colors cursor-pointer flex justify-center items-center gap-2"
                  >
                    {loading ? 'Submitting Specifications...' : 'Submit B2B Inquiry'}
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

              {/* Inquiry Clipboard Summary Side */}
              <div className="lg:col-span-5 bg-white border border-brand-concrete/30 p-6 shadow-sm space-y-6 flex flex-col justify-between h-fit">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-charcoal/5 pb-4">
                    <FileSignature size={16} strokeWidth={1.5} className="text-brand-charcoal/50" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal">Inquiry Clipboard</span>
                  </div>

                  {inquiryItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-brand-charcoal/40 tracking-wider space-y-2">
                      <p>Clipboard is currently empty.</p>
                      <p className="text-[10px] text-brand-charcoal/30">You can still submit a general consultation inquiry above.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-brand-charcoal/5 max-h-96 overflow-y-auto pr-2">
                      {inquiryItems.map((item, idx) => (
                        <div key={idx} className="py-4 flex gap-4 text-xs tracking-wider">
                          <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-brand-cream border border-brand-concrete/20" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-brand-charcoal">{item.name}</span>
                                <button 
                                  onClick={() => removeFromInquiry(item.id, item.selectedColor.hex)}
                                  className="text-brand-charcoal/40 hover:text-red-700 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span className="block text-[10px] text-brand-charcoal/50">{item.fabric_composition}</span>
                              <span className="block text-[10px] text-brand-charcoal/50 font-bold">Color: {item.selectedColor.name}</span>
                            </div>
                            <span className="block text-[10px] text-brand-charcoal/60 mt-1 font-bold">
                              Run Volume: {item.quantity} Units
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {inquiryItems.length > 0 && (
                  <div className="border-t border-brand-charcoal/5 pt-4 flex justify-between items-center text-[10px] text-brand-charcoal/50 tracking-wider">
                    <span>Total items: {inquiryItems.length} styles</span>
                    <button onClick={clearInquiry} className="hover:text-brand-charcoal underline cursor-pointer">Clear all</button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Inquire;
