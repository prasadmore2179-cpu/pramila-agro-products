import React from 'react';
import { Wheat, ShieldCheck, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function VegBazaarPage() {
  const { config, t, products } = useStore();
  const flourProducts = products.filter((p) => p.brand === 'veg_bazaar');

  return (
    <div>
      <section className="bg-[#1A140E] text-white border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-300"><Wheat className="w-3.5 h-3.5" /> {t.vegBazaarTag}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold">{t.vegBazaarTitle}</h1>
            <p className="text-base text-stone-300 max-w-2xl">{t.vegBazaarSummary}</p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-200/90 bg-white/5 px-3.5 py-2 rounded-lg"><ShieldCheck className="w-4 h-4 text-amber-400" /> FSSAI Registered · {config.fssaiNumber}</div>
          </div>
          <div className="lg:col-span-5"><img src={config.images?.vegBazaarHero} alt="Veg Bazaar" className="w-full h-72 object-cover rounded-3xl border border-white/10" /></div>
        </div>
      </section>

      <section className="py-16 border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">Whole-Grain Flour Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flourProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><HelpCircle className="w-5 h-5 text-amber-600" /> Frequently Asked Questions</h2>
          {[
            { q: 'Where is the wheat sourced from?', a: 'Our whole wheat atta is milled from Lokwan wheat sourced from Gujarat through APMC Belgaum.' },
            { q: 'Is the bran or germ removed during milling?', a: 'No. We prepare whole-grain atta without separating the natural bran and germ.' },
            { q: 'What pack sizes are available?', a: 'Standard packs are 1 kg, 2 kg, and 5 kg (Whole Wheat Atta: ₹50 / ₹98 / ₹240).' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A]">
              <h3 className="text-base font-extrabold">{item.q}</h3>
              <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
