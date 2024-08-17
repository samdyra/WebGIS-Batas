import { useState } from 'react';
import Sidebar from './shared/components/Sidebar';
import ArticleScreen from './Article/ArticleScreen';
import Documentation from './Docs/DocsScreen';

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('documentation');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'view':
        return <></>;
      case 'documentation':
        return <Documentation />;
      case 'laporan':
        return <></>;
      case 'user':
        return <></>;
      case 'articles':
        return <ArticleScreen />;
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
