import { useState } from 'react';
import Sidebar from './shared/components/Sidebar';
import ArticleScreen from './Article/ArticleScreen';
import Documentation from './Docs/DocsScreen';
import SpatialDataScreen from './SpatialData/SpatialDataScreen';
import LayerScreen from './Layer/LayerScreen';
import LayerGroupScreen from './LayerGroup/LayerGroupScreen';
import ReportScreen from './Reports/ReportScreen';

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('documentation');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'documentation':
        return <Documentation />;
      case 'data':
        return <SpatialDataScreen />;
      case 'layer':
        return <LayerScreen />;
      case 'group':
        return <LayerGroupScreen />;
      case 'articles':
        return <ArticleScreen />;
      case 'reports':
        return <ReportScreen />;
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
