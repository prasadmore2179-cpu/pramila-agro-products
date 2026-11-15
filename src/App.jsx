import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderDrawer from './components/OrderDrawer';
import AdminPinModal from './components/AdminPinModal';
import AdminStudio from './components/AdminStudio';
import HomePage from './pages/HomePage';
import VegBazaarPage from './pages/VegBazaarPage';
import AaiSparshPage from './pages/AaiSparshPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function MainApp() {
  const { activePage, toast } = useStore();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'veg_bazaar' && <VegBazaarPage />}
        {activePage === 'aai_sparsh' && <AaiSparshPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
      </main>
      <Footer />
      <OrderDrawer />
      <AdminPinModal />
      <AdminStudio />
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-extrabold shadow-xl border ${toast.type === 'error' ? 'bg-rose-950 text-rose-100 border-rose-500/40' : 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 border-white/10'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
