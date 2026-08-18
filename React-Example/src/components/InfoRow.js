import { Typography } from 'antd';

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text strong>{value || '-'}</Typography.Text>
    </div>
  );
}

export default InfoRow;
