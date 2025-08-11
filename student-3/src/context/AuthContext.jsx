import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  seedIfEmpty,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  findUserByCredentials,
  usernameExists,
  addUser,
  updateUserById,
  roleToDashboardPath
} from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setUserState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    const cu = getCurrentUser();
    setUserState(cu);
    setReady(true);
  }, []);

  const login = (username, password) => {
    const user = findUserByCredentials(username, password);
    if (!user) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }
    const { id, username: un, role } = user;
    const lean = { id, username: un, role };
    setCurrentUser(lean);
    setUserState(lean);
    return lean;
  };

  const logout = () => {
    clearCurrentUser();
    setUserState(null);
  };

  const register = (username, password) => {
    if (!username || !password) {
      throw new Error('Lütfen tüm alanları doldurun.');
    }
    if (usernameExists(username)) {
      throw new Error('Bu kullanıcı adı zaten alınmış.');
    }
    const newUser = addUser({ username, password, role: 'student' });
    const lean = { id: newUser.id, username: newUser.username, role: newUser.role };
    setCurrentUser(lean);
    setUserState(lean);
    return lean;
  };

  const updateProfile = (changes) => {
    if (!currentUser) return null;
    const { id } = currentUser;
    const updated = updateUserById(id, changes);
    const lean = { id: updated.id, username: updated.username, role: updated.role };
    setCurrentUser(lean);
    setUserState(lean);
    return lean;
  };

  const value = useMemo(
    () => ({
      ready,
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      register,
      updateProfile,
      roleToDashboardPath
    }),
    [ready, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


