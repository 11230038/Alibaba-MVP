export const sellerProfile = {
  id: 'seller-001',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  name: 'Yiwu Global Supply Co.',
  country: '中国 · 浙江义乌',
  status: '已登录 / Healthy',
  aliId: 'ali-2093847561',
  loginId: 'sales@yiwuglobal.example',
  encryptedId: 'enc_u_8x9k2p4m6n',
  company: '义乌环球供应链有限公司',
  industry: '家居百货 / 小商品批发',
  plan: 'Alibaba Supplier Pro',
  lastSync: '2026-08-11T09:42:00+08:00',
};

export const availableSellerAccounts = [
  sellerProfile,
  {
    id: 'seller-002',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    name: 'Hangzhou Smart Trade Ltd.',
    country: '中国 · 浙江杭州',
    status: '可切换 / Standby',
    aliId: 'ali-6672189043',
    loginId: 'ops@smarttrade.example',
    encryptedId: 'enc_u_2h7q9v1x5c',
    company: '杭州智贸科技有限公司',
    industry: '智能家居 / 跨境贸易',
    plan: 'Alibaba Supplier Standard',
    lastSync: '2026-08-11T08:18:00+08:00',
  },
];

export const emptySellerHint = '暂无数据，请先启动 MITM 代理并登录阿里卖家客户端。';
