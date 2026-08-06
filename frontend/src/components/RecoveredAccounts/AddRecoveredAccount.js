import React, { useState, useEffect } from "react";
import { Input, Button, Form, notification, Typography, Select, Card, Row, Col, Divider, Space } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserAddOutlined, ArrowLeftOutlined, SaveOutlined, UserOutlined, MailOutlined, LockOutlined, GlobalOutlined } from "@ant-design/icons";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { Title, Text } = Typography;
const { Option } = Select;

function AddRecoveredAccount() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [email_personal, setEmailPersonal] = useState("");
  const [loading, setLoading] = useState(false);

  // === UNIFIED DARK THEME ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.7)";

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    color: textColor,
    height: 42,
  };

  const [socialMediaData, setSocialMediaData] = useState({
    instagram: "",
    facebook: "",
    snapchat: "",
    linkedin: "",
    tiktok: "",
    twitter: "",
    gmail: "",
    email: "",
    instagramEmail: "",
    facebookEmail: "",
    snapchatEmail: "",
    linkedinEmail: "",
    tiktokEmail: "",
    twitterEmail: "",
    gmailEmail: "",
    instagramPassword: "",
    facebookPassword: "",
    snapchatPassword: "",
    linkedinPassword: "",
    tiktokPassword: "",
    twitterPassword: "",
    gmailPassword: "",
    emailPassword: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => setUsers(res.data));
  }, []);

  const handleSocialMediaChange = (field, value) => {
    setSocialMediaData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail(email_personal)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("username", selectedUser);
    formData.append("email_personal", email_personal);
    Object.keys(socialMediaData).forEach((key) => {
      if (socialMediaData[key]) formData.append(key, socialMediaData[key]);
    });

    try {
      const res = await axios.post("http://localhost:5000/CreateRecoveredAccount", formData);
      if (res.data.message === "Recovered account added successfully!") {
        notification.success({ message: "Success", description: `${selectedUser} was added successfully.` });
        navigate("/view-recovered-accounts");
      }
    } catch (err) {
      setEmailError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      background: bgColor,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "flex-start",
      padding: "24px 30px",
      boxSizing: "border-box",
      margin: 0,
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 48px)",
        padding: 0,
        margin: 0,
      }}>
        
        {/* Header - Compact */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "16px", 
          flexShrink: 0,
          padding: 0,
        }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0, fontSize: "22px" }}>
              <UserAddOutlined style={{ color: accentColor, marginRight: 10 }} />
              Add Recovered Account
            </Title>
            <Text style={{ color: secondaryText, fontSize: "13px" }}>
              Restore credentials for a hacked or recovered account.
            </Text>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/view-recovered-accounts')} 
            style={{ 
              background: "rgba(255,255,255,0.05)", 
              border: `1px solid ${borderColor}`, 
              color: textColor, 
              borderRadius: 8,
              height: 38,
              padding: "0 18px",
            }}
          >
            Back
          </Button>
        </div>

        {/* Main Card - Full Height */}
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
            padding: "24px 28px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Animated Gradient Header Bar */}
          <div style={{ 
            height: "3px", 
            background: `linear-gradient(90deg, ${accentColor}, #a29bfe, #fd79a8, ${accentColor})`, 
            backgroundSize: "300% 100%", 
            animation: "gradientMove 4s ease infinite", 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0 
          }} />

          <Form 
            layout="vertical" 
            onFinish={handleSubmit} 
            style={{ 
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Row gutter={[24, 12]} style={{ flex: 1 }}>
              <Col xs={24} md={12}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "13px" }}>Client Name</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Select 
                    placeholder="Select a client" 
                    value={selectedUser} 
                    onChange={(v) => setSelectedUser(v)} 
                    dropdownStyle={{ background: inputBg, borderColor: borderColor }} 
                    style={{ width: "100%", height: 42 }}
                    className="dark-select"
                  >
                    {users.map((u) => (
                      <Option key={u.id} value={u.username} style={{ color: textColor }}>
                        {u.username}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "13px" }}>Personal Email</span>} 
                  validateStatus={emailError ? "error" : ""} 
                  help={<span style={{ color: "#ff4d4f", fontSize: "12px" }}>{emailError}</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Input 
                    placeholder="Enter personal email" 
                    value={email_personal} 
                    onChange={(e) => setEmailPersonal(e.target.value)} 
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: borderColor, margin: "12px 0" }}>
              <Text style={{ color: textColor, fontSize: "14px" }}>
                <GlobalOutlined style={{ color: accentColor, marginRight: 8 }} /> 
                Account Credentials
              </Text>
            </Divider>

            <Row gutter={[24, 12]} style={{ flex: 1 }}>
              {["instagram", "facebook", "snapchat", "linkedin", "tiktok", "twitter"].map((platform) => (
                <React.Fragment key={platform}>
                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span style={{ color: textColor, textTransform: 'capitalize', fontSize: "12px" }}>{platform} Username</span>}
                      style={{ marginBottom: 8 }}
                    >
                      <Input 
                        value={socialMediaData[platform]} 
                        onChange={(e) => handleSocialMediaChange(platform, e.target.value)} 
                        style={inputStyle} 
                        prefix={<UserOutlined style={{ color: accentColor }} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span style={{ color: textColor, textTransform: 'capitalize', fontSize: "12px" }}>{platform} Email</span>}
                      style={{ marginBottom: 8 }}
                    >
                      <Input 
                        value={socialMediaData[`${platform}Email`]} 
                        onChange={(e) => handleSocialMediaChange(`${platform}Email`, e.target.value)} 
                        style={inputStyle} 
                        prefix={<MailOutlined style={{ color: accentColor }} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item 
                      label={<span style={{ color: textColor, textTransform: 'capitalize', fontSize: "12px" }}>{platform} Password</span>}
                      style={{ marginBottom: 8 }}
                    >
                      <Input.Password 
                        value={socialMediaData[`${platform}Password`]} 
                        onChange={(e) => handleSocialMediaChange(`${platform}Password`, e.target.value)} 
                        style={inputStyle} 
                        prefix={<LockOutlined style={{ color: accentColor }} />}
                      />
                    </Form.Item>
                  </Col>
                </React.Fragment>
              ))}

              {/* Gmail & Hotmail Section */}
              <Col xs={24} md={8}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "12px" }}>Gmail Username</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Input 
                    value={socialMediaData.gmail} 
                    onChange={(e) => handleSocialMediaChange("gmail", e.target.value)} 
                    style={inputStyle} 
                    prefix={<UserOutlined style={{ color: accentColor }} />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "12px" }}>Gmail Password</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Input.Password 
                    value={socialMediaData.gmailPassword} 
                    onChange={(e) => handleSocialMediaChange("gmailPassword", e.target.value)} 
                    style={inputStyle} 
                    prefix={<LockOutlined style={{ color: accentColor }} />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "12px" }}>Hotmail Username</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Input 
                    value={socialMediaData.email} 
                    onChange={(e) => handleSocialMediaChange("email", e.target.value)} 
                    style={inputStyle} 
                    prefix={<UserOutlined style={{ color: accentColor }} />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item 
                  label={<span style={{ color: textColor, fontSize: "12px" }}>Hotmail Password</span>}
                  style={{ marginBottom: 8 }}
                >
                  <Input.Password 
                    value={socialMediaData.emailPassword} 
                    onChange={(e) => handleSocialMediaChange("emailPassword", e.target.value)} 
                    style={inputStyle} 
                    prefix={<LockOutlined style={{ color: accentColor }} />}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button - Pushed to bottom */}
            <div style={{ marginTop: "auto", paddingTop: 16 }}>
              <Divider style={{ borderColor: borderColor, margin: "0 0 16px 0" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <Button 
                  onClick={() => navigate('/view-recovered-accounts')} 
                  style={{ 
                    background: "transparent", 
                    border: `1px solid ${borderColor}`, 
                    color: textColor, 
                    borderRadius: 8,
                    height: 40,
                    padding: "0 28px",
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  icon={<SaveOutlined />} 
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`, 
                    border: "none", 
                    borderRadius: 8, 
                    padding: "0 28px",
                    height: 40,
                  }}
                >
                  Add Account
                </Button>
              </div>
            </div>
          </Form>
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

        .ant-input, .ant-input-password {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
        }

        .ant-input-password input {
          background: transparent !important;
          color: ${textColor} !important;
        }

        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .ant-form-item {
          margin-bottom: 8px !important;
        }

        .ant-message .ant-message-notice-content {
          background: ${inputBg} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
        }

        .ant-card-body {
          padding: 24px 28px !important;
        }

        @media (max-width: 768px) {
          .ant-card-body {
            padding: 16px !important;
          }
          .ant-input, .ant-input-password, .ant-select-selector {
            height: 38px !important;
          }
          .ant-btn {
            height: 38px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AddRecoveredAccount;