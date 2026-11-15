import React from 'react';
import { Sprout, Info, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function AaiSparshPage() {
  const { config, t, products } = useStore();
  const vegProducts = products.filter((p) => p.brand === 'aai_sparsh');

  return (
    <div>
      <section className="bg-[#0D1914] text-white border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300"><Sprout className="w-3.5 h-3.5" /> {t.aaiSparshTag}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold">{t.aaiSparshTitle}</h1>
            <p className="text-base text-stone-300 max-w-2xl">{t.aaiSparshSummary}</p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-200/90 bg-white/5 px-3.5 py-2 rounded-lg"><Sparkles className="w-4 h-4 text-emerald-400" /> Sorted · Washed · Kitchen Prep Ready</div>
          </div>
          <div className="lg:col-span-5"><img src={config.images?.aaiSparshHero} alt="Aai-Sparsh" className="w-full h-72 object-cover rounded-3xl border border-white/10" /></div>
        </div>
      </section>

      <section className="py-16 border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">Daily Washed Vegetable Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vegProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-300">{t.disclaimerTitle}</h3>
              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 mt-1">{t.aaiSparshDisclaimer}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
