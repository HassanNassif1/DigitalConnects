import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Card, Typography, Space, Tag, Tooltip } from 'antd';
import axios from 'axios';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { DeleteOutlined, EyeOutlined, UserAddOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const { Title, Text } = Typography;

const ViewRecoveredAccounts = () => {
    const [data, setData] = useState([]);
    const [userRecords, setUserRecords] = useState({});
    const [searchText, setSearchText] = useState('');
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

    const fetchClient = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/recoveredAccounts');
            setData(response.data);

            const userIds = response.data.map(user => user.id);
            const recordsPromises = userIds.map(id =>
                axios.get(`http://localhost:5000/api/user-accounting/${id}`)
            );

            const recordsResponses = await Promise.all(recordsPromises);
            const recordsStatus = {};
            recordsResponses.forEach((response, index) => {
                recordsStatus[userIds[index]] = response.data.hasRecords;
            });
            setUserRecords(recordsStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchClient();
    }, []);

    const handleViewDetails = (userId) => {
        navigate(`/recoverAccountProfile/${userId}`);
    };
const handleDelete = async (userId) => {
    try {
        // First try to delete edit history
        try {
            await axios.delete(`http://localhost:5000/api/editHistory/${userId}`);
        } catch (historyError) {
            // If history delete fails, continue with account deletion
            console.warn('Edit history deletion failed, continuing with account deletion:', historyError.message);
        }
        
        // Then delete the recovered account
        await axios.delete(`http://localhost:5000/api/deleteRecoveredAccounts/${userId}`);
        await fetchClient();
        notification.success({ 
            message: 'Success', 
            description: 'Account deleted successfully.' 
        });
    } catch (error) {
        console.error('Delete error:', error.response ? error.response.data : error.message);
        notification.error({ 
            message: 'Error', 
            description: 'Failed to delete account.' 
        });
    }
};
    
    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    }

    const columns = [
        {
            title: "Client Name",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text) => (
                <span style={{ color: textColor, fontWeight: 500 }}>{text}</span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (text, record) => (
                <Space>
                    <Tooltip title="View Account Details">
                        <Button 
                            icon={<EyeOutlined />} 
                            onClick={() => handleViewDetails(record.id)} 
                            style={{ 
                                background: "rgba(10, 132, 255, 0.15)", 
                                color: "#0a84ff", 
                                border: "none", 
                                borderRadius: 8,
                                height: 36,
                                padding: "0 16px",
                            }}
                        >
                            Details
                        </Button>
                    </Tooltip>
                    <Tooltip title="View User Profile">
                        <Button 
                            icon={<UserOutlined />} 
                            onClick={() => handleViewProfile(record.sm_id)} 
                            style={{ 
                                background: `rgba(108, 92, 231, 0.15)`, 
                                color: accentColor, 
                                border: "none", 
                                borderRadius: 8,
                                height: 36,
                                padding: "0 16px",
                            }}
                        >
                            Profile
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                        <Button 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(record.id)} 
                            style={{ 
                                background: "rgba(255, 77, 79, 0.15)", 
                                color: "#ff4d4f", 
                                border: "none", 
                                borderRadius: 8,
                                height: 36,
                                padding: "0 16px",
                            }}
                        >
                            Delete
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredData = data.filter((item) =>
        item.username.toLowerCase().includes(searchText.toLowerCase())
    );

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
                
                {/* Header */}
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
                            Recovered Accounts
                        </Title>
                        <Text style={{ color: secondaryText, fontSize: "13px" }}>
                            Manage recovered and hacked account records.
                        </Text>
                    </div>
                    <Button 
                        href="/AddRecoveredAccount" 
                        type="primary" 
                        icon={<UserAddOutlined />} 
                        style={{ 
                            background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`, 
                            border: "none", 
                            borderRadius: 8,
                            height: 40,
                            padding: "0 24px",
                        }}
                    >
                        Create New
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

                    {/* Search Bar */}
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "flex-end", 
                        marginBottom: "16px", 
                        flexShrink: 0,
                    }}>
                        <Input 
                            placeholder="Search by username..." 
                            prefix={<SearchOutlined style={{ color: secondaryText }} />} 
                            value={searchText} 
                            onChange={(e) => setSearchText(e.target.value)} 
                            style={{ 
                                width: 280, 
                                background: inputBg, 
                                borderColor: borderColor, 
                                color: textColor, 
                                borderRadius: 8,
                                height: 40,
                            }} 
                        />
                    </div>

                    {/* Table - Fills remaining space */}
                    <div style={{ flex: 1, overflow: "auto" }}>
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            pagination={{ 
                                pageSize: 10, 
                                position: ["bottomCenter"],
                                style: { marginTop: "16px" }
                            }}
                            rowKey="id"
                            className="dark-table"
                            scroll={{ y: 'calc(100vh - 380px)' }}
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
                    background-color: transparent !important; 
                    color: ${textColor} !important; 
                }
                .dark-table .ant-table-container { 
                    border: none !important; 
                }
                .dark-table .ant-table-thead > tr > th { 
                    background-color: ${inputBg} !important; 
                    color: ${textColor} !important; 
                    border-bottom: 1px solid ${borderColor} !important;
                    padding: 12px 16px !important;
                    font-weight: 600;
                }
                .dark-table .ant-table-tbody > tr > td { 
                    background-color: transparent !important; 
                    color: ${textColor} !important; 
                    border-bottom: 1px solid ${borderColor} !important;
                    padding: 10px 16px !important;
                }
                .dark-table .ant-table-tbody > tr:hover > td { 
                    background-color: rgba(108, 92, 231, 0.08) !important; 
                }
                .dark-table .ant-table-placeholder {
                    background-color: transparent !important;
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

                .ant-input {
                    background-color: ${inputBg} !important;
                    color: ${textColor} !important;
                    border: 1px solid ${borderColor} !important;
                }
                .ant-input::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }

                .ant-card-body {
                    padding: 24px 28px !important;
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
                    .ant-table {
                        font-size: 12px !important;
                    }
                    .ant-btn {
                        font-size: 12px !important;
                        padding: 0 12px !important;
                    }
                    .ant-input {
                        width: 100% !important;
                    }
                    .ant-space {
                        flex-wrap: wrap !important;
                        gap: 8px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ViewRecoveredAccounts;