import useUploadFiles from '../hooks/useUploadFiles';

const CheckAreaBoundary: React.FC = () => {
  const { files, addFile, deleteFile } = useUploadFiles();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const geoJsonData = JSON.parse(result);
          const newFile = { name: file.name, content: geoJsonData };
          addFile(newFile);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="border-2 mx-sm pt-sm rounded-md h-full mb-2 p-4">
      <h2 className="text-lg font-bold mb-4">Cek Batas Area</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="geojsonFile">
            Upload GeoJSON File
          </label>
          <input
            id="geojsonFile"
            type="file"
            accept=".geojson,application/geo+json"
            onChange={handleFileUpload}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </form>
      {files && files.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-semibold mb-2">Uploaded Files:</p>
          <ul className="list-disc list-inside">
            {files.map((file: { name: string }, index: number) => (
              <li key={index} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded pr-4">
                <span className="pl-2">{file.name}</span>
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
