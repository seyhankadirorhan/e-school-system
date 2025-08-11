import React, { useMemo, useState } from 'react';

export default function StudentTable({
  students,
  readOnly = false,
  onUpdateName,
  onDelete
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const sorted = useMemo(() => {
    return [...students].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [students]);

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };
  const saveEdit = () => {
    if (!editName.trim()) return;
    onUpdateName?.(editingId, editName.trim());
    cancelEdit();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-gray-50">
          <tr>
            <th className="th w-16">#</th>
            <th className="th">İsim</th>
            <th className="th hidden sm:table-cell">Oluşturma</th>
            {!readOnly && <th className="th text-right">İşlemler</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sorted.map((s, idx) => (
            <tr key={s.id}>
              <td className="td">{idx + 1}</td>
              <td className="td">
                {editingId === s.id && !readOnly ? (
                  <input
                    className="input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <span>{s.name}</span>
                )}
              </td>
              <td className="td hidden sm:table-cell">
                <span className="text-xs text-gray-500">
                  {new Date(s.createdAt).toLocaleString('tr-TR')}
                </span>
              </td>
              {!readOnly && (
                <td className="td">
                  {editingId === s.id ? (
                    <div className="flex justify-end gap-2">
                      <button className="btn" onClick={saveEdit}>Kaydet</button>
                      <button className="btn-outline" onClick={cancelEdit}>Vazgeç</button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button className="btn-outline" onClick={() => startEdit(s)}>Düzenle</button>
                      <button
                        className="btn"
                        onClick={() => onDelete?.(s.id)}
                        title="Sil"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td className="td" colSpan={readOnly ? 3 : 4}>
                <div className="text-center text-gray-500">Kayıt bulunamadı.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


