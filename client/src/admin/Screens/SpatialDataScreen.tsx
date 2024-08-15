import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface LayerPaint {
  'line-color'?: string;
  'line-opacity'?: number;
  'line-width'?: number;
  'fill-color'?: string;
  'fill-opacity'?: number;
  'circle-radius'?: number;
  'circle-color'?: string;
  'circle-opacity'?: number;
  'circle-stroke-width'?: number;
}

interface Layer {
  id: string;
  paint: LayerPaint;
  source: {
    tiles: string;
    type: string;
  };
  'source-layer': string;
  type: string;
}

interface DataItem {
  name: string;
  coordinate: number[];
  layer: Layer;
}

interface FormData {
  table_name: string;
  type: string;
  color: string;
  coordinate: string;
}

interface EditChecklist {
  table_name: boolean;
  type: boolean;
  color: boolean;
  coordinate: boolean;
}

const formatTableName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '_');
};

const TableView: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    table_name: '',
    type: '',
    color: '',
    coordinate: '',
  });
  const [editChecklist, setEditChecklist] = useState<EditChecklist>({
    table_name: false,
    type: false,
    color: false,
    coordinate: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/geo-data-list');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditChecklist({ ...editChecklist, [name]: checked });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (file) {
        formDataToSend.append('file', file);
      }

      await axios.post('http://localhost:8080/geo/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload: Partial<FormData> = {};
      let contentType = 'application/json';
      let sendData: FormData | Partial<FormData>;

      if (editChecklist.table_name) {
        if (!file) {
          alert('You must upload a GeoJSON file when changing the table name.');
          return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('table_name', formatTableName(formData.table_name));
        formDataToSend.append('file', file);

        if (editChecklist.type) formDataToSend.append('type', formData.type);
        if (editChecklist.color) formDataToSend.append('color', formData.color);
        if (editChecklist.coordinate) {
          const coordinateArray = formData.coordinate.split(',').map((coord) => coord.trim());
          formDataToSend.append('coordinate', JSON.stringify(coordinateArray));
        }

        contentType = 'multipart/form-data';
        // @ts-ignore
        sendData = formDataToSend;
      } else {
        if (editChecklist.type) payload.type = formData.type;
        if (editChecklist.color) payload.color = formData.color;
        if (editChecklist.coordinate) {
          // @ts-ignore
          payload.coordinate = formData.coordinate.split(',').map((coord) => coord.trim());
        }

        sendData = payload;
      }

      const editingNameFormatted = formatTableName(editingName);

      await axios.put(`http://localhost:8080/geo/${editingNameFormatted}`, sendData, {
        headers: {
          'Content-Type': contentType,
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM4MjE3MjEsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.T92QXRCXkjS0c59VcCFDEEwJUTIrrlZdQirtG_XlMk8',
        },
      });

      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error editing data:', error);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8080/geo/${formatTableName(name)}`, {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM4MjE3MjEsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.T92QXRCXkjS0c59VcCFDEEwJUTIrrlZdQirtG_XlMk8',
          },
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const filteredData = data.filter((item) =>
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
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-main-green text-white p-2 rounded">
          Create New
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Coordinate</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.name} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.coordinate.join(', ')}</td>
              <td className="p-2">{item.layer.type}</td>
              <td className="p-2">
                {item.layer.paint['line-color'] || item.layer.paint['fill-color'] || item.layer.paint['circle-color']}
              </td>
              <td className="p-2">
                <button
                  onClick={() => {
                    setFormData({
                      table_name: item.name,
                      coordinate: item.coordinate.join(', '),
                      type: item.layer.type,
                      color:
                        item.layer.paint['line-color'] ||
                        item.layer.paint['fill-color'] ||
                        item.layer.paint['circle-color'] ||
                        '',
                    });
                    setEditingName(item.name);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-main-blue text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(item.name)} className="bg-red-500 text-white p-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isCreateModalOpen} onRequestClose={() => setIsCreateModalOpen(false)}>
        <h2>Create New Item</h2>
        <form onSubmit={handleCreate}>
          <input name="name" value={formData.table_name} onChange={handleInputChange} placeholder="Name" />
          <input
            name="coordinate"
            value={formData.coordinate}
            onChange={handleInputChange}
            placeholder="Coordinate (e.g., 107.8456, -6.2088)"
          />
          <input
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Type (line, fill, or circle)"
          />
          <input name="color" value={formData.color} onChange={handleInputChange} placeholder="Color (e.g., #00FFFF)" />
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Create</button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Item</h2>
        <form onSubmit={handleEdit}>
          <div>
            <input
              type="checkbox"
              name="table_name"
              checked={editChecklist.table_name}
              onChange={handleCheckboxChange}
            />
            <input
              name="table_name"
              value={formData.table_name}
              onChange={handleInputChange}
              placeholder="Table Name"
              disabled={!editChecklist.table_name}
            />
          </div>
          {editChecklist.table_name && (
            <div>
              <input type="file" onChange={handleFileChange} required />
            </div>
          )}
          <div>
            <input type="checkbox" name="type" checked={editChecklist.type} onChange={handleCheckboxChange} />
            <input
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Type"
              disabled={!editChecklist.type}
            />
          </div>
          <div>
            <input type="checkbox" name="color" checked={editChecklist.color} onChange={handleCheckboxChange} />
            <input
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Color"
              disabled={!editChecklist.color}
            />
          </div>
          <div>
            <input
              type="checkbox"
              name="coordinate"
              checked={editChecklist.coordinate}
              onChange={handleCheckboxChange}
            />
            <input
              name="coordinate"
              value={formData.coordinate}
              onChange={handleInputChange}
              placeholder="Coordinate"
              disabled={!editChecklist.coordinate}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </Modal>
    </div>
  );
};

export default TableView;
