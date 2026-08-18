import { Badge, Tag } from 'antd';

const statusMap = {
  waiting: { color: 'default', text: '等待中', badge: 'default' },
  running: { color: 'processing', text: '执行中', badge: 'processing' },
  success: { color: 'success', text: '成功', badge: 'success' },
  failure: { color: 'error', text: '失败', badge: 'error' },
  online: { color: 'success', text: '在线', badge: 'success' },
  healthy: { color: 'success', text: '健康', badge: 'success' },
  offline: { color: 'default', text: '离线', badge: 'default' },
  warning: { color: 'warning', text: '注意', badge: 'warning' },
  error: { color: 'error', text: '错误', badge: 'error' },
  active: { color: 'green', text: '活跃', badge: 'success' },
  pending: { color: 'gold', text: '待跟进', badge: 'warning' },
  dormant: { color: 'default', text: '沉睡', badge: 'default' },
};

function StatusTag({ status, mode = 'tag' }) {
  const item = statusMap[status] || { color: 'default', text: status || '未知', badge: 'default' };
  if (mode === 'badge') {
    return <Badge status={item.badge} text={item.text} />;
  }
  return <Tag color={item.color}>{item.text}</Tag>;
}

export default StatusTag;
