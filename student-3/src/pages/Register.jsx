import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, currentUser, roleToDashboardPath } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(roleToDashboardPath(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate, roleToDashboardPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!form.username || !form.password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const user = register(form.username.trim(), form.password);
      setOk('Kayıt başarılı. Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/dashboard/student', { replace: true });
      }, 400);
    } catch (err) {
      setError(err.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center py-12">
      <div className="card w-full max-w-md">
        <div className="card-body">
          <h2 className="text-xl font-semibold mb-4">Kayıt Ol</h2>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {ok && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {ok}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="label">Kullanıcı Adı</label>
              <input
                className="input"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="örn. ali"
              />
            </div>
            <div>
              <label className="label">Şifre</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="******"
              />
            </div>
            <button className="btn" disabled={loading} type="submit">
              {loading ? 'Kaydediliyor...' : 'Kayıt'}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link className="text-indigo-600 hover:underline" to="/login">
              Giriş yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


