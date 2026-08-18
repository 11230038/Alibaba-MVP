import { formatDateTime } from './time';

export const buildConversationExport = ({ conversation, customer, messages }) => {
  const profile = [
    `客户：${conversation.name}`,
    `公司：${conversation.company}`,
    `国家/地区：${customer.identity.country}`,
    `联系人：${customer.contact.email} / ${customer.contact.phone}`,
    `标签：${customer.tags.join('、')}`,
    '--- 聊天记录 ---',
  ].join('\n');

  const rows = messages.map((message) => {
    const role = message.sender === 'seller' ? '卖家' : message.sender === 'buyer' ? '买家' : '系统';
    const text = message.content || message.card?.title || message.card?.subject || '业务卡片';
    const translation = message.translation ? `\n译文：${message.translation}` : '';
    return `[${formatDateTime(message.timestamp)}] ${role}: ${text}${translation}`;
  });

  return `${profile}\n${rows.join('\n')}`;
};

export const downloadTextFile = (fileName, content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
