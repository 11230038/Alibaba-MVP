export const llmConfig = {
  systemPrompt: '你是阿里国际站卖家助手，回答必须准确、礼貌、商业化，并保留客户上下文。',
  levels: Array.from({ length: 5 }, (_, level) => ({
    level,
    baseUrl: 'https://api.mock-llm.example/v1',
    apiKey: `sk-mock-level-${level}-placeholder`,
    modelName: level >= 3 ? 'claude-sonnet-5' : 'claude-haiku-4-5-20251001',
    systemPrompt: `Level ${level} agent prompt for Alibaba seller workflow.`,
    context: 12000 + level * 4000,
    maxToolRounds: 3 + level,
  })),
};

export const systemAgents = [
  { id: 'sys-translate', name: '翻译 Agent', binding: 'translation', level: 1, prompt: '将买家消息翻译成自然中文，保留贸易术语。' },
  { id: 'sys-suggestion', name: '回复建议 Agent', binding: 'reply_suggestion', level: 2, prompt: '根据会话上下文生成不超过三条可发送英文回复。' },
  { id: 'sys-intent', name: '客户意图分析 Agent', binding: 'intent_analysis', level: 3, prompt: '判断客户采购意图、关注点、风险和下一步行动。' },
  { id: 'sys-stage', name: '客户阶段分析 Agent', binding: 'stage_analysis', level: 3, prompt: '识别客户所处阶段并给出推进策略。' },
];

export const toolOptions = ['CRM 查询', '订单摘要', '物流计算', '报价模板', '联系人跳转', '消息填充'];

export const regularAgents = [
  {
    id: 'agent-quote',
    name: '报价跟进助手',
    description: '根据产品、MOQ 和客户历史生成报价跟进话术。',
    prompt: '你是报价跟进助手，需要用英文生成清晰、专业、可直接发送的回复。',
    level: 2,
    tools: ['CRM 查询', '报价模板'],
  },
  {
    id: 'agent-risk',
    name: '订单风险审阅',
    description: '审阅客户需求中的履约、价格、付款风险。',
    prompt: '识别潜在订单风险并给出卖家可执行建议。',
    level: 3,
    tools: ['CRM 查询', '订单摘要', '物流计算'],
  },
];

export const testHistories = [
  {
    id: 'hist-001',
    agentId: 'agent-quote',
    title: 'Nordic Home 彩盒报价',
    updatedAt: '2026-08-11T09:25:00+08:00',
    messages: [
      { id: 'h1-m1', role: 'user', content: '客户询问彩盒成本和交期，如何回复？', timestamp: '2026-08-11T09:23:00+08:00', round: 1 },
      { id: 'h1-m2', role: 'assistant', content: '建议先确认正在核价，并承诺今天内给出最终报价。', timestamp: '2026-08-11T09:24:00+08:00', round: 1 },
    ],
  },
];
