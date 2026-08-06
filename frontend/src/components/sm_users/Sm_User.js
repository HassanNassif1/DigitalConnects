import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Card,
  Tooltip,
  notification,
  Space,
  Modal,
  Select,
  Form,
  DatePicker,
  Avatar,
  Badge,
  Divider,
  Row,
  Col,
  Statistic,
  Spin,
  Typography,
  Popconfirm
} from "antd";
import axios from "axios";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import maleImage from "./male.jpg";
import otherImage from "./other.jpg";
import femaleImage from "./female.jpg";
import countriesData from "./countries.json";
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UserAddOutlined,
  TeamOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  InboxOutlined,
  StarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

// Base API URL - change this to match your backend
const API_BASE_URL = "http://localhost:5000/api";

const Sm_User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { isDarkMode } = useDarkMode();
  const [countClients, setCountClients] = useState(0);
  const navigate = useNavigate();

  // ===== EDIT MODAL STATES =====
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();
  const [countries, setCountries] = useState([]);

  // Theme colors
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  useEffect(() => {
    setCountries(countriesData);
  }, []);

  const countUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/count`);
      setCountClients(response.data.user_count || response.data.count || 0);
    } catch (error) {
      console.error("Error fetching user count:", error);
      // Try alternative endpoint
      try {
        const response = await axios.get(`${API_BASE_URL}/userscount`);
        setCountClients(response.data.user_count || 0);
      } catch (e) {
        console.error("Both count endpoints failed:", e);
      }
    }
  };

  const fetchClient = async () => {
    setLoading(true);
    try {
      // Try multiple possible endpoints
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/users`);
      } catch (e) {
        try {
          response = await axios.get(`${API_BASE_URL}/clients`);
        } catch (e2) {
          response = await axios.get(`${API_BASE_URL}/get-users`);
        }
      }
      
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Data Fetch Error",
        description: "Could not retrieve client lists from server. Please check your API endpoints.",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
    countUsers();
  }, []);

  const handleOpenEditModal = (record) => {
    setEditingUser(record);
    editForm.setFieldsValue({
      username: record.username,
      nationality: record.nationality,
      business_name: record.business_name,
      address: record.address,
      phonenumber: record.phonenumber,
      countrycode: record.countrycode,
      date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      
      const dob = values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null;

      const updateData = {
        user_id: editingUser.id,
        username: values.username,
        nationality: values.nationality,
        business_name: values.business_name,
        address: values.address,
        phonenumber: values.phonenumber,
        countrycode: values.countrycode,
        date_of_birth: dob,
      };

      // Try multiple endpoints for update
      try {
        await axios.put(`${API_BASE_URL}/users/${editingUser.id}`, updateData);
      } catch (e) {
        await axios.put(`${API_BASE_URL}/update-client-profile`, updateData);
      }

      notification.success({
        message: "Success",
        description: `${values.username}'s profile updated successfully.`,
      });

      setIsEditModalVisible(false);
      fetchClient();

    } catch (error) {
      console.error("Error updating user:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.error || "Failed to update profile. Please try again.",
      });
    }
  };

  // ===== FIXED DELETE FUNCTION =====
  const handleDelete = async (id) => {
    try {
      // Try multiple possible delete endpoints
      const endpoints = [
        `${API_BASE_URL}/users/${id}`,
        `${API_BASE_URL}/clients/${id}`,
        `${API_BASE_URL}/delete-user/${id}`,
        `${API_BASE_URL}/delete-user-completely/${id}`,
      ];

      let success = false;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await axios.delete(endpoint);
          if (response.status === 200 || response.status === 204) {
            success = true;
            break;
          }
        } catch (e) {
          lastError = e;
          // Continue to next endpoint
        }
      }

      if (success) {
        notification.success({
          message: "Success",
          description: "Client deleted successfully.",
        });
        fetchClient();
        countUsers();
      } else {
        throw lastError || new Error("All delete endpoints failed");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      notification.error({
        message: "Delete Failed",
        description: error.response?.data?.message || "Could not delete the client. Please try again.",
      });
    }
  };

  // ===== FIXED BATCH DELETE =====
  const handleBatchDelete = async () => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: 'Confirm Batch Delete',
        icon: <ExclamationCircleOutlined style={{ color: '#ff6b6b' }} />,
        content: `Are you sure you want to delete ${selectedRowKeys.length} selected client(s)? This action cannot be undone.`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) return;

    try {
      // Try batch delete endpoint
      await axios.post(`${API_BASE_URL}/users/batch-delete`, {
        userIds: selectedRowKeys
      });
      
      setSelectedRowKeys([]);
      fetchClient();
      countUsers();
      notification.success({
        message: "Batch Delete Success",
        description: `Successfully deleted ${selectedRowKeys.length} selected clients.`,
      });
    } catch (error) {
      console.error("Batch delete error:", error);
      
      // Fallback: delete one by one
      try {
        let successCount = 0;
        for (const id of selectedRowKeys) {
          try {
            const endpoints = [
              `${API_BASE_URL}/users/${id}`,
              `${API_BASE_URL}/clients/${id}`,
              `${API_BASE_URL}/delete-user/${id}`,
              `${API_BASE_URL}/delete-user-completely/${id}`,
            ];
            
            for (const endpoint of endpoints) {
              try {
                const response = await axios.delete(endpoint);
                if (response.status === 200 || response.status === 204) {
                  successCount++;
                  break;
                }
              } catch (e) {
                // Continue to next endpoint
              }
            }
          } catch (e) {
            console.error(`Failed to delete user ${id}:`, e);
          }
        }
        
        setSelectedRowKeys([]);
        fetchClient();
        countUsers();
        
        if (successCount > 0) {
          notification.success({
            message: "Batch Delete Success",
            description: `Successfully deleted ${successCount} out of ${selectedRowKeys.length} selected clients.`,
          });
        } else {
          notification.error({
            message: "Batch Delete Error",
            description: "Failed to delete all selected records.",
          });
        }
      } catch (fallbackError) {
        notification.error({
          message: "Batch Delete Error",
          description: "Failed to delete some or all selected records.",
        });
      }
    }
  };

  const handleExportData = () => {
    if (filteredData.length === 0) {
      notification.warning({
        message: "No Data",
        description: "There is no data to export.",
      });
      return;
    }

    const headers = ["ID", "Username", "Nationality", "Date of Birth", "Email", "Phone Number", "Country Code", "Gender", "Address", "Business Name", "Is Verified"];
    const rows = filteredData.map(u => [
      u.id, 
      u.username || '', 
      u.nationality || '', 
      u.date_of_birth || '', 
      u.email || '', 
      u.phonenumber || '', 
      u.countrycode || '', 
      u.gender || '', 
      u.address || '', 
      u.business_name || '', 
      u.isverified ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const customEmpty = () => (
    <div style={{ 
      padding: '60px 20px',
      textAlign: 'center',
      background: 'transparent',
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
        No Clients Found
      </Text>
      <Text style={{ 
        color: secondaryText, 
        fontSize: 14,
        display: 'block',
        marginBottom: 24,
      }}>
        {searchText 
          ? 'Try adjusting your search criteria'
          : 'Get started by adding your first client'}
      </Text>
      {searchText && (
        <Button
          onClick={() => setSearchText('')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${borderColor}`,
            color: textColor,
            borderRadius: 8,
            padding: '0 30px',
            height: 40,
          }}
        >
          Clear Search
        </Button>
      )}
      {!searchText && (
        <Button
          onClick={() => navigate('/CreateUser')}
          type="primary"
          icon={<UserAddOutlined />}
          style={{
            background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
            border: 'none',
            boxShadow: `0 4px 15px ${accentColor}44`,
            borderRadius: 8,
            padding: '0 30px',
            height: 40,
          }}
        >
          Add New Client
        </Button>
      )}
    </div>
  );

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
      title: "Client",
      key: "client",
      width: 250,
      render: (text, record) => {
        const gender = record.gender;
        const defaultImage =
          gender === "male"
            ? maleImage
            : gender === "female"
            ? femaleImage
            : otherImage;
        return (
          <Space size={12}>
            <Avatar 
              size={40}
              src={record.image || defaultImage}
              style={{ 
                border: `2px solid ${accentColor}44`,
              }}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong style={{ color: textColor, display: 'block' }}>{record.username || 'N/A'}</Text>
              <Text style={{ color: secondaryText, fontSize: 11 }}>ID: {record.id}</Text>
            </div>
          </Space>
        );
      },
      sorter: (a, b) => (a.username || '').localeCompare(b.username || ''),
    },
    {
      title: "Business Name",
      dataIndex: "business_name",
      key: "business_name",
      render: (text) => <Text style={{ color: secondaryText }}>{text || "N/A"}</Text>,
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      render: (text) => <Text style={{ color: secondaryText }}>{text || "N/A"}</Text>,
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (text) => (
        <div>
          <div style={{ color: textColor, fontSize: 13 }}>
            {text ? new Date(text).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text style={{ color: secondaryText }}>{text || "N/A"}</Text>,
    },
    {
      title: "Contact Info",
      key: "contact",
      render: (text, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ color: textColor, fontSize: 13 }}>
            <PhoneOutlined style={{ color: accentColor, marginRight: 6 }} />
            {record.countrycode ? `+${record.countrycode}` : ''} {record.phonenumber || 'N/A'}
          </Text>
          {record.isverified && (
            <Badge 
              status="success" 
              text={<span style={{ color: '#00b894', fontSize: 11 }}>Verified</span>}
            />
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (text, record) => {
        const isVerified = record.isverified;
        return (
          <Badge 
            status={isVerified ? "success" : "default"} 
            text={
              <span style={{ color: isVerified ? '#00b894' : secondaryText }}>
                {isVerified ? 'Active' : 'Inactive'}
              </span>
            }
          />
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      align: "center",
      render: (text, record) => {
        const whatsappLink = record.phonenumber && record.countrycode 
          ? `https://wa.me/${record.countrycode}${record.phonenumber}` 
          : '#';

        return (
          <Space size="small">
            <Tooltip title="View Details">
              <Button
                onClick={() => handleViewDetails(record.id)}
                icon={<EyeOutlined />}
                style={{ 
                  color: '#74b9ff',
                  background: 'rgba(116,185,255,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  border: 'none',
                }}
              />
            </Tooltip>
            
            <Tooltip title="Edit Client">
              <Button
                onClick={() => handleOpenEditModal(record)}
                icon={<EditOutlined />}
                style={{ 
                  color: accentColor,
                  background: 'rgba(108,92,231,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  border: 'none',
                }}
              />
            </Tooltip>

            {record.phonenumber && record.countrycode && (
              <Tooltip title="WhatsApp Chat">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    style={{ 
                      color: '#25D366',
                      background: 'rgba(37,211,102,0.1)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      border: 'none',
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </Button>
                </a>
              </Tooltip>
            )}
            
            <Tooltip title="Delete Client">
              <Popconfirm
                title="Delete Client"
                description={`Are you sure you want to delete "${record.username}"?`}
                onConfirm={() => handleDelete(record.id)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                placement="topRight"
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ 
                    color: '#ff6b6b',
                    background: 'rgba(255,107,107,0.1)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const filteredData = data.filter((item) =>
    item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nationality?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.business_name?.toLowerCase().includes(searchText.toLowerCase())
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <TeamOutlined style={{ color: accentColor, marginRight: 12 }} />
                Client Management
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Manage your clients and their information
              </Text>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => { fetchClient(); countUsers(); }}
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
                onClick={() => navigate('/CreateUser')}
                type="primary"
                icon={<UserAddOutlined />}
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                  border: 'none',
                  boxShadow: `0 4px 15px ${accentColor}44`,
                  borderRadius: 8,
                }}
              >
                New Client
              </Button>
            </Space>
          </div>
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
                title={<Text style={{ color: secondaryText }}>Total Clients</Text>}
                value={countClients}
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
                title={<Text style={{ color: secondaryText }}>Verified Clients</Text>}
                value={data.filter(d => d.isverified).length}
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
                value={data.length > 0 ? 'Today' : 'N/A'}
                prefix={<ClockCircleOutlined style={{ color: '#fdcb6e' }} />}
                valueStyle={{ color: '#fdcb6e' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Card */}
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
                  Clients
                </Text>
                <Text style={{ color: secondaryText, fontSize: 12 }}>
                  {filteredData.length} clients found
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Input
                placeholder="Search clients..."
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
                <Popconfirm
                  title="Delete Selected Clients"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} selected client(s)?`}
                  onConfirm={handleBatchDelete}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    style={{ borderRadius: 8 }}
                  >
                    Delete ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportData}
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

          {/* Table */}
          <Spin spinning={loading}>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} clients`,
                pageSizeOptions: ['10', '20', '50'],
                style: { 
                  padding: '12px 20px',
                  borderTop: `1px solid ${borderColor}`,
                },
              }}
              style={{ background: 'transparent' }}
              className="clients-table"
              locale={{
                emptyText: customEmpty()
              }}
            />
          </Spin>
        </Card>
      </div>

      {/* ===== EDIT MODAL ===== */}
      <Modal
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
          editForm.resetFields();
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
              <EditOutlined />
            </div>
            <span style={{ color: textColor, fontSize: 18, fontWeight: 600 }}>
              Edit Client Profile
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
        className="client-modal"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleSaveEdit}
        >
          <Form.Item 
            name="username" 
            label={<Text style={{ color: secondaryText }}>Username</Text>}
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input 
              placeholder="Enter username" 
              size="large"
              prefix={<UserOutlined style={{ color: secondaryText }} />}
              style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }} 
            />
          </Form.Item>

          <Form.Item 
            name="business_name" 
            label={<Text style={{ color: secondaryText }}>Business Name</Text>}
          >
            <Input 
              placeholder="Enter business name" 
              size="large"
              prefix={<StarOutlined style={{ color: secondaryText }} />}
              style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }} 
            />
          </Form.Item>

          <Form.Item 
            name="nationality" 
            label={<Text style={{ color: secondaryText }}>Nationality</Text>}
          >
            <Select
              placeholder="Select nationality"
              size="large"
              style={{ width: '100%' }}
              dropdownStyle={{ background: bgColor, borderColor: borderColor }}
              options={countries.map((c) => ({
                label: <span style={{ color: textColor }}>{c.name}</span>,
                value: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item 
            name="date_of_birth" 
            label={<Text style={{ color: secondaryText }}>Date of Birth</Text>}
          >
            <DatePicker 
              style={{ 
                width: '100%', 
                background: inputBg, 
                borderColor: borderColor, 
                color: textColor, 
                borderRadius: 8,
                height: 40,
              }} 
              placeholder="Select date"
              size="large"
            />
          </Form.Item>

          <Form.Item 
            name="address" 
            label={<Text style={{ color: secondaryText }}>Address</Text>}
          >
            <Input 
              placeholder="Enter address" 
              size="large"
              prefix={<GlobalOutlined style={{ color: secondaryText }} />}
              style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }} 
            />
          </Form.Item>

          <Form.Item 
            label={<Text style={{ color: secondaryText }}>Contact Info</Text>} 
            style={{ marginBottom: 0 }}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="countrycode" noStyle>
                <Input 
                  placeholder="+1" 
                  size="large"
                  style={{ 
                    width: '25%', 
                    background: inputBg, 
                    borderColor: borderColor, 
                    color: textColor, 
                    borderRadius: '8px 0 0 8px' 
                  }} 
                />
              </Form.Item>
              <Form.Item name="phonenumber" noStyle>
                <Input 
                  placeholder="Phone number" 
                  size="large"
                  prefix={<PhoneOutlined style={{ color: secondaryText }} />}
                  style={{ 
                    width: '75%', 
                    background: inputBg, 
                    borderColor: borderColor, 
                    color: textColor, 
                    borderRadius: '0 8px 8px 0' 
                  }} 
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Divider style={{ borderColor: borderColor }} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              onClick={() => {
                setIsEditModalVisible(false);
                setEditingUser(null);
                editForm.resetFields();
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
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                border: 'none',
                boxShadow: `0 4px 15px ${accentColor}44`,
                borderRadius: 8,
                padding: '0 30px',
                height: 40,
              }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      <style>{`
        .clients-table .ant-table {
          background: transparent !important;
        }
        .clients-table .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.02) !important;
          color: rgba(255,255,255,0.7) !important;
          border-bottom: 1px solid ${borderColor} !important;
          font-weight: 600 !important;
        }
        .clients-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .clients-table .ant-table-tbody > tr:hover > td {
          background: rgba(108,92,231,0.04) !important;
        }
        .clients-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
        
        /* Empty state styling */
        .clients-table .ant-table-empty {
          background: transparent !important;
        }
        .clients-table .ant-table-empty .ant-table-tbody > tr > td {
          border: none !important;
          padding: 0 !important;
          background: transparent !important;
        }
        .clients-table .ant-table-placeholder {
          background: transparent !important;
          border: none !important;
        }
        .clients-table .ant-table-placeholder:hover > td {
          background: transparent !important;
        }
        .clients-table .ant-table-empty .ant-table-tbody > tr:hover > td {
          background: transparent !important;
        }
        
        .clients-table .ant-pagination {
          background: transparent !important;
        }
        .clients-table .ant-pagination-item {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
        }
        .clients-table .ant-pagination-item a {
          color: rgba(255,255,255,0.6) !important;
        }
        .clients-table .ant-pagination-item-active {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .clients-table .ant-pagination-item-active a {
          color: #fff !important;
        }
        .clients-table .ant-pagination-prev button,
        .clients-table .ant-pagination-next button {
          color: rgba(255,255,255,0.4) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
          background: transparent !important;
        }
        .clients-table .ant-pagination-options {
          color: rgba(255,255,255,0.6) !important;
        }
        .clients-table .ant-pagination-options .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #fff !important;
          border-radius: 8px !important;
        }
        
        .client-modal .ant-modal-content {
          background: #0a0a1a !important;
          border: 1px solid ${borderColor} !important;
          border-radius: 16px !important;
        }
        .client-modal .ant-modal-title {
          color: ${textColor} !important;
        }
        .client-modal .ant-modal-close {
          color: rgba(255,255,255,0.5) !important;
        }
        .client-modal .ant-modal-close:hover {
          color: #fff !important;
        }
        .client-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid ${borderColor} !important;
          border-radius: 16px 16px 0 0 !important;
        }
        .client-modal .ant-modal-body {
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
        .ant-select-selector,
        .ant-picker {
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
        .ant-select-focused .ant-select-selector,
        .ant-picker-focused {
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
        .ant-picker-input > input {
          color: ${textColor} !important;
        }
        .ant-picker-suffix {
          color: ${secondaryText} !important;
        }

        /* Empty state dark theme overrides */
        .clients-table .ant-empty {
          margin: 0 !important;
        }
        .clients-table .ant-empty-image {
          display: none !important;
        }
        .clients-table .ant-empty-description {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default Sm_User;