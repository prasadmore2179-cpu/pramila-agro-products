import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Upload, CloudUpload, Package, Image as ImageIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminStudio() {
  const { adminOpen, setAdminOpen, config, translations, products, saveSiteContent, saveProduct, deleteProduct, seedSupabaseDefaults, uploadBrandImage, dbStatus, isSupabaseConfigured } = useStore();
  const [tab, setTab] = useState('products');
  const [brandFilter, setBrandFilter] = useState('veg_bazaar');
  const [draftConfig, setDraftConfig] = useState(config);
  const [draftTrans, setDraftTrans] = useState(translations);
  const [editLang, setEditLang] = useState('en');
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!adminOpen) return null;
  const filteredProducts = products.filter((p) => p.brand === brandFilter);

  const openNewProduct = () => {
    setEditingProduct({
      id: `${brandFilter === 'veg_bazaar' ? 'vb' : 'as'}-${Date.now()}`,
      brand: brandFilter, category: brandFilter === 'veg_bazaar' ? 'flour' : 'vegetable',
      in_stock: true, featured: false, sort_order: filteredProducts.length + 1,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80',
      name: { en: '', hi: '', kn: '' }, subtitle: { en: '', hi: '', kn: '' }, description: { en: '', hi: '', kn: '' },
      unit_label: { en: 'Select Pack / Quantity', hi: 'मात्रा चुनें', kn: 'ಪ್ರಮಾಣ ಆಯ್ಕೆಮಾಡಿ' },
      packs: [{ label: '1 kg', price: '' }],
    });
  };

  const handleSaveProductForm = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.en.trim()) return;
    const cleanedPacks = editingProduct.packs.filter((pk) => pk.label.trim() !== '').map((pk) => ({ label: pk.label.trim(), price: pk.price === '' || pk.price === null ? null : Number(pk.price) }));
    await saveProduct({ ...editingProduct, packs: cleanedPacks.length > 0 ? cleanedPacks : [{ label: 'Standard', price: null }] });
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] dark:bg-[#0F1412] overflow-y-auto">
      <div className="sticky top-0 z-20 bg-stone-950 text-white px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400">Owner Control Center</span>
          <h2 className="text-lg sm:text-xl font-extrabold">Pramila Agro Products — Admin Studio</h2>
        </div>
        <div className="flex items-center gap-3">
          {isSupabaseConfigured && (
            <button onClick={seedSupabaseDefaults} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-xs font-extrabold text-white">
              <CloudUpload className="w-4 h-4" /> Sync All to Supabase ({dbStatus})
            </button>
          )}
          <button onClick={() => setAdminOpen(false)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 text-xs font-extrabold"><X className="w-4 h-4" /> Exit Studio</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 dark:border-white/10 pb-4">
          {[{ id: 'products', label: '1. Products, Stock & Pricing', icon: Package }, { id: 'images', label: '2. Banner Images', icon: ImageIcon }, { id: 'texts', label: '3. Texts, Contact & FSSAI', icon: FileText }].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold ${tab === item.id ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : 'bg-white dark:bg-[#161D1A] border border-stone-200 dark:border-white/10'}`}>
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex rounded-xl p-1 bg-stone-200/80 dark:bg-[#161D1A]">
                <button onClick={() => setBrandFilter('veg_bazaar')} className={`px-4 py-2 rounded-lg text-xs font-extrabold ${brandFilter === 'veg_bazaar' ? 'bg-amber-700 text-white' : ''}`}>Veg Bazaar (Flours)</button>
                <button onClick={() => setBrandFilter('aai_sparsh')} className={`px-4 py-2 rounded-lg text-xs font-extrabold ${brandFilter === 'aai_sparsh' ? 'bg-emerald-700 text-white' : ''}`}>Aai-Sparsh (Vegetables)</button>
              </div>
              <button onClick={openNewProduct} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-extrabold"><Plus className="w-4 h-4" /> Add Product</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="p-4 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] flex gap-4 items-start">
                  <img src={prod.image_url} alt={prod.name.en} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-base truncate">{prod.name.en}</h4>
                      <button onClick={() => saveProduct({ ...prod, in_stock: !prod.in_stock })} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${prod.in_stock ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700'}`}>
                        {prod.in_stock ? <><CheckCircle2 className="w-3 h-3" /> In Stock</> : <><AlertCircle className="w-3 h-3" /> Out</>}
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{prod.packs.map((p) => `${p.label}: ${p.price ? '₹' + p.price : 'Daily Rate'}`).join(' · ')}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => setEditingProduct(JSON.parse(JSON.stringify(prod)))} className="px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-white/10 text-white text-xs font-extrabold">Edit Price / Text / Photo</button>
                      <button onClick={() => deleteProduct(prod.id)} className="p-1.5 rounded-lg text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'images' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ key: 'heroMain', label: 'Homepage Hero' }, { key: 'vegBazaarHero', label: 'Veg Bazaar Hero' }, { key: 'aaiSparshHero', label: 'Aai-Sparsh Hero' }, { key: 'packagingShowcase', label: 'Milling Showcase' }].map((item) => (
                <div key={item.key} className="p-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-3">
                  <h4 className="font-extrabold text-sm">{item.label}</h4>
                  <img src={draftConfig.images?.[item.key]} alt={item.label} className="w-full h-44 object-cover rounded-xl" />
                  <input type="text" value={draftConfig.images?.[item.key] || ''} onChange={(e) => setDraftConfig({ ...draftConfig, images: { ...draftConfig.images, [item.key]: e.target.value } })} className="w-full px-3 py-2 rounded-lg text-xs border border-stone-300 dark:border-white/15 bg-transparent" />
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 dark:bg-white/10 text-xs font-extrabold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                    <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setUploading(true); const u = await uploadBrandImage(f, 'banners'); if (u) setDraftConfig({ ...draftConfig, images: { ...draftConfig.images, [item.key]: u } }); setUploading(false); }} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
            <button onClick={() => saveSiteContent(draftConfig, draftTrans)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-extrabold"><Save className="w-4 h-4" /> Save Images</button>
          </div>
        )}

        {tab === 'texts' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1">Company Name</label><input type="text" value={draftConfig.companyName} onChange={(e) => setDraftConfig({ ...draftConfig, companyName: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
              <div><label className="block text-xs font-bold mb-1">WhatsApp Number (91XXXXXXXXXX)</label><input type="text" value={draftConfig.whatsappNumber} onChange={(e) => setDraftConfig({ ...draftConfig, whatsappNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
              <div><label className="block text-xs font-bold mb-1">Display Phone</label><input type="text" value={draftConfig.displayPhone} onChange={(e) => setDraftConfig({ ...draftConfig, displayPhone: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
              <div><label className="block text-xs font-bold mb-1">FSSAI Number</label><input type="text" value={draftConfig.fssaiNumber} onChange={(e) => setDraftConfig({ ...draftConfig, fssaiNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
            </div>
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#161D1A] space-y-4">
              <div className="flex gap-2">
                {['en', 'hi', 'kn'].map((c) => <button key={c} onClick={() => setEditLang(c)} className={`px-3 py-1 rounded-md text-xs font-extrabold ${editLang === c ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950' : ''}`}>{c.toUpperCase()}</button>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['heroTitle', 'heroSubtitle', 'vegBazaarSummary', 'aaiSparshSummary', 'aaiSparshDisclaimer', 'aboutBody1'].map((k) => (
                  <div key={k}><label className="block text-xs font-bold mb-1">{k}</label><textarea rows={2} value={draftTrans[editLang]?.[k] || ''} onChange={(e) => setDraftTrans({ ...draftTrans, [editLang]: { ...draftTrans[editLang], [k]: e.target.value } })} className="w-full px-3 py-2 rounded-lg text-xs border border-stone-300 dark:border-white/15 bg-transparent" /></div>
                ))}
              </div>
            </div>
            <button onClick={() => saveSiteContent(draftConfig, draftTrans)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-extrabold"><Save className="w-4 h-4" /> Save All Texts & Settings</button>
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveProductForm} className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161D1A] border border-stone-200 dark:border-white/15 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3"><h3 className="text-lg font-extrabold">Edit Product</h3><button type="button" onClick={() => setEditingProduct(null)}><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="block text-xs font-bold mb-1">Name (EN) *</label><input required type="text" value={editingProduct.name.en} onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, en: e.target.value } })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
              <div><label className="block text-xs font-bold mb-1">Name (HI)</label><input type="text" value={editingProduct.name.hi} onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, hi: e.target.value } })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
              <div><label className="block text-xs font-bold mb-1">Name (KN)</label><input type="text" value={editingProduct.name.kn} onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, kn: e.target.value } })} className="w-full px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" /></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-xs font-extrabold">Packs & Prices</label><button type="button" onClick={() => setEditingProduct({ ...editingProduct, packs: [...editingProduct.packs, { label: '', price: '' }] })} className="text-xs font-extrabold text-amber-600">+ Add Pack</button></div>
              {editingProduct.packs.map((pk, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" placeholder="Pack (e.g. 1 kg)" value={pk.label} onChange={(e) => { const n = [...editingProduct.packs]; n[idx].label = e.target.value; setEditingProduct({ ...editingProduct, packs: n }); }} className="flex-1 px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" />
                  <input type="number" placeholder="Price ₹" value={pk.price ?? ''} onChange={(e) => { const n = [...editingProduct.packs]; n[idx].price = e.target.value; setEditingProduct({ ...editingProduct, packs: n }); }} className="w-32 px-3 py-2 rounded-lg text-sm border border-stone-300 dark:border-white/15 bg-transparent" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Image URL or Upload</label>
              <input type="text" value={editingProduct.image_url} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg text-xs border border-stone-300 dark:border-white/15 bg-transparent mb-2" />
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/10 text-xs font-extrabold cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setUploading(true); const u = await uploadBrandImage(f, 'products'); if (u) setEditingProduct({ ...editingProduct, image_url: u }); setUploading(false); }} className="hidden" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl text-xs font-extrabold border">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold">Save Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
