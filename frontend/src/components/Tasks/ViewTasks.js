import React, { useState, useEffect, useMemo } from 'react';
import { Table, Space, Button, message, Card, Typography, Tag, Tabs, Popconfirm } from 'antd';
import axios from 'axios';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  UndoOutlined,
  ExclamationCircleOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // === UNIFIED DARK THEME ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/viewtasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Error fetching tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
  
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const response = await axios.put(`http://localhost:5000/updateTaskStatus/${taskId}`, { status: newStatus });
      
      if (response.status === 200) {
        message.success(`Task successfully marked as ${newStatus}.`);
      } else {
        setTasks(previousTasks);
        message.error('Server returned an error. Reverted changes.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setTasks(previousTasks);
      message.error('Failed to update task status. Network error.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-task/${taskId}`);
      if (response.status === 200) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        message.success('Task deleted successfully.');
      }
    } catch (error) {
      message.error('Failed to delete task.');
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/EditTask/${taskId}`);
  };

  const pendingTasks = useMemo(() => tasks.filter(task => task.status === 'Pending'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.status === 'Done'), [tasks]);

  const pendingColumns = [
    { 
      title: 'Task', 
      dataIndex: 'text', 
      key: 'text',
      render: (text) => <span style={{ color: textColor, fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Created',
      key: 'date',
      dataIndex: 'date',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      render: (text) => <Tag style={{ background: inputBg, borderColor: borderColor, color: textColor }}>{formatDate(text)}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (text, record) => (
        <Space wrap size="small">
          <Button 
            type="primary"
            onClick={() => updateTaskStatus(record.id, 'Done')}
            icon={<CheckCircleOutlined />}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
              border: "none",
              boxShadow: `0 2px 8px ${accentColor}44`,
              borderRadius: 6,
              fontSize: '12px',
              height: 32,
            }}
          >
            Mark Done
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            style={{
              background: 'rgba(255, 193, 7, 0.15)',
              border: `1px solid rgba(255, 193, 7, 0.3)`,
              color: '#ffc107',
              borderRadius: 6,
              height: 32,
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this task?"
            description="This action cannot be undone."
            onConfirm={() => deleteTask(record.id)}
            okText="Delete"
            cancelText="Cancel"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            okButtonProps={{ danger: true }}
          >
            <Button 
              icon={<DeleteOutlined />}
              danger
              style={{ borderRadius: 6, height: 32, width: 32 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const completedColumns = [
    { 
      title: 'Task', 
      dataIndex: 'text', 
      key: 'text',
      render: (text) => <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through' }}>{text}</span>
    },
    {
      title: 'Completed On',
      key: 'date',
      dataIndex: 'date',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      render: (text) => <Tag color="success" style={{ background: 'rgba(0, 184, 148, 0.2)', border: 'none', color: '#00b894' }}>{formatDate(text)}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (text, record) => (
        <Space wrap size="small">
          <Button 
            onClick={() => updateTaskStatus(record.id, 'Pending')}
            icon={<UndoOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${borderColor}`,
              color: textColor,
              borderRadius: 6,
              height: 32,
            }}
          >
            Restore
          </Button>
          <div style={{ display: 'inline-block' }}>
            <Popconfirm
              title="Delete this task?"
              description="This action cannot be undone."
              onConfirm={() => deleteTask(record.id)}
              okText="Delete"
              cancelText="Cancel"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              okButtonProps={{ danger: true }}
            >
              <Button 
                icon={<DeleteOutlined />}
                danger
                style={{ borderRadius: 6, height: 32, width: 32 }}
              />
            </Popconfirm>
          </div>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: <span style={{ color: textColor }}><ClockCircleOutlined /> Pending ({pendingTasks.length})</span>,
      children: (
        <Table
          dataSource={pendingTasks}
          columns={pendingColumns}
          pagination={{ pageSize: 10, size: 'small' }}
          rowKey="id"
          className="dark-table"
          loading={loading}
          scroll={{ x: 'max-content' }} 
        />
      ),
    },
    {
      key: '2',
      label: <span style={{ color: textColor }}><CheckCircleOutlined /> Completed ({completedTasks.length})</span>,
      children: (
        <Table
          dataSource={completedTasks}
          columns={completedColumns}
          pagination={{ pageSize: 10, size: 'small' }}
          rowKey="id"
          className="dark-table"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: bgColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "0",
      margin: 0,
      boxSizing: "border-box",
    }}>
      <div style={{ width: "100%", maxWidth: "100%", padding: "20px 24px" }}>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "16px",
          gap: "10px"
        }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              Task Management
            </Title>
            <Text style={{ color: secondaryText, fontSize: 13 }}>Manage your workflow efficiently.</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/CreateTasks')}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
              border: "none",
              boxShadow: `0 4px 15px ${accentColor}44`,
              borderRadius: 6,
              height: 36,
            }}
          >
            New Task
          </Button>
        </div>

        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            boxShadow: cardShadow,
            overflow: "hidden",
            width: "100%"
          }}
          bodyStyle={{ padding: "16px 12px" }}
        >
          <Tabs 
            defaultActiveKey="1" 
            items={items} 
            type="line"
            style={{ color: textColor }}
            tabBarStyle={{ color: textColor, borderBottom: `1px solid ${borderColor}`, marginBottom: 12 }}
            size="middle"
          />
        </Card>
        
      </div>

      <style>{`
        .dark-table .ant-table {
          background-color: transparent !important;
          color: ${textColor} !important;
        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background-color: ${inputBg} !important;
          color: ${textColor} !important;
          font-weight: 600;
          border-bottom: 1px solid ${borderColor} !important;
          padding: 10px 12px !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          background-color: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
          padding: 10px 12px !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(108, 92, 231, 0.08) !important;
          color: ${textColor} !important;
        }

        .dark-table .ant-table-placeholder {
          background-color: ${inputBg} !important;
          border: none !important;
        }
        .dark-table .ant-empty-description {
          color: ${textColor} !important;
        }
        .dark-table .ant-empty-image svg {
          fill: ${textColor} !important;
          opacity: 0.5 !important;
        }
        
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${accentColor} !important;
        }
        .ant-tabs-ink-bar {
          background: ${accentColor} !important;
        }
        
        .ant-table-thead > tr > th {
          color: ${textColor} !important;
        }
        .ant-table-column-sorter {
          color: ${textColor} !important;
        }
        .ant-pagination-item a {
          color: ${textColor} !important;
        }
        .ant-pagination-item-active {
          background-color: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-pagination-item-active a {
          color: #ffffff !important;
        }

        @media (max-width: 768px) {
          .ant-tabs-nav {
            margin-bottom: 8px !important;
          }
          .ant-table-pagination.ant-pagination {
            margin: 8px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewTasks;