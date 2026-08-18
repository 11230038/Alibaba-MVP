import { Button, Card, Descriptions, Image, Space, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined, ShoppingOutlined, TruckOutlined } from '@ant-design/icons';

export function ProductCard({ card }) {
  return (
    <Card className="business-card product-card" size="small">
      <Space align="start">
        <Image width={96} height={72} src={card.image} preview={false} className="product-image" />
        <div>
          <Typography.Text strong>{card.title}</Typography.Text>
          <div className="muted-text">产品 ID：{card.productId}</div>
          <Space wrap>
            <Tag color="blue">{card.price}</Tag>
            <Tag>MOQ {card.moq}</Tag>
          </Space>
        </div>
      </Space>
    </Card>
  );
}

export function InquiryCard({ card }) {
  return (
    <Card className="business-card inquiry-card" size="small" title={<><ShoppingOutlined /> 询盘 {card.inquiryId}</>}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="买家">{card.buyer}</Descriptions.Item>
        <Descriptions.Item label="主题">{card.subject}</Descriptions.Item>
        <Descriptions.Item label="数量">{card.quantity}</Descriptions.Item>
        <Descriptions.Item label="消息">{card.message}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export function GenericCard({ card }) {
  const Icon = card.icon === 'truck' ? TruckOutlined : SafetyCertificateOutlined;
  return (
    <Card className="business-card generic-card" size="small">
      <Space align="start">
        <div className="generic-card-icon"><Icon /></div>
        <div>
          <Typography.Text strong>{card.title}</Typography.Text>
          <div className="muted-text">{card.subtitle}</div>
          <p>{card.body}</p>
          {card.actionUrl && (
            <Button size="small" type="link" href={card.actionUrl} target="_blank" rel="noreferrer">
              查看动作
            </Button>
          )}
        </div>
      </Space>
    </Card>
  );
}

export function BusinessCard({ card }) {
  if (!card) return null;
  if (card.type === 'product') return <ProductCard card={card} />;
  if (card.type === 'inquiry') return <InquiryCard card={card} />;
  return <GenericCard card={card} />;
}
