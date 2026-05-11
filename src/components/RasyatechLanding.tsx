import { useState } from 'react';
import { Phone, Mail, ChevronRight, Laptop, Server, Code, BookOpenText } from 'lucide-react';

export default function RasyatechLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Head: Import Poppins Font (Add this in src/index.css ideally, but here in-line via tailwind config if possible or just normal import) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
        body { font-family: 'Poppins', sans-serif; }
      `}</style>
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="text-2xl font-bold italic tracking-tight text-amber-500">Rasyatech</div>
          <div className="hidden md:flex gap-6 font-semibold">
            <a href="#hero" className="hover:text-amber-500">Beranda</a>
            <a href="#about" className="hover:text-amber-500">Tentang</a>
            <a href="#services" className="hover:text-amber-500">Layanan</a>
            <a href="#contact" className="hover:text-amber-500">Kontak</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="pt-32 pb-20 bg-slate-900 text-white min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Mitra Digitalisasi Pendidikan & Teknologi di Kuningan</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Solusi IT profesional untuk kebutuhan sekolah, instansi, dan bisnis Anda.</p>
          <a href="#services" className="bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition">Pelajari LMS Kami</a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">Tentang Kami</h2>
        <p className="max-w-2xl mx-auto text-slate-600">Rasyatech adalah divisi teknologi dari Rasyacomp, fokus memberikan solusi IT lokal yang andal dan terjangkau di Lebakwangi dan sekitarnya.</p>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Layanan Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "LMS Rasyatech", desc: "Sistem Manajemen Sekolah Terintegrasi (PKBM, SMK, dll).", icon: <BookOpenText className="w-10 h-10 text-amber-500" /> },
              { title: "Jasa Servis IT", desc: "Perbaikan Komputer, Laptop, dan Jaringan (by Rasyacomp).", icon: <Laptop className="w-10 h-10 text-amber-500" /> },
              { title: "Web Development", desc: "Pembuatan website profesional untuk instansi dan bisnis.", icon: <Code className="w-10 h-10 text-amber-500" /> },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md border hover:border-amber-500 transition">
                <div className="mb-4">{s.icon}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-slate-900">Portofolio</h2>
        <div className="max-w-md mx-auto p-8 bg-slate-100 rounded-lg">
          <p className="font-semibold text-slate-800">Klien Pertama:</p>
          <div className="text-2xl font-bold text-slate-900">PKBM Armilla Nusa</div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-slate-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-12">Kontak Kami</h2>
        <div className="flex flex-col gap-4 items-center">
          <a href="https://wa.me/6285224025555" className="flex items-center gap-2 text-lg hover:text-amber-500"><Phone /> 085224025555</a>
          <a href="mailto:ismanto095@gmail.com" className="flex items-center gap-2 text-lg hover:text-amber-500"><Mail /> ismanto095@gmail.com</a>
        </div>
        <p className="mt-10 text-slate-400">Lebakwangi, Kuningan, Jawa Barat</p>
      </section>
      
      {/* Footer comment: Replace images in img tags when available */}
    </div>
  );
}
