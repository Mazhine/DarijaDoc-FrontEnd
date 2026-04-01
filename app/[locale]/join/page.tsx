'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
// استعملنا createBrowserClient حيت هي اللي خدامة دابا فـ Next.js
import { createBrowserClient } from '@supabase/ssr';

export default function JoinDoctor() {
  const t = useTranslations('Join');
  
  // تعريف Supabase Client بطريقة صحيحة للـ Client Components
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    city: '',
    maps: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('doctors')
      .insert([
        { 
          name: formData.name, 
          specialty: formData.speciality, 
          city: formData.city,
          google_maps_link: formData.maps 
        }
      ]);

    setLoading(false);

    if (error) {
      console.error("Supabase Error:", error);
      alert("Error: " + error.message);
    } else {
      setSuccess(true);
      setFormData({ name: '', speciality: '', city: '', maps: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{t('title')}</h1>
        <p className="text-slate-600 mb-10">{t('subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          {success ? (
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">شكراً دكتور!</h2>
              <p className="text-green-600">تم تسجيل معلوماتك بنجاح. غادي نتواصلوا معاك قريباً.</p>
              <button onClick={() => setSuccess(false)} className="mt-4 text-blue-600 underline font-bold">
                تسجيل طبيب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">{t('name')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">{t('speciality')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.speciality}
                  onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">{t('city')}</label>
                <input 
                  required
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">{t('maps')}</label>
                <input 
                  type="url" 
                  placeholder="https://goo.gl/maps/..." 
                  value={formData.maps}
                  onChange={(e) => setFormData({...formData, maps: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                />
              </div>
              
              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? "جارِ الإرسال..." : t('submit')}
              </button>
            </form>
          )}

          {/* Benefits */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">{t('benefits_title')}</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700">✅ <span>{t('b1')}</span></li>
              <li className="flex items-center gap-3 text-slate-700">✅ <span>{t('b2')}</span></li>
              <li className="flex items-center gap-3 text-slate-700">✅ <span>{t('b3')}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}