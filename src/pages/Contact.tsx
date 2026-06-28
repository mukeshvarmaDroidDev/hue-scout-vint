import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft, Trash2, CheckCircle, FileSignature, ArrowRight } from 'lucide-react';
const countries = [
  { code: '+1', flag: '🇺🇸', name: 'United States', iso: 'us' },
  { code: '+1', flag: '🇨🇦', name: 'Canada', iso: 'ca' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom', iso: 'gb' },
  { code: '+91', flag: '🇮🇳', name: 'India', iso: 'in' },
  { code: '+61', flag: '🇦🇺', name: 'Australia', iso: 'au' },
  { code: '+49', flag: '🇩🇪', name: 'Germany', iso: 'de' },
  { code: '+33', flag: '🇫🇷', name: 'France', iso: 'fr' },
  { code: '+81', flag: '🇯🇵', name: 'Japan', iso: 'jp' },
  { code: '+86', flag: '🇨🇳', name: 'China', iso: 'cn' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates', iso: 'ae' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore', iso: 'sg' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa', iso: 'za' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil', iso: 'br' },
  { code: '+7', flag: '🇷🇺', name: 'Russia', iso: 'ru' },
  { code: '+39', flag: '🇮🇹', name: 'Italy', iso: 'it' },
  { code: '+34', flag: '🇪🇸', name: 'Spain', iso: 'es' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico', iso: 'mx' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia', iso: 'id' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey', iso: 'tr' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea', iso: 'kr' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands', iso: 'nl' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland', iso: 'ch' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden', iso: 'se' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium', iso: 'be' },
  { code: '+47', flag: '🇳🇴', name: 'Norway', iso: 'no' },
  { code: '+43', flag: '🇦🇹', name: 'Austria', iso: 'at' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark', iso: 'dk' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', iso: 'pt' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland', iso: 'ie' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand', iso: 'nz' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan', iso: 'pk' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia', iso: 'my' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand', iso: 'th' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam', iso: 'vn' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines', iso: 'ph' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', iso: 'sa' },
  { code: '+972', flag: '🇮🇱', name: 'Israel', iso: 'il' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt', iso: 'eg' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria', iso: 'ng' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya', iso: 'ke' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', iso: 'ar' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', iso: 'co' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', iso: 'cl' },
  { code: '+51', flag: '🇵🇪', name: 'Peru', iso: 'pe' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', iso: 've' },
  { code: '+48', flag: '🇵🇱', name: 'Poland', iso: 'pl' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine', iso: 'ua' },
  { code: '+30', flag: '🇬🇷', name: 'Greece', iso: 'gr' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic', iso: 'cz' },
  { code: '+40', flag: '🇷🇴', name: 'Romania', iso: 'ro' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary', iso: 'hu' },
  { code: '+358', flag: '🇫🇮', name: 'Finland', iso: 'fi' },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia', iso: 'sk' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia', iso: 'hr' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria', iso: 'bg' },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania', iso: 'lt' },
  { code: '+371', flag: '🇱🇻', name: 'Latvia', iso: 'lv' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia', iso: 'ee' },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia', iso: 'si' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus', iso: 'cy' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg', iso: 'lu' },
  { code: '+356', flag: '🇲🇹', name: 'Malta', iso: 'mt' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland', iso: 'is' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', iso: 'qa' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait', iso: 'kw' },
  { code: '+968', flag: '🇴🇲', name: 'Oman', iso: 'om' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain', iso: 'bh' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan', iso: 'jo' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon', iso: 'lb' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh', iso: 'bd' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka', iso: 'lk' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal', iso: 'np' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong', iso: 'hk' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan', iso: 'tw' },
  { code: '+853', flag: '🇲🇴', name: 'Macau', iso: 'mo' },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan', iso: 'kz' },
  { code: '+998', flag: '🇺🇿', name: 'Uzbekistan', iso: 'uz' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan', iso: 'az' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco', iso: 'ma' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria', iso: 'dz' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia', iso: 'tn' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana', iso: 'gh' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia', iso: 'et' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania', iso: 'tz' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda', iso: 'ug' },
  { code: '+244', flag: '🇦🇴', name: 'Angola', iso: 'ao' },
  { code: '+225', flag: '🇨🇮', name: 'Ivory Coast', iso: 'ci' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal', iso: 'sn' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica', iso: 'cr' },
  { code: '+507', flag: '🇵🇦', name: 'Panama', iso: 'pa' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', iso: 'gt' },
  { code: '+1', flag: '🇩🇴', name: 'Dominican Republic', iso: 'do' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador', iso: 'ec' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay', iso: 'uy' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay', iso: 'py' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia', iso: 'bo' },
  { code: '+1', flag: '🇯🇲', name: 'Jamaica', iso: 'jm' },
  { code: '+1', flag: '🇹🇹', name: 'Trinidad and Tobago', iso: 'tt' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras', iso: 'hn' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador', iso: 'sv' },
  { code: '+1', flag: '🇧🇸', name: 'Bahamas', iso: 'bs' }
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

  // Custom Searchable Dropdown States
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredCountries = countries.filter(c => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    // Matches if the country name starts with the search query, or any word in the name starts with the search query
    const nameMatch = c.name.toLowerCase().startsWith(query) || 
                      c.name.toLowerCase().split(' ').some(word => word.startsWith(query));

    // Matches if the phone code starts with the query (ignores the plus prefix for ease of entry)
    const codeMatch = c.code.replace('+', '').startsWith(query.replace('+', ''));

    return nameMatch || codeMatch;
  });

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
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-[16px] md:text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
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
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-[16px] md:text-xs tracking-wider focus:border-brand-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Phone number *</label>
                    <div ref={dropdownRef} className="relative flex items-center w-full bg-white border border-brand-concrete rounded-lg focus-within:border-brand-charcoal/80 transition-colors px-3 py-1">
                      {/* Country Code & Flag Trigger */}
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-1.5 pr-3 border-r border-brand-concrete/50 h-8 select-none focus:outline-none cursor-pointer text-left"
                      >
                        <img
                          src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                          srcSet={`https://flagcdn.com/w40/${selectedCountry.iso}.png 2x`}
                          width="20"
                          alt={selectedCountry.name}
                          className="object-contain h-3.5 w-5 border border-brand-concrete/20"
                        />
                        <span className="text-[8px] text-brand-charcoal/40 font-bold">{showDropdown ? '▲' : '▼'}</span>
                        <span className="text-xs font-semibold text-brand-charcoal/80">{selectedCountry.code}</span>
                      </button>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Mobile number"
                        className="flex-1 bg-transparent px-3 py-3 text-[16px] md:text-xs tracking-wider focus:outline-none"
                      />

                      {/* Custom Searchable Popover Dropdown */}
                      {showDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-brand-concrete/30 shadow-xl rounded-xl z-50 flex flex-col overflow-hidden max-h-[280px]">
                          {/* Search Input Box */}
                          <div className="p-3 border-b border-brand-charcoal/5 bg-white">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search"
                              className="w-full bg-brand-cream/30 border border-brand-concrete/50 px-3 py-2 text-[16px] md:text-xs rounded-lg focus:outline-none focus:border-brand-charcoal focus:ring-1 focus:ring-brand-charcoal transition-all placeholder-brand-charcoal/40"
                              autoFocus
                            />
                          </div>

                          {/* Country List Scroll Area */}
                          <div className="overflow-y-auto max-h-[200px] divide-y divide-brand-charcoal/5 bg-white">
                            {filteredCountries.length === 0 ? (
                              <div className="p-4 text-center text-xs text-brand-charcoal/40 tracking-wider">
                                No results found
                              </div>
                            ) : (
                              filteredCountries.map((c, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setCountryCode(c.code);
                                    setShowDropdown(false);
                                    setSearchQuery('');
                                  }}
                                  className="w-full text-left px-4 py-3 text-xs flex items-center gap-3 hover:bg-brand-beige/50 transition-colors cursor-pointer select-none focus:outline-none focus:bg-brand-beige/50"
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${c.iso}.png`}
                                    srcSet={`https://flagcdn.com/w40/${c.iso}.png 2x`}
                                    width="20"
                                    alt={c.name}
                                    className="object-contain h-3.5 w-5 border border-brand-concrete/20"
                                  />
                                  <span className="flex-1 font-medium text-brand-charcoal">{c.name}</span>
                                  <span className="text-brand-charcoal/50 font-mono font-semibold">{c.code}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>



                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">Custom Requirements / Fabric specifications</label>
                    <textarea
                      rows={6}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="State any adjustments to lengths, custom coloring codes, label weaving, hanger loops, or packaging requirements."
                      className="w-full bg-white border border-brand-concrete px-4 py-3 text-[16px] md:text-xs tracking-wider focus:border-brand-charcoal focus:outline-none resize-none leading-relaxed"
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
