import React, { useState } from 'react';

interface LaporanItem {
  id: number;
  judul: string;
  pelapor: string;
  deskripsi: string;
  daerah: string;
  dokumenPendukung: string;
}

const mockLaporanData: LaporanItem[] = [
  {
    id: 1,
    judul: 'Banjir di Kelurahan Sukamaju',
    pelapor: 'Ahmad Setiawan',
    deskripsi: 'Terjadi banjir setinggi 1 meter di beberapa RT',
    daerah: 'Bandung',
    dokumenPendukung: 'banjir_sukamaju.pdf',
  },
  {
    id: 2,
    judul: 'Longsor di Desa Cikole',
    pelapor: 'Siti Nurhaliza',
    deskripsi: 'Longsor menutup akses jalan utama desa',
    daerah: 'Lembang',
    dokumenPendukung: 'longsor_cikole.jpg',
  },
  {
    id: 3,
    judul: 'Kekeringan di Kecamatan Rancaekek',
    pelapor: 'Budi Santoso',
    deskripsi: 'Kekeringan parah menyebabkan gagal panen',
    daerah: 'Bandung',
    dokumenPendukung: 'kekeringan_rancaekek.docx',
  },
  {
    id: 4,
    judul: 'Pencemaran Sungai Citarum',
    pelapor: 'Dewi Lestari',
    deskripsi: 'Limbah pabrik mencemari aliran sungai',
    daerah: 'Bandung',
    dokumenPendukung: 'pencemaran_citarum.pdf',
  },
  {
    id: 5,
    judul: 'Kebakaran Hutan di Gunung Papandayan',
    pelapor: 'Agus Hermawan',
    deskripsi: 'Kebakaran hutan meluas di lereng gunung',
    daerah: 'Garut',
    dokumenPendukung: 'kebakaran_papandayan.jpg',
  },
];

const LaporanView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockLaporanData.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Judul</th>
              <th className="p-2 text-left">Pelapor</th>
              <th className="p-2 text-left">Deskripsi</th>
              <th className="p-2 text-left">Daerah</th>
              <th className="p-2 text-left">Dokumen Pendukung</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.judul}</td>
                <td className="p-2">{item.pelapor}</td>
                <td className="p-2">{item.deskripsi}</td>
                <td className="p-2">{item.daerah}</td>
                <td className="p-2">{item.dokumenPendukung}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanView;
