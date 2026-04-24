import { Link } from "react-router-dom";

const Terms = () => (
  <div className="min-h-screen px-5 py-10 max-w-3xl mx-auto">
    <Link to="/" className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground">← Kembali</Link>
    <h1 className="font-display text-5xl mt-6 mb-8 text-gradient-golden">Syarat & Ketentuan</h1>
    <div className="space-y-5 text-sm text-muted-foreground normal-case tracking-normal leading-relaxed">
      <p><em>Terakhir diperbarui: April 2026</em></p>
      <p>
        Selamat datang di Jepretin. Dengan menggunakan platform kami, Anda menyetujui syarat dan ketentuan yang tercantum
        di halaman ini. Dokumen ini adalah placeholder dan akan digantikan dengan teks legal final sebelum peluncuran resmi.
      </p>
      <h2 className="font-display text-2xl text-foreground mt-8">1. Penggunaan Layanan</h2>
      <p>Anda setuju untuk menggunakan platform secara sah, jujur, dan profesional.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">2. Akun & Keamanan</h2>
      <p>Anda bertanggung jawab atas keamanan akun Anda dan semua aktivitas yang terjadi di dalamnya.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">3. Pembayaran</h2>
      <p>Detail pembayaran, biaya layanan, dan kebijakan pengembalian dana akan diuraikan di sini.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">4. Konten Pengguna</h2>
      <p>Anda mempertahankan kepemilikan atas konten yang Anda unggah, namun memberi kami lisensi untuk menampilkannya.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">5. Pengakhiran</h2>
      <p>Kami berhak menangguhkan akun yang melanggar syarat ini.</p>
    </div>
  </div>
);

export default Terms;
