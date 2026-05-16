import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SchoolLogin from './SchoolLogin';
import { LayoutDashboard, Users, BookOpen, Settings, Loader2 } from 'lucide-react';

export default function TenantDashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

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
        <h2 className="text-lg font-black mb-8 px-4">LMS Sekolah</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-8 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h1>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          {activeTab === 'dashboard' && <p>Dashboard content goes here...</p>}
          {/* Add other tab contents here */}
        </div>
      </main>
    </div>
  );
}
