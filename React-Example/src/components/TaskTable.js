import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Typography } from 'antd';
import StatusTag from './StatusTag';
import { formatDateTime } from '../utils/time';

function TaskTable({ tasks, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDelete = () => {
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    { title: '任务 ID', dataIndex: 'id', width: 120, align: 'center', ellipsis: true },
    { title: '操作类型', dataIndex: 'type', width: 150, align: 'center', ellipsis: true },
    { title: '目标', dataIndex: 'target', align: 'center', ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', render: formatDateTime, width: 150, align: 'center', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusTag status={status} />, width: 100, align: 'center', ellipsis: true },
    { title: '结果', dataIndex: 'result', align: 'center', ellipsis: true, render: (value) => <Typography.Text type="secondary">{value}</Typography.Text> },
    {
      title: '操作',
      width: 100,
      align: 'center',
      ellipsis: true,
      render: (_, record) => <Button danger size="small" icon={<DeleteOutlined />} onClick={() => setDeleteTarget(record)}>删除</Button>,
    },
  ];

  return (
    <>
      <Table rowKey="id" className="unified-data-table" size="middle" columns={columns} dataSource={tasks} pagination={{ pageSize: 5 }} bordered />
      <Modal
        centered
        open={!!deleteTarget}
        title="确认删除任务？"
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        onOk={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="task-delete-modal-content">
          <Typography.Text>删除后该任务会从任务队列中移除。</Typography.Text>
          {deleteTarget && (
            <div className="task-delete-target">
              <Typography.Text strong>{deleteTarget.id}</Typography.Text>
              <Typography.Text type="secondary">{deleteTarget.type} · {deleteTarget.target}</Typography.Text>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default TaskTable;
