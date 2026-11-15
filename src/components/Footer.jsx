import React from 'react';
import { Lock, Database } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { lang, config, t, setActivePage, setPinModalOpen, dbStatus } = useStore();
  const navigate = (p) => { setActivePage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="bg-[#0F1412] text-stone-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Parent Enterprise</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{config.companyName}</h3>
            <p className="text-sm text-stone-400 max-w-md">{t.footerTagline}</p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p><strong className="text-stone-200">FSSAI Reg:</strong> {config.fssaiNumber}</p>
              <p><strong className="text-stone-200">Location:</strong> {config.address?.[lang] || config.address?.en}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Our Brands</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('veg_bazaar')} className="hover:text-amber-400 font-semibold">Veg Bazaar (Whole-Grain Flours)</button></li>
              <li><button onClick={() => navigate('aai_sparsh')} className="hover:text-emerald-400 font-semibold">Aai-Sparsh (Washed Vegetables)</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-white">{t.navHome}</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-white">{t.navAbout}</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-white">{t.navContact}</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {config.companyName}.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[11px]"><Database className="w-3 h-3" /> {dbStatus === 'connected' ? 'Cloud Synced' : 'Local Mode'}</span>
            <button type="button" onClick={() => setPinModalOpen(true)} title="Owner Studio" className="p-1.5 rounded-md text-stone-600 hover:text-amber-400"><Lock className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
