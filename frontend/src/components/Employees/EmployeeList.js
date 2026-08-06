import React, { useState, useEffect } from "react";
import { Table, Input, Button, Card,Modal,Spin, Tooltip, notification, Typography, Tag, Space, Statistic, Row, Col, Divider, Badge } from "antd";
import axios from "axios";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import maleImage from "./male.jpg";
import otherImage from "./other.png";
import femaleImage from "./female.jpg";
import verification from "../sm_users/verification.png";
import { 
  DeleteOutlined, 
  EyeOutlined, 
  UserAddOutlined, 
  SearchOutlined,
  TeamOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // === THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({ message: "Error", description: "Failed to fetch employees." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete Employee",
      content: "Are you sure you want to delete this employee?",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/delete-employee/${id}`);
          await fetchEmployees();
          notification.success({ message: "Success", description: "Employee deleted successfully." });
        } catch (error) {
          console.error("Error deleting user:", error);
          notification.error({ message: "Error", description: "Failed to delete the record." });
        }
      }
    });
  };

  const handleViewDetails = (userId) => {
    navigate(`/viewEmployee/${userId}`);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <span style={{ color: secondaryText, fontSize: 12 }}>{index + 1}</span>
      ),
    },
    {
      title: "Employee",
      key: "employee",
      render: (text, record) => {
        const base64Image = record.image;
        const gender = record.gender;
        const defaultImage = gender === "male" ? maleImage : gender === "female" ? femaleImage : otherImage;
        return (
          <Space size={12}>
            <img
              src={base64Image || defaultImage}
              alt={record.username}
              style={{ 
                width: 40, 
                height: 40, 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `2px solid ${accentColor}` 
              }}
            />
            <div>
              <Text strong style={{ color: textColor, display: 'block' }}>
                {record.username}
                {record.count > 0 && (
                  <Tooltip title="Verified">
                    <img src={verification} alt="Badge" style={{ width: 18, height: 18, marginLeft: 8 }} />
                  </Tooltip>
                )}
              </Text>
              <Text style={{ color: secondaryText, fontSize: 11 }}>ID: {record.id}</Text>
            </div>
          </Space>
        );
      },
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Job",
      dataIndex: "job_description",
      key: "job_description",
      render: (text) => (
        <Tag style={{ 
          background: `${accentColor}22`, 
          border: `1px solid ${accentColor}44`, 
          color: accentColor,
          borderRadius: 20,
          padding: '4px 16px',
        }}>
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      align: "right",
      render: (text) => (
        <span style={{ color: '#00b894', fontWeight: 600, fontSize: 15 }}>
          ${(text || 0).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => (a.salary || 0) - (b.salary || 0),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: () => (
        <Badge 
          status="success" 
          text={<span style={{ color: '#00b894' }}>Active</span>}
        />
      ),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: 150,
      render: (text, record) => {
        const whatsappLink = `https://wa.me/${record.countrycode}${record.phonenumber}`;
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
            <Tooltip title="WhatsApp">
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
                  <i className="fa-brands fa-whatsapp" />
                </Button>
              </a>
            </Tooltip>
            <Tooltip title="Delete">
              <Button 
                onClick={() => handleDelete(record.id)} 
                icon={<DeleteOutlined />} 
                style={{ 
                  color: '#ff6b6b',
                  background: 'rgba(255,107,107,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  border: 'none',
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const filteredData = data.filter((item) =>
    item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.job_description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalSalary = data.reduce((sum, item) => sum + (item.salary || 0), 0);

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
                Employee Management
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Manage your workforce efficiently
              </Text>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchEmployees}
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
                href="/AddEmployees" 
                type="primary" 
                icon={<UserAddOutlined />} 
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                  border: 'none',
                  boxShadow: `0 4px 15px ${accentColor}44`,
                  borderRadius: 8,
                }}
              >
                Add Employee
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
                title={<Text style={{ color: secondaryText }}>Total Employees</Text>}
                value={data.length}
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
                title={<Text style={{ color: secondaryText }}>Total Payroll</Text>}
                value={`$${totalSalary.toFixed(2)}`}
                prefix={<DollarOutlined style={{ color: '#00b894' }} />}
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
                  Employees
                </Text>
                <Text style={{ color: secondaryText, fontSize: 12 }}>
                  {filteredData.length} employees found
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Input 
                placeholder="Search employees..." 
                prefix={<SearchOutlined style={{ color: secondaryText }} />} 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                style={{ 
                  width: 220, 
                  background: inputBg, 
                  borderColor: borderColor, 
                  color: textColor, 
                  borderRadius: 8 
                }} 
              />
              <Tooltip title="Export">
                <Button 
                  icon={<DownloadOutlined />} 
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
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} employees`,
                pageSizeOptions: ['10', '20', '50'],
                style: { 
                  padding: '12px 20px',
                  borderTop: `1px solid ${borderColor}`,
                },
              }}
              rowKey="id"
              className="dark-table"
            />
          </Spin>
        </Card>
      </div>

      <style>{`
        .dark-table .ant-table {
          background: transparent !important;
          color: ${textColor} !important;
        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background: rgba(255,255,255,0.02) !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
          font-weight: 600 !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.04) !important;
        }
        .dark-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
        .dark-table .ant-pagination {
          background: transparent !important;
        }
        .dark-table .ant-pagination-item {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
        }
        .dark-table .ant-pagination-item a { 
          color: rgba(255,255,255,0.6) !important; 
        }
        .dark-table .ant-pagination-item-active { 
          background: ${accentColor} !important; 
          border-color: ${accentColor} !important; 
        }
        .dark-table .ant-pagination-item-active a { 
          color: #fff !important; 
        }
        .dark-table .ant-pagination-prev button,
        .dark-table .ant-pagination-next button {
          color: rgba(255,255,255,0.4) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 8px !important;
          background: transparent !important;
        }
        .dark-table .ant-pagination-options {
          color: rgba(255,255,255,0.6) !important;
        }
        .dark-table .ant-pagination-options .ant-select-selector {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          color: #fff !important;
          border-radius: 8px !important;
        }
        
        .ant-input, .ant-select-selector {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input::placeholder {
          color: ${secondaryText} !important;
        }
        .ant-select-dropdown {
          background: ${inputBg} !important;
        }
        .ant-select-item {
          color: ${textColor} !important;
        }
      `}</style>
    </div>
  );
};

export default EmployeeList;