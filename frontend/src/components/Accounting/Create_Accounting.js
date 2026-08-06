import React, { useState, useEffect } from "react";
import { Input, Button, message, Checkbox, Select, Card, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import './Create_Accounting.css';
import AnimatePhoto from "../Images/AnimatePhoto";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  HomeOutlined,
  FlagOutlined,
  TagOutlined,
  WalletOutlined,
  DollarOutlined,
  CalendarOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

function Create_Accounting() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    countrycode: '',
    address: '',
    nationality: ''
  });
  const [invoiceData, setInvoiceData] = useState({
    package: '',
    remaining: '',
    amount: '',
    remaining_payment: '',
    priceonme: '',
    plandate: ''
  });

  const { isDarkMode } = useDarkMode();

  // Theme variables matching UsersPage
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.7)";

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleUserChange = (value) => {
    const selectedUser = users.find(user => user.id === parseInt(value));
    if (selectedUser) {
      setSelectedUserId(value);
      setUserDetails({
        username: selectedUser.username,
        phoneNumber: selectedUser.phonenumber,
        email: selectedUser.email,
        countrycode: selectedUser.countrycode,
        address: selectedUser.address,
        nationality: selectedUser.nationality
      });
    } else {
      setSelectedUserId(null);
      setUserDetails({
        username: '',
        phoneNumber: '',
        email: '',
        countrycode: '',
        address: '',
        nationality: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const invoiceDataToSubmit = {
      userId: selectedUserId,
      username: userDetails.username,
      phoneNumber: userDetails.phoneNumber,
      email: userDetails.email,
      package: invoiceData.package,
      remainingPackage: invoiceData.remaining,
      amount: parseFloat(invoiceData.amount) || 0,
      remaining_payment: parseFloat(invoiceData.remaining_payment) || 0,
      priceOnMe: parseFloat(invoiceData.priceonme) || 0,
      planDate: invoiceData.plandate,
      isPaid: isPaid,
      countrycode: userDetails.countrycode,
      address: userDetails.address,
      nationality: userDetails.nationality
    };
    try {
      await axios.post('http://localhost:5000/api/accounting_invoices', invoiceDataToSubmit);
      message.success('Invoice Created Successfully!');
      navigate('/accounting');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(error.response?.data?.error || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: bgColor,
      minHeight: "100vh",
      padding: "30px 24px",
      overflowX: "hidden",
      width: "100%",
    }}>
      <div style={{
        width: "100%",
        margin: "0 auto",
        overflowX: "hidden",
        padding: "0 10px",
      }}>
        
        {/* Header with Back Button */}
        <div style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <PlusOutlined style={{ color: accentColor, marginRight: 12 }} />
                Create Invoice
              </Title>
              <Text style={{ color: secondaryText }}>
                Fill in the details below to create a new invoice
              </Text>
            </Col>
            <Col>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/accounting')}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  borderRadius: 8,
                  padding: "8px 20px",
                }}
              >
                Back to Dashboard
              </Button>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Main Form Card */}
        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
          bodyStyle={{ padding: "32px 24px" }}
        >
          {/* Animated Gradient Header Bar */}
          <div style={{
            height: "3px",
            background: "linear-gradient(90deg, #6c5ce7, #a29bfe, #fd79a8, #6c5ce7)",
            backgroundSize: "300% 100%",
            animation: "gradientMove 4s ease infinite",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }} />

          <form onSubmit={handleSubmit}>
            <Row gutter={[24, 24]}>
              
              {/* Client Selection - Full Width */}
              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ color: textColor, fontWeight: 500 }}>
                    <UserOutlined style={{ marginRight: 8, color: accentColor }} />
                    Select Client
                  </Text>
                </div>
                <Select
                  placeholder="Search and select a client..."
                  onChange={handleUserChange}
                  style={{ width: "100%" }}
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  dropdownStyle={{
                    background: inputBg,
                    borderColor: borderColor,
                  }}
                  className="dark-select"
                >
                  {users.map(user => (
                    <Option key={user.id} value={user.id} style={{ color: textColor }}>
                      <Space>
                        <UserOutlined style={{ color: accentColor }} />
                        {user.username}
                        <Tag style={{ background: "rgba(108,92,231,0.2)", border: "none", color: accentColor, fontSize: 10 }}>
                          #{user.id}
                        </Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* User Details Section */}
              <Col span={24}>
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  border: `1px solid ${borderColor}`,
                  marginTop: 8,
                }}>
                  <Text style={{ color: secondaryText, fontSize: 13, display: "block", marginBottom: 12 }}>
                    <UserOutlined style={{ marginRight: 8, color: accentColor }} />
                    Client Information
                  </Text>
                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, fontSize: 12 }}>Username</Text>
                      <div style={{ color: textColor, fontWeight: 500 }}>
                        {userDetails.username || "—"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, fontSize: 12 }}>Phone</Text>
                      <div style={{ color: textColor, fontWeight: 500 }}>
                        {userDetails.phoneNumber ? `+${userDetails.countrycode} ${userDetails.phoneNumber}` : "—"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, fontSize: 12 }}>Email</Text>
                      <div style={{ color: textColor, fontWeight: 500 }}>
                        {userDetails.email || "—"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, fontSize: 12 }}>Address</Text>
                      <div style={{ color: textColor, fontWeight: 500 }}>
                        {userDetails.address || "—"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, fontSize: 12 }}>Nationality</Text>
                      <div style={{ color: textColor, fontWeight: 500 }}>
                        {userDetails.nationality || "—"}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Invoice Details Section */}
              <Col span={24}>
                <Divider style={{ borderColor: borderColor, margin: "8px 0 16px 0" }}>
                  <Text style={{ color: textColor, fontSize: 15 }}>
                    <WalletOutlined style={{ marginRight: 8, color: accentColor }} />
                    Invoice Details
                  </Text>
                </Divider>
              </Col>

              {/* Package Fields - Using GiftOutlined instead of PackageOutlined */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <GiftOutlined style={{ marginRight: 6, color: accentColor }} />
                    Package
                  </Text>
                </div>
                <Input
                  placeholder="Enter package details..."
                  name="package"
                  value={invoiceData.package}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <WalletOutlined style={{ marginRight: 6, color: accentColor }} />
                    Remaining Package
                  </Text>
                </div>
                <Input
                  placeholder="Enter remaining package..."
                  name="remaining"
                  value={invoiceData.remaining}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <DollarOutlined style={{ marginRight: 6, color: accentColor }} />
                    Amount ($)
                  </Text>
                </div>
                <Input
                  placeholder="0.00"
                  type="number"
                  name="amount"
                  value={invoiceData.amount}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <PercentageOutlined style={{ marginRight: 6, color: accentColor }} />
                    Remaining Payment ($)
                  </Text>
                </div>
                <Input
                  placeholder="0.00"
                  type="number"
                  name="remaining_payment"
                  value={invoiceData.remaining_payment}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <PercentageOutlined style={{ marginRight: 6, color: accentColor }} />
                    Price On Me ($)
                  </Text>
                </div>
                <Input
                  placeholder="0.00"
                  type="number"
                  name="priceonme"
                  value={invoiceData.priceonme}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <CalendarOutlined style={{ marginRight: 6, color: accentColor }} />
                    Plan Date
                  </Text>
                </div>
                <Input
                  type="date"
                  name="plandate"
                  value={invoiceData.plandate}
                  onChange={handleInputChange}
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <CheckCircleOutlined style={{ marginRight: 6, color: accentColor }} />
                    Payment Status
                  </Text>
                </div>
                <div style={{
                  background: inputBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  padding: "0 16px",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                }}>
                  <Checkbox
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    style={{ color: textColor }}
                  >
                    <span style={{ color: textColor }}>
                      {isPaid ? "✅ Paid" : "⏳ Pending"}
                    </span>
                  </Checkbox>
                </div>
              </Col>

              {/* Submit Button */}
              <Col span={24}>
                <Divider style={{ borderColor: borderColor, margin: "8px 0 16px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <Button
                    onClick={() => navigate('/accounting')}
                    size="large"
                    style={{
                      background: "transparent",
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      borderRadius: 8,
                      padding: "0 30px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SaveOutlined />}
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                      border: "none",
                      boxShadow: `0 4px 15px ${accentColor}44`,
                      borderRadius: 8,
                      padding: "0 30px",
                    }}
                  >
                    {loading ? "Creating..." : "Create Invoice"}
                  </Button>
                </div>
              </Col>

            </Row>
          </form>
        </Card>
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .dark-select .ant-select-selector {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
          height: 40px !important;
        }

        .dark-select .ant-select-selection-placeholder {
          color: ${secondaryText} !important;
        }

        .dark-select .ant-select-arrow {
          color: ${secondaryText} !important;
        }

        .dark-select .ant-select-dropdown {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
        }

        .dark-select .ant-select-item {
          color: ${textColor} !important;
        }

        .dark-select .ant-select-item-option-active {
          background: rgba(108, 92, 231, 0.1) !important;
        }

        .dark-select .ant-select-item-option-selected {
          background: rgba(108, 92, 231, 0.15) !important;
        }

        .ant-checkbox-wrapper {
          color: ${textColor} !important;
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }

        .ant-checkbox-inner {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        input[type="number"]::-webkit-inner-spin-button {
          opacity: 0.5;
        }

        .ant-message .ant-message-notice-content {
          background: ${inputBg} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
        }

        @media (max-width: 768px) {
          .ant-card-body {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Create_Accounting;