import React from 'react';
import { ShieldCheck, Wheat, Sprout } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AboutPage() {
  const { config, t } = useStore();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">{config.companyName}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold">{t.aboutTitle}</h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">{t.aboutBody1}</p>
        <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">{t.aboutBody2}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm"><Wheat className="w-4 h-4" /> Veg Bazaar</div>
          <h3 className="text-xl font-extrabold">Whole-Grain Flour Brand</h3>
          <p className="text-sm text-stone-600 dark:text-stone-300">Dedicated exclusively to whole wheat atta (Gujarat Lokwan wheat via APMC Belgaum), jowar flour, bajra flour, and multigrain flour—milled whole with natural bran and germ intact.</p>
        </div>
        <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm"><Sprout className="w-4 h-4" /> Aai-Sparsh</div>
          <h3 className="text-xl font-extrabold">Washed Fresh Vegetable Brand</h3>
          <p className="text-sm text-stone-600 dark:text-stone-300">Dedicated exclusively to sorted, washed daily vegetables—coriander, fenugreek, tomato, cauliflower, potato, beetroot, okra, and ginger.</p>
        </div>
      </div>
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-[#161D1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400"><ShieldCheck className="w-4 h-4" /> Food Safety Compliance</div>
          <h3 className="text-lg font-extrabold">FSSAI Registration</h3>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F1412] border text-sm font-extrabold">{config.fssaiNumber}</div>
      </div>
    </div>
  );
}
