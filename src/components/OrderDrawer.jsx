import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function OrderDrawer() {
  const { lang, t, config, vegBazaarCart, aaiSparshCart, drawerOpen, setDrawerOpen, drawerTab, setDrawerTab, updateCartQty, clearBrandCart } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');

  if (!drawerOpen) return null;
  const isVegBazaar = drawerTab === 'veg_bazaar';
  const activeItems = isVegBazaar ? vegBazaarCart : aaiSparshCart;
  const knownSubtotal = activeItems.reduce((sum, i) => (i.price ? sum + Number(i.price) * i.qty : sum), 0);
  const hasUnpriced = activeItems.some((i) => !i.price);

  const handleSendWhatsApp = async () => {
    if (activeItems.length === 0) return;
    const brandTitle = isVegBazaar ? 'VEG BAZAAR (Whole-Grain Flours)' : 'AAI-SPARSH (Washed Fresh Vegetables)';
    const lines = activeItems.map((i, idx) => `${idx + 1}. ${i.name?.[lang] || i.name?.en} (${i.packLabel}) × ${i.qty} — ${i.price ? '₹' + Number(i.price) * i.qty : 'Daily Rate'}`).join('\n');
    const totalLine = knownSubtotal > 0 ? `Estimated Known Total: ₹${knownSubtotal}${hasUnpriced ? ' + Daily Rate items' : ''}` : 'Pricing: Please confirm today’s rates';
    const msg = [`Namaste *${config.companyName}*,`, `I would like to place a product enquiry for *${brandTitle}*:`, '', lines, '', totalLine, customerName ? `Customer Name: ${customerName}` : '', deliveryArea ? `Delivery Area: ${deliveryArea}` : '', '', '_Please confirm availability, final total & delivery timing._'].filter(Boolean).join('\n');

    if (isSupabaseConfigured && supabase) {
      supabase.from('enquiries').insert({ brand: drawerTab, customer_name: customerName || null, delivery_area: deliveryArea || null, items: activeItems, notes: msg });
    }
    const cleanPhone = (config.whatsappNumber || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FAF9F6] dark:bg-[#0F1412] h-full flex flex-col border-l border-stone-200 dark:border-white/10 shadow-2xl">
        <div className="p-5 border-b border-stone-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-white">{t.enquiryBtn}</h2>
            <p className="text-xs text-stone-500">Separate WhatsApp desks per brand</p>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-stone-200/70 dark:hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 border-b border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-[#161D1A] p-1.5 gap-1.5">
          <button onClick={() => setDrawerTab('veg_bazaar')} className={`py-2.5 px-3 rounded-lg text-xs font-extrabold ${isVegBazaar ? 'bg-amber-700 text-white' : 'text-stone-700 dark:text-stone-300'}`}>Veg Bazaar ({vegBazaarCart.reduce((a, b) => a + b.qty, 0)})</button>
          <button onClick={() => setDrawerTab('aai_sparsh')} className={`py-2.5 px-3 rounded-lg text-xs font-extrabold ${!isVegBazaar ? 'bg-emerald-700 text-white' : 'text-stone-700 dark:text-stone-300'}`}>Aai-Sparsh ({aaiSparshCart.reduce((a, b) => a + b.qty, 0)})</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {activeItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-stone-400 mb-3" />
              <p className="text-sm font-bold">No items selected yet</p>
            </div>
          ) : (
            activeItems.map((item) => (
              <div key={item.key} className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold">{item.name?.[lang] || item.name?.en}</h4>
                  <p className="text-xs text-stone-500">Pack: <strong>{item.packLabel}</strong>{item.price ? ` · ₹${item.price} each` : ' · Daily rate'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(drawerTab, item.key, -1)} className="w-7 h-7 rounded-lg border border-stone-300 dark:border-white/15 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-6 text-center text-sm font-extrabold">{item.qty}</span>
                  <button onClick={() => updateCartQty(drawerTab, item.key, 1)} className="w-7 h-7 rounded-lg border border-stone-300 dark:border-white/15 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {activeItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" className="px-3 py-2 rounded-lg text-xs border border-stone-300 dark:border-white/15 bg-transparent" />
              <input type="text" value={deliveryArea} onChange={(e) => setDeliveryArea(e.target.value)} placeholder="Area (Belagavi)" className="px-3 py-2 rounded-lg text-xs border border-stone-300 dark:border-white/15 bg-transparent" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Known Subtotal</span>
              <span className="text-base font-extrabold">{knownSubtotal > 0 ? `₹${knownSubtotal}` : 'Confirm on WhatsApp'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => clearBrandCart(drawerTab)} className="p-3 rounded-xl border border-stone-300 dark:border-white/15 text-stone-600 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
              <button onClick={handleSendWhatsApp} className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold">
                <MessageCircle className="w-4 h-4" /> Send Enquiry on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
