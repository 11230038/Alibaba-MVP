import { useMemo, useState } from 'react';
import { Col, Pagination, Row, Select, Space, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import SectionCard from '../components/SectionCard';
import { BusinessCard } from '../components/BusinessCardRenderers';
import { capturedCards } from '../mock/cardData';
import { formatDateTime } from '../utils/time';

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'product', label: '产品卡片' },
  { value: 'inquiry', label: '询盘' },
  { value: 'generic', label: '其他通用卡' },
];

function CardPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => capturedCards.filter((card) => filter === 'all' || card.type === filter), [filter]);
  const pageCards = filtered.slice((page - 1) * pageSize, page * pageSize);
  const handleFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="page-stack aligned-page card-pool-page">
      <SectionCard
        className="aligned-main-card"
        title="业务卡片资产池"
        description="统一沉淀产品、询盘和通用业务卡片，支持按类型快速过滤与分页复核"
        icon={<FilterOutlined />}
        extra={<Select value={filter} options={filterOptions} onChange={handleFilter} style={{ width: 180 }} />}
      >
        <Row gutter={[16, 16]}>
          {pageCards.map((card) => (
            <Col xs={24} lg={12} key={card.id}>
              <Space direction="vertical" className="full-width card-pool-item">
                <Typography.Text type="secondary">{card.id} · 捕获于 {formatDateTime(card.capturedAt)}</Typography.Text>
                <BusinessCard card={card} />
              </Space>
            </Col>
          ))}
        </Row>
        <div className="pagination-wrap">
          <Pagination current={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
        </div>
      </SectionCard>
    </div>
  );
}

export default CardPage;
