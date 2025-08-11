// LocalStorage yardımcıları ve seed verisi

const LS_KEYS = {
  users: 'users',
  students: 'students',
  currentUser: 'currentUser',
  seeded: 'seeded_v1'
};

export const ROLES = ['admin', 'teacher', 'student'];

export function roleToDashboardPath(role) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'teacher':
      return '/dashboard/teacher';
    default:
      return '/dashboard/student';
  }
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateId(prefix = '') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now()}_${rand}`;
}

// Seed
export function seedIfEmpty() {
  const hasSeed = localStorage.getItem(LS_KEYS.seeded);
  if (hasSeed) return;

  const users = [
    { id: generateId('u_'), username: 'admin', password: 'admin123', role: 'admin' },
    { id: generateId('u_'), username: 'teacher', password: 'teacher123', role: 'teacher' },
    { id: generateId('u_'), username: 'student', password: 'student123', role: 'student' }
  ];

  const students = [
    { id: generateId('s_'), name: 'Ali Yılmaz', createdAt: new Date().toISOString() },
    { id: generateId('s_'), name: 'Ayşe Demir', createdAt: new Date().toISOString() },
    { id: generateId('s_'), name: 'Mehmet Kaya', createdAt: new Date().toISOString() }
  ];

  writeJSON(LS_KEYS.users, users);
  writeJSON(LS_KEYS.students, students);
  localStorage.setItem(LS_KEYS.seeded, '1');
}

// CurrentUser
export function getCurrentUser() {
  return readJSON(LS_KEYS.currentUser, null);
}

export function setCurrentUser(user) {
  writeJSON(LS_KEYS.currentUser, user);
}

export function clearCurrentUser() {
  localStorage.removeItem(LS_KEYS.currentUser);
}

// Users
export function getUsers() {
  return readJSON(LS_KEYS.users, []);
}

export function setUsers(users) {
  writeJSON(LS_KEYS.users, users);
}

export function usernameExists(username, exceptUserId = null) {
  const users = getUsers();
  return users.some(
    (u) => u.username.toLowerCase() === String(username).toLowerCase() && u.id !== exceptUserId
  );
}

export function findUserByCredentials(username, password) {
  const users = getUsers();
  return users.find((u) => u.username === username && u.password === password) || null;
}

export function addUser({ username, password, role = 'student' }) {
  const users = getUsers();
  const newUser = { id: generateId('u_'), username, password, role };
  users.push(newUser);
  setUsers(users);
  return newUser;
}

export function updateUserById(id, changes) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('Kullanıcı bulunamadı.');
  const updated = { ...users[idx], ...changes };
  users[idx] = updated;
  setUsers(users);

  const cu = getCurrentUser();
  if (cu && cu.id === id) {
    setCurrentUser({ id: updated.id, username: updated.username, role: updated.role });
  }
  return updated;
}

export function countAdmins() {
  return getUsers().filter((u) => u.role === 'admin').length;
}

export function changeUserRole(id, role) {
  if (!ROLES.includes(role)) throw new Error('Geçersiz rol.');
  const users = getUsers();
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error('Kullanıcı bulunamadı.');
  if (target.role === 'admin' && role !== 'admin' && countAdmins() <= 1) {
    throw new Error('Son admin rolü değiştirilemez.');
  }
  return updateUserById(id, { role });
}

export function deleteUserById(id) {
  const users = getUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return false;
  if (target.role === 'admin' && countAdmins() <= 1) {
    throw new Error('Son admin silinemez.');
  }
  const next = users.filter((u) => u.id !== id);
  setUsers(next);
  const cu = getCurrentUser();
  if (cu && cu.id === id) {
    clearCurrentUser();
  }
  return true;
}

// Students
export function getStudents() {
  return readJSON(LS_KEYS.students, []);
}

export function setStudents(students) {
  writeJSON(LS_KEYS.students, students);
}

export function addStudent(name) {
  const students = getStudents();
  const newStudent = { id: generateId('s_'), name, createdAt: new Date().toISOString() };
  students.unshift(newStudent);
  setStudents(students);
  return newStudent;
}

export function updateStudentName(id, name) {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Öğrenci bulunamadı.');
  students[idx] = { ...students[idx], name };
  setStudents(students);
  return students[idx];
}

export function deleteStudentById(id) {
  const students = getStudents().filter((s) => s.id !== id);
  setStudents(students);
  return true;
}


