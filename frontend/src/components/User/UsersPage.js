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
  Avatar,
  Select,
  Descriptions,
  Timeline,
  List,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UserOutlined,
  CrownOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  StarOutlined,
  LockOutlined,
  UserSwitchOutlined,
  SafetyOutlined,
  InboxOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Configure axios defaults
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 [${new Date().toISOString()}] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`📥 [${new Date().toISOString()}] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // Theme colors
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // Fetch user types for dropdown
  const fetchUserTypes = useCallback(async () => {
    try {
      const response = await api.get('/user_type');
      console.log("📋 USER TYPES FETCHED:", response.data);
      const types = Array.isArray(response.data) ? response.data : [];
      setUserTypes(types);
      console.log("✅ User types set:", types.length, "types loaded");
    } catch (error) {
      console.error('Error fetching user types:', error);
      setUserTypes([]);
    }
  }, []);

  // Fetch users from /admins endpoint
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔄 Fetching admins...");
      const response = await api.get('/admins');
      console.log("📋 ADMINS FETCHED:", response.data);
      
      // Ensure we have an array
      const userData = Array.isArray(response.data) ? response.data : [];
      setUsers(userData);
      
      // Calculate stats
      const statsData = {
        total: userData.length,
        active: userData.filter(u => u.status !== 'inactive').length,
        inactive: userData.filter(u => u.status === 'inactive').length,
      };
      setStats(statsData);
      console.log("📊 Stats calculated:", statsData);
      
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.code === 'ERR_NETWORK') {
        message.error('Cannot connect to server. Please check if backend is running on port 5000');
      } else if (error.response) {
        message.error(`Server error: ${error.response.data?.message || 'Unknown error'}`);
      } else {
        message.error('Failed to load admins');
      }
      setUsers([]);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user types on mount
  useEffect(() => {
    fetchUserTypes();
  }, [fetchUserTypes]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      console.log("📝 Submitting form:", values);
      
      if (editingUser) {
        await api.put(`/admins/${editingUser.id}`, values);
        message.success('Admin updated successfully!');
      } else {
        await api.post('/admins', {
          username: values.username,
          password: values.password,
          user_type: values.user_type
        });
        message.success("Admin added successfully");
      }
      
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      await fetchUsers();
    } catch (error) {
      console.error('Error saving admin:', error);
      
      if (error.code === 'ERR_NETWORK') {
        message.error('Network error - Cannot connect to server');
      } else if (error.response) {
        message.error(error.response.data?.message || 'Failed to save admin');
      } else {
        message.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = (id, username) => {
    Modal.confirm({
      title: 'Delete Admin',
      content: (
        <div>
          <Text style={{ color: textColor }}>
            Are you sure you want to delete <strong>{username}</strong>?
          </Text>
          <br />
          <Text style={{ color: secondaryText, fontSize: 12 }}>
            This action cannot be undone. The admin will lose all access.
          </Text>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await api.delete(`/admins/${id}`);
          message.success('Admin deleted successfully!');
          await fetchUsers();
        } catch (error) {
          console.error('Error deleting admin:', error);
          message.error(error.response?.data?.message || 'Failed to delete admin');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      user_type: record.user_type,
    });
    setModalVisible(true);
  };

  // Handle view details
  const handleViewDetails = (record) => {
    setSelectedUser(record);
    setViewModalVisible(true);
  };

  // Handle batch delete
  const handleBatchDelete = () => {
    Modal.confirm({
      title: 'Delete Selected Admins',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected admin(s)?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await Promise.all(
            selectedRowKeys.map((id) => api.delete(`/admins/${id}`))
          );
          message.success(`${selectedRowKeys.length} admin(s) deleted successfully!`);
          setSelectedRowKeys([]);
          await fetchUsers();
        } catch (error) {
          console.error('Error batch deleting admins:', error);
          message.error('Failed to delete selected admins');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Get user type color
  const getUserTypeColor = (type) => {
    const colors = {
      'super_admin': '#ff6b6b',
      'superadmin': '#ff6b6b',
      'admin': '#6c5ce7',
      'manager': '#fdcb6e',
      'support': '#00b894',
      'user': '#74b9ff',
      'guest': '#a29bfe',
    };
    return colors[type] || '#6c5ce7';
  };

  // Get user type icon
  const getUserTypeIcon = (type) => {
    const icons = {
      'super_admin': <CrownOutlined />,
      'superadmin': <CrownOutlined />,
      'admin': <SafetyOutlined />,
      'manager': <StarOutlined />,
      'support': <UserSwitchOutlined />,
      'user': <UserOutlined />,
      'guest': <UserOutlined />,
    };
    return icons[type] || <UserOutlined />;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'active': '#00b894',
      'inactive': '#ff6b6b',
      'pending': '#fdcb6e',
    };
    return colors[status] || '#6c5ce7';
  };

  // Table columns for admins
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
      title: 'Admin',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space size={12}>
          <Avatar 
            style={{ 
              background: `linear-gradient(135deg, ${getUserTypeColor(record.user_type)}, ${getUserTypeColor(record.user_type)}44)`,
              border: `2px solid ${getUserTypeColor(record.user_type)}44`,
            }}
            icon={<UserOutlined />}
          />
          <div>
            <Text strong style={{ color: textColor, display: 'block' }}>{text || 'N/A'}</Text>
            <Text style={{ color: secondaryText, fontSize: 11 }}>ID: {record.id || 'N/A'}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => (a.username || '').localeCompare(b.username || ''),
    },
    {
      title: 'User Type',
      dataIndex: 'user_type',
      key: 'user_type',
      render: (text) => (
        <Tag 
          style={{
            background: `${getUserTypeColor(text)}22`,
            border: `1px solid ${getUserTypeColor(text)}44`,
            color: getUserTypeColor(text),
            borderRadius: 20,
            padding: '4px 16px',
            fontWeight: 500,
          }}
          icon={getUserTypeIcon(text)}
        >
          {text?.replace('_', ' ').toUpperCase() || 'N/A'}
        </Tag>
      ),
      filters: [
        { text: 'Super Admin', value: 'super_admin' },
        { text: 'Superadmin', value: 'superadmin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Support', value: 'support' },
        { text: 'Admin', value: 'admin' },
      ],
      onFilter: (value, record) => record.user_type === value,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <div>
          <div style={{ color: textColor, fontSize: 13 }}>
            {text ? new Date(text).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : 'N/A'}
          </div>
          <div style={{ color: secondaryText, fontSize: 11 }}>
            {text ? new Date(text).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : ''}
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
      width: 120,
      render: () => (
        <Badge 
          status="success" 
          text={
            <span style={{ color: '#00b894' }}>
              Active
            </span>
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ 
                color: '#74b9ff',
                background: 'rgba(116,185,255,0.1)',
                borderRadius: '50%',
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
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
              onClick={() => handleDelete(record.id, record.username)}
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
  const filteredData = users.filter((item) => {
    const matchesSearch = item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                         (item.user_type && item.user_type.toLowerCase().includes(searchText.toLowerCase()));
    const matchesType = filterType === 'all' || item.user_type === filterType;
    return matchesSearch && matchesType;
  });

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      style: { color: textColor },
    }),
  };

  // Custom empty state for dark theme
  const customEmpty = (
    <div style={{ 
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        margin: '0 auto 24px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(108,92,231,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${borderColor}`,
      }}>
        <InboxOutlined style={{ fontSize: 36, color: secondaryText }} />
      </div>
      <Text style={{ 
        color: textColor, 
        fontSize: 18, 
        display: 'block',
        marginBottom: 8,
        fontWeight: 500,
      }}>
        No Admins Found
      </Text>
      <Text style={{ 
        color: secondaryText, 
        fontSize: 14,
        display: 'block',
        marginBottom: 24,
      }}>
        {searchText || filterType !== 'all' 
          ? 'Try adjusting your search or filter criteria'
          : 'Get started by adding your first admin'}
      </Text>
    
      {(searchText || filterType !== 'all') && (
        <Button
          onClick={() => {
            setSearchText('');
            setFilterType('all');
          }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${borderColor}`,
            color: textColor,
            borderRadius: 8,
            padding: '0 30px',
            height: 40,
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      background: bgColor,
      padding: '30px 20px',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <CrownOutlined style={{ color: '#ffd700', marginRight: 12 }} />
                User Management
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Manage system administrators and their roles
              </Text>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchUsers}
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
                    setEditingUser(null);
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
                  Add Admin
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Admins</Text>}
                value={stats.total}
                prefix={<TeamOutlined style={{ color: accentColor }} />}
                valueStyle={{ color: textColor }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Active Admins</Text>}
                value={stats.active}
                prefix={<CheckCircleOutlined style={{ color: '#00b894' }} />}
                valueStyle={{ color: '#00b894' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Last Updated</Text>}
                value={users.length > 0 ? 'Today' : 'N/A'}
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
                <UserOutlined />
              </div>
              <div>
                <Text strong style={{ color: textColor, fontSize: 16, display: 'block' }}>
                  Administrators
                </Text>
                <Text style={{ color: secondaryText, fontSize: 12 }}>
                  {filteredData.length} admins found
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Input
                placeholder="Search admins..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined style={{ color: secondaryText }} />}
                style={{
                  width: 200,
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
                  Delete ({selectedRowKeys.length})
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
                showTotal: (total) => `Total ${total} admins`,
                pageSizeOptions: ['10', '20', '50'],
                style: { 
                  padding: '12px 20px',
                  borderTop: `1px solid ${borderColor}`,
                },
              }}
              style={{ background: 'transparent' }}
              className="users-table"
              locale={{
                emptyText: customEmpty
              }}
            />
          </Spin>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingUser(null);
            form.resetFields();
          }}
          footer={null}
          width={540}
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
                {editingUser ? <EditOutlined /> : <PlusOutlined />}
              </div>
              <span style={{ color: textColor, fontSize: 18, fontWeight: 600 }}>
                {editingUser ? 'Edit Admin' : 'Add New Admin'}
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
          className="user-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              label={<Text style={{ color: secondaryText }}>Username</Text>}
              rules={[
                { required: true, message: 'Please enter a username' },
                { min: 3, message: 'Username must be at least 3 characters' },
              ]}
            >
              <Input
                placeholder="Enter username"
                size="large"
                prefix={<UserOutlined style={{ color: secondaryText }} />}
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label={<Text style={{ color: secondaryText }}>Password</Text>}
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  placeholder="Enter password"
                  size="large"
                  prefix={<LockOutlined style={{ color: secondaryText }} />}
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Form.Item>
            )}

            <Form.Item
              name="user_type"
              label={<Text style={{ color: secondaryText }}>User Type</Text>}
              rules={[{ required: true, message: 'Please select a user type' }]}
            >
              <Select
                size="large"
                placeholder="Select user type"
                style={{
                  background: inputBg,
                  borderRadius: 8,
                }}
                dropdownStyle={{
                  background: bgColor,
                  borderColor: borderColor,
                }}
              >
                {userTypes.map((type) => (
                  <Option key={type.id} value={type.type} style={{ color: textColor }}>
                    <Space>
                      {getUserTypeIcon(type.type)}
                      <span>{type.type?.replace('_', ' ').toUpperCase()}</span>
                      <Text style={{ color: secondaryText, fontSize: 11 }}>
                        - {type.description || 'No description'}
                      </Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider style={{ borderColor: borderColor }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingUser(null);
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
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* View Details Modal */}
        <Modal
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setSelectedUser(null);
          }}
          footer={null}
          width={700}
          title={
            <Space>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${selectedUser ? getUserTypeColor(selectedUser.user_type) : accentColor}33, ${selectedUser ? getUserTypeColor(selectedUser.user_type) : accentColor}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedUser ? getUserTypeColor(selectedUser.user_type) : accentColor,
                fontSize: 18,
                border: `1px solid ${selectedUser ? getUserTypeColor(selectedUser.user_type) : accentColor}44`,
              }}>
                {selectedUser ? getUserTypeIcon(selectedUser.user_type) : <UserOutlined />}
              </div>
              <span style={{ color: textColor, fontSize: 18, fontWeight: 600 }}>
                {selectedUser?.username || 'Admin Details'}
              </span>
              {selectedUser && (
                <Badge 
                  status="success" 
                  text={
                    <span style={{ color: '#00b894', fontSize: 12 }}>
                      Active
                    </span>
                  }
                />
              )}
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
          className="view-modal"
          closeIcon={<CloseOutlined style={{ color: secondaryText }} />}
        >
          {selectedUser && (
            <>
              {/* User Header Card */}
              <Card style={{ 
                background: cardBg, 
                border: `1px solid ${borderColor}`, 
                borderRadius: 16,
                marginBottom: 24,
                boxShadow: cardShadow,
              }}>
                <Row gutter={24} align="middle">
                  <Col>
                    <Avatar 
                      size={80}
                      style={{ 
                        background: `linear-gradient(135deg, ${getUserTypeColor(selectedUser.user_type)}, ${getUserTypeColor(selectedUser.user_type)}44)`,
                        border: `3px solid ${getUserTypeColor(selectedUser.user_type)}44`,
                      }}
                      icon={<UserOutlined />}
                    />
                  </Col>
                  <Col flex="1">
                    <Title level={3} style={{ color: textColor, marginBottom: 4 }}>
                      {selectedUser.username}
                    </Title>
                    <Text style={{ color: secondaryText }}>
                      Admin ID: {selectedUser.id}
                    </Text>
                    <br />
                    <Tag 
                      style={{
                        background: `${getUserTypeColor(selectedUser.user_type)}22`,
                        border: `1px solid ${getUserTypeColor(selectedUser.user_type)}44`,
                        color: getUserTypeColor(selectedUser.user_type),
                        borderRadius: 20,
                        padding: '2px 12px',
                        marginTop: 8,
                      }}
                      icon={getUserTypeIcon(selectedUser.user_type)}
                    >
                      {selectedUser.user_type?.replace('_', ' ').toUpperCase()}
                    </Tag>
                  </Col>
                  <Col>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setViewModalVisible(false);
                        handleEdit(selectedUser);
                      }}
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                        border: 'none',
                        color: '#fff',
                        borderRadius: 8,
                      }}
                    >
                      Edit Admin
                    </Button>
                  </Col>
                </Row>
              </Card>

              {/* Details Grid */}
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card style={{ 
                    background: cardBg, 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: 16,
                    boxShadow: cardShadow,
                    height: '100%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <InfoCircleOutlined style={{ color: accentColor, fontSize: 18 }} />
                      <Text strong style={{ color: textColor, fontSize: 16 }}>Basic Information</Text>
                    </div>
                    <Divider style={{ borderColor: borderColor, margin: '12px 0' }} />
                    
                    <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>ID</Text>
                        <Text style={{ color: textColor, fontSize: 14 }}>{selectedUser.id}</Text>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>Username</Text>
                        <Text style={{ color: textColor, fontSize: 14 }}>{selectedUser.username}</Text>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>User Type</Text>
                        <Text style={{ color: textColor, fontSize: 14 }}>{selectedUser.user_type}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card style={{ 
                    background: cardBg, 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: 16,
                    boxShadow: cardShadow,
                    height: '100%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <CalendarOutlined style={{ color: accentColor, fontSize: 18 }} />
                      <Text strong style={{ color: textColor, fontSize: 16 }}>Timeline</Text>
                    </div>
                    <Divider style={{ borderColor: borderColor, margin: '12px 0' }} />
                    
                    <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>Created At</Text>
                        <Text style={{ color: textColor, fontSize: 14 }}>
                          {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </Text>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>Status</Text>
                        <Badge 
                          status="success" 
                          text={
                            <span style={{ color: '#00b894', fontSize: 14 }}>
                              Active
                            </span>
                          }
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text style={{ color: secondaryText, fontSize: 12, display: 'block' }}>Last Updated</Text>
                        <Text style={{ color: textColor, fontSize: 14 }}>Today</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Footer Actions */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 12,
                marginTop: 24,
                paddingTop: 16,
                borderTop: `1px solid ${borderColor}`,
              }}>
                <Button
                  onClick={() => {
                    setViewModalVisible(false);
                    setSelectedUser(null);
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
                  Close
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setViewModalVisible(false);
                    handleEdit(selectedUser);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                    border: 'none',
                    boxShadow: `0 4px 15px ${accentColor}44`,
                    borderRadius: 8,
                    padding: '0 30px',
                    height: 40,
                    color: '#fff',
                  }}
                >
                  Edit Admin
                </Button>
              </div>
            </>
          )}
        </Modal>
      </div>

      <style>{`
        .users-table .ant-table {
          background: transparent !important;
        }
        .users-table .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.02) !important;
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid ${borderColor} !important;
          font-weight: 600 !important;
        }
        .users-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .users-table .ant-table-tbody > tr:hover > td {
          background: rgba(108,92,231,0.04) !important;
        }
        .users-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
        .users-table .ant-pagination {
          background: transparent !important;
        }
        .users-table .ant-pagination-item {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
        }
        .users-table .ant-pagination-item a {
          color: rgba(255,255,255,0.6) !important;
        }
        .users-table .ant-pagination-item-active {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .users-table .ant-pagination-item-active a {
          color: #fff !important;
        }
        .users-table .ant-pagination-prev button,
        .users-table .ant-pagination-next button {
          color: rgba(255,255,255,0.4) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
          background: transparent !important;
        }
        .users-table .ant-pagination-options {
          color: rgba(255,255,255,0.6) !important;
        }
        .users-table .ant-pagination-options .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #fff !important;
          border-radius: 8px !important;
        }
        .users-table .ant-select-selector {
          background: transparent !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .users-table .ant-select-arrow {
          color: ${secondaryText} !important;
        }
        
        .user-modal .ant-modal-content,
        .view-modal .ant-modal-content {
          background: #0a0a1a !important;
          border: 1px solid ${borderColor} !important;
          border-radius: 16px !important;
        }
        .user-modal .ant-modal-title,
        .view-modal .ant-modal-title {
          color: ${textColor} !important;
        }
        .user-modal .ant-modal-close,
        .view-modal .ant-modal-close {
          color: rgba(255,255,255,0.5) !important;
        }
        .user-modal .ant-modal-close:hover,
        .view-modal .ant-modal-close:hover {
          color: #fff !important;
        }
        .user-modal .ant-modal-header,
        .view-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid ${borderColor} !important;
          border-radius: 16px 16px 0 0 !important;
        }
        .user-modal .ant-modal-body,
        .view-modal .ant-modal-body {
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
        .ant-input-password,
        .ant-input-textarea,
        .ant-select-selector {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input::placeholder,
        .ant-input-password input::placeholder {
          color: ${secondaryText} !important;
        }
        .ant-input:focus,
        .ant-input-password:focus-within,
        .ant-input-textarea:focus-within,
        .ant-select-focused .ant-select-selector {
          border-color: ${accentColor} !important;
          box-shadow: 0 0 0 4px rgba(108,92,231,0.1) !important;
        }
        .ant-select-selection-item {
          color: ${textColor} !important;
        }
        .ant-select-item-option {
          background: ${bgColor} !important;
          color: ${textColor} !important;
        }
        .ant-select-item-option:hover {
          background: ${inputBg} !important;
        }
        .ant-select-item-option-selected {
          background: ${accentColor}22 !important;
        }

        /* Empty state dark theme overrides */
        .users-table .ant-empty {
          margin: 0 !important;
        }
        .users-table .ant-empty-image {
          display: none !important;
        }
        .users-table .ant-empty-description {
          display: none !important;
        }

        /* View modal scroll */
        .view-modal .ant-modal-body {
          max-height: 70vh;
          overflow-y: auto;
        }
        .view-modal .ant-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .view-modal .ant-modal-body::-webkit-scrollbar-track {
          background: ${bgColor};
        }
        .view-modal .ant-modal-body::-webkit-scrollbar-thumb {
          background: ${borderColor};
          border-radius: 3px;
        }
        .view-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: ${accentColor}44;
        }
      `}</style>
    </div>
  );
};

export default UsersPage;