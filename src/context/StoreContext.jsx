import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_CONFIG, DEFAULT_TRANSLATIONS, DEFAULT_PRODUCTS } from '../data/defaultData';

const StoreContext = createContext(null);
const LS_CONFIG_KEY = 'pap_prod_config_v1';
const LS_TRANS_KEY = 'pap_prod_trans_v1';
const LS_PRODUCTS_KEY = 'pap_prod_items_v1';

export function StoreProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const [config, setConfig] = useState(() => {
    try { const s = localStorage.getItem(LS_CONFIG_KEY); return s ? { ...DEFAULT_CONFIG, ...JSON.parse(s) } : DEFAULT_CONFIG; } catch { return DEFAULT_CONFIG; }
  });

  const [translations, setTranslations] = useState(() => {
    try {
      const s = localStorage.getItem(LS_TRANS_KEY);
      if (!s) return DEFAULT_TRANSLATIONS;
      const p = JSON.parse(s);
      return { en: { ...DEFAULT_TRANSLATIONS.en, ...(p.en || {}) }, hi: { ...DEFAULT_TRANSLATIONS.hi, ...(p.hi || {}) }, kn: { ...DEFAULT_TRANSLATIONS.kn, ...(p.kn || {}) } };
    } catch { return DEFAULT_TRANSLATIONS; }
  });

  const [products, setProducts] = useState(() => {
    try { const s = localStorage.getItem(LS_PRODUCTS_KEY); return s ? JSON.parse(s) : DEFAULT_PRODUCTS; } catch { return DEFAULT_PRODUCTS; }
  });

  const [vegBazaarCart, setVegBazaarCart] = useState([]);
  const [aaiSparshCart, setAaiSparshCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('veg_bazaar');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState(isSupabaseConfigured ? 'connecting' : 'local');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast((prev) => (prev && Date.now() - prev.id >= 2900 ? null : prev)), 3200);
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    if (darkMode) r.classList.add('dark'); else r.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setDbStatus('local'); return; }
    async function loadFromSupabase() {
      try {
        const [{ data: sData, error: sErr }, { data: pData, error: pErr }] = await Promise.all([
          supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('products').select('*').order('sort_order', { ascending: true }),
        ]);
        if (sErr || pErr) { setDbStatus('error'); return; }
        if (sData?.config && Object.keys(sData.config).length > 0) {
          const merged = { ...DEFAULT_CONFIG, ...sData.config };
          setConfig(merged); localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(merged));
        }
        if (sData?.translations && Object.keys(sData.translations).length > 0) {
          const mergedT = { en: { ...DEFAULT_TRANSLATIONS.en, ...(sData.translations.en || {}) }, hi: { ...DEFAULT_TRANSLATIONS.hi, ...(sData.translations.hi || {}) }, kn: { ...DEFAULT_TRANSLATIONS.kn, ...(sData.translations.kn || {}) } };
          setTranslations(mergedT); localStorage.setItem(LS_TRANS_KEY, JSON.stringify(mergedT));
        }
        if (pData && pData.length > 0) { setProducts(pData); localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(pData)); }
        setDbStatus('connected');
      } catch { setDbStatus('error'); }
    }
    loadFromSupabase();
  }, []);

  const saveSiteContent = async (newConfig, newTranslations) => {
    setConfig(newConfig); setTranslations(newTranslations);
    localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(newConfig));
    localStorage.setItem(LS_TRANS_KEY, JSON.stringify(newTranslations));
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, config: newConfig, translations: newTranslations, updated_at: new Date().toISOString() });
      if (error) { showToast('Saved locally, Supabase error: ' + error.message, 'error'); return false; }
      setDbStatus('connected'); showToast('Synced live to Supabase & saved!'); return true;
    }
    showToast('Saved locally in browser'); return true;
  };

  const saveProduct = async (product) => {
    const updated = products.some((p) => p.id === product.id) ? products.map((p) => (p.id === product.id ? product : p)) : [...products, product];
    setProducts(updated); localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').upsert({ ...product, updated_at: new Date().toISOString() });
      if (error) { showToast('Saved locally, Supabase error: ' + error.message, 'error'); return false; }
      setDbStatus('connected'); showToast('Product synced to Supabase!'); return true;
    }
    showToast('Product updated locally!'); return true;
  };

  const deleteProduct = async (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated); localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(updated));
    if (isSupabaseConfigured && supabase) await supabase.from('products').delete().eq('id', productId);
    showToast('Product removed');
  };

  const seedSupabaseDefaults = async () => {
    if (!isSupabaseConfigured || !supabase) { showToast('Configure .env first', 'error'); return; }
    const { error: sErr } = await supabase.from('site_settings').upsert({ id: 1, config, translations, updated_at: new Date().toISOString() });
    const { error: pErr } = await supabase.from('products').upsert(products);
    if (sErr || pErr) showToast('Seed error: ' + (sErr?.message || pErr?.message), 'error');
    else { setDbStatus('connected'); showToast('All products & texts uploaded to Supabase!'); }
  };

  const uploadBrandImage = async (file, folder = 'products') => {
    if (!file) return null;
    if (isSupabaseConfigured && supabase) {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await supabase.storage.from('brand-assets').upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (!error) return supabase.storage.from('brand-assets').getPublicUrl(filePath).data.publicUrl;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = img.width > 900 ? 900 / img.width : 1;
          canvas.width = img.width * scale; canvas.height = img.height * scale;
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const addToCart = (product, pack, qty = 1) => {
    const setter = product.brand === 'veg_bazaar' ? setVegBazaarCart : setAaiSparshCart;
    const key = `${product.id}__${pack.label}`;
    setter((prev) => {
      const found = prev.find((i) => i.key === key);
      return found ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i)) : [...prev, { key, productId: product.id, brand: product.brand, name: product.name, packLabel: pack.label, price: pack.price, qty }];
    });
    setDrawerTab(product.brand);
    showToast(`${product.name[lang] || product.name.en} (${pack.label}) added`);
  };

  const updateCartQty = (brand, key, delta) => {
    const setter = brand === 'veg_bazaar' ? setVegBazaarCart : setAaiSparshCart;
    setter((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  };

  const clearBrandCart = (brand) => (brand === 'veg_bazaar' ? setVegBazaarCart([]) : setAaiSparshCart([]));
  const t = translations[lang] || translations.en;

  return (
    <StoreContext.Provider value={{
      lang, setLang, darkMode, setDarkMode, activePage, setActivePage, config, translations, t, products,
      vegBazaarCart, aaiSparshCart, drawerOpen, setDrawerOpen, drawerTab, setDrawerTab, addToCart, updateCartQty, clearBrandCart,
      pinModalOpen, setPinModalOpen, adminOpen, setAdminOpen, saveSiteContent, saveProduct, deleteProduct, seedSupabaseDefaults, uploadBrandImage,
      dbStatus, isSupabaseConfigured, toast, showToast,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
export const useStore = () => useContext(StoreContext);
