import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Tag,
  Badge,
  Tooltip,
  Modal,
  Form,
  message,
  Spin,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

// Configure axios defaults
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

const UserTypes = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Theme colors
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // Fetch user types - wrapped in useCallback to prevent recreation
  const fetchUserTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user_type');
      console.log("GET RESPONSE:", response.data);
      setUserTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      
      // More detailed error logging
      if (error.code === 'ERR_NETWORK') {
        message.error('Cannot connect to server. Please check if backend is running on port 5000');
        console.error('Network error - Make sure the backend server is running');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error:', error.response.data);
        message.error(`Server error: ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        message.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
        message.error(`Error: ${error.message}`);
      }
      
      setUserTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use useEffect with fetchUserTypes as dependency
  useEffect(() => {
    fetchUserTypes();
  }, [fetchUserTypes]);

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingType) {
        await api.put(`/user_type/${editingType.id}`, values);
        message.success('User type updated successfully!');
      } else {
        await api.post('/user_type', {
          type: values.type,
          description: values.description
        });
        message.success("User type added successfully");
      }
      setModalVisible(false);
      setEditingType(null);
      form.resetFields();
      await fetchUserTypes();
    } catch (error) {
      console.error('Error saving user type:', error);
      
      if (error.code === 'ERR_NETWORK') {
        message.error('Network error - Cannot connect to server');
      } else if (error.response) {
        message.error(error.response.data?.error || 'Failed to save user type');
      } else {
        message.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = (id, type) => {
    Modal.confirm({
      title: 'Delete User Type',
      content: (
        <div>
          <Text style={{ color: textColor }}>
            Are you sure you want to delete <strong>{type}</strong>?
          </Text>
          <br />
          <Text style={{ color: secondaryText, fontSize: 12 }}>
            This action cannot be undone.
          </Text>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await api.delete(`/user_type/${id}`);
          message.success('User type deleted successfully!');
          await fetchUserTypes();
        } catch (error) {
          console.error('Error deleting user type:', error);
          
          if (error.code === 'ERR_NETWORK') {
            message.error('Network error - Cannot connect to server');
          } else if (error.response) {
            message.error(error.response.data?.error || 'Failed to delete user type');
          } else {
            message.error('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingType(record);
    form.setFieldsValue({
      type: record.type,
      description: record.description,
    });
    setModalVisible(true);
  };

  // Handle batch delete
  const handleBatchDelete = () => {
    Modal.confirm({
      title: 'Delete Selected User Types',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected user type(s)?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await Promise.all(
            selectedRowKeys.map((id) => api.delete(`/user_type/${id}`))
          );
          message.success(`${selectedRowKeys.length} user type(s) deleted successfully!`);
          setSelectedRowKeys([]);
          await fetchUserTypes();
        } catch (error) {
          console.error('Error batch deleting user types:', error);
          
          if (error.code === 'ERR_NETWORK') {
            message.error('Network error - Cannot connect to server');
          } else if (error.response) {
            message.error(error.response.data?.error || 'Failed to delete selected user types');
          } else {
            message.error('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Table columns
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <span style={{ color: secondaryText, fontSize: 12 }}>{index + 1}</span>
      ),
    },
    {
      title: 'User Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <Space>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${accentColor}33`,
          }}>
            <UserOutlined style={{ color: accentColor, fontSize: 14 }} />
          </div>
          <Text strong style={{ color: textColor }}>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.type?.localeCompare(b.type) || 0,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Text style={{ color: secondaryText }}>{text || 'No description'}</Text>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <div>
          <div style={{ color: textColor, fontSize: 13 }}>
            {text ? new Date(text).toLocaleDateString() : 'N/A'}
          </div>
          <div style={{ color: secondaryText, fontSize: 11 }}>
            {text ? new Date(text).toLocaleTimeString() : ''}
          </div>
        </div>
      ),
      sorter: (a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: () => (
        <Badge 
          status="success" 
          text={<span style={{ color: '#00b894' }}>Active</span>}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ 
                color: accentColor,
                background: 'rgba(108,92,231,0.1)',
                borderRadius: '50%',
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.type)}
              style={{ 
                color: '#ff6b6b',
                background: 'rgba(255,107,107,0.1)',
                borderRadius: '50%',
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filtered data
  const filteredData = userTypes.filter((item) =>
    item.type?.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      style: { color: textColor },
    }),
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      background: bgColor, 
      minHeight: '100vh',
      padding: '30px 20px',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <SafetyCertificateOutlined style={{ color: accentColor, marginRight: 12 }} />
                User Types Management
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Manage user roles and permissions for your system
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchUserTypes}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    borderRadius: 8,
                  }}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingType(null);
                    form.resetFields();
                    setModalVisible(true);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                    border: 'none',
                    boxShadow: `0 4px 15px ${accentColor}44`,
                    borderRadius: 8,
                  }}
                >
                  Add User Type
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Types</Text>}
                value={userTypes.length}
                prefix={<SafetyCertificateOutlined style={{ color: accentColor }} />}
                valueStyle={{ color: textColor }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Active Types</Text>}
                value={userTypes.length}
                prefix={<CheckCircleOutlined style={{ color: '#00b894' }} />}
                valueStyle={{ color: '#00b894' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Last Updated</Text>}
                value={userTypes.length > 0 ? 'Today' : 'N/A'}
                prefix={<ClockCircleOutlined style={{ color: '#fdcb6e' }} />}
                valueStyle={{ color: '#fdcb6e' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card style={{ 
          background: cardBg, 
          border: `1px solid ${borderColor}`, 
          borderRadius: 16, 
          overflow: 'hidden',
          boxShadow: cardShadow,
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: `1px solid ${borderColor}`,
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(108,92,231,0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c5ce7',
                fontSize: 18,
                border: '1px solid rgba(108,92,231,0.1)',
              }}>
                <TeamOutlined />
              </div>
              <div>
                <Text strong style={{ color: textColor, fontSize: 16, display: 'block' }}>
                  User Types
                </Text>
                <Text style={{ color: secondaryText, fontSize: 12 }}>
                  {filteredData.length} records found
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Input
                placeholder="Search user types..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined style={{ color: secondaryText }} />}
                style={{
                  width: 220,
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                }}
              />
              {selectedRowKeys.length > 0 && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                  style={{ borderRadius: 8 }}
                >
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              )}
              <Tooltip title="Export">
                <Button
                  icon={<ExportOutlined />}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} types`,
                pageSizeOptions: ['10', '20', '50'],
                style: { 
                  padding: '12px 20px',
                  borderTop: `1px solid ${borderColor}`,
                },
              }}
              style={{ background: 'transparent' }}
              className="user-types-table"
              scroll={{ x: 800 }}
            />
          </Spin>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingType(null);
            form.resetFields();
          }}
          footer={null}
          width={520}
          title={
            <Space>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(108,92,231,0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c5ce7',
                fontSize: 18,
                border: '1px solid rgba(108,92,231,0.1)',
              }}>
                {editingType ? <EditOutlined /> : <PlusOutlined />}
              </div>
              <span style={{ color: textColor, fontSize: 18, fontWeight: 600 }}>
                {editingType ? 'Edit User Type' : 'Add User Type'}
              </span>
            </Space>
          }
          style={{ 
            background: bgColor,
            maxHeight: '90vh',
          }}
          bodyStyle={{ 
            background: bgColor,
            padding: '24px',
          }}
          className="user-type-modal"
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="type"
              label={<Text style={{ color: secondaryText }}>User Type</Text>}
              rules={[
                { required: true, message: 'Please enter a user type' },
                { min: 2, message: 'User type must be at least 2 characters' },
              ]}
            >
              <Input
                placeholder="e.g., super_admin, manager, etc."
                size="large"
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={<Text style={{ color: secondaryText }}>Description</Text>}
            >
              <Input.TextArea
                placeholder="Describe the user type and its permissions"
                rows={3}
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Divider style={{ borderColor: borderColor }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingType(null);
                  form.resetFields();
                }}
                style={{
                  background: 'transparent',
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  borderRadius: 8,
                  padding: '0 30px',
                  height: 40,
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                  border: 'none',
                  boxShadow: `0 4px 15px ${accentColor}44`,
                  borderRadius: 8,
                  padding: '0 30px',
                  height: 40,
                }}
              >
                {editingType ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>

      <style>{`
        .user-types-table .ant-table {
          background: transparent !important;
        }
        .user-types-table .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.02) !important;
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid ${borderColor} !important;
          font-weight: 600 !important;
        }
        .user-types-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .user-types-table .ant-table-tbody > tr:hover > td {
          background: rgba(108,92,231,0.04) !important;
        }
        .user-types-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
        .user-types-table .ant-pagination {
          background: transparent !important;
        }
        .user-types-table .ant-pagination-item {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
        }
        .user-types-table .ant-pagination-item a {
          color: rgba(255,255,255,0.6) !important;
        }
        .user-types-table .ant-pagination-item-active {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .user-types-table .ant-pagination-item-active a {
          color: #fff !important;
        }
        .user-types-table .ant-pagination-prev button,
        .user-types-table .ant-pagination-next button {
          color: rgba(255,255,255,0.4) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
          background: transparent !important;
        }
        .user-types-table .ant-pagination-options {
          color: rgba(255,255,255,0.6) !important;
        }
        .user-types-table .ant-pagination-options .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #fff !important;
          border-radius: 8px !important;
        }
        
        .user-type-modal .ant-modal-content {
          background: #0a0a1a !important;
          border: 1px solid ${borderColor} !important;
          border-radius: 16px !important;
        }
        .user-type-modal .ant-modal-title {
          color: ${textColor} !important;
        }
        .user-type-modal .ant-modal-close {
          color: rgba(255,255,255,0.5) !important;
        }
        .user-type-modal .ant-modal-close:hover {
          color: #fff !important;
        }
        .user-type-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid ${borderColor} !important;
          border-radius: 16px 16px 0 0 !important;
        }
        .user-type-modal .ant-modal-body {
          background: transparent !important;
        }
        
        .ant-checkbox-wrapper {
          color: ${textColor} !important;
        }
        .ant-checkbox-inner {
          background: rgba(255,255,255,0.05) !important;
          border-color: ${borderColor} !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        
        .ant-input,
        .ant-input-textarea {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input::placeholder,
        .ant-input-textarea::placeholder {
          color: ${secondaryText} !important;
        }
        .ant-input:focus,
        .ant-input-textarea:focus {
          border-color: ${accentColor} !important;
          box-shadow: 0 0 0 4px rgba(108,92,231,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default UserTypes;