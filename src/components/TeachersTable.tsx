import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function TeachersTable({ schoolId }: { schoolId: string }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, [schoolId]);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', schoolId);
    
    if (data) setTeachers(data);
    setLoading(false);
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Data Guru
        </h3>
        <button className="px-4 py-2 bg-indigo-600 text-white font-black rounded-xl text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Guru
        </button>
      </div>
      <table className="w-full">
        <thead>
            <tr className="text-left text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="pb-4">Nama</th>
                <th className="pb-4">NIP</th>
                <th className="pb-4">Aksi</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {teachers.map(t => (
                <tr key={t.id}>
                    <td className="py-4 font-bold">{t.name}</td>
                    <td className="py-4 font-bold">{t.nip}</td>
                    <td className="py-4 flex gap-2">
                        <button className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
