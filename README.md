<<<<<<< HEAD
# E-School-System
Made with reacht and Talwind.css
=======
## Öğrenci Yönetimi — React + Tailwind (LocalStorage, RBAC)

Tamamen tarayıcıda çalışan, backend gerektirmeyen bir SPA. Tüm veriler `localStorage` üzerinde tutulur. Rol tabanlı yetkilendirme içerir (`admin` / `teacher` / `student`).

### Özellikler
- Kayıt ol / giriş yap (kayıt olan herkes `student`)
- Rol tabanlı yönlendirme:
  - admin → `/dashboard/admin`
  - teacher → `/dashboard/teacher`
  - student → `/dashboard/student`
- Admin: Öğrenci CRUD + kullanıcı rolü değiştirme
- Teacher: Öğrencileri tablo halinde görüntüleme, arama
- Student: Sadece kendi kullanıcı bilgilerini güncelleme (rol readonly)
- Navbar’da her zaman Logout (oturum varsa)
- Oturum yoksa dashboard rotalarına erişim engellenir
- Basit doğrulamalar, inline mesajlar
- Tailwind ile modern ve responsive arayüz

### Seed Kullanıcılar
- admin / admin123 (admin)
- teacher / teacher123 (teacher)
- student / student123 (student)

### Kurulum ve Çalıştırma
1. Node 18+ önerilir.
2. Kurulum:
   ```bash
   npm install
   ```
3. Geliştirme:
   ```bash
   npm run dev
   ```
4. Tarayıcı:
   - `http://localhost:5173`

### Proje Yapısı
- `src/context/AuthContext.jsx`: Oturum yönetimi (localStorage ile)
- `src/utils/storage.js`: localStorage yardımcıları ve seed
- `src/pages/*`: Sayfalar (Home, Login, Register, Dashboard’lar)
- `src/components/*`: Navbar, ProtectedRoute, ProfileForm, StudentTable
- `tailwind.config.js`, `postcss.config.js`, `src/index.css`: Tailwind kurulumu

### Notlar
- Parola güncelleme, kullanıcı adının benzersizliği ve boş alan kontrolleri yapılır.
- Admin kendi rolünü değiştirirse, uygun dashboard’a otomatik yönlendirilir.
- Tüm operasyonlar localStorage üzerinde anlık olarak uygulanır.


>>>>>>> 149b8ec (first commit)
