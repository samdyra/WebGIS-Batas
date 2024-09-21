import React, { useState } from 'react';
import useGeospatialUpload from '../hooks/useGeospatialUpload';

const spatialDataTypes = [
  { value: 'LINESTRING', label: 'LINESTRING' },
  { value: 'POLYGON', label: 'POLYGON' },
  { value: 'POINT', label: 'POINT' },
];

const CheckAreaBoundary: React.FC = () => {
  const { files, isUploading, handleFileUpload, deleteFile } = useGeospatialUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile && selectedType) {
      try {
        await handleFileUpload(selectedFile, selectedType);
        setSelectedFile(null);
        setSelectedType('');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred while uploading the file.');
      }
    } else {
      alert('Please select both a file and a spatial data type.');
    }
  };

  return (
    <div className="border-2 mx-sm pt-sm rounded-md h-full mb-2 p-4">
      <h2 className="text-lg font-bold mb-4">Cek Batas Area</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="spatialDataType">
            Select Spatial Data Type
          </label>
          <select
            id="spatialDataType"
            value={selectedType}
            onChange={onTypeChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a type</option>
            {spatialDataTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="geospatialFile">
            Upload GeoJSON or Shapefile (ZIP)
          </label>
          <input
            id="geospatialFile"
            type="file"
            accept=".geojson,application/geo+json,.zip"
            onChange={onFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-main-blue  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isUploading || !selectedFile || !selectedType}
        >
          Submit
        </button>
      </form>
      {isUploading && <p className="mt-4">Uploading...</p>}
      {files && files.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-semibold mb-2">Uploaded Files:</p>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded pr-4">
                <span className="pl-2">
                  {file.name} - {file.type}
                </span>
                <button
                  onClick={() => deleteFile(file.name)}
                  className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckAreaBoundary;
