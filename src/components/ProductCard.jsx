import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { lang, t, addToCart } = useStore();
  const packs = product.packs?.length > 0 ? product.packs : [{ label: 'Standard', price: null }];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentPack = packs[selectedIdx] || packs[0];
  const isVegBazaar = product.brand === 'veg_bazaar';

  return (
    <article className="group flex flex-col justify-between border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] rounded-2xl overflow-hidden transition hover:border-stone-400 dark:hover:border-white/25">
      <div>
        <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-900 overflow-hidden">
          <img src={product.image_url} alt={product.name?.[lang] || product.name?.en} loading="lazy" className={`w-full h-full object-cover transition duration-500 group-hover:scale-105 ${!product.in_stock ? 'grayscale opacity-60' : ''}`} />
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${isVegBazaar ? 'bg-amber-950/90 text-amber-200' : 'bg-emerald-950/90 text-emerald-200'}`}>
            {isVegBazaar ? 'Veg Bazaar' : 'Aai-Sparsh'}
          </span>
          <div className="absolute top-3 right-3">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 dark:bg-stone-900/95 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> {t.inStock}</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-950 text-rose-200"><AlertCircle className="w-3 h-3" /> {t.outOfStock}</span>
            )}
          </div>
        </div>
        <div className="p-5">
          <p className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${isVegBazaar ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{product.subtitle?.[lang] || product.subtitle?.en}</p>
          <h3 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">{product.name?.[lang] || product.name?.en}</h3>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{product.description?.[lang] || product.description?.en}</p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-white/5 space-y-4">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">{product.unit_label?.[lang] || product.unit_label?.en}</span>
          <div className="flex flex-wrap gap-2">
            {packs.map((pack, idx) => (
              <button key={pack.label + idx} type="button" onClick={() => setSelectedIdx(idx)} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition ${idx === selectedIdx ? (isVegBazaar ? 'bg-amber-700 border-amber-700 text-white' : 'bg-emerald-700 border-emerald-700 text-white') : 'border-stone-300 dark:border-white/15 text-stone-700 dark:text-stone-200'}`}>
                {pack.label}{pack.price ? ` · ₹${pack.price}` : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            {currentPack.price ? <span className="text-xl font-extrabold text-stone-900 dark:text-white">₹{currentPack.price}</span> : <span className="text-xs font-bold text-stone-500 dark:text-stone-400">{t.priceOnConfirm}</span>}
          </div>
          <button type="button" disabled={!product.in_stock} onClick={() => addToCart(product, currentPack, 1)} className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${!product.in_stock ? 'bg-stone-200 dark:bg-white/10 text-stone-400 cursor-not-allowed' : isVegBazaar ? 'bg-stone-900 hover:bg-amber-800 dark:bg-amber-500 text-white dark:text-stone-950' : 'bg-emerald-700 hover:bg-emerald-800 text-white'}`}>
            <Plus className="w-4 h-4" /> {product.in_stock ? t.addToOrder : t.outOfStock}
          </button>
        </div>
      </div>
    </article>
  );
}
