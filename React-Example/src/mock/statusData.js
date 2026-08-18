export const systemStatuses = [
  {
    key: 'user',
    name: '用户状态',
    status: 'online',
    detail: '卖家身份已捕获，CRM 会话可读取',
    lastCheck: '2026-08-11T09:42:00+08:00',
  },
  {
    key: 'mitm',
    name: 'MITM 代理',
    status: 'online',
    detail: '127.0.0.1:8080 正常转发，证书链有效',
    lastCheck: '2026-08-11T09:41:00+08:00',
  },
  {
    key: 'receiver',
    name: 'MITM Receiver',
    status: 'warning',
    detail: '最近 5 分钟捕获量偏低，等待新消息进入',
    lastCheck: '2026-08-11T09:40:00+08:00',
  },
];
