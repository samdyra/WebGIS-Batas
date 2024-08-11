import { useState, lazy, Suspense } from 'react';
import Sidebar from './Components/Sidebar';

const UploadForm = lazy(() => import('./Components/UploadForm'));
const TableView = lazy(() => import('./Components/TableView'));
const Documentation = lazy(() => import('./Components/Documentation'));
const LaporanView = lazy(() => import('./Components/LaporanView'));
const UserAccessView = lazy(() => import('./Components/UserAccess'));

const AdminScreen = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  console.log(activeTab);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadForm setMessage={setMessage} />;
      case 'view':
        return <TableView />;
      case 'documentation':
        return <Documentation />;
      case 'laporan':
        return <LaporanView />;
      case 'user':
        return <UserAccessView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-10 bg-gray-100 overflow-auto">
        <Suspense fallback={<div>Loading...</div>}>{renderActiveTab()}</Suspense>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
