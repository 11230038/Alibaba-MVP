export const groupConversationsByTime = (conversations) => {
  const now = Date.now();
  const buckets = [
    { key: '24h', title: '最近24小时', max: 24 * 60 * 60 * 1000, items: [] },
    { key: '7d', title: '最近7天', max: 7 * 24 * 60 * 60 * 1000, items: [] },
    { key: '30d', title: '最近30天', max: 30 * 24 * 60 * 60 * 1000, items: [] },
    { key: 'older', title: '更早', max: Infinity, items: [] },
  ];

  conversations.forEach((item) => {
    const diff = now - new Date(item.updatedAt).getTime();
    const bucket = buckets.find((group) => diff <= group.max) || buckets[buckets.length - 1];
    bucket.items.push(item);
  });

  return buckets.filter((bucket) => bucket.items.length > 0);
};

export const groupByConversationCount = (conversations) => [
  { title: '高频客户（30+ 条）', items: conversations.filter((item) => item.messageCount >= 30) },
  { title: '活跃客户（10-29 条）', items: conversations.filter((item) => item.messageCount >= 10 && item.messageCount < 30) },
  { title: '低频客户（10 条以下）', items: conversations.filter((item) => item.messageCount < 10) },
].filter((group) => group.items.length > 0);
