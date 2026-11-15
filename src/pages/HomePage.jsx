import React from 'react';
import { ArrowRight, Wheat, Sprout, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { config, t, products, setActivePage } = useStore();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const go = (page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div>
      <section className="border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300">{t.heroTag}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">{t.heroTitle}</h1>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">{t.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => go('veg_bazaar')} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-extrabold">{t.exploreVegBazaar} <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => go('aai_sparsh')} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold">{t.exploreAaiSparsh} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-white/10 shadow-xl aspect-[4/3]">
              <img src={config.images?.heroMain} alt={config.companyName} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F1412] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t.twoBrandsTitle}</h2>
            <p className="mt-3 text-stone-300">{t.twoBrandsDesc}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-amber-500/25 bg-[#161D1A] overflow-hidden flex flex-col justify-between">
              <div>
                <img src={config.images?.vegBazaarHero} alt="Veg Bazaar" className="w-full h-56 object-cover" />
                <div className="p-7 space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400"><Wheat className="w-4 h-4" /> {t.vegBazaarTag}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">{t.vegBazaarTitle}</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">{t.vegBazaarSummary}</p>
                </div>
              </div>
              <div className="px-7 pb-7"><button onClick={() => go('veg_bazaar')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-stone-950 text-xs font-extrabold">{t.exploreVegBazaar} <ArrowRight className="w-4 h-4" /></button></div>
            </div>

            <div className="rounded-3xl border border-emerald-500/25 bg-[#161D1A] overflow-hidden flex flex-col justify-between">
              <div>
                <img src={config.images?.aaiSparshHero} alt="Aai-Sparsh" className="w-full h-56 object-cover" />
                <div className="p-7 space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400"><Sprout className="w-4 h-4" /> {t.aaiSparshTag}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">{t.aaiSparshTitle}</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">{t.aaiSparshSummary}</p>
                </div>
              </div>
              <div className="px-7 pb-7"><button onClick={() => go('aai_sparsh')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-stone-950 text-xs font-extrabold">{t.exploreAaiSparsh} <ArrowRight className="w-4 h-4" /></button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">{t.howItWorksTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ title: t.step1Title, desc: t.step1Desc }, { title: t.step2Title, desc: t.step2Desc }, { title: t.step3Title, desc: t.step3Desc }].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A]">
                <h3 className="text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-stone-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">{t.featuredTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400"><ShieldCheck className="w-4 h-4" /> Pramila Agro Standard</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{t.whyUsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ title: t.why1Title, desc: t.why1Desc }, { title: t.why2Title, desc: t.why2Desc }, { title: t.why3Title, desc: t.why3Desc }].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
