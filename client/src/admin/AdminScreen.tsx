import { useState, lazy, Suspense } from 'react';
import Sidebar from './Components/shared/Sidebar';

const UploadForm = lazy(() => import('./Screens/UploadDataScreen'));
const TableView = lazy(() => import('./Screens/SpatialDataScreen'));
const Documentation = lazy(() => import('./Screens/DocsScreen'));
const LaporanView = lazy(() => import('./Screens/LaporanScreen'));
const UserAccessView = lazy(() => import('./Screens/UserAccessScreen'));
const ArticleView = lazy(() => import('./Screens/ArticleScreen'));

const AdminScreen = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

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
      case 'articles':
        return <ArticleView />;
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
