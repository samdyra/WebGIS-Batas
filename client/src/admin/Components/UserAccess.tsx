import React, { useState } from 'react';

interface UserItem {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const mockUserData: UserItem[] = [
  {
    id: 1,
    email: 'admin@example.com',
    username: 'admin',
    role: 'Admin',
    created_at: '2023-08-01',
    updated_at: '2023-08-02',
  },
  {
    id: 2,
    email: 'user@example.com',
    username: 'regularuser',
    role: 'User',
    created_at: '2023-08-03',
    updated_at: '2023-08-03',
  },
  {
    id: 3,
    email: 'editor@example.com',
    username: 'contenteditor',
    role: 'Editor',
    created_at: '2023-08-04',
    updated_at: '2023-08-05',
  },
  // Add more mock user data as needed
];

const UserAccessView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockUserData.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button className="bg-main-green text-white p-2 rounded">Tambah Pengguna Baru</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Dibuat Pada</th>
              <th className="p-2 text-left">Diperbarui Pada</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">{item.username}</td>
                <td className="p-2">{item.role}</td>
                <td className="p-2">{item.created_at}</td>
                <td className="p-2">{item.updated_at}</td>
                <td className="p-2">
                  <button className="bg-main-blue text-white p-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white p-1 rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccessView;
