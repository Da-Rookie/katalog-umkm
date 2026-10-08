# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Berhasil membuat koneksi Supabase untuk server di `lib/supabase/server.js` dan re-export di `lib/supabase/index.js` menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Halaman `app/page.jsx` diubah menjadi Server Component async yang mengambil seluruh data dari tabel `produk` di Supabase.
- Produk ditampilkan dengan komponen `KartuProduk` tanpa mengubah tata letak kartu maupun grid.
- Jika database kosong, halaman menampilkan teks "Belum ada produk".
- Jika terjadi kegagalan pengambilan data, pesan error ditampilkan secara jelas dengan gaya token `text-bahaya`.
- Komponen `CatatanBelumAktif` berhasil dihapus dari halaman beranda.

**Perbaikan:**
- Menambahkan konfigurasi `export const dynamic = "force-dynamic"` pada `app/page.jsx` agar katalog selalu menampilkan data terbaru dari Supabase.
- Menambahkan blok penanganan try-catch untuk menangkap potensi error koneksi database secara anggun.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` berhasil mengambil data produk berdasarkan parameter `id` langsung dari database Supabase secara server-side.
- Jika produk tidak ditemukan di database, memanggil fungsi `notFound()` dari Next.js untuk menampilkan halaman 404.
- Seluruh elemen tampilan, gaya, dan komponen `TombolWhatsApp` dipertahankan.
- Komponen `CatatanBelumAktif` berhasil dihapus dari halaman detail produk.

**Perbaikan:**
- Menggunakan query `.maybeSingle()` dan validasi error sehingga input ID yang tidak valid atau non-numerik langsung mengarah ke halaman 404 tanpa menyebabkan crash pada server.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `components/TombolWhatsApp.jsx` berhasil diubah menjadi tautan `<a>` menuju `https://wa.me/<nomorWhatsApp>?text=<pesan>`.
- Nomor tujuan diambil dari `lib/toko.js` (format internasional tanpa tanda `+`).
- Pesan otomatis berisikan nama dan harga produk yang diformat rupiah menggunakan `formatRupiah` dari `lib/format.js`.
- Pesan di-encode secara aman menggunakan `encodeURIComponent`.
- Tautan membuka tab baru dengan `target="_blank"` dan `rel="noopener noreferrer"`.
- Gaya visual tombol tetap konsisten dengan desain awal.

**Perbaikan:**
- Menambahkan pengecekan pengaman (guard clause) `if (!produk) return null;` agar komponen tidak melempar runtime error jika objek produk belum siap.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Membuat koneksi sesi admin menggunakan `@supabase/ssr` dan cookie store dari `next/headers` di `lib/supabase/session.js`.
- Membuat Server Action `login` dan `logout` (alias `keluar`) di `app/admin/actions.js`.
- Form login di `app/admin/login/page.jsx` disambungkan ke Server Action menggunakan `useActionState`.
- Login berhasil mengalihkan admin ke `/admin`, sedangkan login gagal menampilkan pesan error yang informatif di bawah judul form.
- Tombol "Keluar" di `components/NavAdmin.jsx` difungsikan untuk logout via Server Action dan mengembalikan pengguna ke `/admin/login`.
- Komponen `CatatanBelumAktif` dihapus dari halaman login tanpa mengubah estetika form.

