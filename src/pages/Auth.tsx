import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowRight, Lock, Mail, Building } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('/api/v1/auth/login', { email, password });
        login(res.data.access_token);
        navigate('/dashboard');
      } else {
        const res = await axios.post('/api/v1/auth/register', { 
          company_name: companyName, 
          email, 
          password 
        });
        login(res.data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'An error occurred. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col justify-between pt-[70px]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        {/* Editorially Styled Auth Box */}
        <div className="w-full max-w-4xl bg-white border border-brand-concrete/30 grid grid-cols-1 md:grid-cols-2 shadow-sm">
          
          {/* Left panel: high-fashion editorial duster */}
          <div className="relative bg-brand-obsidian hidden md:flex flex-col justify-between p-12 text-brand-beige overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1484517186945-df8151a1a871?q=80&w=800')" }}
            />
            <div className="relative z-10">
              <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-beige/60">Atelier Portal</span>
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-serif text-3xl font-light tracking-wide leading-tight">
                Partner Services
              </h3>
              <p className="text-xs text-brand-beige/60 tracking-wider leading-relaxed">
                Log in to download seasonal linesheets, access detailed swatch cards, submit fabric requests, and track custom bulk runs.
              </p>
            </div>
            <div className="relative z-10 text-[9px] text-brand-beige/40 tracking-widest uppercase">
              HUESCOUT © 2026
            </div>
          </div>

          {/* Right panel: clean geometric input forms */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="space-y-6">
              {/* Header Selector */}
              <div className="space-y-2">
                <h2 className="font-serif text-2xl text-brand-charcoal font-medium">
                  {isLogin ? 'B2B Client Portal' : 'Register Account'}
                </h2>
                <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest">
                  {isLogin ? 'Wholesale supply services' : 'Apply for buyer certification'}
                </p>
              </div>

              {/* Error Callout */}
              {error && (
                <div className="bg-red-50 text-red-800 text-xs p-4 border-l-2 border-red-800 tracking-wide">
                  {error}
                </div>
              )}

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">
                      Company Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40">
                        <Building size={14} />
                      </span>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Atelier & Co."
                        className="w-full bg-brand-beige/40 border border-brand-concrete/30 px-10 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none placeholder-brand-charcoal/30"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@atelier.com"
                      className="w-full bg-brand-beige/40 border border-brand-concrete/30 px-10 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none placeholder-brand-charcoal/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 block font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40">
                      <Lock size={14} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-beige/40 border border-brand-concrete/30 px-10 py-3 text-xs tracking-wider focus:border-brand-charcoal focus:outline-none placeholder-brand-charcoal/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-charcoal text-brand-beige py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-brand-obsidian transition-colors cursor-pointer flex justify-center items-center gap-2 mt-4"
                >
                  {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Submit Application'}
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Toggle Login/Register */}
              <div className="pt-4 text-center border-t border-brand-charcoal/5">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-xs text-brand-charcoal/50 hover:text-brand-charcoal tracking-wide transition-colors cursor-pointer"
                >
                  {isLogin 
                    ? "Don't have an account? Request Access" 
                    : "Already have a certified account? Sign In"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Auth;
