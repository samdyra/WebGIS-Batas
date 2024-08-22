import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mx-auto mb-xl">
      <h1 className="text-3xl font-bold mb-6 text-main-green-dark">Dokumentasi</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Ikhtisar Panel Admin</h2>
        <p className="mb-4">
          Panel admin ini dirancang untuk mengelola data spasial untuk sistem WebGIS kami. Panel ini menyediakan fungsi
          untuk mengunggah, melihat, mengedit, dan menghapus data geografis. Setiap perubahan yang dilakukan melalui
          panel ini akan langsung tercermin pada layar WebGIS, memastikan pembaruan real-time pada informasi geografis
          yang ditampilkan kepada pengguna.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Cara Membuat Data (Menggunakan Tab Unggah File)</h2>
        <p className="mb-4">Untuk mengunggah dan membuat data baru, ikuti langkah-langkah berikut:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Klik tab "Unggah Data" di sidebar.</li>
          <li>
            Isi formulir dengan informasi yang diperlukan:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Nama Tabel: Masukkan nama unik untuk data Anda</li>
              <li>Tipe: Tentukan tipe data (misalnya, Garis, Titik)</li>
              <li>Koordinat: Masukkan koordinat jika diperlukan</li>
              <li>File GeoJSON: Unggah file GeoJSON Anda</li>
            </ul>
          </li>
          <li>Klik tombol "Unggah" untuk mengirim data.</li>
          <li>Tunggu konfirmasi bahwa data telah berhasil diunggah.</li>
        </ol>
        <p className="mt-4">
          Pastikan file GeoJSON Anda menggunakan sistem koordinat WGS84 (EPSG:4326) sebelum mengunggah.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Cara Melihat Data (Menggunakan Tab Lihat)</h2>
        <p className="mb-4">Untuk melihat dan mengelola data yang ada, ikuti langkah-langkah berikut:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Klik tab "Lihat Data" di sidebar.</li>
          <li>Anda akan melihat tabel yang berisi semua data yang telah diunggah.</li>
          <li>Gunakan kotak pencarian di atas tabel untuk mencari data tertentu.</li>
          <li>
            Setiap baris dalam tabel mewakili satu set data dan memiliki tombol "Edit" dan "Hapus":
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Klik "Edit" untuk mengubah informasi data.</li>
              <li>Klik "Hapus" untuk menghapus data dari sistem.</li>
            </ul>
          </li>
          <li>Untuk membuat data baru, klik tombol "Buat Baru" di atas tabel.</li>
        </ol>
        <p className="mt-4">Perubahan yang Anda buat di sini akan langsung tercermin dalam sistem WebGIS.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Konversi Data: SHP/GDB ke GeoJSON</h2>
        <p className="mb-4">
          Untuk mengonversi data dari Shapefile (SHP) atau File Geodatabase (GDB) ke GeoJSON menggunakan QGIS, ikuti
          langkah-langkah berikut:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Buka QGIS dan muat file SHP atau GDB Anda.</li>
          <li>Klik kanan pada layer di panel Layers dan pilih 'Export' → 'Save Features As...'</li>
          <li>
            Dalam dialog 'Save Vector Layer as...':
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Atur Format menjadi 'GeoJSON'</li>
              <li>Pilih nama file dan lokasi penyimpanan</li>
              <li>Pastikan CRS diatur ke EPSG:4326 (WGS 84)</li>
            </ul>
          </li>
          <li>Klik 'OK' untuk menyimpan file dalam format GeoJSON.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Menghubungkan Database dengan QGIS</h2>
        <p className="mb-4">
          Untuk menghubungkan database dengan QGIS dan mengedit data spasial, ikuti langkah-langkah berikut:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Buka QGIS dan klik ikon "Add PostGIS Layers" di toolbar.</li>
          <li>Klik "New" untuk membuat koneksi baru ke database.</li>
          <li>Masukkan detail koneksi database (nama, host, port, database, username, password).</li>
          <li>Klik "Test Connection" untuk memastikan koneksi berhasil.</li>
          <li>Setelah terhubung, pilih tabel yang ingin Anda edit dan klik "Add".</li>
          <li>Gunakan alat editing QGIS untuk memodifikasi data spasial.</li>
          <li>Simpan perubahan Anda ke database.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Sistem Koordinat</h2>
        <p className="mb-4">
          Semua data harus menggunakan sistem koordinat WGS84 (EPSG:4326). Ini adalah standar yang digunakan oleh sistem
          GPS dan banyak aplikasi pemetaan web.
        </p>
        <h3 className="text-xl font-semibold mb-2 text-main-green">Cara Mengubah Proyeksi ke EPSG:4326 di QGIS:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Klik kanan pada layer di panel Layers dan pilih "Properties".</li>
          <li>Pergi ke tab "Source" dan klik tombol "Select CRS".</li>
          <li>Cari dan pilih "EPSG:4326 - WGS 84".</li>
          <li>Klik "Apply" dan "OK".</li>
          <li>Ekspor layer yang sudah diproyeksi ulang sebagai file baru jika diperlukan.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-main-green">Bantuan</h2>
        <p className="mb-4">
          Jika Anda mengalami kesulitan atau memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim
          dukungan kami di support@example.com atau telepon ke 021-1234567.
        </p>
      </section>
    </div>
  );
};

export default Documentation;
