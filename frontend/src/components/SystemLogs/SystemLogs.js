import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Divider,
  Tag,
  Badge,
  Tooltip,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  Spin,
  Empty,
  message,
  Dropdown,
  Menu,
  Tabs,
  Timeline,
  Collapse,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
  DownloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteFilled,
  LoginOutlined,
  LogoutOutlined,
  ApiOutlined,
  DatabaseOutlined,
  InboxOutlined,
  ArrowRightOutlined,
  DollarOutlined,
  TagOutlined,
  GlobalOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UserAddOutlined,
  DeleteOutlined as DeleteIcon,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import './SystemLogs.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const SystemLogs = () => {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState({
    actionType: '',
    entityType: '',
    status: '',
    search: '',
    dateRange: [],
  });
  const [summary, setSummary] = useState({
    total: 0,
    success_count: 0,
    error_count: 0,
    action_types: 0,
    entity_types: 0,
  });
  const [actionBreakdown, setActionBreakdown] = useState([]);

  // Theme variables
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // Action type configs
  const actionConfigs = {
    create: { color: '#00b894', icon: <PlusOutlined />, label: 'Created' },
    update: { color: '#fdcb6e', icon: <EditOutlined />, label: 'Updated' },
    delete: { color: '#ff6b6b', icon: <DeleteFilled />, label: 'Deleted' },
    fetch: { color: '#4ecdc4', icon: <SearchOutlined />, label: 'Fetched' },
    login: { color: '#6c5ce7', icon: <LoginOutlined />, label: 'Logged In' },
    logout: { color: '#fd79a8', icon: <LogoutOutlined />, label: 'Logged Out' },
  };

  // Entity type configs
  const entityConfigs = {
    user: { icon: <UserOutlined />, label: 'User', color: '#6c5ce7' },
    invoice: { icon: <FileTextOutlined />, label: 'Invoice', color: '#00b894' },
    quotation: { icon: <FileTextOutlined />, label: 'Quotation', color: '#fdcb6e' },
    task: { icon: <ClockCircleOutlined />, label: 'Task', color: '#4ecdc4' },
    expense: { icon: <DollarOutlined />, label: 'Expense', color: '#ff6b6b' },
    salary: { icon: <DollarOutlined />, label: 'Salary', color: '#fd79a8' },
    employee: { icon: <UserOutlined />, label: 'Employee', color: '#a29bfe' },
    credit_card: { icon: <CreditCardOutlined />, label: 'Credit Card', color: '#fdcb6e' },
    social_media: { icon: <ApiOutlined />, label: 'Social Media', color: '#4ecdc4' },
    backup_code: { icon: <SafetyOutlined />, label: 'Backup Code', color: '#fd79a8' },
    system: { icon: <DatabaseOutlined />, label: 'System', color: '#6c5ce7' },
  };

  const fetchLogs = async (page = 1, pageSize = 50, statusFilter = null) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filters,
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      } else if (filters.status) {
        params.status = filters.status;
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }
      if (filters.actionType) params.actionType = filters.actionType;
      if (filters.entityType) params.entityType = filters.entityType;
      if (filters.search) params.search = filters.search;

      const response = await axios.get('http://localhost:5000/api/system-logs', { params });
      setLogs(response.data.data);
      setPagination({
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.total,
      });
      setSummary(response.data.summary);
      setActionBreakdown(response.data.actionBreakdown);
    } catch (error) {
      console.error('Error fetching logs:', error);
      message.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'errors') {
      fetchLogs(1, 50, 'error');
    } else if (key === 'success') {
      fetchLogs(1, 50, 'success');
    } else {
      fetchLogs(1, 50, null);
    }
  };

  const handleTableChange = (pagination) => {
    const statusFilter = activeTab === 'errors' ? 'error' : activeTab === 'success' ? 'success' : null;
    fetchLogs(pagination.current, pagination.pageSize, statusFilter);
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  const getStatusTag = (status) => {
    if (status === 'success') {
      return <Tag icon={<CheckCircleOutlined />} color="success" style={{ color: '#fff' }}>Success</Tag>;
    } else if (status === 'error') {
      return <Tag icon={<CloseCircleOutlined />} color="error" style={{ color: '#fff' }}>Error</Tag>;
    }
    return <Tag style={{ color: '#fff' }}>{status}</Tag>;
  };

  const getActionTag = (action) => {
    const config = actionConfigs[action] || { color: 'default', icon: null, label: action };
    return <Tag icon={config.icon} color={config.color} style={{ color: '#fff' }}>{config.label}</Tag>;
  };

  const parseActionDetails = (log) => {
    if (!log.action_details) return null;
    
    try {
      const details = typeof log.action_details === 'string' 
        ? JSON.parse(log.action_details) 
        : log.action_details;
      
      if (log.action_type === 'update' && details.changes) {
        return {
          type: 'update_with_changes',
          changes: details.changes,
          fields: details.updatedFields || [],
        };
      }
      
      if (log.action_type === 'create') {
        return {
          type: 'create',
          data: details,
        };
      }
      
      if (log.action_type === 'delete') {
        return {
          type: 'delete',
          data: details,
        };
      }
      
      return {
        type: 'general',
        data: details,
      };
    } catch {
      return {
        type: 'general',
        data: log.action_details,
      };
    }
  };

 const renderChanges = (oldData, newData) => {
  if (!oldData || !newData) return null;
  
  try {
    const oldObj = typeof oldData === 'string' ? JSON.parse(oldData) : oldData;
    const newObj = typeof newData === 'string' ? JSON.parse(newData) : newData;
    
    if (!oldObj || !newObj) return null;
    
    const changes = [];
    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    
    allKeys.forEach(key => {
      // Skip undefined or null keys
      if (!key) return;
      
      const oldVal = oldObj?.[key];
      const newVal = newObj?.[key];
      
      if (oldVal !== newVal && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        changes.push({
          field: key,
          oldValue: oldVal ?? 'N/A',
          newValue: newVal ?? 'N/A',
        });
      }
    });
    
    return changes.length > 0 ? changes : null;
  } catch (error) {
    console.error('Error parsing changes:', error);
    return null;
  }
};

// Find the getFieldLabel function and update it with a safe check:

const getFieldLabel = (field) => {
  // Add this safety check at the beginning
  if (!field) return 'Unknown Field';
  
  const labels = {
    username: 'Username',
    email: 'Email',
    phone_number: 'Phone Number',
    countrycode: 'Country Code',
    nationality: 'Nationality',
    address: 'Address',
    gender: 'Gender',
    date_of_birth: 'Date of Birth',
    business_name: 'Business Name',
    amount: 'Amount',
    price_on_me: 'Price On Me',
    package: 'Package',
    remaining_package: 'Remaining Package',
    plan_date: 'Plan Date',
    is_paid: 'Payment Status',
    text: 'Task Text',
    status: 'Status',
    job_description: 'Job Description',
    salary: 'Salary',
    card_type: 'Card Type',
    card_holder_name: 'Card Holder Name',
    card_number: 'Card Number',
    billing_address: 'Billing Address',
    type: 'Type',
    remaining: 'Remaining',
    country: 'Country',
  };
  
  // Return the label if it exists, otherwise format the field name
  return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

 const getFieldIcon = (field) => {
  if (!field) return <EditOutlined />;
  
  const icons = {
    username: <UserOutlined />,
    email: <MailOutlined />,
    phone_number: <PhoneOutlined />,
    nationality: <GlobalOutlined />,
    address: <HomeOutlined />,
    date_of_birth: <CalendarOutlined />,
    business_name: <TagOutlined />,
    amount: <DollarOutlined />,
    package: <TagOutlined />,
    status: <CheckCircleOutlined />,
    salary: <DollarOutlined />,
  };
  return icons[field] || <EditOutlined />;
};

  const formatValue = (field, value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (field === 'is_paid' || field === 'paid') {
      return value ? 'Paid ✅' : 'Pending ⏳';
    }
    if (field === 'date_of_birth' || field === 'plan_date') {
      return moment(value).format('YYYY-MM-DD');
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (field === 'amount' || field === 'price_on_me' || field === 'salary') {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    return String(value);
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 170,
      render: (text) => (
        <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>
          <div style={{ color: textColor }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {moment(text).format('MMM DD, YYYY')}
            </div>
            <div style={{ fontSize: 11, color: secondaryText }}>
              {moment(text).format('HH:mm:ss')}
            </div>
          </div>
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <Space>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}44, ${accentColor}22)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${accentColor}44`,
          }}>
            <UserOutlined style={{ color: accentColor, fontSize: 14 }} />
          </div>
          <Text style={{ color: textColor, fontWeight: 500 }}>{text || 'System'}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action_type',
      key: 'action_type',
      render: (text, record) => (
        <div>
          {getActionTag(text)}
          <div style={{ fontSize: 11, color: secondaryText, marginTop: 2 }}>
            {entityConfigs[record.entity_type]?.label || record.entity_type}
          </div>
        </div>
      ),
    },
    {
      title: 'Summary',
      key: 'summary',
      render: (_, record) => {
        const parsed = parseActionDetails(record);
        if (record.status === 'error') {
          return (
            <div>
              <Text style={{ color: '#ff6b6b' }}>
                <WarningOutlined style={{ marginRight: 4 }} />
                Error: {record.error_message || 'Operation failed'}
              </Text>
            </div>
          );
        }
        if (parsed?.type === 'update_with_changes' && parsed.changes) {
          const changeSummary = parsed.changes.map(c => 
            `${getFieldLabel(c.field)}: ${formatValue(c.field, c.oldValue)} → ${formatValue(c.field, c.newValue)}`
          ).join(', ');
          return (
            <Tooltip title={changeSummary}>
              <Text style={{ color: textColor, fontSize: 13 }}>
                {parsed.changes.length} field{parsed.changes.length > 1 ? 's' : ''} updated
              </Text>
              <div style={{ fontSize: 11, color: secondaryText, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {changeSummary.slice(0, 60)}...
              </div>
            </Tooltip>
          );
        }
        if (parsed?.type === 'create') {
          const details = parsed.data;
          const keys = Object.keys(details || {}).filter(k => k !== 'id');
          if (keys.length > 0) {
            return (
              <Text style={{ color: textColor, fontSize: 13 }}>
                Created: {keys.slice(0, 2).map(k => `${getFieldLabel(k)}: ${formatValue(k, details[k])}`).join(', ')}
                {keys.length > 2 && ` +${keys.length - 2} more`}
              </Text>
            );
          }
        }
        if (parsed?.type === 'delete') {
          return <Text style={{ color: textColor }}>Deleted record</Text>;
        }
        return <Text style={{ color: secondaryText }}>View details</Text>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => getStatusTag(text),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewLog(record)}
            style={{ 
              color: accentColor,
              background: 'rgba(108,92,231,0.1)',
              borderRadius: '50%',
              width: 36,
              height: 36,
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const renderLogModal = () => (
    <Modal
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={900}
      title={
        <Space>
          <InfoCircleOutlined style={{ color: accentColor, fontSize: 20 }} />
          <span style={{ color: textColor, fontSize: 18, fontWeight: 600 }}>Log Details</span>
          {selectedLog && (
            <Badge 
              status={selectedLog.status === 'success' ? 'success' : 'error'} 
              text={selectedLog.status === 'success' ? 'Success' : 'Error'}
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
        maxHeight: 'calc(90vh - 110px)',
        overflowY: 'auto',
      }}
      className="log-modal"
      width={900}
      centered
    >
      {selectedLog && (
        <div>
          <Card 
            style={{ 
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              marginBottom: 16,
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Row gutter={[16, 8]}>
              <Col span={6}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>Timestamp</Text>
                <div style={{ color: textColor, fontWeight: 500 }}>
                  {moment(selectedLog.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </Col>
              <Col span={6}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>User</Text>
                <div style={{ color: textColor, fontWeight: 500 }}>
                  <UserOutlined style={{ marginRight: 6, color: accentColor }} />
                  {selectedLog.username || 'System'}
                </div>
              </Col>
              <Col span={6}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>IP Address</Text>
                <div style={{ color: textColor, fontWeight: 500 }}>
                  {selectedLog.ip_address || 'N/A'}
                </div>
              </Col>
              <Col span={6}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>Status</Text>
                <div>{getStatusTag(selectedLog.status)}</div>
              </Col>
            </Row>
          </Card>

          {selectedLog.status === 'error' && selectedLog.error_message && (
            <Alert
              message="Error Details"
              description={selectedLog.error_message}
              type="error"
              showIcon
              icon={<CloseCircleOutlined />}
              style={{ 
                marginBottom: 16,
                background: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.2)',
                borderRadius: 8,
              }}
            />
          )}

          <Card 
            style={{ 
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              marginBottom: 16,
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>Action</Text>
                <div style={{ marginTop: 4 }}>
                  {getActionTag(selectedLog.action_type)}
                  <ArrowRightOutlined style={{ margin: '0 8px', color: secondaryText }} />
                  <Tag style={{ 
                    background: 'rgba(108,92,231,0.15)',
                    border: 'none',
                    color: textColor,
                  }}>
                    {entityConfigs[selectedLog.entity_type]?.icon || <FileTextOutlined />}
                    {' '}{entityConfigs[selectedLog.entity_type]?.label || selectedLog.entity_type}
                    {selectedLog.entity_id && <span style={{ color: secondaryText, marginLeft: 4 }}>#{selectedLog.entity_id}</span>}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <Text style={{ color: secondaryText, fontSize: 12 }}>User Agent</Text>
                <div style={{ color: secondaryText, fontSize: 12, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedLog.user_agent || 'N/A'}
                </div>
              </Col>
            </Row>
          </Card>

          {selectedLog.action_type === 'update' && (
            <Card 
              style={{ 
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                marginBottom: 16,
              }}
              title={
                <Space>
                  <EditOutlined style={{ color: '#fdcb6e' }} />
                  <Text strong style={{ color: textColor }}>Changes Made</Text>
                </Space>
              }
              headStyle={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              {(() => {
                const changes = renderChanges(selectedLog.old_data, selectedLog.new_data);
                if (changes && changes.length > 0) {
                  return (
                    <div>
                      {changes.map((change, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 14px',
                            marginBottom: 6,
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: 8,
                            border: `1px solid ${borderColor}`,
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          <div style={{ minWidth: 150, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {getFieldIcon(change.field)}
                            <Text strong style={{ color: textColor }}>{getFieldLabel(change.field)}</Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <Tag 
                              color="red" 
                              style={{ 
                                background: 'rgba(255,107,107,0.15)', 
                                border: 'none', 
                                color: '#ff6b6b',
                                padding: '4px 12px',
                                borderRadius: 6,
                              }}
                            >
                              <CloseOutlined style={{ marginRight: 4 }} />
                              {formatValue(change.field, change.oldValue)}
                            </Tag>
                            <ArrowRightOutlined style={{ color: secondaryText }} />
                            <Tag 
                              color="green" 
                              style={{ 
                                background: 'rgba(0,184,148,0.15)', 
                                border: 'none', 
                                color: '#00b894',
                                padding: '4px 12px',
                                borderRadius: 6,
                              }}
                            >
                              <CheckOutlined style={{ marginRight: 4 }} />
                              {formatValue(change.field, change.newValue)}
                            </Tag>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <Text style={{ color: secondaryText }}>No detailed changes available</Text>
                );
              })()}
            </Card>
          )}

          {selectedLog.action_details && (
            <Card 
              style={{ 
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                marginBottom: 16,
              }}
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: accentColor }} />
                  <Text strong style={{ color: textColor }}>Action Details</Text>
                </Space>
              }
              headStyle={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              {(() => {
                try {
                  const details = typeof selectedLog.action_details === 'string' 
                    ? JSON.parse(selectedLog.action_details) 
                    : selectedLog.action_details;
                  
                  if (details && typeof details === 'object') {
                    const entries = Object.entries(details).filter(([key]) => key !== 'changes' && key !== 'updatedFields');
                    if (entries.length > 0) {
                      return (
                        <div>
                          {entries.map(([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '6px 0',
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              <Text style={{ color: secondaryText }}>{getFieldLabel(key)}:</Text>
                              <Text style={{ color: textColor, fontWeight: 500 }}>
                                {formatValue(key, value)}
                              </Text>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  }
                  return (
                    <pre style={{ color: textColor, margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  );
                } catch {
                  return <Text style={{ color: textColor }}>{String(selectedLog.action_details)}</Text>;
                }
              })()}
            </Card>
          )}

          {(selectedLog.old_data || selectedLog.new_data) && selectedLog.action_type === 'update' && (
            <Row gutter={16}>
              {selectedLog.old_data && (
                <Col span={12}>
                  <Card 
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${borderColor}`,
                      borderRadius: 12,
                    }}
                    title={
                      <Space>
                        <CloseCircleOutlined style={{ color: '#ff6b6b' }} />
                        <Text strong style={{ color: textColor }}>Before</Text>
                      </Space>
                    }
                    headStyle={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}
                    bodyStyle={{ padding: '16px 20px', maxHeight: 300, overflow: 'auto' }}
                  >
                    {(() => {
                      try {
                        const data = typeof selectedLog.old_data === 'string' 
                          ? JSON.parse(selectedLog.old_data) 
                          : selectedLog.old_data;
                        
                        if (data && typeof data === 'object') {
                          const entries = Object.entries(data).filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
                          return entries.map(([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '4px 0',
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              <Text style={{ color: secondaryText }}>{getFieldLabel(key)}:</Text>
                              <Text style={{ color: '#ff6b6b' }}>
                                {formatValue(key, value)}
                              </Text>
                            </div>
                          ));
                        }
                        return <pre style={{ color: textColor, margin: 0, fontSize: 12 }}>{JSON.stringify(data, null, 2)}</pre>;
                      } catch {
                        return <Text style={{ color: textColor }}>{String(selectedLog.old_data)}</Text>;
                      }
                    })()}
                  </Card>
                </Col>
              )}
              {selectedLog.new_data && (
                <Col span={12}>
                  <Card 
                    style={{ 
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${borderColor}`,
                      borderRadius: 12,
                    }}
                    title={
                      <Space>
                        <CheckCircleOutlined style={{ color: '#00b894' }} />
                        <Text strong style={{ color: textColor }}>After</Text>
                      </Space>
                    }
                    headStyle={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}
                    bodyStyle={{ padding: '16px 20px', maxHeight: 300, overflow: 'auto' }}
                  >
                    {(() => {
                      try {
                        const data = typeof selectedLog.new_data === 'string' 
                          ? JSON.parse(selectedLog.new_data) 
                          : selectedLog.new_data;
                        
                        if (data && typeof data === 'object') {
                          const entries = Object.entries(data).filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
                          return entries.map(([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '4px 0',
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              <Text style={{ color: secondaryText }}>{getFieldLabel(key)}:</Text>
                              <Text style={{ color: '#00b894' }}>
                                {formatValue(key, value)}
                              </Text>
                            </div>
                          ));
                        }
                        return <pre style={{ color: textColor, margin: 0, fontSize: 12 }}>{JSON.stringify(data, null, 2)}</pre>;
                      } catch {
                        return <Text style={{ color: textColor }}>{String(selectedLog.new_data)}</Text>;
                      }
                    })()}
                  </Card>
                </Col>
              )}
            </Row>
          )}

          {selectedLog.status === 'error' && selectedLog.error_message && (
            <Alert
              message="Error Details"
              description={selectedLog.error_message}
              type="error"
              showIcon
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginTop: 16,
                background: 'rgba(255,107,107,0.15)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: 8,
              }}
            />
          )}
        </div>
      )}
    </Modal>
  );

  const DarkEmpty = () => (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      background: 'transparent',
    }}>
      <div style={{
        fontSize: 72,
        marginBottom: 24,
        color: 'rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {activeTab === 'errors' ? <CloseCircleOutlined /> : <InboxOutlined />}
      </div>
      <div style={{
        color: textColor,
        fontSize: 20,
        fontWeight: 600,
        marginBottom: 8,
        letterSpacing: '0.5px',
      }}>
        {activeTab === 'errors' ? 'No Error Logs Found' : 'No Logs Found'}
      </div>
      <div style={{
        color: secondaryText,
        fontSize: 14,
        marginBottom: 24,
        maxWidth: 400,
        margin: '0 auto 24px auto',
        lineHeight: 1.6,
      }}>
        {activeTab === 'errors' 
          ? 'Great! No errors have been recorded in the system. All operations are running smoothly.'
          : 'There are no system logs matching your current filters. Try adjusting your search criteria or reset the filters.'}
      </div>
      <Button
        icon={<ReloadOutlined />}
        onClick={() => {
          setFilters({
            actionType: '',
            entityType: '',
            status: '',
            search: '',
            dateRange: [],
          });
          setActiveTab('all');
          fetchLogs(1, 50, null);
        }}
        style={{
          background: 'rgba(108,92,231,0.15)',
          border: `1px solid ${accentColor}44`,
          color: textColor,
          borderRadius: 10,
          padding: '0 32px',
          height: 44,
          fontSize: 14,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(108,92,231,0.25)';
          e.currentTarget.style.borderColor = accentColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(108,92,231,0.15)';
          e.currentTarget.style.borderColor = `${accentColor}44`;
        }}
      >
        <span style={{ marginRight: 8 }}>🔄</span>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      background: bgColor, 
      minHeight: '100vh',
      padding: '30px',
      overflowX: 'hidden',
      width: '100%',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        margin: '0 auto',
        overflowX: 'hidden',
        padding: '0 10px',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <DatabaseOutlined style={{ color: accentColor, marginRight: 12 }} />
                System Logs
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Track all system actions and activities in real-time
              </Text>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    const statusFilter = activeTab === 'errors' ? 'error' : activeTab === 'success' ? 'success' : null;
                    fetchLogs(1, 50, statusFilter);
                  }}
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
                  icon={<DownloadOutlined />}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    borderRadius: 8,
                  }}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Actions</Text>}
                value={summary.total}
                prefix={<DatabaseOutlined style={{ color: accentColor }} />}
                valueStyle={{ color: textColor }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Successful</Text>}
                value={summary.success_count}
                prefix={<CheckCircleOutlined style={{ color: '#00b894' }} />}
                valueStyle={{ color: '#00b894' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Errors</Text>}
                value={summary.error_count}
                prefix={<CloseCircleOutlined style={{ color: '#ff6b6b' }} />}
                valueStyle={{ color: '#ff6b6b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Unique Actions</Text>}
                value={summary.action_types}
                prefix={<ApiOutlined style={{ color: '#fdcb6e' }} />}
                valueStyle={{ color: '#fdcb6e' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for filtering */}
        <div style={{ marginBottom: 16 }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[
              {
                key: 'all',
                label: (
                  <span>
                    <DatabaseOutlined style={{ marginRight: 8 }} />
                    All Logs
                    <Badge 
                      count={summary.total} 
                      style={{ 
                        marginLeft: 8, 
                        background: accentColor,
                        fontSize: 10,
                      }} 
                    />
                  </span>
                ),
              },
              {
                key: 'errors',
                label: (
                  <span>
                    <CloseCircleOutlined style={{ marginRight: 8, color: '#ff6b6b' }} />
                    Error Logs
                    <Badge 
                      count={summary.error_count} 
                      style={{ 
                        marginLeft: 8, 
                        background: '#ff6b6b',
                        fontSize: 10,
                      }} 
                    />
                  </span>
                ),
              },
              {
                key: 'success',
                label: (
                  <span>
                    <CheckCircleOutlined style={{ marginRight: 8, color: '#00b894' }} />
                    Success Logs
                    <Badge 
                      count={summary.success_count} 
                      style={{ 
                        marginLeft: 8, 
                        background: '#00b894',
                        fontSize: 10,
                      }} 
                    />
                  </span>
                ),
              },
            ]}
            style={{ 
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12,
              padding: '0 16px',
              border: `1px solid ${borderColor}`,
            }}
            tabBarStyle={{ 
              borderBottom: `1px solid ${borderColor}`,
              margin: 0,
            }}
          />
        </div>

        {/* Action Breakdown */}
        {actionBreakdown.length > 0 && (
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actionBreakdown.map((item) => (
              <Tag 
                key={item.action_type}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  borderColor: borderColor,
                  color: textColor,
                  padding: '4px 12px',
                  fontSize: 13,
                }}
              >
                {item.action_type}: {item.count}
              </Tag>
            ))}
          </div>
        )}

        {/* Filters */}
        <Card style={{ 
          background: cardBg, 
          border: `1px solid ${borderColor}`, 
          borderRadius: 16, 
          marginBottom: 24,
          boxShadow: cardShadow,
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                prefix={<SearchOutlined style={{ color: secondaryText }} />}
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                placeholder="Action Type"
                value={filters.actionType || undefined}
                onChange={(value) => setFilters({ ...filters, actionType: value })}
                style={{ width: '100%' }}
                dropdownStyle={{ background: inputBg, borderColor: borderColor }}
                allowClear
              >
                <Option value="create">Create</Option>
                <Option value="update">Update</Option>
                <Option value="delete">Delete</Option>
                <Option value="fetch">Fetch</Option>
                <Option value="login">Login</Option>
                <Option value="logout">Logout</Option>
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Select
                placeholder="Entity Type"
                value={filters.entityType || undefined}
                onChange={(value) => setFilters({ ...filters, entityType: value })}
                style={{ width: '100%' }}
                dropdownStyle={{ background: inputBg, borderColor: borderColor }}
                allowClear
              >
                <Option value="user">User</Option>
                <Option value="invoice">Invoice</Option>
                <Option value="quotation">Quotation</Option>
                <Option value="task">Task</Option>
                <Option value="expense">Expense</Option>
                <Option value="salary">Salary</Option>
                <Option value="employee">Employee</Option>
                <Option value="credit_card">Credit Card</Option>
                <Option value="social_media">Social Media</Option>
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Select
                placeholder="Status"
                value={filters.status || undefined}
                onChange={(value) => setFilters({ ...filters, status: value })}
                style={{ width: '100%' }}
                dropdownStyle={{ background: inputBg, borderColor: borderColor }}
                allowClear
              >
                <Option value="success">Success</Option>
                <Option value="error">Error</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <RangePicker
                onChange={(dates) => setFilters({ ...filters, dateRange: dates || [] })}
                style={{ 
                  width: '100%', 
                  background: inputBg, 
                  borderColor: borderColor,
                  color: textColor,
                }}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card style={{ 
          background: cardBg, 
          border: `1px solid ${borderColor}`, 
          borderRadius: 16, 
          overflow: 'hidden',
          boxShadow: cardShadow,
        }}>
          <Spin spinning={loading}>
            <Table
              dataSource={logs}
              columns={columns}
              rowKey="id"
              pagination={pagination}
              onChange={handleTableChange}
              style={{ background: 'transparent' }}
              className="system-logs-table"
              locale={{ emptyText: <DarkEmpty /> }}
              components={{
                empty: () => (
                  <div style={{ padding: '40px 0', background: 'transparent' }}>
                    <DarkEmpty />
                  </div>
                )
              }}
            />
          </Spin>
        </Card>

        {renderLogModal()}
      </div>

      <style>{`
        .system-logs-table .ant-table {
          background: transparent !important;
        }
        .system-logs-table .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.03) !important;
          color: #ffffff !important;
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
          font-weight: 600 !important;
        }
        .system-logs-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: #ffffff !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        }
        .system-logs-table .ant-table-tbody > tr:hover > td {
          background: rgba(108,92,231,0.06) !important;
        }
        .system-logs-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
        .system-logs-table .ant-table-placeholder {
          background: transparent !important;
          border: none !important;
        }
        .system-logs-table .ant-table-placeholder:hover > td {
          background: transparent !important;
        }
        .system-logs-table .ant-table-empty .ant-table-tbody > tr > td {
          border: none !important;
          padding: 0 !important;
        }
        
        .system-logs-table .ant-pagination {
          background: transparent !important;
          padding: 16px 0 !important;
        }
        .system-logs-table .ant-pagination-item {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
        }
        .system-logs-table .ant-pagination-item a {
          color: rgba(255,255,255,0.7) !important;
        }
        .system-logs-table .ant-pagination-item:hover {
          border-color: #6c5ce7 !important;
        }
        .system-logs-table .ant-pagination-item-active {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }
        .system-logs-table .ant-pagination-item-active a {
          color: #fff !important;
        }
        .system-logs-table .ant-pagination-prev button,
        .system-logs-table .ant-pagination-next button {
          color: rgba(255,255,255,0.5) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
          background: transparent !important;
        }
        .system-logs-table .ant-pagination-prev button:hover,
        .system-logs-table .ant-pagination-next button:hover {
          color: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }
        .system-logs-table .ant-pagination-options {
          color: rgba(255,255,255,0.6) !important;
        }
        .system-logs-table .ant-pagination-options .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #ffffff !important;
          border-radius: 8px !important;
        }
        .system-logs-table .ant-pagination-options .ant-select-selector:hover {
          border-color: #6c5ce7 !important;
        }
        .system-logs-table .ant-empty-description {
          color: rgba(255,255,255,0.5) !important;
        }
        
        .log-modal .ant-modal-content {
          background: #0a0a1a !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 16px !important;
        }
        .log-modal .ant-modal-title {
          color: #ffffff !important;
        }
        .log-modal .ant-modal-close {
          color: rgba(255,255,255,0.5) !important;
        }
        .log-modal .ant-modal-close:hover {
          color: #ffffff !important;
        }
        .log-modal .ant-modal-header {
          background: #14142b !important;
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 16px 16px 0 0 !important;
        }
        .log-modal .ant-modal-body {
          background: #0a0a1a !important;
        }
        
        .ant-select-dropdown {
          background: #1a1a35 !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 12px !important;
        }
        .ant-select-dropdown .ant-select-item {
          color: #ffffff !important;
        }
        .ant-select-dropdown .ant-select-item-option-active {
          background: rgba(108,92,231,0.1) !important;
        }
        .ant-select-dropdown .ant-select-item-option-selected {
          background: rgba(108,92,231,0.15) !important;
          color: #6c5ce7 !important;
        }
        
        .ant-picker-panel {
          background: #1a1a35 !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
        }
        .ant-picker-panel .ant-picker-cell-inner {
          color: #ffffff !important;
        }
        .ant-picker-panel .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
          border-color: #6c5ce7 !important;
        }
        .ant-picker-panel .ant-picker-cell-selected .ant-picker-cell-inner {
          background: #6c5ce7 !important;
          color: #fff !important;
        }
        .ant-picker-panel .ant-picker-header {
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        }
        .ant-picker-panel .ant-picker-header button {
          color: #ffffff !important;
        }
        .ant-picker-panel .ant-picker-header-view {
          color: #ffffff !important;
        }
        .ant-picker-panel .ant-picker-cell-disabled .ant-picker-cell-inner {
          color: rgba(255,255,255,0.3) !important;
        }
        
        .ant-tag {
          color: #ffffff !important;
        }
        .ant-tag-success {
          background: rgba(0,184,148,0.2) !important;
          border-color: rgba(0,184,148,0.3) !important;
          color: #00b894 !important;
        }
        .ant-tag-error {
          background: rgba(255,71,87,0.2) !important;
          border-color: rgba(255,71,87,0.3) !important;
          color: #ff6b6b !important;
        }
        .ant-tag-cyan {
          background: rgba(78,205,196,0.2) !important;
          border-color: rgba(78,205,196,0.3) !important;
          color: #4ecdc4 !important;
        }
        .ant-tag-purple {
          background: rgba(108,92,231,0.2) !important;
          border-color: rgba(108,92,231,0.3) !important;
          color: #6c5ce7 !important;
        }
        .ant-tag-gold {
          background: rgba(253,203,110,0.2) !important;
          border-color: rgba(253,203,110,0.3) !important;
          color: #fdcb6e !important;
        }
        .ant-tag-magenta {
          background: rgba(253,121,168,0.2) !important;
          border-color: rgba(253,121,168,0.3) !important;
          color: #fd79a8 !important;
        }
        
        .ant-badge-status-text {
          color: #ffffff !important;
        }
        .ant-badge-status-success {
          background-color: #00b894 !important;
        }
        .ant-badge-status-error {
          background-color: #ff6b6b !important;
        }
        
        .ant-spin-text {
          color: #ffffff !important;
        }
        .ant-spin-dot-item {
          background-color: #6c5ce7 !important;
        }
        
        .ant-divider {
          border-color: rgba(255,255,255,0.06) !important;
        }
        
        .ant-statistic-title {
          color: rgba(255,255,255,0.6) !important;
        }
        .ant-statistic-content {
          color: #ffffff !important;
        }

        .ant-card-head-title {
          color: #ffffff !important;
        }

        .ant-tabs-tab {
          color: ${secondaryText} !important;
        }

        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${accentColor} !important;
        }

        .ant-tabs-ink-bar {
          background: ${accentColor} !important;
        }

        .ant-tabs-tab:hover {
          color: ${textColor} !important;
        }
      `}</style>
    </div>
  );
};

export default SystemLogs;