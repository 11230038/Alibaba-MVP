import { useMemo, useState } from 'react';
import AnalysisMarkdown from '../components/AnalysisMarkdown';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  BulbOutlined,
  DownOutlined,
  DownloadOutlined,
  FlagOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';
import SectionCard from '../components/SectionCard';
import StatusTag from '../components/StatusTag';
import { BusinessCard } from '../components/BusinessCardRenderers';
import { conversations, customerProfiles, initialDrafts, messagesByConversation } from '../mock/conversationData';
import { buildConversationExport, downloadTextFile } from '../utils/exportText';
import { formatDate, formatDateTime, formatTime, relativeTime } from '../utils/time';
import { groupByConversationCount, groupConversationsByTime } from '../utils/grouping';
import {
  generateSuggestions,
  runCustomerAnalysis,
  translateBuyerMessages,
} from '../services/mockServices';

const { TextArea } = Input;

function ConversationList({ selectedId, onSelect, collapsed, onToggleCollapse, id }) {
  const groups = groupConversationsByTime(conversations);
  const toggleLabel = collapsed ? '展开客户会话' : '收起客户会话';
  const toggleIcon = collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;

  return (
    <div className={`conversation-panel ${collapsed ? 'conversation-panel-collapsed' : ''}`} id={id}>
      {collapsed ? (
        <div className="conversation-panel-rail">
          <Button
            type="text"
            size="small"
            className="conversation-panel-toggle"
            icon={toggleIcon}
            aria-label={toggleLabel}
            aria-expanded={!collapsed}
            aria-controls={id}
            title={toggleLabel}
            onClick={onToggleCollapse}
          />
          <Typography.Text className="conversation-panel-rail-label" type="secondary">客户会话</Typography.Text>
        </div>
      ) : (
        <>
          <div className="conversation-panel-head">
            <div>
              <Typography.Title level={5}>客户会话</Typography.Title>
              <Typography.Text type="secondary">按更新时间聚合重点客户，优先处理未读与高价值对话。</Typography.Text>
            </div>
            <Button
              type="text"
              size="small"
              className="conversation-panel-toggle"
              icon={toggleIcon}
              aria-label={toggleLabel}
              aria-expanded={!collapsed}
              aria-controls={id}
              title={toggleLabel}
              onClick={onToggleCollapse}
            />
          </div>
          {groups.map((group) => (
            <div key={group.key} className="conversation-group">
              <div className="group-title">{group.title}</div>
              <List
                dataSource={group.items}
                renderItem={(item) => (
                  <List.Item
                    className={`conversation-item ${selectedId === item.id ? 'active' : ''}`}
                    onClick={() => onSelect(item.id)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar}>{item.name[0]}</Avatar>}
                      title={<Space><span>{item.name}</span><StatusTag status={item.status} /></Space>}
                      description={(
                        <div>
                          <div className="ellipsis">{item.lastMessage}</div>
                          <Space size="small" className="muted-text">
                            <span>{relativeTime(item.updatedAt)}</span>
                            <span>{item.messageCount} 条</span>
                            {item.unread > 0 && <Tag color="red">{item.unread} 未读</Tag>}
                          </Space>
                        </div>
                      )}
                    />
                  </List.Item>
                )}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function MessageBubble({ message, showTranslation, onRetranslate, retranslateLoading }) {
  const isSeller = message.sender === 'seller';
  const isSystem = message.sender === 'system';
  return (
    <div className={`message-row ${isSeller ? 'seller' : ''} ${isSystem ? 'system' : ''}`}>
      <div className="message-bubble">
        <div className="message-meta">{isSeller ? '卖家' : isSystem ? '系统' : '买家'} · {formatTime(message.timestamp)}</div>
        {message.type === 'text' && <Typography.Text>{message.content}</Typography.Text>}
        {message.type === 'system' && <Typography.Text type="secondary">{message.content}</Typography.Text>}
        {message.type.includes('card') && <BusinessCard card={message.card} />}
        {showTranslation && message.translation && (
          <>
            <div className="translation-box">
              <div className="translation-content"><GlobalOutlined /> <span>{message.translation}</span></div>
            </div>
            {message.sender === 'buyer' && (
              <Button
                className="retranslate-button"
                size="small"
                icon={<ReloadOutlined />}
                loading={retranslateLoading}
                onClick={() => onRetranslate(message.id)}
              >
                重新翻译
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MessageTimeline({ messages, showTranslation, onRetranslate, retranslatingId }) {
  let lastDate = '';
  return (
    <div className="message-timeline">
      {messages.map((item) => {
        const date = formatDate(item.timestamp);
        const showDate = date !== lastDate;
        lastDate = date;
        return (
          <div key={item.id}>
            {showDate && <Divider plain>{date}</Divider>}
            <MessageBubble
              message={item}
              showTranslation={showTranslation}
              onRetranslate={onRetranslate}
              retranslateLoading={retranslatingId === item.id}
            />
          </div>
        );
      })}
    </div>
  );
}

function CustomerInfo({ customer, avatar }) {
  if (!customer) return <Empty description="请选择客户" />;

  const isExpandedProfile = Boolean(customer.behavior);

  if (!isExpandedProfile) {
    return (
      <div className="page-stack compact">
        <SectionCard title="客户身份">
          <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
            <Descriptions.Item label="姓名">{customer.identity.name}</Descriptions.Item>
            <Descriptions.Item label="公司">{customer.identity.company}</Descriptions.Item>
            <Descriptions.Item label="国家">{customer.identity.country}</Descriptions.Item>
            <Descriptions.Item label="Buyer ID">{customer.identity.buyerId}</Descriptions.Item>
            <Descriptions.Item label="角色">{customer.profile.role}</Descriptions.Item>
            <Descriptions.Item label="语言">{customer.profile.language}</Descriptions.Item>
            <Descriptions.Item label="时区">{customer.profile.timezone}</Descriptions.Item>
            <Descriptions.Item label="来源">{customer.profile.source}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{customer.contact.email}</Descriptions.Item>
            <Descriptions.Item label="电话">{customer.contact.phone}</Descriptions.Item>
          </Descriptions>
        </SectionCard>
        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}><Card><Statistic title="订单数" value={customer.metrics.orders} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title="询盘数" value={customer.metrics.inquiryCount} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title="响应率" value={customer.metrics.responseRate} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title="90天金额" value={customer.metrics.last90Value} /></Card></Col>
        </Row>
        <SectionCard title="标签与可用性">
          <Space wrap>{customer.tags.map((tag) => <Tag color="blue" key={tag}>{tag}</Tag>)}</Space>
          <Divider />
          <StatusTag status={customer.availability.includes('在线') ? 'online' : 'offline'} mode="badge" />
          <Typography.Text className="availability-text">{customer.availability}</Typography.Text>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="page-stack compact customer-info-page">
      <SectionCard
        className="customer-hero-card"
        title={customer.identity.name}
        description={customer.identity.company}
        icon={<Avatar src={avatar} size={44}>{customer.identity.name[0]}</Avatar>}
      >
        <div className="customer-summary-strip">
          <div>
            <Typography.Text type="secondary">国家</Typography.Text>
            <Typography.Title level={5}>{customer.profile.country}</Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">质量等级</Typography.Text>
            <Typography.Title level={5}>{customer.tags.qualityLevel}</Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">潜力分</Typography.Text>
            <Typography.Title level={5}>{customer.availability.potentialScore}</Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">状态</Typography.Text>
            <Typography.Title level={5}>{customer.availability.status}</Typography.Title>
          </div>
        </div>
        <Descriptions bordered column={{ xs: 1, md: 2 }} size="small" title="身份信息">
          <Descriptions.Item label="Ali ID">{customer.identity.aliId}</Descriptions.Item>
          <Descriptions.Item label="会员 ID">{customer.identity.memberId}</Descriptions.Item>
          <Descriptions.Item label="登录 ID">{customer.identity.loginId}</Descriptions.Item>
          <Descriptions.Item label="加密 ID">{customer.identity.encryptedId}</Descriptions.Item>
        </Descriptions>
      </SectionCard>
      <div className="customer-info-grid">
        <SectionCard title="个人资料">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="姓名">{customer.profile.name}</Descriptions.Item>
          <Descriptions.Item label="国家">{customer.profile.country}</Descriptions.Item>
          <Descriptions.Item label="公司">{customer.profile.company}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{customer.profile.registeredAt}</Descriptions.Item>
        </Descriptions>
        </SectionCard>
        <SectionCard title="联系方式">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="邮箱">{customer.contact.email}</Descriptions.Item>
          <Descriptions.Item label="手机">{customer.contact.mobile}</Descriptions.Item>
          <Descriptions.Item label="电话">{customer.contact.phone}</Descriptions.Item>
        </Descriptions>
        </SectionCard>
      </div>
      <SectionCard title="行为数据（近 90 天）">
        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="商品浏览" value={customer.behavior.productViews} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="有效询盘" value={customer.behavior.validInquiries} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="已回复询盘" value={customer.behavior.repliedInquiries} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="有效 RFQ" value={customer.behavior.validRfqs} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="登录天数" value={customer.behavior.loginDays} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="垃圾询盘" value={customer.behavior.spamInquiries} /></Card></Col>
          <Col xs={12} md={6}><Card className="metric-card"><Statistic title="拉黑次数" value={customer.behavior.blacklistCount} /></Card></Col>
        </Row>
      </SectionCard>
      <SectionCard title="标签">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="质量等级">{customer.tags.qualityLevel}</Descriptions.Item>
          <Descriptions.Item label="成长等级">{customer.tags.growthLevel}</Descriptions.Item>
          <Descriptions.Item label="偏好行业" span={2}>
            <Space wrap>{customer.tags.preferredIndustries.map((tag) => <Tag color="blue" key={tag}>{tag}</Tag>)}</Space>
          </Descriptions.Item>
        </Descriptions>
      </SectionCard>
      <SectionCard title="可用性">
        <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
          <Descriptions.Item label="状态"><StatusTag status="online" mode="badge" /> <Typography.Text>{customer.availability.status}</Typography.Text></Descriptions.Item>
          <Descriptions.Item label="加入年限">{customer.availability.yearsJoined}</Descriptions.Item>
          <Descriptions.Item label="潜力分">{customer.availability.potentialScore}</Descriptions.Item>
          <Descriptions.Item label="近期联系">{customer.availability.recentContact || '—'}</Descriptions.Item>
          <Descriptions.Item label="邮箱验证">{customer.availability.emailVerified || '—'}</Descriptions.Item>
        </Descriptions>
      </SectionCard>
    </div>
  );
}

function BatchManagement({ selectedKeys, setSelectedKeys, messagesMap }) {
  const [groupMode, setGroupMode] = useState('time');
  const [messageApi, contextHolder] = message.useMessage();
  const groups = groupMode === 'time' ? groupConversationsByTime(conversations) : groupByConversationCount(conversations);

  const toggleGroup = (items, checked) => {
    const ids = items.map((item) => item.id);
    setSelectedKeys((current) => checked ? Array.from(new Set([...current, ...ids])) : current.filter((id) => !ids.includes(id)));
  };

  const exportSelected = () => {
    if (selectedKeys.length === 0) {
      messageApi.warning('请先选择要导出的客户');
      return;
    }
    const content = selectedKeys.map((id) => buildConversationExport({
      conversation: conversations.find((item) => item.id === id),
      customer: customerProfiles[id],
      messages: messagesMap[id] || [],
    })).join('\n\n==============================\n\n');
    downloadTextFile(`mock-chat-export-${selectedKeys.length}-customers.txt`, content);
    messageApi.success('已生成模拟 TXT 导出；真实系统可替换为 ZIP 包');
  };

  return (
    <div className="page-stack compact batch-page">
      {contextHolder}
      <div className="batch-toolbar">
        <div>
          <Typography.Title level={5}>批量管理</Typography.Title>
          <Typography.Text type="secondary">已选择 {selectedKeys.length} / {conversations.length} 个客户</Typography.Text>
        </div>
        <Space wrap>
          <Radio.Group value={groupMode} onChange={(event) => setGroupMode(event.target.value)}>
            <Radio.Button value="time">按更新时间</Radio.Button>
            <Radio.Button value="count">按对话数</Radio.Button>
          </Radio.Group>
          <Button onClick={() => setSelectedKeys(conversations.map((item) => item.id))}>全选</Button>
          <Button onClick={() => setSelectedKeys(conversations.filter((item) => !selectedKeys.includes(item.id)).map((item) => item.id))}>反选</Button>
          <Button onClick={() => setSelectedKeys([])}>清空</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={exportSelected}>导出聊天</Button>
          <Button onClick={() => messageApi.info('群发消息功能待接入，当前仅展示占位提示')}>群发消息</Button>
        </Space>
      </div>
      {groups.map((group) => (
        <Card key={group.title} className="batch-group-card" size="small" title={group.title} extra={(
          <Space>
            <Button size="small" onClick={() => toggleGroup(group.items, true)}>组选中</Button>
            <Button size="small" onClick={() => toggleGroup(group.items, false)}>取消组</Button>
          </Space>
        )}>
          <Checkbox.Group value={selectedKeys} onChange={setSelectedKeys} className="batch-checkbox-group">
            {group.items.map((item) => (
              <Checkbox key={item.id} value={item.id} className="batch-checkbox">
                <div className="batch-record">
                  <Avatar src={item.avatar}>{item.name[0]}</Avatar>
                  <div className="batch-record-main">
                    <Typography.Text strong>{item.name}</Typography.Text>
                    <Typography.Text type="secondary">{item.company} · {item.messageCount} 条 · {formatDateTime(item.updatedAt)}</Typography.Text>
                  </div>
                  <StatusTag status={item.status} />
                </div>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Card>
      ))}
    </div>
  );
}

function ChatPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [messagesMap, setMessagesMap] = useState(messagesByConversation);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [retranslatingId, setRetranslatingId] = useState('');
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [analysis, setAnalysis] = useState({ open: false, title: '', loading: false, content: '', type: '' });
  const [batchSelected, setBatchSelected] = useState([]);
  const [conversationPanelCollapsed, setConversationPanelCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const selectedConversation = useMemo(() => conversations.find((item) => item.id === selectedId), [selectedId]);
  const customer = customerProfiles[selectedId];
  const currentMessages = messagesMap[selectedId] || [];
  const draft = drafts[selectedId] || '';

  const selectConversation = (id) => {
    setSelectedId(id);
  };

  const setDraft = (value) => setDrafts((items) => ({ ...items, [selectedId]: value }));
  const toggleConversationPanel = () => setConversationPanelCollapsed((collapsed) => !collapsed);

  const translate = async (retranslate = false) => {
    setTranslationLoading(true);
    const translated = await translateBuyerMessages(currentMessages, retranslate);
    setMessagesMap((items) => ({ ...items, [selectedId]: translated }));
    setTranslationLoading(false);
    setShowTranslation(true);
    messageApi.success(retranslate ? '重新翻译完成' : '翻译完成');
  };

  const retranslateMessage = async (messageId) => {
    setRetranslatingId(messageId);
    const [translatedMessage] = await translateBuyerMessages(currentMessages.filter((item) => item.id === messageId), true);
    setMessagesMap((items) => ({
      ...items,
      [selectedId]: (items[selectedId] || []).map((item) => item.id === messageId ? translatedMessage : item),
    }));
    setRetranslatingId('');
    setShowTranslation(true);
    messageApi.success('重新翻译完成');
  };

  const openSuggestions = async () => {
    setSuggestionOpen(true);
    setSuggestionLoading(true);
    setSuggestions(await generateSuggestions(selectedConversation));
    setSuggestionLoading(false);
  };

  const openAnalysis = async (type) => {
    setAnalysis({ open: true, title: type === 'intent' ? '客户意图分析' : '客户阶段分析', loading: true, content: '', type });
    const content = await runCustomerAnalysis(type, customer);
    setAnalysis((item) => ({ ...item, loading: false, content }));
  };

  const confirmSend = () => {
    if (!draft.trim()) {
      messageApi.warning('请输入消息内容');
      return;
    }
    Modal.confirm({
      title: '发送前确认',
      content: '请选择测试填充或确认发送。测试不会真正发送消息。',
      okText: '确认发送',
      cancelText: '取消',
      footer: (_, { OkBtn, CancelBtn }) => (
        <Space>
          <CancelBtn />
          <Button onClick={() => enqueueSendTask('TestMessageFill')}>测试</Button>
          <OkBtn />
        </Space>
      ),
      onOk: () => enqueueSendTask('MessageSend'),
    });
  };

  const enqueueSendTask = (type) => {
    if (type === 'MessageSend') {
      const newMessage = { id: `m-${Date.now()}`, type: 'text', sender: 'seller', timestamp: new Date().toISOString(), content: draft };
      setMessagesMap((items) => ({ ...items, [selectedId]: [...(items[selectedId] || []), newMessage] }));
      setDraft('');
      messageApi.success('消息已模拟发送成功');
      return;
    }

    messageApi.info('已模拟跳转联系人并填充输入框');
  };

  const assistantMenuItems = [
    { key: 'suggestions', label: 'AI建议', icon: <BulbOutlined /> },
    { key: 'intent', label: '客户意图', icon: <FlagOutlined /> },
    { key: 'stage', label: '客户阶段', icon: <ProfileOutlined /> },
    { key: 'translate', label: '翻译', icon: <GlobalOutlined /> },
  ];

  const runAssistantAction = ({ key }) => {
    if (key === 'suggestions') openSuggestions();
    if (key === 'intent') openAnalysis('intent');
    if (key === 'stage') openAnalysis('stage');
    if (key === 'translate') translate(false);
  };

  const tabItems = [
    {
      key: 'messages',
      label: '聊天消息',
      children: (
        <div className="chat-workspace">
          <MessageTimeline
            messages={currentMessages}
            showTranslation={showTranslation}
            onRetranslate={retranslateMessage}
            retranslatingId={retranslatingId}
          />
          <Card className="composer-card" bordered={false}>
            <div className="composer-head">
              <Typography.Text strong>回复编排</Typography.Text>
            </div>
            <TextArea autoSize={{ minRows: 1, maxRows: 5 }} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => messageApi.success('草稿已保存')} placeholder="输入要发送给客户的英文回复，可先用智能助手生成建议..." />
            <div className="composer-actions">
              {showTranslation && (
                <Button icon={<GlobalOutlined />} onClick={() => setShowTranslation(false)}>
                  关闭翻译
                </Button>
              )}
              <Dropdown menu={{ items: assistantMenuItems, onClick: runAssistantAction }} trigger={['click']}>
                <Button loading={translationLoading} icon={<BulbOutlined />}>
                  智能助手 <DownOutlined />
                </Button>
              </Dropdown>
              <Button icon={<ReloadOutlined />}>刷新页面以更新聊天记录</Button>
              <Button type="primary" icon={<SendOutlined />} onClick={confirmSend}>发送</Button>
            </div>
          </Card>
        </div>
      ),
    },
    { key: 'info', label: '客户信息', children: <CustomerInfo customer={customer} avatar={selectedConversation.avatar} /> },
    { key: 'batch', label: '批量管理', children: <BatchManagement selectedKeys={batchSelected} setSelectedKeys={setBatchSelected} messagesMap={messagesMap} /> },
  ];

  return (
    <div className={`chat-page ${conversationPanelCollapsed ? 'conversation-panel-collapsed' : ''}`}>
      {contextHolder}
      <ConversationList
        id="conversation-panel"
        selectedId={selectedId}
        onSelect={selectConversation}
        collapsed={conversationPanelCollapsed}
        onToggleCollapse={toggleConversationPanel}
      />
      <div className="chat-main">
        <Card className="section-card">
          <Tabs items={tabItems} />
        </Card>
      </div>
      <Modal title="AI 回复建议" open={suggestionOpen} onCancel={() => setSuggestionOpen(false)} footer={null} width={760}>
        {suggestionLoading ? <Spin tip="正在生成建议..." /> : (
          <Space direction="vertical" className="full-width">
            {suggestions.map((item) => (
              <Card key={item.id} size="small">
                <Typography.Paragraph><b>中文解释：</b>{item.reason}</Typography.Paragraph>
                <Typography.Paragraph copyable>{item.reply}</Typography.Paragraph>
                <Button type="primary" onClick={() => { setDraft(item.reply); setSuggestionOpen(false); }}>填充到输入框</Button>
              </Card>
            ))}
          </Space>
        )}
      </Modal>
      <Modal title={analysis.title} open={analysis.open} onCancel={() => setAnalysis((item) => ({ ...item, open: false }))} footer={<Button type="primary" onClick={() => setAnalysis((item) => ({ ...item, open: false }))}>知道了</Button>} width={720} centered>
        {analysis.loading ? <Spin tip="正在分析客户上下文..." /> : <AnalysisMarkdown content={analysis.content} />}
      </Modal>
    </div>
  );
}

export default ChatPage;
