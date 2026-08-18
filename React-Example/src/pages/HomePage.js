import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Space, Statistic, Tag, Typography } from 'antd';
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  DashboardOutlined,
  RadarChartOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import AnalyticsTrendChart from '../components/AnalyticsTrendChart';
import StatusTag from '../components/StatusTag';
import { capturedCards } from '../mock/cardData';
import { conversations, customerProfiles } from '../mock/conversationData';
import { initialTasks } from '../mock/taskData';
import { regularAgents, systemAgents } from '../mock/agentData';
import { systemStatuses } from '../mock/statusData';
import { formatDateTime } from '../utils/time';

const cardTypeLabels = {
  product: '产品卡',
  inquiry: '询盘卡',
  generic: '通用卡',
};

function cycleItems(items, start, count) {
  if (!items.length) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => items[(start + offset) % items.length]);
}

function getCardTitle(card) {
  return card.title || card.subject || card.buyer || card.id;
}

function getCardMeta(card) {
  if (card.type === 'product') return `${card.productId} · ${card.price}`;
  if (card.type === 'inquiry') return `${card.buyer} · ${card.quantity}`;
  return `${card.subtitle} · ${card.body}`;
}

function HomePage() {
  const navigate = useNavigate();
  const [rotationIndex, setRotationIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    if (carouselPaused) return undefined;
    const timer = window.setInterval(() => {
      setRotationIndex((index) => index + 1);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  const dashboard = useMemo(() => {
    const totalMessages = conversations.reduce((sum, item) => sum + item.messageCount, 0);
    const unreadMessages = conversations.reduce((sum, item) => sum + item.unread, 0);
    const activeConversations = conversations.filter((item) => item.status === 'active').length;
    const highPotentialCustomers = Object.values(customerProfiles).filter((item) => item.availability.potentialScore >= 75).length;
    const captureTrend = ['2026-08-05', '2026-08-07', '2026-08-09', '2026-08-10', '2026-08-11'].map((date) => ({
      label: date.slice(5).replace('-', '/'),
      value: capturedCards.filter((item) => item.capturedAt.startsWith(date)).length,
    }));
    const taskSuccess = initialTasks.filter((item) => item.status === 'success').length;
    const onlineSystems = systemStatuses.filter((item) => item.status === 'online').length;
    const allAgents = [...systemAgents, ...regularAgents];

    return {
      totalMessages,
      unreadMessages,
      activeConversations,
      highPotentialCustomers,
      captureTrend,
      taskSuccess,
      onlineSystems,
      agentCount: allAgents.length,
    };
  }, []);

  const kpis = [
    { label: '历史消息', value: dashboard.totalMessages, suffix: '条', icon: <CommentOutlined />, note: '客户上下文持续沉淀', pulse: '+12%' },
    { label: '待处理未读', value: dashboard.unreadMessages, suffix: '条', icon: <ThunderboltOutlined />, note: '建议优先完成跟进', pulse: 'Now' },
    { label: '卡片资产', value: capturedCards.length, suffix: '张', icon: <AppstoreOutlined />, note: '产品、询盘、通用卡统一沉淀', pulse: '+3' },
    { label: 'Agent 能力', value: dashboard.agentCount, suffix: '个', icon: <RobotOutlined />, note: '系统与普通 Agent 可用', pulse: 'Ready' },
  ];

  const quickActions = [
    { title: '聊天工作台', path: '/chat', icon: <CommentOutlined />, action: `${dashboard.unreadMessages} 条未读待处理`, description: '进入客户会话，优先处理高价值跟进。', status: 'Priority', tone: 'primary' },
    { title: '卡片池', path: '/card', icon: <AppstoreOutlined />, action: `${capturedCards.length} 张业务卡待复核`, description: '复核产品、询盘和通用业务卡片资产。', status: 'Assets', tone: 'blue' },
    { title: '系统状态', path: '/status', icon: <DashboardOutlined />, action: `${dashboard.onlineSystems}/${systemStatuses.length} 服务在线`, description: '查看身份、代理和任务链路健康度。', status: 'Health', tone: 'cyan' },
    { title: 'Agent 控制台', path: '/agent', icon: <RobotOutlined />, action: `${dashboard.agentCount} 个 Agent 已配置`, description: '维护 Prompt、模型等级和工具授权策略。', status: 'Strategy', tone: 'violet' },
  ];

  const topCustomers = conversations.slice(0, 3).map((conversation) => {
    const profile = customerProfiles[conversation.id];
    return {
      ...conversation,
      profile,
      industries: profile.tags.preferredIndustries.slice(0, 2),
    };
  });

  const agentRows = [
    ...systemAgents.map((item) => ({ ...item, capability: item.binding, type: '系统' })),
    ...regularAgents.map((item) => ({ ...item, capability: item.tools.join(' / ') || '未授权工具', type: '普通' })),
  ];
  const visibleAgents = cycleItems(agentRows, rotationIndex, 3);
  const visibleTasks = cycleItems(initialTasks, rotationIndex, 3);
  const activeAssetCard = capturedCards[rotationIndex % capturedCards.length];

  return (
    <div className="home-page cockpit-home">
      <section className="cockpit-hero bento-card bento-hero">
        <div className="hero-orbit one" />
        <div className="hero-orbit two" />
        <div className="hero-grid-light" />
        <div className="cockpit-hero-content">
          <Tag className="cockpit-chip">MaaAlibaba Command Center</Tag>
          <Typography.Title level={1}>实时汇聚客户会话、Agent 决策与业务卡片的运营驾驶舱</Typography.Title>
          <Space wrap className="cockpit-hero-actions">
            <Button type="primary" size="large" icon={<SendOutlined />} onClick={() => navigate('/chat')}>处理客户会话</Button>
            <Button size="large" icon={<RadarChartOutlined />} onClick={() => navigate('/agent')}>检查 Agent 策略</Button>
          </Space>
        </div>
        <div className="cockpit-live-panel">
          <div className="live-panel-head">
            <span className="live-dot" />
            <Typography.Text strong>实时运营脉冲</Typography.Text>
          </div>
          <div className="live-metric-grid">
            <div><strong>{dashboard.activeConversations}</strong><span>活跃客户</span></div>
            <div><strong>{dashboard.highPotentialCustomers}</strong><span>高潜客户</span></div>
            <div><strong>{dashboard.taskSuccess}</strong><span>成功任务</span></div>
          </div>
          <div className="signal-stack">
            <div className="signal-line"><span style={{ width: '82%' }} /></div>
            <div className="signal-line"><span style={{ width: '64%' }} /></div>
            <div className="signal-line"><span style={{ width: '74%' }} /></div>
          </div>
        </div>
      </section>

      <div className="cockpit-kpi-grid">
        {kpis.map((item) => (
          <Card key={item.label} className="bento-card cockpit-kpi-card">
            <div className="kpi-glow" />
            <div className="cockpit-kpi-top">
              <div className="cockpit-kpi-icon">{item.icon}</div>
              <Tag>{item.pulse}</Tag>
            </div>
            <Statistic title={item.label} value={item.value} suffix={item.suffix} />
            <div className="cockpit-kpi-note">{item.note}</div>
          </Card>
        ))}
      </div>

      <Card className="bento-card cockpit-quick-card">
        <div className="bento-card-head">
          <div>
            <Typography.Text type="secondary">Next Actions</Typography.Text>
            <Typography.Title level={4}>快捷入口与下一步动作</Typography.Title>
          </div>
          <CheckCircleOutlined />
        </div>
        <div className="quick-action-grid">
          {quickActions.map((item, index) => (
            <button type="button" className={`quick-action-tile ${item.tone}`} key={item.path} onClick={() => navigate(item.path)}>
              <span className="quick-action-index">0{index + 1}</span>
              <span className="quick-action-icon">{item.icon}</span>
              <span className="quick-action-copy">
                <Tag>{item.status}</Tag>
                <strong>{item.title}</strong>
                <small>{item.action}</small>
                <em>{item.description}</em>
              </span>
              <span className="quick-action-arrow"><ArrowRightOutlined /></span>
            </button>
          ))}
        </div>
      </Card>

      <section className="cockpit-detail-section">
        <div className="cockpit-detail-grid">
          <Card className="bento-card cockpit-chart-card">
            <div className="bento-card-head">
              <div>
                <Typography.Text type="secondary">Capture Trend</Typography.Text>
                <Typography.Title level={4}>卡片捕获趋势</Typography.Title>
              </div>
              <Tag color="blue">近 5 次捕获</Tag>
            </div>
            <AnalyticsTrendChart data={dashboard.captureTrend} height={206} />
          </Card>

          <Card className="bento-card cockpit-customer-card">
            <div className="bento-card-head">
              <div>
                <Typography.Text type="secondary">Customer Radar</Typography.Text>
                <Typography.Title level={4}>重点客户雷达</Typography.Title>
              </div>
              <SafetyCertificateOutlined />
            </div>
            <Space direction="vertical" size={10} className="full-width">
              {topCustomers.map((item) => (
                <div className="customer-radar-row customer-action-row" key={item.id}>
                  <div className="customer-action-main">
                    <div className="customer-action-head">
                      <Typography.Text strong>{item.company === 'NA' ? item.name : item.company}</Typography.Text>
                      <Tag color={item.unread > 0 ? 'blue' : 'default'}>{item.unread > 0 ? `${item.unread} 未读` : '已同步'}</Tag>
                    </div>
                    <div className="section-card-description">{item.lastMessage}</div>
                    <Space size={6} wrap>
                      {item.industries.map((industry) => <Tag key={industry}>{industry}</Tag>)}
                    </Space>
                  </div>
                  <div className="customer-score">
                    <span>{item.profile.availability.potentialScore}</span>
                    <small>潜力</small>
                  </div>
                </div>
              ))}
            </Space>
          </Card>

          <Card className="bento-card cockpit-agent-card">
            <div className="bento-card-head">
              <div>
                <Typography.Text type="secondary">Agent Matrix</Typography.Text>
                <Typography.Title level={4}>Agent 能力矩阵</Typography.Title>
              </div>
              <RobotOutlined />
            </div>
            <div className="step-carousel agent-step-carousel" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
              <div className="step-carousel-stack" key={`agents-${rotationIndex}`}>
                {visibleAgents.map((item) => (
                  <div className="agent-health-row" key={item.id}>
                    <div>
                      <Typography.Text strong>{item.name}</Typography.Text>
                      <small>{item.type} · Level {item.level}</small>
                    </div>
                    <Tag color={item.type === '系统' ? 'blue' : 'purple'}>{item.capability}</Tag>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="bento-card cockpit-task-card">
            <div className="bento-card-head">
              <div>
                <Typography.Text type="secondary">Task Queue</Typography.Text>
                <Typography.Title level={4}>任务链路摘要</Typography.Title>
              </div>
              <ClockCircleOutlined />
            </div>
            <div className="step-carousel task-step-carousel" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
              <div className="step-carousel-stack" key={`tasks-${rotationIndex}`}>
                {visibleTasks.map((item) => (
                  <div className="task-flow-row" key={item.id}>
                    <div>
                      <Typography.Text strong>{item.type}</Typography.Text>
                      <div className="section-card-description">{item.target} · {formatDateTime(item.createdAt)}</div>
                    </div>
                    <StatusTag status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="bento-card cockpit-breakdown-card">
            <div className="bento-card-head">
              <div>
                <Typography.Text type="secondary">Card Assets</Typography.Text>
                <Typography.Title level={4}>卡片资产结构</Typography.Title>
              </div>
              <AppstoreOutlined />
            </div>
            <div className="step-carousel asset-step-carousel" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
              <div className="step-carousel-stack" key={`asset-${rotationIndex}`}>
                <div className={`asset-preview-card ${activeAssetCard.type}`}>
                  {activeAssetCard.image && <img src={activeAssetCard.image} alt={getCardTitle(activeAssetCard)} />}
                  <div className="asset-preview-main">
                    <div className="asset-preview-head">
                      <Tag color={activeAssetCard.type === 'product' ? 'blue' : activeAssetCard.type === 'inquiry' ? 'cyan' : 'purple'}>{cardTypeLabels[activeAssetCard.type]}</Tag>
                      <Typography.Text type="secondary">{formatDateTime(activeAssetCard.capturedAt)}</Typography.Text>
                    </div>
                    <Typography.Text strong>{getCardTitle(activeAssetCard)}</Typography.Text>
                    <div className="section-card-description">{getCardMeta(activeAssetCard)}</div>
                    {'message' in activeAssetCard && <p>{activeAssetCard.message}</p>}
                    {'moq' in activeAssetCard && <p>MOQ {activeAssetCard.moq}</p>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
