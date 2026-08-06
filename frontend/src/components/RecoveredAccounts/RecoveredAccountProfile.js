import React, { useState, useEffect } from "react";

import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { Button, Table, Typography, Divider, Input, Card, Row, Col, Tag, Space, Spin } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { Title, Text } = Typography;

const RecoveredAccountProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialMediaData, setSocialMediaData] = useState({});
  const [originalSocialMediaData, setOriginalSocialMediaData] = useState({});
  const [editHistoryPassword, setEditHistoryPassword] = useState([]);
  const [editHistoryUsername, setEditHistoryUsername] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [editState, setEditState] = useState({});
  const [visiblePasswordsOldValue, setVisiblePasswordsOldValue] = useState({}); 
  const [visiblePasswordsNewValue, setVisiblePasswordsNewValue] = useState({}); 
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

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
    padding: '8px 12px',
    borderRadius: '8px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    color: textColor,
    height: '40px',
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/recoveredAccountProfile/${id}`);
      setUser(response.data);
      const data = {
        instagram: response.data.instagram,
        facebook: response.data.facebook,
        snapchat: response.data.snapchat,
        linkedin: response.data.linkedin,
        tiktok: response.data.tiktok,
        twitter: response.data.twitter,
        gmail: response.data.gmail_username,
        instagram_email: response.data.instagram_email,
        facebook_email: response.data.facebook_email,
        snapchat_email: response.data.snapchat_email,
        linkedin_email: response.data.linkedin_email,
        tiktok_email: response.data.tiktok_email,
        twitter_email: response.data.twitter_email,
        gmail_email: response.data.gmail_email,
        instagram_password: response.data.instagram_password,
        facebook_password: response.data.facebook_password,
        snapchat_password: response.data.snapchat_password,
        linkedin_password: response.data.linkedin_password,
        tiktok_password: response.data.tiktok_password,
        twitter_password: response.data.twitter_password,
        gmail_password: response.data.gmail_password,
        email: response.data.email_username,
        email_password: response.data.email_password,
      };
      setSocialMediaData(data);
      setOriginalSocialMediaData(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditHistoryPassword = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/edit-history-password/${id}`);
      setEditHistoryPassword(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };
  const fetchEditHistoryUsername = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/edit-history-username/${id}`);
      setEditHistoryUsername(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEditHistoryPassword();
    fetchEditHistoryUsername();
  }, [id]);

  if (loading) return (
    <div style={{ 
      minHeight: "100vh", 
      background: bgColor,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <Spin size="large" />
    </div>
  );
  
  if (!user) return (
    <div style={{ 
      minHeight: "100vh", 
      background: bgColor,
      color: textColor, 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      User not found
    </div>
  );

  const togglePasswordVisibility = (platform) => {
    setPasswordVisibility((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };
  const togglePasswordVisibilityOldValue = (index) => {
    setVisiblePasswordsOldValue((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const togglePasswordVisibilityNewValue = (index) => {
    setVisiblePasswordsNewValue((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleUpdate = async (platform) => {
    const updates = {};
    const platformLower = platform.toLowerCase();
    if (socialMediaData[`${platformLower}_email`] !== originalSocialMediaData[`${platformLower}_email`]) updates.email = socialMediaData[`${platformLower}_email`];
    if (socialMediaData[`${platformLower}_password`] !== originalSocialMediaData[`${platformLower}_password`]) updates.password = socialMediaData[`${platformLower}_password`];
    if (socialMediaData[`${platformLower}`] !== originalSocialMediaData[`${platformLower}`]) updates.username = socialMediaData[`${platformLower}`];

    if (Object.keys(updates).length > 0) {
      try {
        await axios.put("http://localhost:5000/api/update-social-media", { user_id: id, updates: { [platformLower]: updates } });
        fetchUserData();
        fetchEditHistoryPassword();
        fetchEditHistoryUsername();
      } catch (error) { console.error("Error updating:", error); }
    }
    setEditState((prev) => ({ ...prev, [platform]: false }));
  };

  const handleEmailUpdate = async (platform) => {
    const platformLower = platform.toLowerCase();
    const updates = {};
    const newUsername = socialMediaData[platformLower];
    const newPassword = socialMediaData[`${platformLower}_password`];
    if (newUsername) updates[`${platformLower}_username`] = newUsername;
    if (newPassword) updates[`${platformLower}_password`] = newPassword;

    try {
      await axios.put("http://localhost:5000/api/update-recovered-accounts-email", { user_id: id, updates: { [platformLower]: updates } });
      fetchUserData();
      fetchEditHistoryPassword();
      fetchEditHistoryUsername();
    } catch (error) { console.error("Error updating:", error); }
    setEditState((prev) => ({ ...prev, [platform]: false }));
  };

  const toggleEdit = (platform) => setEditState((prev) => ({ ...prev, [platform]: !prev[platform] }));

  const socialMediaLinks = [
    { platform: "Instagram", url: socialMediaData.instagram, email: socialMediaData.instagram_email, password: socialMediaData.instagram_password },
    { platform: "Facebook", url: socialMediaData.facebook, email: socialMediaData.facebook_email, password: socialMediaData.facebook_password },
    { platform: "Snapchat", url: socialMediaData.snapchat, email: socialMediaData.snapchat_email, password: socialMediaData.snapchat_password },
    { platform: "LinkedIn", url: socialMediaData.linkedin, email: socialMediaData.linkedin_email, password: socialMediaData.linkedin_password },
    { platform: "TikTok", url: socialMediaData.tiktok, email: socialMediaData.tiktok_email, password: socialMediaData.tiktok_password },
    { platform: "Twitter", url: socialMediaData.twitter, email: socialMediaData.twitter_email, password: socialMediaData.twitter_password },
  ];

  const emailLinks = [
    { platform: "Gmail", url: socialMediaData.gmail, password: socialMediaData.gmail_password },
    { platform: "Hotmail", url: socialMediaData.email, password: socialMediaData.email_password },
  ];

  const socialMediaSource = socialMediaLinks.map((link) => ({ key: link.platform, platform: link.platform, url: link.url || "N/A", password: link.password || "" }));
  const emailSource = emailLinks.map((link) => ({ key: link.platform, platform: link.platform, url: link.url || "N/A", password: link.password || "" }));

  const socialMediaColumns = [
    { title: "Platform", dataIndex: "platform", key: "platform", render: (text) => <span style={{ color: textColor, fontWeight: 600 }}>{text}</span> },
    {
      title: "Username",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <Space>
              <Input value={socialMediaData[`${record.platform.toLowerCase()}`] || ""} onChange={(e) => setSocialMediaData((prev) => ({ ...prev, [`${record.platform.toLowerCase()}`]: e.target.value }))} style={{ width: 180, ...inputStyle }} />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleUpdate(record.platform)} style={{ color: accentColor }} />
            </Space>
          ) : (
            <Space>
              <span style={{ color: textColor }}>{socialMediaData[`${record.platform.toLowerCase()}`] || "N/A"}</span>
              <Button type="text" icon={<EditOutlined />} onClick={() => toggleEdit(record.platform)} style={{ color: accentColor }} />
            </Space>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <Space>
              <Input value={socialMediaData[`${record.platform.toLowerCase()}_email`]} onChange={(e) => setSocialMediaData((prev) => ({ ...prev, [`${record.platform.toLowerCase()}_email`]: e.target.value }))} style={{ width: 180, ...inputStyle }} />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleUpdate(record.platform)} style={{ color: accentColor }} />
            </Space>
          ) : (
            <Space>
              <span style={{ color: textColor }}>{socialMediaData[`${record.platform.toLowerCase()}_email`] || "N/A"}</span>
              <Button type="text" icon={<EditOutlined />} onClick={() => toggleEdit(record.platform)} style={{ color: accentColor }} />
            </Space>
          )}
        </div>
      ),
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <Space>
              <Input value={socialMediaData[`${record.platform.toLowerCase()}_password`] || ""} onChange={(e) => setSocialMediaData((prev) => ({ ...prev, [`${record.platform.toLowerCase()}_password`]: e.target.value }))} type={passwordVisibility[record.platform] ? "text" : "password"} style={{ width: 180, ...inputStyle }} />
              <Button type="link" icon={passwordVisibility[record.platform] ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibility(record.platform)} style={{ color: textColor }} />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleUpdate(record.platform)} style={{ color: accentColor }} />
            </Space>
          ) : (
            <Space>
              <span style={{ color: textColor }}>{passwordVisibility[record.platform] ? socialMediaData[`${record.platform.toLowerCase()}_password`] || "N/A" : "********"}</span>
              <Button type="link" icon={passwordVisibility[record.platform] ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibility(record.platform)} style={{ color: textColor }} />
              <Button type="text" icon={<EditOutlined />} onClick={() => toggleEdit(record.platform)} style={{ color: accentColor }} />
            </Space>
          )}
        </div>
      ),
    },
  ];

  const emailColumns = [
    { title: "Platform", dataIndex: "platform", key: "platform", render: (text) => <span style={{ color: textColor, fontWeight: 600 }}>{text}</span> },
    {
      title: "Username",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <Space>
              <Input value={socialMediaData[`${record.platform.toLowerCase()}`] || ""} onChange={(e) => setSocialMediaData((prev) => ({ ...prev, [`${record.platform.toLowerCase()}`]: e.target.value }))} style={{ width: 180, ...inputStyle }} />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleEmailUpdate(record.platform)} style={{ color: accentColor }} />
            </Space>
          ) : (
            <Space>
              <span style={{ color: textColor }}>{socialMediaData[`${record.platform.toLowerCase()}`] || "N/A"}</span>
              <Button type="text" icon={<EditOutlined />} onClick={() => toggleEdit(record.platform)} style={{ color: accentColor }} />
            </Space>
          )}
        </div>
      ),
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <Space>
              <Input value={socialMediaData[`${record.platform.toLowerCase()}_password`] || ""} onChange={(e) => setSocialMediaData((prev) => ({ ...prev, [`${record.platform.toLowerCase()}_password`]: e.target.value }))} type={passwordVisibility[record.platform] ? "text" : "password"} style={{ width: 180, ...inputStyle }} />
              <Button type="link" icon={passwordVisibility[record.platform] ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibility(record.platform)} style={{ color: textColor }} />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleEmailUpdate(record.platform)} style={{ color: accentColor }} />
            </Space>
          ) : (
            <Space>
              <span style={{ color: textColor }}>{passwordVisibility[record.platform] ? socialMediaData[`${record.platform.toLowerCase()}_password`] || "N/A" : "********"}</span>
              <Button type="link" icon={passwordVisibility[record.platform] ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibility(record.platform)} style={{ color: textColor }} />
              <Button type="text" icon={<EditOutlined />} onClick={() => toggleEdit(record.platform)} style={{ color: accentColor }} />
            </Space>
          )}
        </div>
      ),
    },
  ];

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
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 48px)",
        padding: 0,
        margin: 0,
      }}>
        
        {/* Header with Back Button */}
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
              <UserOutlined style={{ color: accentColor, marginRight: 10 }} />
              Recovered Account Profile
            </Title>
            <Text style={{ color: secondaryText, fontSize: "13px" }}>
              Manage social media, email credentials and history.
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
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }} 
          bodyStyle={{ 
            padding: "24px 28px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
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
            right: 0,
          }} />

          {/* User Header */}
          <div style={{ textAlign: "center", marginBottom: "16px", flexShrink: 0 }}>
            <div style={{ 
              width: 72, 
              height: 72, 
              borderRadius: "50%", 
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 12px", 
              fontSize: 28, 
              color: accentColor, 
              border: `2px solid ${accentColor}44` 
            }}>
              <UserOutlined />
            </div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>{user.username}</Title>
            <Tag color="purple" style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44`, color: textColor }}>
              Recovered Account
            </Tag>
          </div>

          <Divider style={{ borderColor: borderColor, margin: "12px 0" }} />

          {/* Tables - Fill remaining space */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Title level={4} style={{ color: textColor, marginTop: 0 }}>Social Media Accounts</Title>
            <Table 
              columns={socialMediaColumns} 
              dataSource={socialMediaSource} 
              pagination={false} 
              className="dark-table" 
              style={{ marginBottom: 16 }}
              scroll={{ x: true }}
            />

            <Title level={4} style={{ color: textColor, marginTop: 8 }}>Email Accounts</Title>
            <Table 
              columns={emailColumns} 
              dataSource={emailSource} 
              pagination={false} 
              className="dark-table" 
              style={{ marginBottom: 16 }}
              scroll={{ x: true }}
            />

            <Title level={4} style={{ color: textColor, marginTop: 8 }}>Password History</Title>
            <Table
              columns={[
                { title: "Account", dataIndex: "modified_field", key: "modified_field", render: (text) => <span style={{ color: textColor }}>{(text || "N/A").replace(/_/g, " ")}</span> },
                { title: "Old Value", dataIndex: "old_value", key: "old_value", render: (text, record, index) => {
                    const isVisible = visiblePasswordsOldValue[index];
                    return <div style={{ display: "flex", alignItems: "center" }}><span style={{ color: textColor, marginRight: 8 }}>{isVisible ? text : "****"}</span><Button icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibilityOldValue(index)} type="link" style={{ color: textColor }} /></div>;
                  }
                },
                { title: "New Value", dataIndex: "new_value", key: "new_value", render: (text, record, index) => {
                    const isVisible = visiblePasswordsNewValue[index];
                    return <div style={{ display: "flex", alignItems: "center" }}><span style={{ color: textColor, marginRight: 8 }}>{isVisible ? text : "****"}</span><Button icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordVisibilityNewValue(index)} type="link" style={{ color: textColor }} /></div>;
                  }
                },
                { title: "Modified Date", dataIndex: "modified_date", key: "modified_date", render: (text) => <span style={{ color: textColor }}>{new Date(text).toLocaleString("en-US", { hour12: true })}</span> }
              ]}
              dataSource={editHistoryPassword.map((entry, index) => ({ key: index, modified_field: entry.modified_field, old_value: entry.old_value || "N/A", new_value: entry.new_value, modified_date: entry.modified_date }))}
              pagination={false}
              className="dark-table"
              style={{ marginBottom: 16 }}
              scroll={{ x: true }}
            />

            <Title level={4} style={{ color: textColor, marginTop: 8 }}>Username History</Title>
            <Table
              columns={[
                { title: "Account", dataIndex: "modified_field", key: "modified_field", render: (text) => <span style={{ color: textColor }}>{(text || "N/A").replace(/_/g, " ")}</span> },
                { title: "Old Value", dataIndex: "old_value", key: "old_value", render: (text) => <span style={{ color: textColor }}>{text || "N/A"}</span> },
                { title: "New Value", dataIndex: "new_value", key: "new_value", render: (text) => <span style={{ color: textColor }}>{text || "N/A"}</span> },
                { title: "Modified Date", dataIndex: "modified_date", key: "modified_date", render: (text) => <span style={{ color: textColor }}>{new Date(text).toLocaleString("en-US", { hour12: true })}</span> }
              ]}
              dataSource={editHistoryUsername.map((entry, index) => ({ key: index, modified_field: entry.modified_field, old_value: entry.old_value || "N/A", new_value: entry.new_value, modified_date: entry.modified_date }))}
              pagination={false}
              className="dark-table"
              scroll={{ x: true }}
            />
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .dark-table .ant-table { 
          background: transparent !important; 
          color: ${textColor} !important; 
        }
        .dark-table .ant-table-container { 
          border: none !important; 
        }
        .dark-table .ant-table-thead > tr > th { 
          background: ${inputBg} !important; 
          color: ${textColor} !important; 
          border-bottom: 1px solid ${borderColor} !important;
          padding: 10px 12px !important;
        }
        .dark-table .ant-table-tbody > tr > td { 
          background: transparent !important; 
          color: ${textColor} !important; 
          border-bottom: 1px solid ${borderColor} !important;
          padding: 8px 12px !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td { 
          background: rgba(108, 92, 231, 0.08) !important; 
        }
        .dark-table .ant-table-placeholder {
          background: transparent !important;
        }
        .dark-table .ant-empty-description {
          color: ${secondaryText} !important;
        }

        .ant-pagination-item a { 
          color: ${textColor} !important; 
        }
        .ant-pagination-item-active { 
          background: ${accentColor} !important; 
          border-color: ${accentColor} !important; 
        }
        .ant-pagination-item-active a {
          color: #fff !important;
        }

        .ant-input, .ant-input-password {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }

        .ant-input-password input {
          background: transparent !important;
          color: ${textColor} !important;
        }

        .ant-card-body {
          padding: 24px 28px !important;
        }

        @media (max-width: 768px) {
          .ant-card-body {
            padding: 16px !important;
          }
          .ant-table {
            font-size: 12px !important;
          }
          .ant-btn {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RecoveredAccountProfile;