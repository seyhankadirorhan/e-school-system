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
  updateStudentName
} from '../utils/storage.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
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
    changeUserRole(userId, role);
    refreshUsers();
    if (currentUser?.id === userId) {
      navigate(roleToDashboardPath(role), { replace: true });
    } else {
      setMsg({ type: 'success', text: 'Kullanıcı rolü güncellendi.' });
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
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th w-16">#</th>
                  <th className="th">Kullanıcı Adı</th>
                  <th className="th">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((u, idx) => (
                  <tr key={u.id}>
                    <td className="td">{idx + 1}</td>
                    <td className="td">{u.username}</td>
                    <td className="td">
                      <select
                        className="input"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="td" colSpan={3}>
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


