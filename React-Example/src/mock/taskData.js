export const initialTasks = [
  {
    id: 'TASK-1001',
    type: 'ContactSearch',
    target: 'Nordic Home AB',
    createdAt: '2026-08-11T09:18:00+08:00',
    status: 'success',
    result: '已定位到联系人窗口',
  },
  {
    id: 'TASK-1002',
    type: 'ChatInput',
    target: 'Ocean Retail LLC',
    createdAt: '2026-08-11T09:24:00+08:00',
    status: 'failure',
    result: '外部 UI 输入框未响应，请重试',
  },
  {
    id: 'TASK-1003',
    type: 'MessageSend',
    target: 'Casa Bella',
    createdAt: '2026-08-11T09:38:00+08:00',
    status: 'running',
    result: '正在确认联系人上下文',
  },
];
