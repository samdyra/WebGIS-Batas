import { useState } from 'react';
import Sidebar from './shared/components/Sidebar';
import ArticleScreen from './Article/ArticleScreen';
import Documentation from './Docs/DocsScreen';
import SpatialDataScreen from './SpatialData/SpatialDataScreen';

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('documentation');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'documentation':
        return <Documentation />;
      case 'data':
        return <SpatialDataScreen />;
      case 'layer':
        return <>layer</>;
      case 'group':
        return <>group</>;
      case 'laporan':
        return <>laporan</>;
      case 'articles':
        return <ArticleScreen />;
      case 'user':
        return <>user</>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-10 bg-gray-100 overflow-auto">{renderActiveTab()}</div>
    </div>
  );
};

export default AdminScreen;
