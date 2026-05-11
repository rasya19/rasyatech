import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function RasyatechLanding() {
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
  const [config, setConfig] = useState<any>({ 
    whatsapp: '6281918226387', 
    address: 'Mekarwangi, Kuningan - Jawa Barat', 
    heroTitle: 'Transformasi Digital Masa Depan', 
    heroSubtitle: 'Solusi Manajemen Sekolah (LMS) Terintegrasi, Jasa Service IT, dan Web Development Profesional berbasis di Mekarwangi, Kuningan.' 
  });
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Listen to Payments from Firestore
    const unsubPayments = onSnapshot(doc(db, 'settings', 'payments'), (snap) => {
      if (snap.exists()) setPayments(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/payments'));

    // Listen to Config from Firestore
    const unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) setConfig(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/config'));

    return () => {
      unsubPayments();
      unsubConfig();
    };
  }, []);

  const selectPackage = (pkg: string, type: 'Annual' | 'Monthly' = 'Annual') => {
    const select = document.getElementById('packageSelect') as HTMLSelectElement;
    if (select) {
      if (pkg === 'Silver') {
        select.value = type === 'Annual' ? 'Silver (Annual Promo)' : 'Silver Monthly';
      } else if (pkg === 'Gold') {
        select.value = type === 'Annual' ? 'Gold (Annual Promo)' : 'Gold Monthly';
      } else if (pkg === 'Platinum') {
        select.value = 'Platinum';
      }
      
      const daftarSection = document.getElementById('daftar');
      daftarSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pkg = formData.get('package') as string;
    const school = formData.get('school_name');
    const addr = formData.get('address');
    const email = formData.get('email');
    const pass = formData.get('password');
    
    let promoText = "";
    if (pkg.includes("Annual Promo")) {
        promoText = `Saya tertarik dengan Promo Tahunan Paket ${pkg.split(' ')[0]}.%0A`;
    } else if (pkg.includes("Monthly")) {
        promoText = `Saya tertarik dengan Paket Bulanan ${pkg.split(' ')[0]}.%0A`;
    }

    const message = `Halo Rasyatech,%0A%0A${promoText}Saya ingin mendaftarkan sekolah baru:%0A` +
                    `Paket: ${pkg}%0A` +
                    `Nama Sekolah: ${school}%0A` +
                    `Alamat: ${addr}%0A` +
                    `Email Admin: ${email}%0A` +
                    `Password Request: ${pass}%0A%0A` +
                    `Mohon diproses untuk pembuatan akun admin sekolah kami. Terima kasih.`;
    
    window.open(`https://wa.me/${config.whatsapp || '6281918226387'}?text=${message}`, '_blank');
    setShowPayment(true);
    setTimeout(() => {
      document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Teks berhasil disalin: ' + text);
    });
  };

  return (
    <div>
      <nav>
        <div className="logo">RASYATECH</div>
        <div className="nav-links">
          <a href="#about">Tentang</a>
          <a href="#layanan">Layanan</a>
          <a href="#paket">Paket LMS</a>
          <a href="#daftar" className="btn-daftar">Daftar</a>
          <Link to="/admin" className="btn-login">Portal Admin</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>{config.heroTitle || 'Transformasi Digital Masa Depan'}</h1>
        <p>{config.heroSubtitle || 'Solusi Manajemen Sekolah (LMS) Terintegrasi, Jasa Service IT, dan Web Development Profesional berbasis di Mekarwangi, Kuningan.'}</p>
        <div>
          <a href="#layanan" style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '15px 30px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Eksplorasi Layanan</a>
        </div>
      </section>

      <section id="layanan" className="services">
        <h2>Layanan Unggulan Kami</h2>
        <div className="service-grid">
          <div className="card">
            <h3>LMS Rasyatech</h3>
            <p>Sistem manajemen sekolah modern untuk PKBM, SMK, dan instansi pendidikan lainnya.</p>
          </div>
          <div className="card">
            <h3>Servis IT & Komputer</h3>
            <p>Perbaikan hardware, laptop, dan pemeliharaan jaringan kantor oleh tenaga ahli Rasyacomp.</p>
          </div>
          <div className="card">
            <h3>Web Development</h3>
            <p>Pembuatan website profil sekolah atau bisnis dengan teknologi PWA dan Next.js.</p>
          </div>
        </div>
      </section>

      <section id="paket" className="pricing">
        <h2>Pilihan Paket LMS Rasyatech</h2>
        <div className="promo-banner-container">
          <a href="https://wa.me/6281918226387?text=Halo%20Rasyatech,%20saya%20tertarik%20dengan%20Promo%20Tahunan:%20Bayar%2010%20Bulan,%20Gratis%202%20Bulan." target="_blank" rel="noopener noreferrer" className="promo-banner">
            🔥 Hemat 20% dengan Pembayaran Tahunan (Bayar 10 Bulan, Gratis 2 Bulan!)
          </a>
        </div>
        <p>Solusi manajemen digital yang dirancang untuk pertumbuhan sekolah Anda.</p>
        <div className="pricing-grid">
          <div className="price-card silver">
            <h4>Silver Package</h4>
            <div className="price">Rp 250.000 <span style={{ fontSize: '1rem', color: '#666' }}>/ Bulan</span></div>
            <div className="annual-price">
              💰 Rp 2.500.000 / Tahun<br />
              <span style={{ fontSize: '0.75rem' }}>(Promo Bayar 10 Bulan)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e67e22', fontWeight: 600, marginTop: '-10px' }}>Setup: Rp 500.000 (Sekali)</p>
            <ul>
              <li><strong>Ideal:</strong> Sekolah Kecil / PKBM</li>
              <li><strong>Domain:</strong> Subdomain (.rsch.my.id)</li>
              <li><strong>Penyimpanan:</strong> 2GB Cloud Storage</li>
              <li>Support Email/WA Group</li>
            </ul>
            <button onClick={() => selectPackage('Silver', 'Annual')} style={{ display: 'block', width: '100%', background: 'var(--navy)', color: 'white', padding: '12px', borderRadius: '5px', fontWeight: 700 }}>Pilih Tahunan</button>
            <button onClick={() => selectPackage('Silver', 'Monthly')} style={{ display: 'block', width: '100%', background: 'transparent', color: 'var(--navy)', padding: '10px', borderRadius: '5px', fontWeight: 600, border: '1px solid var(--navy)', marginTop: '10px', fontSize: '0.9rem' }}>Pilih Bulanan</button>
          </div>
          <div className="price-card gold featured">
            <div className="badge">Terpopuler</div>
            <h4>Gold Package</h4>
            <div className="price">Rp 500.000 <span style={{ fontSize: '1rem', color: '#666' }}>/ Bulan</span></div>
            <div className="annual-price">
              💰 Rp 5.000.000 / Tahun<br />
              <span style={{ fontSize: '0.75rem' }}>(Promo Bayar 10 Bulan)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e67e22', fontWeight: 600, marginTop: '-10px' }}>Setup: Rp 1.000.000 (Sekali)</p>
            <ul>
              <li><strong>Ideal:</strong> SMK / SMA / SMP</li>
              <li><strong>Domain:</strong> Subdomain (.rsch.my.id)</li>
              <li><strong>Penyimpanan:</strong> 10GB Cloud Storage</li>
              <li>Prioritas Jam Kerja</li>
            </ul>
            <button onClick={() => selectPackage('Gold', 'Annual')} style={{ display: 'block', width: '100%', background: 'var(--gold)', color: 'var(--navy)', padding: '12px', borderRadius: '5px', fontWeight: 700 }}>Pilih Tahunan</button>
            <button onClick={() => selectPackage('Gold', 'Monthly')} style={{ display: 'block', width: '100%', background: 'transparent', color: 'var(--navy)', padding: '10px', borderRadius: '5px', fontWeight: 600, border: '1px solid var(--navy)', marginTop: '10px', fontSize: '0.9rem' }}>Pilih Bulanan</button>
          </div>
          <div className="price-card platinum">
            <h4>Platinum Package</h4>
            <div className="price">Custom</div>
            <div className="annual-price" style={{ background: '#f1f2f6', color: '#2f3542', borderColor: '#ced6e0' }}>
              💎 Paket Eksklusif<br />
              <span style={{ fontSize: '0.75rem' }}>Sesuai Kebutuhan Besar</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e67e22', fontWeight: 600, marginTop: '-10px' }}>Setup: Custom Setup</p>
            <ul>
              <li><strong>Ideal:</strong> Yayasan / Sekolah Besar</li>
              <li><strong>Domain:</strong> Custom Domain (.sch.id)</li>
              <li><strong>Penyimpanan:</strong> Unlimited / Sesuai Server</li>
              <li>24/7 + On-Site Support</li>
            </ul>
            <button onClick={() => selectPackage('Platinum')} style={{ display: 'block', width: '100%', background: 'var(--navy)', color: 'white', padding: '12px', borderRadius: '5px', fontWeight: 700 }}>Hubungi Kami</button>
          </div>
        </div>
      </section>

      <section id="daftar" className="registration">
        <div className="form-container">
          <h2>Pendaftaran Sekolah Baru</h2>
          <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>Isi data di bawah ini. Akun Admin akan dikirimkan setelah proses verifikasi oleh tim Rasyatech.</p>
          <form id="regForm" onSubmit={handleRegistration}>
            <div className="form-group">
              <label>Paket yang Diminati</label>
              <select name="package" id="packageSelect" required>
                <option value="">-- Pilih Paket --</option>
                <option value="Silver Monthly">Silver Package (Bulanan - Rp 250k)</option>
                <option value="Silver (Annual Promo)">Silver Package (Promo Tahunan - Rp 2.5jt)</option>
                <option value="Gold Monthly">Gold Package (Bulanan - Rp 500k)</option>
                <option value="Gold (Annual Promo)">Gold Package (Promo Tahunan - Rp 5jt)</option>
                <option value="Platinum">Platinum Package (Custom)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nama Sekolah / Instansi</label>
              <input type="text" name="school_name" required placeholder="Contoh: PKBM Armilla Nusa" />
            </div>
            <div className="form-group">
              <label>Alamat Sekolah</label>
              <input type="text" name="address" required placeholder="Contoh: Mekarwangi, Kuningan" />
            </div>
            <div className="form-group">
              <label>Email Utama (Admin)</label>
              <input type="email" name="email" required placeholder="Contoh: admin@sekolah.sch.id" />
            </div>
            <div className="form-group">
              <label>Password Admin (Nantinya)</label>
              <input type="password" name="password" required placeholder="Min. 8 Karakter" />
            </div>
            <button type="submit" className="btn-submit">Kirim Pendaftaran</button>
          </form>
        </div>
      </section>

      <section id="payment" className={`payment-info ${showPayment ? 'active' : ''}`}>
        <h2 style={{ color: 'var(--navy)' }}>Instruksi Pembayaran</h2>
        <p>Silakan lakukan pembayaran sesuai dengan paket yang Anda pilih untuk mengaktifkan akun Admin Sekolah.</p>

        <div className="payment-grid">
          <div className="payment-card">
            <h4>🏧 Transfer Bank</h4>
            <p><strong>Bank {payments.bankBcaProvider || 'BCA'}</strong></p>
            <p>No. Rekening: {payments.bankBca} <button className="copy-btn" onClick={() => copyText(payments.bankBca)}>Salin</button></p>
            <p>a.n. {payments.bankBcaName}</p>
            <hr style={{ margin: '15px 0', border: 0, borderTop: '1px solid #ddd' }} />
            <p><strong>Bank {payments.bankMandiriProvider || 'Mandiri'}</strong></p>
            <p>No. Rekening: {payments.bankMandiri} <button className="copy-btn" onClick={() => copyText(payments.bankMandiri)}>Salin</button></p>
            <p>a.n. {payments.bankMandiriName}</p>
          </div>

          <div className="payment-card">
            <h4>📱 E-Wallet / QRIS</h4>
            <p><strong>DANA / OVO / GoPay</strong></p>
            <p>No. HP: {payments.eWallet} <button className="copy-btn" onClick={() => copyText(payments.eWallet)}>Salin</button></p>
            <p>a.n. {payments.eWalletName}</p>
            <div style={{ marginTop: '15px', background: '#eee', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>QRIS Standar Tersedia</span>
            </div>
          </div>

          <div className="payment-card">
            <h4>💳 Virtual Account</h4>
            <p>Pilih menu Virtual Account pada ATM/M-Banking Anda:</p>
            <p><strong>BCA VA:</strong> 80777 + No. HP</p>
            <p><strong>Mandiri VA:</strong> 90342 + No. HP</p>
            <p><strong>BRI VA:</strong> 128 + No. HP</p>
            <p style={{ fontSize: '0.8rem', color: '#e74c3c', marginTop: '10px' }}>*Konfirmasi otomatis setelah pembayaran.</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '10px', background: '#fff9e6', border: '1px solid #ffeaa7' }}>
          <p><strong>Setelah Transfer:</strong> Kirim Bukti Pembayaran ke WhatsApp Admin kami untuk percepatan aktivasi server sekolah Anda.</p>
          <a href={`https://wa.me/${config.whatsapp || '6281918226387'}?text=Konfirmasi%20Pembayaran%20Rasyatech`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '10px', background: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 700 }}>Konfirmasi Via WhatsApp</a>
        </div>
      </section>

      <section className="portfolio">
        <h2>Mitra Strategis & Klien</h2>
        <div className="mitra-grid">
          <div className="client-logo">PKBM ARMILLA NUSA</div>
          <div className="client-logo">MITRA AFFILIASI</div>
        </div>
        <p style={{ marginTop: '2rem', color: '#666', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Membangun ekosistem pendidikan digital yang inklusif bersama mitra terpercaya di seluruh daerah.
        </p>
      </section>

      <footer>
        <p><strong>&copy; 2026 Rasyatech by Rasyacomp</strong></p>
        <div className="contact-info">
          📍 {config.address || 'Mekarwangi, Kuningan - Jawa Barat'}<br />
          📱 WhatsApp: <a href={`https://wa.me/${config.whatsapp || '6281918226387'}`} style={{ color: 'white', textDecoration: 'none' }}>{config.whatsapp || '081918226387'}</a> | ✉ Email: ismanto095@gmail.com
        </div>
      </footer>
    </div>
  );
}
