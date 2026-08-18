import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Avatar, Button, Card, Descriptions, Dropdown, Drawer, Grid, Layout, List, Menu, Modal, Space, Typography, message } from 'antd';
import {
  AppstoreOutlined,
  CommentOutlined,
  DashboardOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  SwapOutlined,
  UserOutlined,
  LogoutOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { availableSellerAccounts, sellerProfile } from '../mock/sellerData';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const navItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/chat', icon: <CommentOutlined />, label: <Link to="/chat">聊天工作台</Link> },
  { key: '/card', icon: <AppstoreOutlined />, label: <Link to="/card">卡片池</Link> },
  { key: '/status', icon: <DashboardOutlined />, label: <Link to="/status">系统状态</Link> },
  { key: '/agent', icon: <RobotOutlined />, label: <Link to="/agent">Agent 控制台</Link> },
];

const pageMeta = {
  '/': { title: '运营驾驶舱', subtitle: '会话、商机、卡片捕获与客户价值总览' },
  '/chat': { title: '聊天工作台', subtitle: '客户会话、译文、AI 建议和客户分析' },
  '/card': { title: '卡片池', subtitle: '产品、询盘和通用业务卡片统一管理' },
  '/status': { title: '系统状态', subtitle: '身份、代理、Receiver 与任务队列监控' },
  '/agent': { title: 'Agent 控制台', subtitle: '系统 Agent、工具和测试配置' },
};

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(sellerProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const location = useLocation();
  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/chat')) return '/chat';
    if (location.pathname.startsWith('/card')) return '/card';
    if (location.pathname.startsWith('/status')) return '/status';
    if (location.pathname.startsWith('/agent')) return '/agent';
    return '/';
  }, [location.pathname]);

  const menu = <Menu mode="inline" selectedKeys={[selectedKey]} items={navItems} onClick={() => setDrawerOpen(false)} />;
  const currentPage = pageMeta[selectedKey];
  const routeClass = selectedKey === '/' ? 'route-home' : `route-${selectedKey.slice(1)}`;
  const otherAccounts = availableSellerAccounts.filter((account) => account.id !== currentAccount.id);
  const accountMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { key: 'switch', icon: <SwapOutlined />, label: '切换账户' },
    { key: 'clear-cache', icon: <DeleteOutlined />, label: '清除缓存数据', danger: true },
    { key: 'logout', icon: <LogoutOutlined />, label: '登出账户', danger: true },
  ];

  const handleAccountMenuClick = ({ key }) => {
    if (key === 'profile') setProfileOpen(true);
    if (key === 'switch') setSwitchOpen(true);
    if (key === 'clear-cache') {
      Modal.confirm({
        title: '确认清除缓存数据？',
        content: '该操作会清空当前演示中的 MITM 卡片池、身份缓存和草稿状态。',
        okText: '清除缓存',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: () => messageApi.success('缓存数据已清除'),
      });
    }
    if (key === 'logout') {
      setProfileOpen(false);
      setSwitchOpen(false);
      setIsLoggedIn(false);
      messageApi.warning('已登出当前账户，请选择账号登录');
    }
  };

  const loginWithAccount = (account) => {
    setCurrentAccount(account);
    setIsLoggedIn(true);
    messageApi.success(`已登录 ${account.name}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        {contextHolder}
        <div className="login-panel">
          <div className="login-brand">
            <div className="brand-logo">M</div>
            <div>
              <Typography.Title level={3}>选择账号登录</Typography.Title>
              <Typography.Text type="secondary">请选择一个可用卖家账户进入运营台</Typography.Text>
            </div>
          </div>
          <div className="login-account-grid">
            {availableSellerAccounts.map((account) => (
              <Card key={account.id} className="login-account-card" hoverable onClick={() => loginWithAccount(account)}>
                <Space align="start">
                  <Avatar size={54} src={account.avatar}>{account.name[0]}</Avatar>
                  <div>
                    <Typography.Text strong>{account.name}</Typography.Text>
                    <div><Typography.Text type="secondary">{account.company}</Typography.Text></div>
                    <div><Typography.Text type="secondary">{account.country}</Typography.Text></div>
                    <Button type="primary" className="login-account-button">登录该账户</Button>
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout className={`app-shell ${siderCollapsed ? 'sider-collapsed' : ''}`}>
      {contextHolder}
      {screens.md ? (
        <Sider width={268} collapsedWidth={84} collapsed={siderCollapsed} trigger={null} className="app-sider">
          <div className="brand-block">
            <div className="brand-logo">M</div>
            <div className="brand-copy">
              <Typography.Title level={5}>MaaAlibaba</Typography.Title>
              <Typography.Text type="secondary">Supplier Intelligence</Typography.Text>
            </div>
            <Button
              className="sider-collapse-button"
              type="text"
              size="small"
              aria-label={siderCollapsed ? '展开侧栏' : '收起侧栏'}
              icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSiderCollapsed((collapsed) => !collapsed)}
            />
          </div>
          <div className="sider-menu-wrap">{menu}</div>
          <Dropdown menu={{ items: accountMenuItems, onClick: handleAccountMenuClick }} trigger={['click']} placement="topRight">
            <div className="sider-profile-card" role="button" tabIndex={0}>
              <Avatar size={42} src={currentAccount.avatar}>{currentAccount.name[0]}</Avatar>
              <div className="sider-profile-main">
                <Typography.Text strong ellipsis>{currentAccount.name}</Typography.Text>
                <Typography.Text type="secondary" ellipsis>{currentAccount.company}</Typography.Text>
              </div>
            </div>
          </Dropdown>
        </Sider>
      ) : (
        <Drawer className="app-drawer" title="MaaAlibaba Supplier" open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left" width={280}>
          {menu}
        </Drawer>
      )}
      <Layout className="app-main">
        <Header className={`app-header ${selectedKey === '/' ? 'home-header' : ''}`}>
          <Space className="header-left">
            {!screens.md && <Button icon={<MenuFoldOutlined />} onClick={() => setDrawerOpen(true)} />}
            <div>
              <div className="header-kicker">Supplier Intelligence Cockpit</div>
              <Typography.Title level={4}>{currentPage.title}</Typography.Title>
              <Typography.Text type="secondary">{currentPage.subtitle}</Typography.Text>
            </div>
          </Space>
        </Header>
        <div className="app-header-spacer" />
        <Content className={`app-content ${routeClass} ${selectedKey === '/' ? 'home-content' : ''}`}>
          <Outlet />
        </Content>
      </Layout>
      <Modal title="个人信息" open={profileOpen} onCancel={() => setProfileOpen(false)} footer={<Button type="primary" onClick={() => setProfileOpen(false)}>知道了</Button>} width={720} centered>
        <div className="profile-modal-head">
          <Avatar size={72} src={currentAccount.avatar}>{currentAccount.name[0]}</Avatar>
          <div>
            <Typography.Title level={4}>{currentAccount.name}</Typography.Title>
            <Typography.Text type="secondary">{currentAccount.company}</Typography.Text>
          </div>
        </div>
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="账号状态">{currentAccount.status}</Descriptions.Item>
          <Descriptions.Item label="国家/地区">{currentAccount.country}</Descriptions.Item>
          <Descriptions.Item label="Ali ID">{currentAccount.aliId}</Descriptions.Item>
          <Descriptions.Item label="登录 ID">{currentAccount.loginId}</Descriptions.Item>
          <Descriptions.Item label="加密 ID">{currentAccount.encryptedId}</Descriptions.Item>
          <Descriptions.Item label="公司">{currentAccount.company}</Descriptions.Item>
          <Descriptions.Item label="行业">{currentAccount.industry}</Descriptions.Item>
          <Descriptions.Item label="套餐">{currentAccount.plan}</Descriptions.Item>
          <Descriptions.Item label="最近同步" span={2}>{currentAccount.lastSync}</Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal title="切换账户" open={switchOpen} onCancel={() => setSwitchOpen(false)} footer={null} width={620} centered>
        <Typography.Paragraph type="secondary">选择一个可用账户切换到对应卖家身份。</Typography.Paragraph>
        <List
          dataSource={otherAccounts}
          renderItem={(account) => (
            <List.Item
              className="switch-account-item"
              actions={[<Button type="primary" onClick={() => { setCurrentAccount(account); setSwitchOpen(false); messageApi.success(`已切换到 ${account.name}`); }}>切换</Button>]}
            >
              <List.Item.Meta
                avatar={<Avatar src={account.avatar}>{account.name[0]}</Avatar>}
                title={account.name}
                description={`${account.company} · ${account.country} · ${account.status}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
}

export default AppLayout;
