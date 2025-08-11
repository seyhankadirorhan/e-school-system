import React, { useEffect, useMemo, useState } from 'react';
import { getStudents } from '../utils/storage.js';
import StudentTable from '../components/StudentTable.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    setStudents(getStudents());
    const int = setInterval(() => {
      setStudents(getStudents());
    }, 800);
    return () => clearInterval(int);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter((x) => x.name.toLowerCase().includes(s));
  }, [q, students]);

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Teacher Paneli</h1>

      <ProfileForm />

      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-4">
            <div className="flex-1">
              <label className="label">Ara</label>
              <input
                className="input"
                placeholder="İsim ile ara..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <StudentTable students={filtered} readOnly />
        </div>
      </div>
    </div>
  );
}


