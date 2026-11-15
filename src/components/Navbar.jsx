import React, { useRef, useState } from 'react';
import { ShoppingBag, Sun, Moon, Menu, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { lang, setLang, darkMode, setDarkMode, activePage, setActivePage, config, t, vegBazaarCart, aaiSparshCart, setDrawerOpen, setPinModalOpen, adminOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tapTimestamps = useRef([]);

  const handleSecretBrandTap = () => {
    const now = Date.now();
    tapTimestamps.current = [...tapTimestamps.current.filter((ts) => now - ts < 2000), now];
    if (tapTimestamps.current.length >= 4) { tapTimestamps.current = []; setPinModalOpen(true); }
    else if (tapTimestamps.current.length === 1) setActivePage('home');
  };

  const totalCount = vegBazaarCart.reduce((a, i) => a + i.qty, 0) + aaiSparshCart.reduce((a, i) => a + i.qty, 0);
  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'veg_bazaar', label: t.navVegBazaar, badge: 'Flours' },
    { id: 'aai_sparsh', label: t.navAaiSparsh, badge: 'Fresh' },
    { id: 'about', label: t.navAbout },
    { id: 'contact', label: t.navContact },
  ];

  const handleNav = (id) => { setActivePage(id); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-white/10 bg-[#FAF9F6]/90 dark:bg-[#0F1412]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 select-none">
          <button type="button" onClick={handleSecretBrandTap} className="text-left focus:outline-none">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Belagavi · Est. Small-Batch</span>
            <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">{config.companyName}</span>
          </button>
          {adminOpen && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-3 h-3" /> Admin
            </span>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${activePage === item.id ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/10'}`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="inline-flex rounded-lg border border-stone-300 dark:border-white/15 p-0.5 bg-white dark:bg-[#161D1A]">
            {[{ code: 'en', label: 'EN' }, { code: 'hi', label: 'हिन्दी' }, { code: 'kn', label: 'ಕನ್ನಡ' }].map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={`px-2 py-1 rounded-md text-xs font-extrabold transition ${lang === l.code ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : 'text-stone-600 dark:text-stone-300'}`}>
                {l.label}
              </button>
            ))}
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#161D1A] text-stone-700 dark:text-stone-200">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={() => setDrawerOpen(true)} className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold transition shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.enquiryBtn}</span>
            {totalCount > 0 && <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold">{totalCount}</span>}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg border border-stone-300 dark:border-white/15 text-stone-800 dark:text-stone-200">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#0F1412] px-4 py-4 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-bold ${activePage === item.id ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950' : 'text-stone-800 dark:text-stone-200'}`}>
              <span>{item.label}</span>
              {item.badge && <span className="text-xs font-bold uppercase opacity-75">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
