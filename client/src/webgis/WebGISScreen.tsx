import s from './styles.module.scss';
import useFeatureData from './hooks/useGetFeature';
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import MapComponent from './components/Map';
import SettingBar from './components/Settingbar';
import Detailbar from './components/Detailbar';
import LayerIcon from '../shared/assets/svg/layer';
import AlertIcon from '../shared/assets/svg/alert';
import UploadIcon from '../shared/assets/svg/upload';
import useQueryLayers from './hooks/useQueryLayers';
import { TLayer } from './hooks/useQueryLayers';
import useUploadFiles from './hooks/useUploadFiles';

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

const ReportIssue: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [supportingData, setSupportingData] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, email, description, supportingData });
  };

  return (
    <div className="border-2 mx-sm pt-sm rounded-md h-full mb-2 p-4">
      <h2 className="text-lg font-bold mb-4">Lapor Isu Batas Daerah</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supportingData">
            Supporting Data
          </label>
          <input
            id="supportingData"
            type="file"
            onChange={(e) => setSupportingData(e.target.files ? e.target.files[0] : null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-main-green hover:bg-main-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const menuItems = [
  { icon: LayerIcon, label: 'Manajemen Layer' },
  { icon: AlertIcon, label: 'Lapor Batas' },
  { icon: UploadIcon, label: 'Cek Batas' },
];

function WebGISScreen() {
  const [menuIndex, setMenuIndex] = useState(0);
  const [isDetailBarOpen, setIsDetailBarOpen] = useState(false);
  const { data: layers = [], setVisibility } = useQueryLayers();
  const handleOpenDetailBar = () => setIsDetailBarOpen(!isDetailBarOpen);
  const { getFeatureData } = useFeatureData();
  const featureData = getFeatureData();

  const handleSetVisibility = (layer: TLayer) => {
    if (!layer?.visibility) {
      setVisibility(layer.table_name, 'none');

      return;
    }

    setVisibility(layer.table_name, layer.visibility === 'visible' ? 'none' : 'visible');
  };

  function formatText(text: string) {
    return text
      .split('_') // Split the string by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words with a space
  }

  const LayerManagement = (
    <main className="border-2 mx-sm pt-sm rounded-md h-full mb-2">
      {layers.map((layer, index) => (
        <div key={index} className="flex gap-2 mb-2 px-sm justify-between ">
          <button>{formatText(layer.table_name)}</button>
          <label className={`${s.formswitch} ml-2`}>
            <input
              onClick={() => handleSetVisibility(layer)}
              type="checkbox"
              checked={!layer.visibility || layer.visibility === 'visible'}
            />
            <i></i>
          </label>
        </div>
      ))}
    </main>
  );

  return (
    <>
      <Detailbar
        handleShowLayerbar={handleOpenDetailBar}
        isOpen={isDetailBarOpen}
        position="right"
        size="large"
        className="mt-lg"
      >
        <div>
          <div>
            {featureData ? (
              <div
                className="h-fit overflow-scroll"
                style={{
                  height: 'calc(100vh - 12rem)',
                }}
              >
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(featureData).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-xs">{key}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-xs">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center mt-64 text-gray-500">Click on the map to get details</p>
            )}
          </div>
        </div>
      </Detailbar>
      <SettingBar />
      <Sidebar menuItems={menuItems} menuIndex={menuIndex} setMenuIndex={setMenuIndex}>
        {menuIndex === 0 && LayerManagement}
        {menuIndex === 1 && <ReportIssue />}
        {menuIndex === 2 && <CheckAreaBoundary />}
      </Sidebar>
      <MapComponent />
    </>
  );
}

export default WebGISScreen;
