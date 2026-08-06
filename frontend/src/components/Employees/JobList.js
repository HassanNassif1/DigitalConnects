import React, { useState, useEffect } from "react";
import { Input, Button, message, Table, Card, Typography, Space, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const JobList = () => {
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState('');
    const [jobs, setJobs] = useState([]);
    const [editableJobId, setEditableJobId] = useState(null);
    const [editableDescription, setEditableDescription] = useState('');
    const { isDarkMode } = useDarkMode();

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

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getjobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDescription) return;

        try {
            await axios.post('http://localhost:5000/postjob', { job_description: jobDescription });
            setJobDescription('');
            fetchJobs();
            message.success('Job added successfully!');
        } catch (error) {
            console.error('Error adding job:', error);
            message.error('Error adding job.');
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/deletejob/${jobId}`);
            fetchJobs();
            message.success('Job deleted successfully!');
        } catch (error) {
            console.error('Error deleting job:', error);
            message.error('Error deleting job.');
        }
    };

    const handleEditToggle = (jobId) => {
        if (editableJobId === jobId) {
            setEditableJobId(null);
            setEditableDescription('');
        } else {
            const job = jobs.find(j => j.id === jobId);
            setEditableJobId(jobId);
            setEditableDescription(job.job_description);
            setJobDescription('');
        }
    };

    const handleEditSave = async (jobId) => {
        try {
            await axios.put(`http://localhost:5000/updatejob/${jobId}`, { job_description: editableDescription });
            fetchJobs();
            setEditableJobId(null);
            setEditableDescription('');
            message.success('Job updated successfully!');
        } catch (error) {
            console.error('Error updating job:', error);
            message.error('Error updating job.');
        }
    };

    const columns = [
        {
            title: 'Job Description',
            dataIndex: 'job_description',
            key: 'job_description',
            render: (text, record) => (
                <Input
                    value={editableJobId === record.id ? editableDescription : text}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    style={{ 
                        ...inputStyle, 
                        marginBottom: 0,
                        background: editableJobId === record.id ? inputBg : 'transparent',
                        border: editableJobId === record.id ? `1px solid ${accentColor}` : 'none',
                    }}
                    disabled={editableJobId !== record.id}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right',
            width: 200,
            render: (text, record) => (
                <Space>
                    {editableJobId === record.id ? (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => handleEditSave(record.id)}
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                                border: 'none',
                                borderRadius: 8,
                                height: 36,
                            }}
                        >
                            Save
                        </Button>
                    ) : (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditToggle(record.id)}
                            style={{
                                background: 'rgba(255, 193, 7, 0.15)',
                                border: `1px solid rgba(255, 193, 7, 0.3)`,
                                color: '#ffc107',
                                borderRadius: 8,
                                height: 36,
                            }}
                        >
                            Edit
                        </Button>
                    )}
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        style={{
                            background: 'rgba(255, 77, 79, 0.15)',
                            border: `1px solid rgba(255, 77, 79, 0.3)`,
                            borderRadius: 8,
                            height: 36,
                        }}
                    >
                        Delete
                    </Button>
                </Space>
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
                maxWidth: "1200px",
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 48px)",
                padding: 0,
                margin: 0,
            }}>
                
                {/* Header - Compact */}
                <div style={{ 
                    marginBottom: "16px", 
                    flexShrink: 0,
                    padding: 0,
                }}>
                    <Title level={3} style={{ color: textColor, margin: 0, fontSize: "22px" }}>
                        Job Listings
                    </Title>
                    <Text style={{ color: secondaryText, fontSize: "13px" }}>
                        Manage job descriptions for your employees.
                    </Text>
                </div>

                {/* Main Card - Full Height */}
                <Card 
                    style={{ 
                        background: cardBg, 
                        border: `1px solid ${borderColor}`, 
                        borderRadius: 16, 
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)",
                        overflow: "hidden",
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
                        right: 0,
                    }} />
                    
                    {/* Add Job Form - Compact */}
                    <div style={{ 
                        padding: "0 0 16px 0", 
                        borderBottom: `1px solid ${borderColor}`, 
                        marginBottom: "16px",
                        flexShrink: 0,
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px" }}>
                            <Input
                                placeholder="Enter new job description..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                required
                                size="large"
                                style={inputStyle}
                            />
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<PlusOutlined />}
                                size="large"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                                    border: "none",
                                    boxShadow: `0 4px 15px ${accentColor}44`,
                                    borderRadius: 8,
                                    height: 42,
                                    padding: "0 24px",
                                    flexShrink: 0,
                                }}
                            >
                                Add Job
                            </Button>
                        </form>
                    </div>

                    {/* Jobs Table - Fills remaining space */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <Table
                            dataSource={jobs}
                            columns={columns}
                            rowKey="id"
                            pagination={{ 
                                pageSize: 10, 
                                position: ["bottomCenter"],
                                style: { marginTop: "16px" }
                            }}
                            className="dark-table"
                            style={{ flex: 1 }}
                            scroll={{ y: 'calc(100vh - 420px)' }}
                        />
                    </div>
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
                    font-weight: 600;
                    border-bottom: 1px solid ${borderColor} !important;
                    padding: 12px 16px !important;
                }
                .dark-table .ant-table-tbody > tr > td {
                    background-color: transparent !important;
                    color: ${textColor} !important;
                    border-bottom: 1px solid ${borderColor} !important;
                    padding: 8px 16px !important;
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
                    .ant-input {
                        height: 38px !important;
                        font-size: 14px !important;
                    }
                    .ant-btn {
                        height: 38px !important;
                        font-size: 13px !important;
                        padding: 0 16px !important;
                    }
                    form {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobList;