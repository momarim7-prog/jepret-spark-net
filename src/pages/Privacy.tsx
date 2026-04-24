import { Link } from "react-router-dom";

const Privacy = () => (
  <div className="min-h-screen px-5 py-10 max-w-3xl mx-auto">
    <Link to="/" className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground">← Kembali</Link>
    <h1 className="font-display text-5xl mt-6 mb-8 text-gradient-golden">Kebijakan Privasi</h1>
    <div className="space-y-5 text-sm text-muted-foreground normal-case tracking-normal leading-relaxed">
      <p><em>Terakhir diperbarui: April 2026</em></p>
      <p>
        Privasi Anda penting bagi kami. Dokumen ini menjelaskan bagaimana Jepretin mengumpulkan, menggunakan, dan melindungi
        data Anda. Ini adalah placeholder dan akan digantikan dengan kebijakan privasi final.
      </p>
      <h2 className="font-display text-2xl text-foreground mt-8">1. Data yang Kami Kumpulkan</h2>
      <p>Nama, email, foto profil, lokasi, dan informasi lain yang Anda berikan saat onboarding.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">2. Cara Kami Menggunakan Data</h2>
      <p>Untuk menghubungkan klien dan freelancer, memproses pembayaran, dan meningkatkan layanan.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">3. Berbagi Data</h2>
      <p>Kami tidak menjual data Anda. Data dibagikan dengan pihak ketiga hanya seperlunya untuk menjalankan layanan.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">4. Hak Anda</h2>
      <p>Anda dapat mengakses, memperbarui, atau menghapus data Anda kapan saja melalui pengaturan akun.</p>
      <h2 className="font-display text-2xl text-foreground mt-8">5. Kontak</h2>
      <p>Pertanyaan tentang privasi: privacy@jepretin.id</p>
    </div>
  </div>
);

export default Privacy;
