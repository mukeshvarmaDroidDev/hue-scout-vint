import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Download, FileText, ArrowUpRight } from 'lucide-react';

interface InquiredItemDetails {
  id: number;
  name: string;
  color: string;
  quantity: number;
}

interface Inquiry {
  id: number;
  company_name: string;
  contact_email: string;
  estimated_volume: string;
  message_text: string | null;
  status: string;
  created_at: string;
  items_inquired: InquiredItemDetails[] | null;
}

export const Dashboard: React.FC = () => {
  const { token, user, isAuthenticated, loadingUser } = useApp();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'linesheets' | 'fabrics'>('inquiries');
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Protected route check
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loadingUser, navigate]);

  // Load inquiries
  useEffect(() => {
    if (!token) return;
    const fetchInquiries = async () => {
      try {
        setLoadingInquiries(true);
        const res = await axios.get('/api/v1/inquiries/my-inquiries', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(res.data);
      } catch (err) {
        console.error('Error fetching inquiries', err);
      } finally {
        setLoadingInquiries(false);
      }
    };
    fetchInquiries();
  }, [token]);

  // Mock download action
  const handleDownloadLinesheet = (filename: string) => {
    alert(`Linesheet "${filename}" download initialized. Generates a custom wholesale pricing catalog for Atelier group compliance.`);
  };

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center text-xs uppercase tracking-[0.25em] text-brand-charcoal/50">
        Authenticating B2B Profile...
      </div>
    );
  }

  // Define steps for inquiry progress
  const getStatusSteps = (status: string) => {
    const steps = ['pending', 'reviewing', 'sampling', 'production', 'shipped'];
    const currentIdx = steps.indexOf(status.toLowerCase());
    return steps.map((step, idx) => ({
      name: step,
      isCompleted: idx < currentIdx,
      isActive: idx === currentIdx,
    }));
  };

  const fabricSwatches = [
    { name: "Organic Belgian Linen (Natural)", gsm: 340, composition: "100% Linen", mill: "Ghent, Belgium", hex: "#DCDAD5" },
    { name: "Organic Belgian Linen (Concrete)", gsm: 340, composition: "100% Linen", mill: "Ghent, Belgium", hex: "#B5B3AE" },
    { name: "French Flax Linen (Sage)", gsm: 260, composition: "100% Linen", mill: "Porto, Portugal", hex: "#8C9286" },
    { name: "Supima Cotton Double-Knit (Bone)", gsm: 320, composition: "100% Cotton", mill: "Coimbatore, India", hex: "#F5F5F0" },
    { name: "Mercerized Cotton Twill (Khaki)", gsm: 460, composition: "100% Cotton Twill", mill: "Istanbul, Turkey", hex: "#C3B091" },
    { name: "Merino Cashmere Blend (Ecru)", gsm: 510, composition: "70% Merino, 30% Cashmere", mill: "Biella, Italy", hex: "#F3EFE0" },
  ];

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="editorial-container mx-auto space-y-12">
          
          {/* Dashboard Header */}
          <div className="border-b border-brand-charcoal/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/40">Registered B2B Partner</span>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-charcoal">{user.company_name}</h1>
              <p className="text-xs text-brand-charcoal/50 tracking-wider">
                Corporate ID: HU-{user.id + 1000} • verified buyer status: <span className="text-green-700 font-semibold uppercase tracking-widest text-[10px]">Verified</span>
              </p>
            </div>

            {/* Dashboard Sub-tabs */}
            <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-charcoal">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`pb-2 relative cursor-pointer ${activeTab === 'inquiries' ? 'text-brand-charcoal' : 'text-brand-charcoal/40 hover:text-brand-charcoal/70'}`}
              >
                Inquiries ({inquiries.length})
                {activeTab === 'inquiries' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-charcoal" />}
              </button>
              <button 
                onClick={() => setActiveTab('linesheets')}
                className={`pb-2 relative cursor-pointer ${activeTab === 'linesheets' ? 'text-brand-charcoal' : 'text-brand-charcoal/40 hover:text-brand-charcoal/70'}`}
              >
                Linesheets (PDFs)
                {activeTab === 'linesheets' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-charcoal" />}
              </button>
              <button 
                onClick={() => setActiveTab('fabrics')}
                className={`pb-2 relative cursor-pointer ${activeTab === 'fabrics' ? 'text-brand-charcoal' : 'text-brand-charcoal/40 hover:text-brand-charcoal/70'}`}
              >
                Fabric Library
                {activeTab === 'fabrics' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-charcoal" />}
              </button>
            </div>
          </div>

          {/* TAB CONTENT: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-10">
              {loadingInquiries ? (
                <div className="text-xs uppercase tracking-widest text-brand-charcoal/40 py-12">Loading inquiry runs...</div>
              ) : inquiries.length === 0 ? (
                <div className="bg-white border border-brand-concrete/30 p-12 text-center space-y-4">
                  <p className="text-xs text-brand-charcoal/50 tracking-wider">No active manufacturing inquiries filed under this partner account.</p>
                  <button onClick={() => navigate('/')} className="text-xs uppercase tracking-[0.2em] font-semibold bg-brand-charcoal text-brand-beige px-6 py-3 hover:bg-brand-obsidian cursor-pointer">
                    Browse Showroom Lookbooks
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  {inquiries.map(inq => (
                    <div key={inq.id} className="bg-white border border-brand-concrete/30 p-6 md:p-8 space-y-8 shadow-sm">
                      
                      {/* Top Meta info */}
                      <div className="flex flex-col md:flex-row justify-between border-b border-brand-charcoal/5 pb-4 gap-4">
                        <div className="text-xs tracking-wider">
                          <span className="block font-bold text-brand-charcoal">Run ID: #MR-{inq.id + 5000}</span>
                          <span className="text-brand-charcoal/40">Submitted on: {new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs tracking-wider md:text-right">
                          <span className="block font-bold text-brand-charcoal">Volume Bracket</span>
                          <span className="text-brand-charcoal/60 uppercase">{inq.estimated_volume} Units</span>
                        </div>
                      </div>

                      {/* Dynamic B2B Progress Path Tracker */}
                      <div className="space-y-3">
                        <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/45 font-bold block">Run Status Tracking</span>
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start pt-2 gap-4 md:gap-0">
                          {getStatusSteps(inq.status).map((step, idx) => (
                            <div key={idx} className="flex-1 w-full flex flex-col items-center relative">
                              {/* Horizontal connector line */}
                              {idx < 4 && (
                                <div className="absolute top-2 left-1/2 w-full h-[1px] bg-brand-concrete/60 hidden md:block" />
                              )}
                              
                              {/* Circle node indicator */}
                              <div className={`w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center ${step.isActive ? 'border-brand-charcoal bg-brand-charcoal' : step.isCompleted ? 'border-green-700 bg-green-700' : 'border-brand-concrete bg-white'}`} />
                              
                              <span className={`text-[9px] uppercase tracking-widest mt-2 font-semibold ${step.isActive ? 'text-brand-charcoal font-bold' : step.isCompleted ? 'text-green-800' : 'text-brand-charcoal/30'}`}>
                                {step.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inquired items list */}
                      {inq.items_inquired && inq.items_inquired.length > 0 && (
                        <div className="space-y-3 border-t border-brand-charcoal/5 pt-6">
                          <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/45 font-bold block">Requested Garment Silhouettes</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {inq.items_inquired.map((item, itemIdx) => (
                              <div key={itemIdx} className="bg-brand-beige/30 border border-brand-concrete/20 p-4 flex justify-between items-center text-xs tracking-wider">
                                <div>
                                  <span className="font-semibold block text-brand-charcoal">{item.name}</span>
                                  <span className="text-[10px] text-brand-charcoal/50 block">Selected: {item.color}</span>
                                </div>
                                <span className="font-mono text-brand-charcoal/60 bg-brand-cream/80 px-2.5 py-1 text-[10px] border border-brand-concrete/20">
                                  {item.quantity} Units
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom comments message */}
                      {inq.message_text && (
                        <div className="border-t border-brand-charcoal/5 pt-6 space-y-2">
                          <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/45 font-bold block">Production Specifications</span>
                          <p className="text-xs text-brand-charcoal/70 bg-brand-beige/20 p-4 border-l border-brand-charcoal/20 italic leading-relaxed">
                            "{inq.message_text}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: LINESHEETS */}
          {activeTab === 'linesheets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-brand-concrete/30 p-8 flex flex-col justify-between h-56 shadow-sm">
                <div className="space-y-3">
                  <div className="text-brand-charcoal/50"><FileText size={28} strokeWidth={1.5} /></div>
                  <h3 className="font-serif text-lg text-brand-charcoal font-medium">SS 2026 Lookbook Linesheet</h3>
                  <p className="text-xs text-brand-charcoal/50 leading-relaxed max-w-sm">Contains full wholesale production weights, packaging ratios, weave options, and MOQ brackets for linen structures.</p>
                </div>
                <button 
                  onClick={() => handleDownloadLinesheet('SS_2026_Linen_Linesheet.pdf')}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-charcoal hover:underline mt-4 cursor-pointer"
                >
                  <Download size={14} /> Download catalog PDF <ArrowUpRight size={12} />
                </button>
              </div>

              <div className="bg-white border border-brand-concrete/30 p-8 flex flex-col justify-between h-56 shadow-sm">
                <div className="space-y-3">
                  <div className="text-brand-charcoal/50"><FileText size={28} strokeWidth={1.5} /></div>
                  <h3 className="font-serif text-lg text-brand-charcoal font-medium">FW 2026 Structured Essentials</h3>
                  <p className="text-xs text-brand-charcoal/50 leading-relaxed max-w-sm">Contains detail logs for heavyweight double-knit Supima cotton twills, custom rib options, and cashmere density grids.</p>
                </div>
                <button 
                  onClick={() => handleDownloadLinesheet('FW_2026_Essentials_Linesheet.pdf')}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-charcoal hover:underline mt-4 cursor-pointer"
                >
                  <Download size={14} /> Download catalog PDF <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT: FABRICS */}
          {activeTab === 'fabrics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {fabricSwatches.map((swatch, idx) => (
                <div key={idx} className="bg-white border border-brand-concrete/30 p-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-4">
                    {/* Swatch color square box */}
                    <div className="h-28 w-full border border-brand-concrete/30 flex items-center justify-center" style={{ backgroundColor: swatch.hex }}>
                      <span className="text-[9px] uppercase tracking-widest bg-white/95 px-3 py-1 text-brand-charcoal border border-brand-concrete/20 font-bold shadow-xs">
                        {swatch.gsm} GSM Weight
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-serif text-base text-brand-charcoal font-medium">{swatch.name}</h4>
                      <p className="text-[10px] text-brand-charcoal/55 uppercase tracking-widest font-bold">{swatch.composition}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-brand-charcoal/5 pt-4 text-[10px] text-brand-charcoal/50 tracking-wider">
                      <div>
                        <span className="block uppercase text-[8px] font-bold text-brand-charcoal/40">Weaving Location</span>
                        <span>{swatch.mill}</span>
                      </div>
                      <div>
                        <span className="block uppercase text-[8px] font-bold text-brand-charcoal/40">Standard Dyeing</span>
                        <span>Reactive Vat</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Dashboard;
