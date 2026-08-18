const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const createMockTask = ({ type, target, result = '任务已进入队列' }) => ({
  id: `TASK-${Date.now().toString().slice(-6)}`,
  type,
  target,
  createdAt: new Date().toISOString(),
  status: 'waiting',
  result,
});

export const runTaskLifecycle = (task, setTasks, successResult) => {
  setTasks((items) => [task, ...items]);
  setTimeout(() => {
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status: 'running', result: '外部 UI 任务执行中' } : item));
  }, 500);
  setTimeout(() => {
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status: 'success', result: successResult } : item));
  }, 1800);
};

const mockTranslations = {
  'Could you confirm the color box cost and lead time?': '可以确认彩盒成本和交期吗？',
  'We need the quote today for internal approval.': '我们今天需要这份报价用于内部审批。',
  'Please confirm FOB Ningbo price.': '请确认宁波 FOB 价格。',
  'Gift box sample is important for our launch.': '礼盒样品对我们的新品发布很重要。',
  'We will review your updated catalog.': '我们会评估你们更新后的产品目录。',
};

export const translateBuyerMessages = async (messages, retranslate = false) => {
  await delay(900);
  return messages.map((message) => {
    if (message.sender !== 'buyer' || message.type !== 'text') return message;
    const translatedText = mockTranslations[message.content] || message.translation || message.content;
    return {
      ...message,
      translation: retranslate ? `【重新翻译】${translatedText}` : message.translation || translatedText,
    };
  });
};

export const generateSuggestions = async (conversation) => {
  await delay(900);
  return [
    {
      id: 'sug-1',
      reason: '先回应客户的时效诉求，降低等待焦虑。',
      reply: `Hi ${conversation.contact}, we are confirming the packaging cost now and will send you the final quote today.`,
    },
    {
      id: 'sug-2',
      reason: '强调可提供备选方案，体现专业度。',
      reply: 'We can offer both standard carton and custom color box options, so you can compare the total landed cost.',
    },
    {
      id: 'sug-3',
      reason: '推动客户给出采购节奏，便于后续跟进。',
      reply: 'Could you also share your target order quantity and expected delivery window for this project?',
    },
  ];
};

export const runCustomerAnalysis = async (type, customer) => {
  await delay(900);
  if (type === 'intent') {
    return `### 客户意图分析\n\n- **核心需求**：${customer.identity.company} 正在确认价格、包装和交期。\n- **采购信号**：近 90 天询盘与回复率较高，具备明确项目窗口。\n- **风险点**：价格敏感，需避免只给单一报价。\n- **建议动作**：提供阶梯价、包装差异价和交期承诺。`;
  }
  return `### 客户阶段分析\n\n- **当前阶段**：方案确认 / 报价推进。\n- **下一步目标**：推动客户确认数量、包装形式和样品需求。\n- **推荐话术**：主动承诺报价时间，并附带两套包装方案。`;
};

export const refreshMockStatuses = async (statuses) => {
  await delay(700);
  return statuses.map((status) => ({
    ...status,
    status: status.key === 'receiver' ? 'online' : status.status,
    detail: status.key === 'receiver' ? 'Receiver 已重新连接，消息捕获正常' : status.detail,
    lastCheck: new Date().toISOString(),
  }));
};