**Perbaikan:**
- Mengadaptasi argumen Server Action agar fleksibel mendukung baik pemanggilan berbasis React 19 `useActionState` maupun form action standar.
- Menyesuaikan pesan error autentikasi Supabase (`Invalid login credentials`) menjadi pesan berbahasa Indonesia yang jelas ("Email atau password salah.").

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js` yang memverifikasi bahwa pemanggil adalah admin yang sedang aktif login.
- Validasi sisi server memastikan password baru memiliki panjang minimal 8 karakter dan bernilai identik dengan konfirmasi password.
- Memperbarui password akun admin lewat Supabase Auth `updateUser({ password })`.
- Form di `app/admin/password/page.jsx` disambungkan menggunakan `useActionState` dan menampilkan pesan berhasil (hijau) atau pesan gagal (merah).
- Komponen `CatatanBelumAktif` dihapus dari halaman ganti password.

**Perbaikan:**
- Menambahkan pengecekan sesi admin di sisi server sebelum menjalankan proses pergantian password sesuai aturan keamanan AGENTS.md nomor 3.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat file `proxy.js` di root proyek untuk memproteksi semua rute dengan pola `/admin/:path*`.
- Pengguna yang belum login otomatis dialihkan (redirect 307) ke `/admin/login` jika mencoba membuka `/admin`, `/admin/password`, maupun sub-halaman admin lainnya.
- Pengguna yang sudah login yang mengunjungi `/admin/login` otomatis dialihkan ke `/admin`.
- Setiap Server Action yang memodifikasi data terproteksi dengan validasi sesi admin di sisi server.
- Komponen `CatatanBelumAktif` berhasil dihapus dari `app/admin/page.jsx`.

**Perbaikan:**
- Menyediakan export `proxy`, `middleware`, dan `default` di `proxy.js` untuk memastikan kompatibilitas penuh dengan sistem proxy/middleware Next.js 16.

## Debugging dan fitur bonus

**[SENDIRI] Resolusi GitHub Push Protection (Kebocoran Secret Key)**
- **Masalah:** Saat menjalankan `git push`, GitHub menolak push dengan error `GH013: Repository rule violations (Push cannot contain secrets)` karena kunci `SUPABASE_SECRET_KEY` tidak sengaja tercantum di file publik `.env.example` pada commit lokal.
- **Perbaikan:**
  1. Mengembalikan nilai variabel di `.env.example` ke template kosong tanpa nilai kredensial nyata (kredensial asli tetap aman di `.env.local`).
  2. Melakukan `git commit --amend` untuk memperbarui commit terakhir sehingga kredensial terhapus sepenuhnya dari riwayat commit Git lokal.
  3. Menjalankan ulang `git push` dan push berhasil diterima oleh GitHub tanpa melanggar aturan perlindungan rahasia.

### [SENDIRI] US-07 List Produk di Halaman Admin dari Database
**Prompt:**
Ubah app/admin/page.jsx supaya daftar produk diambil langsung dari tabel "produk" di Supabase secara server-side menggunakan createServerClient. Tampilkan daftar produk menggunakan TabelProduk dan jika tabel kosong, tampilkan pesan bahwa belum ada produk di database.

**Hasil:**
- Halaman `app/admin/page.jsx` kini memuat produk dari database Supabase alih-alih data contoh `produkContoh`.
- `components/TabelProduk.jsx` menampilkan seluruh produk lengkap dengan foto, nama, kategori, harga, dan tombol aksi.
- Jika database belum memiliki produk, ditampilkan kotak pesan bahwa produk masih kosong.

**Perbaikan:**
- Menambahkan `export const dynamic = "force-dynamic"` agar daftar produk admin selalu terbarui seketika setelah aksi tambah, ubah, atau hapus.

### [SENDIRI] US-08 Tambah Produk (Terkunci Login)
**Prompt:**
Buat Server Action tambahProduk di app/admin/actions.js yang terkunci login admin dan menyimpan produk baru ke database Supabase (nama, harga, kategori, foto_url, deskripsi). Sambungkan form di app/admin/produk/baru/page.jsx via components/FormProduk.jsx, lalu kembali ke /admin setelah tersimpan.

**Hasil:**
- Server Action `tambahProduk` berhasil dibuat dengan validasi autentikasi admin di server via `supabase.auth.getUser()`.
- Validasi data memastikan nama produk terisi dan harga merupakan nilai numerik non-negatif.
- `app/admin/produk/baru/page.jsx` dan `components/FormProduk.jsx` terhubung dengan action dan kembali ke `/admin` serta memicu `revalidatePath`.
- `CatatanBelumAktif` dihapus dari halaman tambah produk.

**Perbaikan:**
- Menambahkan status `isPending` pada tombol simpan agar admin mendapatkan feedback visual saat proses penyimpanan sedang berlangsung.

### [SENDIRI] US-09 Ubah Produk (Terkunci Login)
**Prompt:**
Buat Server Action ubahProduk di app/admin/actions.js yang terkunci login admin dan memperbarui data produk di Supabase berdasarkan id. Di app/admin/produk/[id]/ubah/page.jsx, ambil data lama produk dari database secara server-side dan isi form melalui components/FormProduk.jsx. Jika produk tidak ditemukan, panggil notFound().

**Hasil:**
- Halaman `app/admin/produk/[id]/ubah/page.jsx` mengambil produk lama dari Supabase dan menampilkannya di dalam form.
- Server Action `ubahProduk` memverifikasi sesi login admin, lalu mengupdate data pada tabel `produk`.
- Selesai simpan diarahkan kembali ke `/admin` dan path direvalidasi.
- `CatatanBelumAktif` dihapus dari halaman ubah produk.

**Perbaikan:**
- Menyertakan hidden input `id` pada `components/FormProduk.jsx` jika mengedit produk agar ID produk dikirimkan secara tepat ke Server Action.

### [SENDIRI] US-10 Hapus Produk (Terkunci Login)
**Prompt:**
Buat Server Action hapusProduk di app/admin/actions.js yang terkunci login admin dan menghapus produk dari database. Pada components/TabelProduk.jsx, buat tombol "Hapus" meminta konfirmasi dialog sebelum menghapus data.

**Hasil:**
- Server Action `hapusProduk` memverifikasi sesi login admin dan menghapus baris terkait di tabel `produk`.
- Tombol "Hapus" pada `components/TabelProduk.jsx` menjalankan dialog browser `confirm()` sebelum formulir dikirimkan.
- Setelah produk terhapus, halaman admin otomatis menampilkan daftar produk terbaru.

**Perbaikan:**
- Menambahkan `event.preventDefault()` jika admin membatalkan konfirmasi penghapusan sehingga request tidak terkirim ke server.

### [SENDIRI] US-11 Filter Kategori dan Pencarian
**Prompt:**
Ubah app/page.jsx agar pengunjung dapat mencari produk berdasarkan nama melalui form pencarian dan menyaring produk berdasarkan kategori melalui tombol filter. Gunakan query parameter URL dan query Supabase.

**Hasil:**
- Input pencarian nama produk ditambahkan di samping judul "Produk kami", lengkap dengan tombol "Cari" dan "Reset".
- Tombol filter kategori ("Semua", "Minuman", "Camilan", dll.) diekstrak secara dinamis dari produk yang ada di Supabase.
- Pengunjung dapat mencari dan memfilter secara bersamaan atau terpisah.
- Jika pencarian tidak menemukan hasil, pesan "Tidak ada produk yang cocok" ditampilkan.

**Perbaikan:**
- Menggunakan query database yang efisien (`.ilike("nama", ...)` dan `.eq("kategori", ...)`) sehingga pemfilteran dilakukan di sisi server dan URL dapat dibagikan langsung.

### [SENDIRI] US-12 Pilih Jumlah Produk Sebelum Memesan
**Prompt:**
Ubah components/TombolWhatsApp.jsx agar pengunjung dapat memilih jumlah pesanan (counter interaktif). Hitung total harga otomatis dan cantumkan jumlah beserta total harga ke dalam format pesan otomatis WhatsApp.

**Hasil:**
- Tombol pemilih jumlah interaktif (`−` dan `+`) ditambahkan di atas tombol WhatsApp.
- Total harga otomatis terkalkulasi secara real-time (`harga x jumlah`).
- Tautan WhatsApp otomatis menghasilkan pesan: `Halo, saya ingin memesan <nama> sebanyak <jumlah> pcs (total <totalHarga>).`
- Tombol utama menampilkan jumlah pesanan yang dipilih, misal: `Pesan via WhatsApp (2 pcs)`.

**Perbaikan:**
- Membatasi jumlah minimal pemesanan adalah 1 unit (`Math.max(1, prev - 1)`).
