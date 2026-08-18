import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined, MessageOutlined, PlusOutlined, ReloadOutlined, RollbackOutlined } from '@ant-design/icons';
import SectionCard from '../components/SectionCard';
import { llmConfig, regularAgents, systemAgents, testHistories, toolOptions } from '../mock/agentData';
import { formatDateTime } from '../utils/time';

const { TextArea } = Input;

function maskApiKey(value) {
  if (!value) return '未配置';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 3)}****${value.slice(-4)}`;
}

function LlmConfigTab() {
  const [config, setConfig] = useState(llmConfig);
  const [editing, setEditing] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const globalPromptItem = {
    id: 'global-prompt',
    type: 'global',
    name: '全局 SYSTEM_PROMPT',
    description: '所有模型层级共享的基础行为约束',
    prompt: config.systemPrompt,
  };
  const levelRows = config.levels.map((item) => ({
    ...item,
    id: `level-${item.level}`,
    type: 'level',
    name: `Level ${item.level}`,
    description: item.level >= 3 ? '复杂分析与策略任务' : '轻量会话与常规任务',
  }));

  const saveEditing = () => {
    if (!editing) return;
    if (editing.type === 'global') {
      setConfig((current) => ({ ...current, systemPrompt: editing.prompt }));
    } else {
      setConfig((current) => ({
        ...current,
        levels: current.levels.map((item) => item.level === editing.level ? {
          level: editing.level,
          baseUrl: editing.baseUrl,
          apiKey: editing.apiKey,
          modelName: editing.modelName,
          systemPrompt: editing.systemPrompt,
          context: editing.context,
          maxToolRounds: editing.maxToolRounds,
        } : item),
      }));
    }
    setEditing(null);
    messageApi.success('LLM 配置已模拟保存');
  };

  const resetConfig = () => {
    if (!resetTarget) return;
    if (resetTarget.type === 'global') {
      setConfig((current) => ({ ...current, systemPrompt: llmConfig.systemPrompt }));
    } else {
      const defaults = llmConfig.levels.find((item) => item.level === resetTarget.level);
      setConfig((current) => ({
        ...current,
        levels: current.levels.map((item) => item.level === resetTarget.level ? { ...defaults } : item),
      }));
    }
    setResetTarget(null);
    messageApi.success('已重置配置');
  };

  const columns = [
    {
      title: '配置项',
      dataIndex: 'name',
      align: 'center',
      ellipsis: true,
      render: (value) => <Typography.Text strong>{value}</Typography.Text>,
    },
    { title: '模型', dataIndex: 'modelName', align: 'center', ellipsis: true },
    { title: 'Base URL', dataIndex: 'baseUrl', align: 'center', ellipsis: true },
    { title: 'API Key', dataIndex: 'apiKey', align: 'center', ellipsis: true, render: (value) => <Typography.Text code>{maskApiKey(value)}</Typography.Text> },
    { title: 'Context', dataIndex: 'context', align: 'center', ellipsis: true, render: (value) => value.toLocaleString() },
    { title: 'max_tool_rounds', dataIndex: 'maxToolRounds', align: 'center', ellipsis: true },
    { title: 'Prompt', dataIndex: 'systemPrompt', align: 'center', ellipsis: true },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setEditing({ ...record })}>编辑</Button>
          <Button size="small" icon={<ReloadOutlined />} onClick={() => setResetTarget(record)}>重置</Button>
        </Space>
      ),
    },
  ];

  return (
    <SectionCard title="LLM 配置" description="统一管理模型层级、上下文窗口与系统提示词；当前为 mock 保存">
      {contextHolder}
      <Card className="llm-global-prompt-card">
        <div className="llm-global-prompt-head">
          <div>
            <Typography.Title level={5}>全局 SYSTEM_PROMPT</Typography.Title>
            <Typography.Paragraph ellipsis={{ rows: 2 }}>{config.systemPrompt}</Typography.Paragraph>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setEditing({ ...globalPromptItem })}>编辑</Button>
            <Button icon={<ReloadOutlined />} onClick={() => setResetTarget(globalPromptItem)}>重置</Button>
          </Space>
        </div>
      </Card>
      <Table
        rowKey="id"
        className="llm-config-table unified-data-table"
        columns={columns}
        dataSource={levelRows}
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: 1180 }}
      />
      <Modal
        rootClassName="agent-edit-modal llm-edit-modal"
        title={(
          <div className="agent-modal-title">
            <div>
              <Typography.Text type="secondary">LLM 配置</Typography.Text>
              <Typography.Title level={4}>{editing?.type === 'global' ? '编辑全局 Prompt' : `编辑 ${editing?.name || ''}`}</Typography.Title>
            </div>
            <Tag color="blue">{editing?.type === 'global' ? 'Global' : editing?.name}</Tag>
          </div>
        )}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={saveEditing}
        okText="保存配置"
        cancelText="取消"
        width={980}
      >
        {editing && <div className="agent-edit-form-grid">
          <div className="agent-edit-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>基础信息</Typography.Text>
              <div className="section-card-description">{editing.type === 'global' ? '全局提示词影响所有 LLM 层级的默认行为。' : '连接信息、模型名称和运行边界统一在此维护。'}</div>
            </div>
            {editing.type === 'global' ? (
              <Space direction="vertical" className="full-width">
                <label className="agent-field">
                  <span>配置项</span>
                  <Input value="全局 SYSTEM_PROMPT" disabled />
                </label>
                <label className="agent-field">
                  <span>作用范围</span>
                  <Input value="所有 LLM Level" disabled />
                </label>
              </Space>
            ) : (
              <Space direction="vertical" className="full-width">
                <label className="agent-field">
                  <span>Base URL</span>
                  <Input placeholder="https://api.example.com/v1" value={editing.baseUrl} onChange={(event) => setEditing({ ...editing, baseUrl: event.target.value })} />
                </label>
                <label className="agent-field">
                  <span>API Key</span>
                  <Input.Password placeholder="输入 API Key" value={editing.apiKey} onChange={(event) => setEditing({ ...editing, apiKey: event.target.value })} />
                </label>
                <label className="agent-field">
                  <span>Model Name</span>
                  <Input placeholder="例如：claude-sonnet-5" value={editing.modelName} onChange={(event) => setEditing({ ...editing, modelName: event.target.value })} />
                </label>
                <Row gutter={12}>
                  <Col span={12}>
                    <label className="agent-field">
                      <span>Context</span>
                      <InputNumber className="full-width" min={1} value={editing.context} onChange={(context) => setEditing({ ...editing, context })} />
                    </label>
                  </Col>
                  <Col span={12}>
                    <label className="agent-field">
                      <span>max_tool_rounds</span>
                      <InputNumber className="full-width" min={1} value={editing.maxToolRounds} onChange={(maxToolRounds) => setEditing({ ...editing, maxToolRounds })} />
                    </label>
                  </Col>
                </Row>
              </Space>
            )}
          </div>
          <div className="agent-edit-panel prompt-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>提示词 / System Prompt</Typography.Text>
              <div className="section-card-description">建议明确角色、任务边界、工具使用约束和输出风格。</div>
            </div>
            <TextArea
              rows={14}
              placeholder="请输入 System Prompt..."
              value={editing.type === 'global' ? editing.prompt : editing.systemPrompt}
              onChange={(event) => setEditing(editing.type === 'global' ? { ...editing, prompt: event.target.value } : { ...editing, systemPrompt: event.target.value })}
            />
          </div>
        </div>}
      </Modal>
      <Modal
        centered
        open={!!resetTarget}
        title="确认重置配置？"
        okText="重置"
        cancelText="取消"
        onOk={resetConfig}
        onCancel={() => setResetTarget(null)}
      >
        <div className="task-delete-modal-content">
          <Typography.Text>重置后该配置项会恢复为 mock 默认值，当前修改将被覆盖。</Typography.Text>
          {resetTarget && (
            <div className="task-delete-target">
              <Typography.Text strong>{resetTarget.name}</Typography.Text>
              <Typography.Text type="secondary">{resetTarget.type === 'global' ? '全局提示词' : `${resetTarget.modelName} · ${maskApiKey(resetTarget.apiKey)}`}</Typography.Text>
            </div>
          )}
        </div>
      </Modal>
    </SectionCard>
  );
}

function SystemAgentsTab() {
  const [agents, setAgents] = useState(systemAgents);
  const [editing, setEditing] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    { title: '名称', dataIndex: 'name', align: 'center', ellipsis: true },
    { title: '绑定能力', dataIndex: 'binding', align: 'center', ellipsis: true, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: 'LLM Level', dataIndex: 'level', align: 'center', ellipsis: true, render: (value) => <Tag>Level {value}</Tag> },
    { title: 'Prompt', dataIndex: 'prompt', align: 'center', ellipsis: true },
    {
      title: '操作', align: 'center', ellipsis: true, render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(record)}>编辑</Button>
          <Button size="small" icon={<ReloadOutlined />} onClick={() => setRestoreTarget(record)}>重置</Button>
        </Space>
      ),
    },
  ];

  return (
    <SectionCard title="系统 Agent" description="内置能力绑定聊天页关键动作，支持编辑与重置">
      {contextHolder}
      <Table rowKey="id" className="unified-data-table" columns={columns} dataSource={agents} pagination={false} bordered size="middle" />
      <Modal
        rootClassName="agent-edit-modal"
        title={(
          <div className="agent-modal-title">
            <div>
              <Typography.Text type="secondary">System Agent 配置</Typography.Text>
              <Typography.Title level={4}>编辑系统 Agent</Typography.Title>
            </div>
            <Tag color="blue">{editing?.binding || 'System'}</Tag>
          </div>
        )}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => {
          setAgents((items) => items.map((item) => item.id === editing.id ? editing : item));
          setEditing(null);
          messageApi.success('系统 Agent 已模拟保存');
        }}
        okText="保存 Agent"
        cancelText="取消"
        width={980}
      >
        {editing && <div className="agent-edit-form-grid">
          <div className="agent-edit-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>基础信息</Typography.Text>
              <div className="section-card-description">系统 Agent 绑定聊天页核心能力，仅支持编辑名称、模型等级和提示词。</div>
            </div>
            <Space direction="vertical" className="full-width">
              <label className="agent-field">
                <span>名称</span>
                <Input placeholder="系统 Agent 名称" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
              </label>
              <label className="agent-field">
                <span>绑定能力</span>
                <Input value={editing.binding} disabled />
              </label>
              <label className="agent-field">
                <span>LLM Level</span>
                <Select value={editing.level} onChange={(level) => setEditing({ ...editing, level })} options={[0, 1, 2, 3, 4].map((level) => ({ value: level, label: `Level ${level}` }))} />
              </label>
            </Space>
          </div>
          <div className="agent-edit-panel prompt-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>提示词 / Prompt</Typography.Text>
              <div className="section-card-description">用于驱动该系统 Agent 的内置能力表现。修改后可在聊天工作台相关功能里验证效果。</div>
            </div>
            <TextArea rows={14} placeholder="请输入系统 Agent 的提示词..." value={editing.prompt} onChange={(event) => setEditing({ ...editing, prompt: event.target.value })} />
          </div>
        </div>}
      </Modal>
      <Modal
        centered
        open={!!restoreTarget}
        title="确认重置设置？"
        okText="重置"
        cancelText="取消"
        onOk={() => {
          const defaults = systemAgents.find((agent) => agent.id === restoreTarget.id);
          setAgents((items) => items.map((item) => item.id === restoreTarget.id ? { ...item, ...defaults } : item));
          setRestoreTarget(null);
          messageApi.success('已重置设置');
        }}
        onCancel={() => setRestoreTarget(null)}
      >
        <div className="task-delete-modal-content">
          <Typography.Text>恢复后该系统 Agent 的名称、模型等级和提示词会回到默认配置。</Typography.Text>
          {restoreTarget && (
            <div className="task-delete-target">
              <Typography.Text strong>{restoreTarget.name}</Typography.Text>
              <Typography.Text type="secondary">{restoreTarget.binding} · Level {restoreTarget.level}</Typography.Text>
            </div>
          )}
        </div>
      </Modal>
    </SectionCard>
  );
}

function AgentTestModal({ agent, open, onClose }) {
  const [histories, setHistories] = useState(testHistories.filter((item) => item.agentId === agent?.id));
  const [activeId, setActiveId] = useState(histories[0]?.id);
  const [input, setInput] = useState('');
  const active = histories.find((item) => item.id === activeId);
  const [messageApi, contextHolder] = message.useMessage();

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: `msg-${Date.now()}-u`, role: 'user', content: input, timestamp: new Date().toISOString(), round: (active?.messages.length || 0) + 1 };
    const botMsg = { id: `msg-${Date.now()}-a`, role: 'assistant', content: `Mock 回复：已根据「${agent.name}」策略生成建议。`, timestamp: new Date().toISOString(), round: userMsg.round };
    if (active) {
      setHistories((items) => items.map((item) => item.id === active.id ? { ...item, updatedAt: new Date().toISOString(), messages: [...item.messages, userMsg, botMsg] } : item));
    } else {
      const newHistory = { id: `hist-${Date.now()}`, agentId: agent.id, title: input.slice(0, 18), updatedAt: new Date().toISOString(), messages: [userMsg, botMsg] };
      setHistories([newHistory]);
      setActiveId(newHistory.id);
    }
    setInput('');
  };

  const branchFrom = (messageIndex) => {
    const next = { ...active, id: `hist-${Date.now()}`, title: `${active.title} 分支`, messages: active.messages.slice(0, messageIndex + 1), updatedAt: new Date().toISOString() };
    setHistories((items) => [next, ...items]);
    setActiveId(next.id);
  };

  const copyMessage = (item) => {
    navigator.clipboard?.writeText(`${item.role}: ${item.content}`);
    messageApi.success('消息已复制');
  };

  const deleteMessage = (messageId) => {
    if (!active) return;
    const updatedAt = new Date().toISOString();
    setHistories((items) => items.map((history) => history.id === active.id ? {
      ...history,
      updatedAt,
      messages: history.messages.filter((item) => item.id !== messageId),
    } : history));
    messageApi.success('消息已删除');
  };

  return (
    <Modal
      rootClassName="agent-test-modal"
      title={(
        <div className="agent-modal-title">
          <div>
            <Typography.Text type="secondary">Agent 测试台</Typography.Text>
            <Typography.Title level={4}>{agent?.name || ''}</Typography.Title>
          </div>
          <Tag color="blue">Level {agent?.level}</Tag>
        </div>
      )}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1080}
    >
      {contextHolder}
      <Row gutter={18} className="agent-test-layout">
        <Col xs={24} md={8}>
          <div className="agent-test-sidebar">
            <div className="agent-test-sidebar-head">
              <div>
                <Typography.Text strong>测试历史</Typography.Text>
                <div className="section-card-description">选择历史或创建新的测试分支</div>
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { const h = { id: `hist-${Date.now()}`, agentId: agent.id, title: '新测试对话', updatedAt: new Date().toISOString(), messages: [] }; setHistories((items) => [h, ...items]); setActiveId(h.id); }}>新对话</Button>
            </div>
            <ListLike histories={histories} activeId={activeId} onSelect={setActiveId} />
          </div>
        </Col>
        <Col xs={24} md={16}>
          <div className="agent-test-console">
            <div className="agent-test-console-head">
              <div>
                <Typography.Text strong>{active?.title || '未选择测试对话'}</Typography.Text>
                <div className="section-card-description">{active ? `最近更新：${formatDateTime(active.updatedAt)}` : '创建或选择一个测试对话开始验证 Agent 行为'}</div>
              </div>
              <Tag>{(active?.messages || []).length} messages</Tag>
            </div>
            <div className="agent-test-window">
              {(active?.messages || []).map((item, index) => (
                <Card size="small" key={item.id} className={`test-message ${item.role}`}>
                  <div className="test-message-head">
                    <Typography.Text strong>{item.role === 'user' ? '用户' : 'Agent'}</Typography.Text>
                    <Typography.Text type="secondary" className="test-message-time">{formatDateTime(item.timestamp)}</Typography.Text>
                  </div>
                  <Typography.Paragraph>{item.content}</Typography.Paragraph>
                  <Space className="test-message-toolbar" wrap>
                    <Button size="small" onClick={() => branchFrom(index)}>从此新开</Button>
                    <Button size="small" icon={<CopyOutlined />} onClick={() => copyMessage(item)}>复制</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteMessage(item.id)}>删除</Button>
                  </Space>
                </Card>
              ))}
            </div>
            <div className="agent-test-composer">
              <Space.Compact className="full-width">
                <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入测试消息，验证该 Agent 的提示词和工具策略..." onPressEnter={send} />
                <Button type="primary" onClick={send}>发送</Button>
              </Space.Compact>
              <Space className="agent-test-actions" wrap>
                <Button icon={<RollbackOutlined />} onClick={() => active && setHistories((items) => items.map((item) => item.id === active.id ? { ...item, messages: item.messages.slice(0, -2) } : item))}>撤销一轮</Button>
                <Popconfirm title="删除当前历史？" onConfirm={() => { setHistories((items) => items.filter((item) => item.id !== activeId)); setActiveId(undefined); }}><Button danger icon={<DeleteOutlined />}>删除历史</Button></Popconfirm>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
}

function ListLike({ histories, activeId, onSelect }) {
  return (
    <div className="history-list">
      {histories.map((item) => (
        <Card size="small" key={item.id} className={`history-card ${activeId === item.id ? 'active-history' : ''}`} onClick={() => onSelect(item.id)}>
          <Typography.Text strong>{item.title}</Typography.Text>
          <div className="section-card-description">{formatDateTime(item.updatedAt)}</div>
        </Card>
      ))}
    </div>
  );
}

function RegularAgentsTab() {
  const [agents, setAgents] = useState(regularAgents);
  const [editing, setEditing] = useState(null);
  const [testing, setTesting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const saveAgent = () => {
    if (editing.id) {
      setAgents((items) => items.map((item) => item.id === editing.id ? editing : item));
    } else {
      setAgents((items) => [{ ...editing, id: `agent-${Date.now()}` }, ...items]);
    }
    setEditing(null);
    messageApi.success('普通 Agent 已模拟保存');
  };

  const columns = [
    { title: '名称', dataIndex: 'name', align: 'center', ellipsis: true },
    { title: '描述', dataIndex: 'description', align: 'center', ellipsis: true },
    { title: 'LLM Level', dataIndex: 'level', align: 'center', ellipsis: true, render: (value) => <Tag>Level {value}</Tag> },
    { title: 'Tools', dataIndex: 'tools', align: 'center', ellipsis: true, render: (tools) => tools.map((tool) => <Tag key={tool}>{tool}</Tag>) },
    {
      title: '操作', align: 'center', ellipsis: true, render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(record)}>编辑</Button>
          <Button size="small" icon={<MessageOutlined />} onClick={() => setTesting(record)}>对话</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setDeleteTarget(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <SectionCard
      title="普通 Agent"
      description="管理 AgentPreset、工具授权、Prompt 编辑与测试对话历史"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing({ name: '', description: '', prompt: '', level: 1, tools: [] })}>新建 AgentPreset</Button>}
    >
      {contextHolder}
      <Table rowKey="id" className="unified-data-table" columns={columns} dataSource={agents} bordered size="middle" />
      <Modal
        rootClassName="agent-edit-modal"
        title={(
          <div className="agent-modal-title">
            <div>
              <Typography.Text type="secondary">AgentPreset 配置</Typography.Text>
              <Typography.Title level={4}>{editing?.id ? '编辑普通 Agent' : '新建普通 Agent'}</Typography.Title>
            </div>
          </div>
        )}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={saveAgent}
        okText="保存 Agent"
        cancelText="取消"
        width={980}
      >
        {editing && <div className="agent-edit-form-grid">
          <div className="agent-edit-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>基础信息</Typography.Text>
              <div className="section-card-description">定义 Agent 名称、职责说明和模型等级</div>
            </div>
            <Space direction="vertical" className="full-width">
              <label className="agent-field">
                <span>名称</span>
                <Input placeholder="例如：询盘分类助手" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
              </label>
              <label className="agent-field">
                <span>描述</span>
                <Input placeholder="说明该 Agent 负责的业务场景" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
              </label>
              <label className="agent-field">
                <span>LLM Level</span>
                <Select value={editing.level} onChange={(level) => setEditing({ ...editing, level })} options={[0, 1, 2, 3, 4].map((level) => ({ value: level, label: `Level ${level}` }))} />
              </label>
              <label className="agent-field">
                <span>工具授权</span>
                <Select mode="multiple" value={editing.tools} onChange={(tools) => setEditing({ ...editing, tools })} options={toolOptions.map((tool) => ({ value: tool, label: tool }))} placeholder="选择可用工具" />
              </label>
            </Space>
          </div>
          <div className="agent-edit-panel prompt-panel">
            <div className="agent-edit-panel-head">
              <Typography.Text strong>提示词 / Prompt</Typography.Text>
              <div className="section-card-description">建议包含角色、任务目标、约束条件和输出格式，保存后可直接在对话测试台验证。</div>
            </div>
            <TextArea rows={14} placeholder="请输入 Agent 的系统提示词，例如：你是负责询盘优先级判断的销售运营助手..." value={editing.prompt} onChange={(event) => setEditing({ ...editing, prompt: event.target.value })} />
          </div>
        </div>}
      </Modal>
      <Modal
        centered
        open={!!deleteTarget}
        title="确认删除 Agent？"
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        onOk={() => {
          setAgents((items) => items.filter((item) => item.id !== deleteTarget.id));
          setDeleteTarget(null);
          messageApi.success('普通 Agent 已删除');
        }}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="task-delete-modal-content">
          <Typography.Text>删除后该 AgentPreset 会从普通 Agent 列表中移除。</Typography.Text>
          {deleteTarget && (
            <div className="task-delete-target">
              <Typography.Text strong>{deleteTarget.name}</Typography.Text>
              <Typography.Text type="secondary">Level {deleteTarget.level} · {(deleteTarget.tools || []).join('、') || '未配置工具'}</Typography.Text>
            </div>
          )}
        </div>
      </Modal>
      {testing && <AgentTestModal agent={testing} open={!!testing} onClose={() => setTesting(null)} />}
    </SectionCard>
  );
}

function AgentPage() {
  return (
    <div className="page-stack aligned-page agent-console-page">
      <Card className="section-card aligned-tabs-card">
        <Tabs items={[
          { key: 'llm', label: 'LLM 配置', children: <LlmConfigTab /> },
          { key: 'system', label: '系统 Agent', children: <SystemAgentsTab /> },
          { key: 'regular', label: '普通 Agent', children: <RegularAgentsTab /> },
        ]} />
      </Card>
    </div>
  );
}

export default AgentPage;
