import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SchoolLogin from './SchoolLogin';
import TeachersTable from './TeachersTable';
import StudentsTable from './StudentsTable';
import { LayoutDashboard, Users, BookOpen, Settings, Loader2, School } from 'lucide-react';

export default function TenantDashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [schoolData, setSchoolData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSchoolData(session.user.email);
      } else {
        setLoading(false);
      }
      
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSchoolData(session.user.email);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchSchoolData = async (email: string | undefined) => {
    if (!email) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('admin_email', email)
      .single();
    
    if (data) setSchoolData(data);
    setLoading(false);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) return <SchoolLogin />;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil Sekolah', icon: <Settings className="w-5 h-5" /> },
    { id: 'academic', label: 'Manajemen Akademik', icon: <Users className="w-5 h-5" /> },
    { id: 'learning', label: 'Pembelajaran', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <School className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black tracking-tight">LMS Sekolah</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black capitalize">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-700">
                {schoolData?.school_name || 'Sekolah'}
            </div>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px]">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="text-indigo-600 font-bold mb-2">Total Siswa</div>
                    <div className="text-4xl font-black text-indigo-900">0</div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="text-emerald-600 font-bold mb-2">Total Guru</div>
                    <div className="text-4xl font-black text-emerald-900">0</div>
                </div>
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="text-amber-600 font-bold mb-2">Materi Aktif</div>
                    <div className="text-4xl font-black text-amber-900">0</div>
                </div>
            </div>
          )}
          {activeTab === 'academic' && schoolData && (
             <div className="space-y-6">
                 <TeachersTable schoolId={schoolData.id} />
                 <StudentsTable schoolId={schoolData.id} />
             </div>
          )}
          {activeTab === 'profile' && (
             <div className="space-y-6">
                 <h3 className="text-xl font-bold">Data Sekolah</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <p className="font-bold text-slate-400">Nama:</p><p className="font-bold">{schoolData?.school_name}</p>
                     <p className="font-bold text-slate-400">NPSN:</p><p className="font-bold">{schoolData?.npsn}</p>
                     <p className="font-bold text-slate-400">Alamat:</p><p className="font-bold">{schoolData?.address}</p>
                 </div>
             </div>
          )}
          {activeTab === 'learning' && <p className="text-slate-500 font-bold">Fitur Pembelajaran (Materi/Tugas/Nilai) dalam pengembangan.</p>}
        </div>
      </main>
    </div>
  );
}
