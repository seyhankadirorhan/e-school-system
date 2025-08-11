import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Home() {
  return (
    <div className="grid place-items-center py-16">
      <div className="text-center max-w-xl">
        <img src={logo} alt="Logo" className="mx-auto h-16 w-16 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Öğrenci Yönetimi</h1>
        <p className="text-gray-600 mb-6">
          Kayıt ol, giriş yap ve rolüne göre öğrencileri yönet. Tüm veriler tarayıcında
          saklanır.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/login" className="btn-outline">Giriş</Link>
          <Link to="/register" className="btn">Kayıt</Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Örnek hesaplar: admin/admin123, teacher/teacher123, student/student123
        </div>
      </div>
    </div>
  );
}


