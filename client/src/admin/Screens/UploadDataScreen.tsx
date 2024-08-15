import React, { useState } from 'react';
import axios from 'axios';

interface UploadFormProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

type geom_type = 'POINT' | 'LINESTRING' | 'POLYGON';

const UploadForm: React.FC<UploadFormProps> = ({ setMessage }) => {
  const [tableName, setTableName] = useState('');
  const [type, setType] = useState<geom_type>('LINESTRING');
  const [coordinate, setCoordinate] = useState<[string, string]>(['106.8456', '-6.2088']);
  const [color, setColor] = useState('#FF0000');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [lon, lat] = e.target.value.split(',').map((coord) => coord.trim());
    setCoordinate([lon || '', lat || '']);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!tableName || !type || !file || !color || !coordinate[0] || !coordinate[1]) {
      setMessage('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('table_name', tableName);
    formData.append('type', type);
    formData.append('file', file);
    formData.append('color', color);

    // Append each coordinate value separately
    formData.append('coordinate', coordinate[0]);
    formData.append('coordinate', coordinate[1]);

    // Log the FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post('http://localhost:8080/geo/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM4MjE3MjEsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.T92QXRCXkjS0c59VcCFDEEwJUTIrrlZdQirtG_XlMk8',
        },
      });
      setMessage('Upload successful: ' + response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Upload failed: ${error.response.status} ${error.response.statusText}`);
        console.error('Error data:', error.response.data);
      } else {
        setMessage('Upload failed');
      }
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-main-green">Upload Spatial Data</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-700">
            Table Name*
          </label>
          <input
            type="text"
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main-blue focus:border-main-blue"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type*
          </label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as geom_type)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main-blue focus:border-main-blue"
          />
        </div>
        <div>
          <label htmlFor="coordinate" className="block text-sm font-medium text-gray-700">
            Coordinate
          </label>
          <input
            type="text"
            id="coordinate"
            value={coordinate.join(', ')}
            onChange={handleCoordinateChange}
            placeholder="e.g., 106.8456, -6.2088"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main-blue focus:border-main-blue"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#007cbf"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main-blue focus:border-main-blue"
          />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            GeoJSON File*
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".geojson,application/geo+json"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-yellow file:text-main-green-dark hover:file:bg-main-blue"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-main-green text-white p-2 rounded-md hover:bg-main-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-green"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
