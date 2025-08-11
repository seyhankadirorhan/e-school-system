import React, { useEffect, useMemo, useState } from 'react';
import ProfileForm from '../components/ProfileForm.jsx';
import StudentTable from '../components/StudentTable.jsx';
import {
  addStudent,
  changeUserRole,
  deleteStudentById,
  getStudents,
  getUsers,
  ROLES,
  updateStudentName,
  addUser,
  updateUserById,
  deleteUserById
} from '../utils/storage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [q, setQ] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({ username: '', password: '', role: 'student' });
  const { currentUser, roleToDashboardPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setStudents(getStudents());
    setUsers(getUsers());
  }, []);

  const filteredStudents = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter((x) => x.name.toLowerCase().includes(s));
  }, [q, students]);

  const refreshUsers = () => setUsers(getUsers());
  const refreshStudents = () => setStudents(getStudents());

  const handleAddStudent = (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!newStudent.trim()) {
      setMsg({ type: 'error', text: 'Öğrenci ismi boş olamaz.' });
      return;
    }
    addStudent(newStudent.trim());
    setNewStudent('');
    refreshStudents();
    setMsg({ type: 'success', text: 'Öğrenci eklendi.' });
  };

  const handleUpdateStudent = (id, name) => {
    updateStudentName(id, name);
    refreshStudents();
    setMsg({ type: 'success', text: 'Öğrenci güncellendi.' });
  };

  const handleDeleteStudent = (id) => {
    deleteStudentById(id);
    refreshStudents();
    setMsg({ type: 'success', text: 'Öğrenci silindi.' });
  };

  const handleRoleChange = (userId, role) => {
    try {
      changeUserRole(userId, role);
      refreshUsers();
      if (currentUser?.id === userId) {
        navigate(roleToDashboardPath(role), { replace: true });
      } else {
        setMsg({ type: 'success', text: 'Kullanıcı rolü güncellendi.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users.filter((u) => {
      const matchText = !q || u.username.toLowerCase().includes(q);
      const matchRole = !userRoleFilter || u.role === userRoleFilter;
      return matchText && matchRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const onCreateUser = (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    const { username, password, role } = newUser;
    if (!username || !password) {
      setMsg({ type: 'error', text: 'Kullanıcı adı ve şifre zorunludur.' });
      return;
    }
    try {
      addUser({ username: username.trim(), password, role });
      setNewUser({ username: '', password: '', role: 'student' });
      refreshUsers();
      setMsg({ type: 'success', text: 'Kullanıcı eklendi.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Kullanıcı eklenemedi.' });
    }
  };

  const onEditUserStart = (u) => {
    setEditingUserId(u.id);
    setEditUser({ username: u.username, password: '', role: u.role });
  };
  const onEditUserCancel = () => {
    setEditingUserId(null);
    setEditUser({ username: '', password: '', role: 'student' });
  };
  const onEditUserSave = () => {
    if (!editingUserId) return;
    const payload = { username: editUser.username, role: editUser.role };
    if (editUser.password) payload.password = editUser.password;
    try {
      updateUserById(editingUserId, payload);
      refreshUsers();
      if (currentUser?.id === editingUserId && currentUser.role !== editUser.role) {
        navigate(roleToDashboardPath(editUser.role), { replace: true });
      }
      setMsg({ type: 'success', text: 'Kullanıcı güncellendi.' });
      onEditUserCancel();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const onDeleteUser = (id) => {
    try {
      deleteUserById(id);
      refreshUsers();
      setMsg({ type: 'success', text: 'Kullanıcı silindi.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Admin Paneli</h1>

      {msg.text && (
        <div
          className={`rounded-md p-3 text-sm ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      <ProfileForm />

      <div className="grid gap-4 card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
            <div className="flex-1">
              <label className="label">Öğrenci İsmi</label>
              <input
                className="input"
                placeholder="örn. Zeynep Koç"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="label">Ara</label>
              <input
                className="input"
                placeholder="İsim ile ara..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className="btn md:self-end" onClick={handleAddStudent}>
              Ekle
            </button>
          </div>

          <div className="mt-4">
            <StudentTable
              students={filteredStudents}
              readOnly={false}
              onUpdateName={handleUpdateStudent}
              onDelete={handleDeleteStudent}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Kullanıcı Rolleri</h2>
          <form onSubmit={onCreateUser} className="grid gap-3 md:grid-cols-4 mb-4">
            <input
              className="input"
              placeholder="Yeni kullanıcı adı"
              value={newUser.username}
              onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Şifre"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
            />
            <select
              className="input"
              value={newUser.role}
              onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value }))}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button type="submit" className="btn">Kullanıcı Ekle</button>
          </form>

          <div className="grid gap-3 md:grid-cols-3 mb-4">
            <input
              className="input"
              placeholder="Kullanıcı arayın..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <select
              className="input"
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
            >
              <option value="">Tüm Roller</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div />
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th w-16">#</th>
                  <th className="th">Kullanıcı Adı</th>
                  <th className="th">Rol</th>
                  <th className="th text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id}>
                    <td className="td">{idx + 1}</td>
                    <td className="td">
                      {editingUserId === u.id ? (
                        <input
                          className="input"
                          value={editUser.username}
                          onChange={(e) => setEditUser((s) => ({ ...s, username: e.target.value }))}
                        />
                      ) : (
                        u.username
                      )}
                    </td>
                    <td className="td">
                      {editingUserId === u.id ? (
                        <select
                          className="input"
                          value={editUser.role}
                          onChange={(e) => setEditUser((s) => ({ ...s, role: e.target.value }))}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          className="input"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="td">
                      <div className="flex justify-end gap-2">
                        {editingUserId === u.id ? (
                          <>
                            <button className="btn" onClick={onEditUserSave}>Kaydet</button>
                            <button className="btn-outline" onClick={onEditUserCancel}>Vazgeç</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-outline" onClick={() => onEditUserStart(u)}>Düzenle</button>
                            <button className="btn" onClick={() => onDeleteUser(u.id)}>Sil</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td className="td" colSpan={4}>
                      <div className="text-center text-gray-500">Kullanıcı yok.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


