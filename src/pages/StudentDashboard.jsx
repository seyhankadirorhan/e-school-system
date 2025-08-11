import React from 'react';
import ProfileForm from '../components/ProfileForm.jsx';

export default function StudentDashboard() {
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Student Paneli</h1>
      <ProfileForm />
      <div className="text-sm text-gray-600">
        Rolünüz öğrenci olduğu için sadece kendi bilgilerinizi güncelleyebilirsiniz.
      </div>
    </div>
  );
}


