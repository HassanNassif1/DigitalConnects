import React, { useState, useEffect } from "react";
import { Input, Button, message, DatePicker, Select, Card, Row, Col, Typography, Divider, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
import dayjs from "dayjs";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  MailOutlined,
  TagOutlined,
  PhoneOutlined,
  FlagOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

function EditQuotation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { isDarkMode } = useDarkMode();
    const [countryCode, setCountryCode] = useState('');

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
        boxSizing: 'border-box',
        fontFamily: 'Arial',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        height: 42,
        border: `1px solid ${borderColor}`,
        backgroundColor: inputBg,
        color: textColor,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://localhost:5000/GetQuotationById/${id}`);
                    console.log("Fetched data:", response.data);
                    
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        const formattedRecord = response.data.map(item => ({
                            ...item,
                            plan_date: item.plan_date ? new Date(item.plan_date).toISOString().split('T')[0] : null,
                            amount: parseFloat(item.amount) || 0,
                            price: parseFloat(item.price) || 0,
                            remaining: parseFloat(item.remaining) || 0,
                        }));
                        setUsers(formattedRecord);
                    } else {
                        message.warning('No quotation data found for this ID');
                        setUsers([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 404) {
                    message.error('Quotation not found. Please check the ID.');
                } else {
                    message.error('Error fetching quotation data');
                }
                setUsers([]);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDateChange = (date, dateString) => {
        if(users.length > 0) {
            const updatedRecord = [...users];
            updatedRecord[0] = { ...updatedRecord[0], plan_date: dateString };
            setUsers(updatedRecord);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(users.length > 0) {
            const updatedRecord = [...users];
            updatedRecord[0] = { ...updatedRecord[0], [name]: value };
            setUsers(updatedRecord);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if(users.length === 0) {
            message.error('No data to update');
            return;
        }
        setLoading(true);
        try {
            const updatedRecord = users[0];
            const response = await axios.put(`http://localhost:5000/UpdateQuotation/${id}`, updatedRecord);

            if (response.status === 200) {
                message.success(response.data.message || 'Quotation updated successfully');
                navigate('/quotations');
            } else {
                message.error(`Update failed: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating users:', error.response ? error.response.data : error.message);
            message.error('Error updating users');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div style={{ 
                minHeight: "100vh", 
                width: "100%", 
                background: bgColor,
                backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center" 
            }}>
                <Spin size="large" tip="Loading Quotation..." style={{ color: textColor }} />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div style={{ 
                minHeight: "100vh", 
                width: "100%", 
                background: bgColor,
                backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                flexDirection: "column",
                gap: "20px"
            }}>
                <Card
                    style={{
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        maxWidth: 500,
                        textAlign: "center",
                        padding: "40px"
                    }}
                >
                    <Title level={3} style={{ color: textColor }}>
                        <FileTextOutlined style={{ color: accentColor, marginRight: 12 }} />
                        Quotation Not Found
                    </Title>
                    <Text style={{ color: secondaryText, display: "block", marginBottom: 20 }}>
                        The quotation with ID #{id} could not be found.
                    </Text>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/quotations')}
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                            border: "none",
                            borderRadius: 8,
                            padding: "0 30px",
                            height: 40
                        }}
                    >
                        Back to Quotations
                    </Button>
                </Card>
            </div>
        );
    }

    const e = users[0] || {};

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
                
                {/* Header with Back Button - Compact */}
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
                            <EditOutlined style={{ color: accentColor, marginRight: 10 }} />
                            Edit Quotation
                        </Title>
                        <Text style={{ color: secondaryText, fontSize: "13px" }}>
                            Modify the details of quotation #{id}.
                        </Text>
                    </div>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/quotations')}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${borderColor}`,
                            color: textColor,
                            borderRadius: 8,
                            padding: "6px 18px",
                            height: 38,
                        }}
                    >
                        Back
                    </Button>
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
                        padding: "24px 28px", 
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
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

                    <form 
                        onSubmit={handleUpdate} 
                        style={{ 
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <Row gutter={[24, 12]} style={{ flex: 1 }}>
                            
                            {/* Username */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <UserOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Username
                                    </Text>
                                </div>
                                <Input
                                    name="username"
                                    placeholder="Enter username..."
                                    value={e.username || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Plan Date */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <CalendarOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Plan Date
                                    </Text>
                                </div>
                                <DatePicker
                                    value={e.plan_date ? dayjs(e.plan_date) : null}
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
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <DollarOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Amount ($)
                                    </Text>
                                </div>
                                <Input
                                    type="number"
                                    name="amount"
                                    placeholder="0.00"
                                    value={e.amount || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                    step="0.01"
                                />
                            </Col>

                            {/* Email */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <MailOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Email
                                    </Text>
                                </div>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email..."
                                    value={e.email || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Package */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <TagOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Package
                                    </Text>
                                </div>
                                <Input
                                    name="type"
                                    placeholder="Enter package details..."
                                    value={e.type || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Phone Number */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <PhoneOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Phone Number
                                    </Text>
                                </div>
                                <Input
                                    name="phone_number"
                                    placeholder={`Enter phone number...`}
                                    value={e.phone_number || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Nationality */}
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <FlagOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Nationality
                                    </Text>
                                </div>
                                <Input
                                    name="nationality"
                                    placeholder="Enter nationality..."
                                    value={e.nationality || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Address - Full Width */}
                            <Col span={24}>
                                <div style={{ marginBottom: 3 }}>
                                    <Text style={{ color: secondaryText, fontSize: 12 }}>
                                        <HomeOutlined style={{ marginRight: 5, color: accentColor }} />
                                        Address
                                    </Text>
                                </div>
                                <Input
                                    name="address"
                                    placeholder="Enter address..."
                                    value={e.address || ''}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    style={inputStyle}
                                />
                            </Col>

                            {/* Submit Button - Pushed to bottom */}
                            <Col span={24} style={{ marginTop: "auto", paddingTop: 12 }}>
                                <Divider style={{ borderColor: borderColor, margin: "4px 0 12px 0" }} />
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                                    <Button
                                        onClick={() => navigate('/quotations')}
                                        size="large"
                                        style={{
                                            background: "transparent",
                                            border: `1px solid ${borderColor}`,
                                            color: textColor,
                                            borderRadius: 8,
                                            padding: "0 28px",
                                            height: 40,
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
                                            padding: "0 28px",
                                            height: 40,
                                        }}
                                    >
                                        {loading ? "Updating..." : "Update Quotation"}
                                    </Button>
                                </div>
                            </Col>

                        </Row>
                    </form>
                </Card>
                
                <div style={{ marginTop: "20px", flexShrink: 0 }}>
                    <AnimatePhoto />
                </div>
            </div>

            <style>{`
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .dark-datepicker .ant-picker {
                    background: ${inputBg} !important;
                    border-color: ${borderColor} !important;
                    border-radius: 8px !important;
                    height: 42px !important;
                    display: flex !important;
                    align-items: center !important;
                    width: 100% !important;
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

                .ant-card-body {
                    padding: 24px 28px !important;
                }

                @media (max-width: 768px) {
                    .ant-card-body {
                        padding: 16px !important;
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

export default EditQuotation;