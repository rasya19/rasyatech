import { useState, useEffect, FormEvent } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  Laptop as LaptopIcon, 
  Monitor, 
  Settings, 
  Package,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'config' | 'services' | 'laptops' | 'payments'>('config');
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPayments, setSavingPayments] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Data States
  const [config, setConfig] = useState<any>({ whatsapp: '', address: '', openingHours: '', heroTitle: '', heroSubtitle: '' });
  const [payments, setPayments] = useState<any>({
    bankBcaProvider: 'BCA',
    bankBca: '1234567890',
    bankMandiriProvider: 'Mandiri',
    bankMandiri: '0987654321',
    eWallet: '081918226387',
    bankBcaName: 'PT Rasyatech Digital',
    bankMandiriName: 'PT Rasyatech Digital',
    eWalletName: 'Admin Rasyatech'
  });
  const [services, setServices] = useState<any[]>([]);
  const [laptops, setLaptops] = useState<any[]>([]);
  
  // Edit States
  const [editingService, setEditingService] = useState<any>(null);
  const [editingLaptop, setEditingLaptop] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen to Config
    const unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setConfig(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/config'));

    // Listen to Payments
    const unsubPayments = onSnapshot(doc(db, 'settings', 'payments'), (snap) => {
      if (snap.exists()) setPayments(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/payments'));

    // Listen to Services
    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('title')), (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'services'));

    // Listen to Laptops
    const unsubLaptops = onSnapshot(query(collection(db, 'laptops'), orderBy('name')), (snap) => {
      setLaptops(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'laptops'));

    return () => {
      unsubConfig();
      unsubPayments();
      unsubServices();
      unsubLaptops();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveStatus(null);
    try {
      await setDoc(doc(db, 'settings', 'config'), config);
      setSaveStatus({ type: 'success', message: 'Konfigurasi website berhasil disimpan!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Gagal menyimpan konfigurasi.' });
      handleFirestoreError(err, OperationType.WRITE, 'settings/config');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSavePayments = async (e: FormEvent) => {
    e.preventDefault();
    setSavingPayments(true);
    setSaveStatus(null);
    try {
      await setDoc(doc(db, 'settings', 'payments'), payments);
      setSaveStatus({ type: 'success', message: 'Konfigurasi pembayaran berhasil disimpan!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Gagal menyimpan konfigurasi pembayaran.' });
      handleFirestoreError(err, OperationType.WRITE, 'settings/payments');
    } finally {
      setSavingPayments(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    const data = editingService;
    const id = data.id || Math.random().toString(36).substring(7);
    try {
      const { id: _, ...payload } = data;
      await setDoc(doc(db, 'services', id), payload);
      setEditingService(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `services/${id}`);
    }
  };

  const handleDeleteLaptop = async (id: string) => {
    if (!confirm('Yakin ingin menghapus laptop ini?')) return;
    try {
      await deleteDoc(doc(db, 'laptops', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `laptops/${id}`);
    }
  };

  const handleSaveLaptop = async (e: FormEvent) => {
    e.preventDefault();
    const data = editingLaptop;
    const id = data.id || Math.random().toString(36).substring(7);
    try {
      const { id: _, ...payload } = data;
      await setDoc(doc(db, 'laptops', id), payload);
      setEditingLaptop(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `laptops/${id}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black transition-all bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Beranda
      </Link>
      <div className="max-w-md w-full bg-white p-12 rounded-[32px] shadow-2xl text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
          <Settings className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black mb-4">Admin RasyaComp</h1>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          Silakan login menggunakan akun Google Anda untuk mengelola konten website.
        </p>
        <button 
          onClick={handleLogin}
          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all"
        >
          Login with Google
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-100 py-6 px-10 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">RC</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <div className="text-sm font-bold text-slate-900">{user.displayName}</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">{user.email}</div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:text-red-500 transition-colors border border-slate-100"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 pt-12">
        {/* Tabs */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold ${
                saveStatus.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {saveStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {saveStatus.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'config', label: 'Konfigurasi', icon: <Settings className="w-5 h-5" /> },
            { id: 'payments', label: 'Pembayaran', icon: <CheckCircle2 className="w-5 h-5" /> },
            { id: 'services', label: 'Layanan', icon: <Monitor className="w-5 h-5" /> },
            { id: 'laptops', label: 'Inventory Laptop', icon: <Package className="w-5 h-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Config Section */}
          {activeTab === 'config' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black mb-10">Konfigurasi Website</h2>
              <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={config.whatsapp} 
                    onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold"
                    placeholder="Contoh: 628123456789"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Title</label>
                  <input 
                    type="text" 
                    value={config.heroTitle} 
                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Subtitle</label>
                  <textarea 
                    value={config.heroSubtitle} 
                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold h-24"
                    placeholder="Deskripsi singkat di bawah judul utama"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Alamat Lengkap</label>
                  <textarea 
                    value={config.address} 
                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold h-32"
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={savingConfig}
                    className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all"
                  >
                    {savingConfig ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {savingConfig ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Payments Section */}
          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black mb-10">Konfigurasi Pembayaran</h2>
              <p className="text-slate-500 mb-8">Informasi ini akan tampil pada instruksi pembayaran setelah pendaftaran sekolah baru.</p>
              <form onSubmit={handleSavePayments} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank 1 */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Transfer Bank 1</h3>
                    <select 
                      value={payments.bankBcaProvider}
                      onChange={(e) => setPayments({ ...payments, bankBcaProvider: e.target.value })}
                      className="text-xs font-black bg-white border border-slate-200 rounded-lg px-2 py-1"
                    >
                      {['BCA', 'Mandiri', 'BNI', 'BRI', 'BTN', 'BSI', 'CIMB Niaga', 'Lainnya'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Rekening</label>
                    <input 
                      type="text" 
                      value={payments.bankBca} 
                      onChange={(e) => setPayments({ ...payments, bankBca: e.target.value })}
                      className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atas Nama</label>
                    <input 
                      type="text" 
                      value={payments.bankBcaName} 
                      onChange={(e) => setPayments({ ...payments, bankBcaName: e.target.value })}
                      className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                    />
                  </div>
                </div>

                {/* Bank 2 */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Transfer Bank 2</h3>
                    <select 
                      value={payments.bankMandiriProvider}
                      onChange={(e) => setPayments({ ...payments, bankMandiriProvider: e.target.value })}
                      className="text-xs font-black bg-white border border-slate-200 rounded-lg px-2 py-1"
                    >
                      {['Mandiri', 'BCA', 'BNI', 'BRI', 'BTN', 'BSI', 'CIMB Niaga', 'Lainnya'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Rekening</label>
                    <input 
                      type="text" 
                      value={payments.bankMandiri} 
                      onChange={(e) => setPayments({ ...payments, bankMandiri: e.target.value })}
                      className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atas Nama</label>
                    <input 
                      type="text" 
                      value={payments.bankMandiriName} 
                      onChange={(e) => setPayments({ ...payments, bankMandiriName: e.target.value })}
                      className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                    />
                  </div>
                </div>

                {/* E-Wallet */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-2xl md:col-span-2">
                  <h3 className="font-bold text-slate-800">DANA / OVO / GoPay (E-Wallet)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor HP</label>
                      <input 
                        type="text" 
                        value={payments.eWallet} 
                        onChange={(e) => setPayments({ ...payments, eWallet: e.target.value })}
                        className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atas Nama</label>
                      <input 
                        type="text" 
                        value={payments.eWalletName} 
                        onChange={(e) => setPayments({ ...payments, eWalletName: e.target.value })}
                        className="w-full p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={savingPayments}
                    className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all"
                  >
                    {savingPayments ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {savingPayments ? 'Menyimpan...' : 'Simpan Konfigurasi Pembayaran'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Services Section */}
          {activeTab === 'services' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100">
                <h2 className="text-3xl font-black">Kelola Layanan</h2>
                <button 
                  onClick={() => setEditingService({ title: '', description: '', icon: 'Monitor' })}
                  className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" /> Tambah Layanan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-white p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(s)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService(s.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="text-xl font-black mb-3">{s.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Laptops Section */}
          {activeTab === 'laptops' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100">
                <h2 className="text-3xl font-black">Inventory Laptop</h2>
                <button 
                  onClick={() => setEditingLaptop({ name: '', price: '', image: '', isAvailable: true })}
                  className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" /> Tambah Laptop
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {laptops.map(l => (
                  <div key={l.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden group">
                    <div className="h-48 overflow-hidden relative">
                      <img src={l.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setEditingLaptop(l)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-900 shadow-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteLaptop(l.id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-red-500 shadow-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="font-black text-lg mb-1">{l.name}</h4>
                      <p className="text-indigo-600 font-black mb-4 italic">{l.price}</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${l.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {l.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {l.isAvailable ? 'Available' : 'Sold Out'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingService(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl p-12 rounded-[40px] shadow-2xl">
              <h3 className="text-3xl font-black mb-8">{editingService.id ? 'Edit' : 'Tambah'} Layanan</h3>
              <form onSubmit={handleSaveService} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Judul Layanan</label>
                  <input type="text" required value={editingService.title} onChange={e => setEditingService({ ...editingService, title: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi</label>
                  <textarea required value={editingService.description} onChange={e => setEditingService({ ...editingService, description: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold h-32" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl">Simpan</button>
                  <button type="button" onClick={() => setEditingService(null)} className="px-8 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl">Batal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {editingLaptop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingLaptop(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl p-12 rounded-[40px] shadow-2xl">
              <h3 className="text-3xl font-black mb-8">{editingLaptop.id ? 'Edit' : 'Tambah'} Laptop</h3>
              <form onSubmit={handleSaveLaptop} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Unit</label>
                    <input type="text" required value={editingLaptop.name} onChange={e => setEditingLaptop({ ...editingLaptop, name: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Harga</label>
                    <input type="text" required value={editingLaptop.price} onChange={e => setEditingLaptop({ ...editingLaptop, price: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold" />
                  </div>
                  <div className="flex items-end pb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={editingLaptop.isAvailable} onChange={e => setEditingLaptop({ ...editingLaptop, isAvailable: e.target.checked })} className="w-6 h-6 rounded border-slate-200 text-indigo-600 focus:ring-indigo-600" />
                      <span className="text-sm font-black uppercase tracking-widest text-slate-400">Available</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Image URL</label>
                  <input type="text" required value={editingLaptop.image} onChange={e => setEditingLaptop({ ...editingLaptop, image: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-bold" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl">Simpan</button>
                  <button type="button" onClick={() => setEditingLaptop(null)} className="px-8 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl">Batal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
