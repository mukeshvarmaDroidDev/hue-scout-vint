import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft, Trash2, CheckCircle, FileSignature, ArrowRight } from 'lucide-react';
const countries = [
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' }
];

export const Contact: React.FC = () => {
  const { user, token, inquiryItems, removeFromInquiry, clearInquiry } = useApp();
  const navigate = useNavigate();

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [consent, setConsent] = useState(false);
  const [estimatedVolume] = useState('100-500');
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
      gsm_weight: item.gsm_weight,
      size: item.size || 'M',
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
        phone_number: phoneNumber,
        country_code: countryCode,
        consent: consent,
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
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/45">Huescout Sourcing Request</span>
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
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Huescout"
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. buyer@huescout.com"
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand-charcoal block">Phone number *</label>
                    <div className="flex items-center w-full bg-white border border-brand-concrete rounded-lg focus-within:border-brand-charcoal/80 transition-colors px-3 py-1">
                      {/* Country Code & Flag Dropdown */}
                      <div className="relative flex items-center pr-3 border-r border-brand-concrete/50 h-8 select-none">
                        <span className="text-base mr-1">{selectedCountry.flag}</span>
                        <span className="text-[10px] text-brand-charcoal/40 mr-2">▾</span>
                        <span className="text-xs font-semibold text-brand-charcoal/80">{selectedCountry.code}</span>

                        {/* Hidden native select overlapping the trigger */}
                        <select
                          value={`${selectedCountry.flag} ${selectedCountry.code}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            const match = countries.find(c => `${c.flag} ${c.code}` === val);
                            if (match) {
                              setSelectedCountry(match);
                              setCountryCode(match.code);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        >
                          {countries.map((c, idx) => (
                            <option key={idx} value={`${c.flag} ${c.code}`}>
                              {c.flag} {c.code} ({c.name})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Mobile number"
                        className="flex-1 bg-transparent px-3 py-3 text-xs tracking-wider focus:outline-none"
                      />
                    </div>
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

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      id="communication-consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 border border-brand-concrete rounded-sm focus:ring-brand-charcoal accent-brand-charcoal cursor-pointer"
                    />
                    <label htmlFor="communication-consent" className="text-[10px] text-brand-charcoal/65 tracking-wider leading-relaxed cursor-pointer select-none">
                      I consent to receive communication updates, custom wholesale price sheets, and logistics reports via email, SMS, or phone calls from HUESCOUT sourcing managers.
                    </label>
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

              {/* Inquiry Clipboard Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Inquiry Clipboard Summary Side */}
                <div className="bg-white border border-brand-concrete/30 p-6 shadow-sm space-y-6 flex flex-col justify-between h-fit w-full">
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
                                    onClick={() => removeFromInquiry(item.id, item.selectedColor.hex, item.gsm_weight, item.size)}
                                    className="text-brand-charcoal/40 hover:text-red-700 cursor-pointer"
                                    title="Remove item"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <span className="block text-[10px] text-brand-charcoal/50">{item.fabric_composition} &bull; {item.gsm_weight} GSM</span>
                                <span className="block text-[10px] text-brand-charcoal/50 font-bold">Color: {item.selectedColor.name} &bull; Size: {item.size || 'M'}</span>
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

                {/* Mill Map Location Block */}
                <div className="w-full h-44 bg-brand-cream relative overflow-hidden border border-brand-concrete/20 rounded-[24px] shadow-sm">
                  <a
                    href="https://maps.google.com/?q=Andhra+Pradesh,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full relative group cursor-pointer"
                  >
                    <img
                      src="/map-andhra-pradesh.png"
                      alt="HUESCOUT Mill Location"
                      className="w-full h-full object-cover transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-105 pointer-events-none"
                    />

                    {/* Glassmorphic Overlay Button */}
                    <div className="absolute inset-0 bg-[#0c0f12]/15 backdrop-blur-[0.5px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0c0f12]/25 group-hover:backdrop-blur-[1px]">
                      <span className="px-6 py-3 border border-white/40 bg-white/20 backdrop-blur-md rounded-full text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:bg-white/30 group-hover:scale-105 shadow-md">
                        VIEW MAP
                      </span>
                    </div>
                  </a>
                </div>

                {/* Direct Wholesale Email Desk */}
                <div className="text-center text-xs tracking-wider text-brand-charcoal/50 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-brand-charcoal/40">Wholesale Sourcing Desk</p>
                  <a href="mailto:sales@huescout.com" className="underline font-semibold text-brand-charcoal hover:text-[#08060D] transition-colors block">
                    sales@huescout.com
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Contact;
