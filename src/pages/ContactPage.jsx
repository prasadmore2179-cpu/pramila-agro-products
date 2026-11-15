import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ContactPage() {
  const { lang, config, t, showToast } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', brand: 'Veg Bazaar', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from('enquiries').insert({ brand: form.brand, customer_name: form.name, customer_phone: form.phone, notes: form.message });
    }
    const cleanPhone = (config.whatsappNumber || '').replace(/[^0-9]/g, '');
    const text = `Namaste ${config.companyName},\nName: ${form.name}\nPhone: ${form.phone}\nBrand: ${form.brand}\nEnquiry: ${form.message}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Opening WhatsApp with your enquiry');
    setForm({ name: '', phone: '', brand: 'Veg Bazaar', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold">{t.contactTitle}</h1>
        <p className="mt-3 text-base text-stone-600 dark:text-stone-300">{t.contactSubtitle}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] flex items-start gap-3.5"><Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><div><h3 className="text-sm font-extrabold">WhatsApp & Phone Order Desk</h3><p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{config.displayPhone}</p></div></div>
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] flex items-start gap-3.5"><MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><div><h3 className="text-sm font-extrabold">Location</h3><p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{config.address?.[lang] || config.address?.en}</p></div></div>
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] flex items-start gap-3.5"><Clock className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" /><div><h3 className="text-sm font-extrabold">Order & Delivery Hours</h3><p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{config.hours?.[lang] || config.hours?.en}</p></div></div>
        </div>
        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-extrabold uppercase mb-1.5">Your Name *</label><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
            <div><label className="block text-xs font-extrabold uppercase mb-1.5">Phone / WhatsApp</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase mb-1.5">Brand</label>
            <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 dark:border-white/15 bg-white dark:bg-[#0F1412]">
              <option value="Veg Bazaar">Veg Bazaar (Whole-Grain Flours)</option>
              <option value="Aai-Sparsh">Aai-Sparsh (Washed Fresh Vegetables)</option>
            </select>
          </div>
          <div><label className="block text-xs font-extrabold uppercase mb-1.5">Message *</label><textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
          <button type="submit" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-extrabold"><MessageCircle className="w-4 h-4" /> {t.sendMessage} via WhatsApp</button>
        </form>
      </div>
    </div>
  );
}
