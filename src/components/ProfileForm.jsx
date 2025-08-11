import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { usernameExists } from '../utils/storage.js';

export default function ProfileForm() {
  const { currentUser, updateProfile } = useAuth();
  const [username, setUsername] = useState(currentUser?.username || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!username) {
      setMessage({ type: 'error', text: 'Kullanıcı adı boş olamaz.' });
      return;
    }
    if (username !== currentUser.username && usernameExists(username, currentUser.id)) {
      setMessage({ type: 'error', text: 'Bu kullanıcı adı zaten mevcut.' });
      return;
    }

    setLoading(true);
    try {
      const changes = { username };
      if (password) changes.password = password;
      updateProfile(changes);
      setPassword('');
      setMessage({ type: 'success', text: 'Bilgileriniz güncellendi.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-lg font-semibold mb-4">Profilim</h2>

        {message.text && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="grid gap-4 max-w-xl">
          <div>
            <label className="label">Rol</label>
            <input className="input bg-gray-100" value={currentUser.role} disabled />
          </div>
          <div>
            <label className="label">Kullanıcı Adı</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="örn. ali"
            />
          </div>
          <div>
            <label className="label">Yeni Şifre (opsiyonel)</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>
          <div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


