import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface InquiredItem {
  id: number;
  name: string;
  fabric_composition: string;
  gsm_weight: number;
  selectedColor: { name: string; hex: string };
  quantity: number;
  image: string;
  size?: string;
}

export interface User {
  id: number;
  company_name: string;
  email: string;
  is_verified_buyer: boolean;
  created_at: string;
}

interface AppContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  inquiryItems: InquiredItem[];
  addToInquiry: (item: any, color: { name: string; hex: string }, quantity: number, gsmWeight?: number, size?: string) => void;
  removeFromInquiry: (itemId: number, colorHex: string, gsm?: number, size?: string) => void;
  clearInquiry: () => void;
  loadingUser: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('huescout_token'));
  const [user, setUser] = useState<User | null>(null);
  const [inquiryItems, setInquiryItems] = useState<InquiredItem[]>(() => {
    const saved = localStorage.getItem('huescout_inquiry');
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingUser, setLoadingUser] = useState(true);

  // Sync inquiry items to localStorage
  useEffect(() => {
    localStorage.setItem('huescout_inquiry', JSON.stringify(inquiryItems));
  }, [inquiryItems]);

  // Load user data on token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }
      try {
        setLoadingUser(true);
        const res = await axios.get('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user', err);
        // Clear expired or invalid tokens
        setToken(null);
        localStorage.removeItem('huescout_token');
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('huescout_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('huescout_token');
    setToken(null);
    setUser(null);
  };

  const addToInquiry = (item: any, color: { name: string; hex: string }, quantity: number, gsmWeight?: number, size?: string) => {
    setInquiryItems(prev => {
      const finalGsm = gsmWeight !== undefined ? gsmWeight : item.gsm_weight;
      const finalSize = size || 'M';

      // Check if item with exact same ID, color, GSM, and Size exists
      const existingIdx = prev.findIndex(
        i => i.id === item.id && 
             i.selectedColor.hex === color.hex && 
             i.gsm_weight === finalGsm &&
             i.size === finalSize
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      const colorIdx = item.available_colors.findIndex((c: any) => c.hex === color.hex);
      const image = (colorIdx > -1 && item.images.length > colorIdx * 4)
        ? item.images[colorIdx * 4]
        : item.images[0];

      return [...prev, {
        id: item.id,
        name: item.name,
        fabric_composition: item.fabric_composition,
        gsm_weight: finalGsm,
        selectedColor: color,
        quantity,
        image,
        size: finalSize
      }];
    });
  };

  const removeFromInquiry = (itemId: number, colorHex: string, gsm?: number, size?: string) => {
    setInquiryItems(prev => prev.filter(i => {
      const matchId = i.id === itemId;
      const matchColor = i.selectedColor.hex === colorHex;
      const matchGsm = gsm !== undefined ? i.gsm_weight === gsm : true;
      const matchSize = size !== undefined ? i.size === size : true;
      return !(matchId && matchColor && matchGsm && matchSize);
    }));
  };

  const clearInquiry = () => {
    setInquiryItems([]);
  };

  return (
    <AppContext.Provider value={{
      token,
      user,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      inquiryItems,
      addToInquiry,
      removeFromInquiry,
      clearInquiry,
      loadingUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
