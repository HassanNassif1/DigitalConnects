import React, { useState, useEffect } from "react";
import { Input, Button, message, DatePicker, Select, Card, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
import countriesData from "../sm_users/countries.json";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  MailOutlined,
  TagOutlined,
  PhoneOutlined,
  GlobalOutlined,
  FlagOutlined,
  HomeOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

function Create_Quotation() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const { isDarkMode } = useDarkMode();
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    plan_date: null,
    amount: '',
    email: '',
    price: '',
    username: '',
    type: '',
    ispaid: false,
    phone_number: '',
    country: '',
    nationality: '',
    address: ''
  });
  const [countryCode, setCountryCode] = useState('');

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
    setCountries(countriesData);
    const phoneCodeMap = countriesData.reduce((acc, country) => {
      acc[country.name] = country.phoneCode;
      return acc;
    }, {});
    setCountryPhoneCodes(phoneCodeMap);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(country => country.name === value);
    setFormValues(prev => ({
      ...prev,
      country: value,
    }));
    setCountryCode(selectedCountry?.phoneCode || '');
  };

  const handleDateChange = (date, dateString) => {
    setFormValues(prev => ({
      ...prev,
      plan_date: dateString,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const amount = parseFloat(formValues.amount);
    
    if (isNaN(amount)) {
      message.error('Amount must be a valid number.');
      setLoading(false);
      return;
    }

    const payload = {
      plan_date: formValues.plan_date,
      amount: formValues.amount,
      email: formValues.email,
      username: formValues.username,
      type: formValues.type,
      price: formValues.price || 0,
      ispaid: formValues.ispaid || false,
      phone_number: formValues.phone_number,
      country_code: countryCode,
      country: formValues.country,
      nationality: formValues.nationality,
      address: formValues.address,
    };

    axios.post('http://localhost:5000/CreateQuotation', payload)
      .then(response => {
        message.success('Quotation created successfully!');
        navigate('/quotations');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        message.error(error.response?.data?.error || 'Error submitting form');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: bgColor,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
      minHeight: "100vh",
      width: "100%",
      padding: "30px",
      boxSizing: "border-box",
      margin: 0,
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 60px)",
        padding: "0",
      }}>
        
        {/* Header with Back Button */}
        <div style={{ marginBottom: 20, flexShrink: 0 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <FileTextOutlined style={{ color: accentColor, marginRight: 12 }} />
                Create Quotation
              </Title>
              <Text style={{ color: secondaryText }}>
                Fill in the details below to create a new quotation
              </Text>
            </Col>
            <Col>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/quotations')}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  borderRadius: 8,
                  padding: "8px 20px",
                }}
              >
                Back to Quotations
              </Button>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor, margin: "10px 0 0 0" }} />
        </div>

        {/* Main Form Card - Full Height */}
        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)",
            overflow: "hidden",
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          bodyStyle={{ 
            padding: "28px 32px", 
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
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

          <form 
            onSubmit={handleSubmit} 
            style={{ 
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Row gutter={[24, 16]} style={{ flex: 1 }}>
              
              {/* Username */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <UserOutlined style={{ marginRight: 6, color: accentColor }} />
                    Username
                  </Text>
                </div>
                <Input
                  name="username"
                  placeholder="Enter username..."
                  value={formValues.username}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Plan Date */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <CalendarOutlined style={{ marginRight: 6, color: accentColor }} />
                    Plan Date
                  </Text>
                </div>
                <DatePicker
                  onChange={handleDateChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                  className="dark-datepicker"
                />
              </Col>

              {/* Amount */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <DollarOutlined style={{ marginRight: 6, color: accentColor }} />
                    Amount ($)
                  </Text>
                </div>
                <Input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formValues.amount}
                  onChange={handleChange}
                  required
                  size="large"
                  step="0.01"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Email */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <MailOutlined style={{ marginRight: 6, color: accentColor }} />
                    Email
                  </Text>
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email..."
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Package */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <TagOutlined style={{ marginRight: 6, color: accentColor }} />
                    Package
                  </Text>
                </div>
                <Input
                  name="type"
                  placeholder="Enter package details..."
                  value={formValues.type}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Phone Number */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <PhoneOutlined style={{ marginRight: 6, color: accentColor }} />
                    Phone Number {countryCode && <Tag color="purple" style={{ fontSize: 10, marginLeft: 4 }}>{countryCode}</Tag>}
                  </Text>
                </div>
                <Input
                  name="phone_number"
                  placeholder={`Enter phone number...`}
                  value={formValues.phone_number}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Country */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <GlobalOutlined style={{ marginRight: 6, color: accentColor }} />
                    Country
                  </Text>
                </div>
                <Select
                  name="country"
                  placeholder="Select Country"
                  onChange={handleCountryChange}
                  showSearch
                  required
                  size="large"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownStyle={{
                    background: inputBg,
                    borderColor: borderColor,
                  }}
                  className="dark-select"
                >
                  {countries.map(country => (
                    <Option value={country.name} key={country.code} style={{ color: textColor }}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Nationality */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <FlagOutlined style={{ marginRight: 6, color: accentColor }} />
                    Nationality
                  </Text>
                </div>
                <Input
                  name="nationality"
                  placeholder="Enter nationality..."
                  value={formValues.nationality}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Address - Full Width */}
              <Col xs={24}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <HomeOutlined style={{ marginRight: 6, color: accentColor }} />
                    Address
                  </Text>
                </div>
                <Input
                  name="address"
                  placeholder="Enter address..."
                  value={formValues.address}
                  onChange={handleChange}
                  required
                  size="large"
                  style={{
                    width: "100%",
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    height: 42,
                  }}
                />
              </Col>

              {/* Submit Button - Pushed to bottom */}
              <Col span={24} style={{ marginTop: "auto", paddingTop: 16 }}>
                <Divider style={{ borderColor: borderColor, margin: "0 0 16px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <Button
                    onClick={() => navigate('/quotations')}
                    size="large"
                    style={{
                      background: "transparent",
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      borderRadius: 8,
                      padding: "0 30px",
                      height: 44,
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
                      height: 44,
                    }}
                  >
                    {loading ? "Creating..." : "Create Quotation"}
                  </Button>
                </div>
              </Col>

            </Row>
          </form>
        </Card>
        
        <div style={{ marginTop: "30px", flexShrink: 0 }}>
          <AnimatePhoto />
        </div>
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
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
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

        .dark-datepicker .ant-picker {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          border-radius: 8px !important;
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
        }

        .dark-datepicker .ant-picker-input input {
          color: ${textColor} !important;
        }

        .dark-datepicker .ant-picker-input input::placeholder {
          color: ${secondaryText} !important;
        }

        .dark-datepicker .ant-picker-suffix {
          color: ${secondaryText} !important;
        }

        .dark-datepicker .ant-picker-panel {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
        }

        .dark-datepicker .ant-picker-cell-inner {
          color: ${textColor} !important;
        }

        .dark-datepicker .ant-picker-cell-selected .ant-picker-cell-inner {
          background: ${accentColor} !important;
          color: #fff !important;
        }

        .dark-datepicker .ant-picker-header {
          border-bottom: 1px solid ${borderColor} !important;
        }

        .dark-datepicker .ant-picker-header button {
          color: ${textColor} !important;
        }

        .dark-datepicker .ant-picker-header-view {
          color: ${textColor} !important;
        }

        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .ant-message .ant-message-notice-content {
          background: ${inputBg} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
        }

        /* Remove extra spacing from Card */
        .ant-card-body {
          padding: 28px 32px !important;
        }

        @media (max-width: 768px) {
          .ant-card-body {
            padding: 16px !important;
          }
          
          .ant-select-selector {
            height: 38px !important;
          }
          
          .ant-picker {
            height: 38px !important;
          }
          
          .ant-input {
            height: 38px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Create_Quotation;