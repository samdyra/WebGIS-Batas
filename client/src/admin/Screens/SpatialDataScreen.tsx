import React, { useState } from 'react';

interface DataItem {
  id: number;
  district: string;
  type: string;
  name: string;
  coordinate: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

const mockData: DataItem[] = [
  {
    id: 1,
    district: 'Bandung',
    type: 'Garis',
    name: 'Batas Daerah Jawa Barat',
    coordinate: '123,123',
    created_at: '2023-08-01',
    updated_at: '2023-08-02',
    updated_by: 'Admin',
  },
  // Add more mock data items here
];

const TableView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockData.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button className="bg-main-green text-white p-2 rounded">Create New</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">District</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Coordinate</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Updated At</th>
            <th className="p-2 text-left">Updated By</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.district}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.coordinate}</td>
              <td className="p-2">{item.created_at}</td>
              <td className="p-2">{item.updated_at}</td>
              <td className="p-2">{item.updated_by}</td>
              <td className="p-2">
                <button className="bg-main-blue text-white p-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
