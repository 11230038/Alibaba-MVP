import { useState } from 'react';
import { Button, Card, Col, Row, Space, Typography, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import SectionCard from '../components/SectionCard';
import StatusTag from '../components/StatusTag';
import TaskTable from '../components/TaskTable';
import { systemStatuses } from '../mock/statusData';
import { initialTasks } from '../mock/taskData';
import { createMockTask, refreshMockStatuses, runTaskLifecycle } from '../services/mockServices';
import { formatDateTime } from '../utils/time';

function StatusPage() {
  const [statuses, setStatuses] = useState(systemStatuses);
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const refresh = async () => {
    setLoading(true);
    setStatuses(await refreshMockStatuses(statuses));
    setLoading(false);
    messageApi.success('状态检查已完成');
  };

  const startTask = (type) => {
    const task = createMockTask({ type, target: 'Alibaba Seller UI' });
    runTaskLifecycle(task, setTasks, `${type} 测试执行成功`);
  };

  const deleteTask = (id) => {
    setTasks((items) => items.filter((item) => item.id !== id));
    messageApi.success('任务已删除');
  };

  return (
    <div className="page-stack aligned-page status-page">
      {contextHolder}
      <SectionCard className="aligned-main-card" title="运行健康度" description="集中查看身份、代理、Receiver 与任务队列的可用状态" icon={<ReloadOutlined />} extra={<Button loading={loading} icon={<ReloadOutlined />} onClick={refresh}>刷新</Button>}>
        <Row gutter={[16, 16]}>
          {statuses.map((item) => (
            <Col xs={24} md={8} key={item.key}>
              <Card className="status-card aligned-status-card">
                <Space direction="vertical">
                  <Typography.Text strong>{item.name}</Typography.Text>
                  <StatusTag status={item.status} mode="badge" />
                  <Typography.Text type="secondary">{item.detail}</Typography.Text>
                  <Typography.Text type="secondary">最近检查：{formatDateTime(item.lastCheck)}</Typography.Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </SectionCard>
      <SectionCard className="aligned-main-card status-action-card" title="快捷测试动作" description="以 mock 任务验证关键链路，不访问外部 UI" icon={<ClockCircleOutlined />}>
        <Space wrap>
          <Button type="primary" icon={<SendOutlined />} onClick={() => startTask('ChatInput')}>测试 ChatInput 操作</Button>
          <Button icon={<SearchOutlined />} onClick={() => startTask('ContactSearch')}>测试 ContactSearch 操作</Button>
        </Space>
      </SectionCard>
      <SectionCard className="aligned-main-card" title="任务队列" description="等待、执行、成功和失败任务统一展示，便于定位链路状态" icon={<CheckCircleOutlined />}>
        <TaskTable tasks={tasks} onDelete={deleteTask} />
      </SectionCard>
    </div>
  );
}

export default StatusPage;
