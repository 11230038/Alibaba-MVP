import { ConfigProvider } from 'antd';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './layouts/AppLayout';
import AgentPage from './pages/AgentPage';
import CardPage from './pages/CardPage';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#60a5fa',
          colorInfo: '#60a5fa',
          colorSuccess: '#147a4f',
          colorWarning: '#b7791f',
          colorError: '#c24135',
          colorText: '#334155',
          colorTextSecondary: '#64748b',
          colorBgLayout: '#f6f9ff',
          colorBgContainer: '#ffffff',
          colorBorder: '#dbeafe',
          borderRadius: 12,
          wireframe: false,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Card: { borderRadiusLG: 16, boxShadowTertiary: '0 18px 48px rgba(37, 99, 235, 0.10)' },
          Button: { borderRadius: 10, controlHeight: 38, primaryShadow: '0 10px 22px rgba(37, 99, 235, 0.22)' },
          Menu: { itemBorderRadius: 10, itemHeight: 42, itemSelectedBg: '#eff6ff', itemSelectedColor: '#3b82f6' },
          Tabs: { inkBarColor: '#93c5fd' },
          Table: { headerBg: '#f9fafb', headerColor: '#374151' },
          Modal: { borderRadiusLG: 18 },
        },
      }}
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/agent" element={<AgentPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
