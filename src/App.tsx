import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import Faqs from './pages/Faqs';
import Policy from './pages/Policy';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/story" element={<AboutUs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
