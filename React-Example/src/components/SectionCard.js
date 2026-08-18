import { Card, Typography } from 'antd';

function SectionCard({ title, description, extra, children, className = '', icon }) {
  return (
    <Card className={`section-card ${className}`} extra={extra} title={(
      <div className="section-card-header">
        {icon && <div className="section-card-icon">{icon}</div>}
        <div className="section-card-title">
          <Typography.Text strong>{title}</Typography.Text>
          {description && <div className="section-card-description">{description}</div>}
        </div>
      </div>
    )}>
      {children}
    </Card>
  );
}

export default SectionCard;
