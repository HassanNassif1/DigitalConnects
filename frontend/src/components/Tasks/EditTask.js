import React, { useState, useEffect } from "react";
import { Input, Button, notification, Card, Typography, Divider, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { SaveOutlined, ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    
    const [task, setTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // === UNIFIED DARK THEME ===
    const bgColor = "#0a0a1a";
    const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
    const textColor = "#ffffff";
    const borderColor = "rgba(255, 255, 255, 0.06)";
    const inputBg = "#1a1a35";
    const accentColor = "#6c5ce7";
    const secondaryText = "rgba(255, 255, 255, 0.6)";
    const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontFamily: 'Arial',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        height: 40,
        border: `1px solid ${borderColor}`,
        marginBottom: 12,
        backgroundColor: inputBg,
        color: textColor,
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/viewtasks`);
                const foundTask = response.data.find(t => t.id === parseInt(id));
                if (foundTask) {
                    setTask(foundTask.text);
                } else {
                    notification.error({ message: "Task not found" });
                }
            } catch (error) {
                console.error("Error fetching task:", error);
                notification.error({ message: "Failed to load task" });
            } finally {
                setFetchLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!task.trim()) {
            notification.error({ message: 'Task Required', description: 'Please enter a task before submitting.' });
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/updateTask/${id}`, { text: task });

            if (response.status === 200) {
                notification.success({ message: 'Task Updated', description: 'Your task has been updated successfully!' });
                setTimeout(() => navigate('/viewtasks'), 1500);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            notification.error({ message: 'Update Failed', description: error.response?.data?.error || 'Could not update the task.' });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div style={{ minHeight: "100vh", width: "100%", background: bgColor, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" tip="Loading task..." style={{ color: textColor }} />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            background: bgColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0",
            margin: 0,
            boxSizing: "border-box",
        }}>
            <div style={{ width: "100%", maxWidth: "100%", padding: "20px 24px" }}>
                
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div>
                        <Title level={3} style={{ color: textColor, margin: 0 }}>
                            <EditOutlined style={{ color: accentColor, marginRight: 10 }} />
                            Edit Task
                        </Title>
                        <Text style={{ color: secondaryText, fontSize: 13 }}>Update the description of your task.</Text>
                    </div>
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate('/viewtasks')}
                        style={{ 
                            background: "transparent", 
                            border: `1px solid ${borderColor}`, 
                            color: textColor,
                            borderRadius: 6,
                            height: 34,
                            padding: "0 12px",
                        }}
                        size="small"
                    >
                        Back
                    </Button>
                </div>

                {/* Form Card */}
                <Card
                    style={{
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 12,
                        boxShadow: cardShadow,
                        overflow: "hidden",
                        position: "relative",
                    }}
                    bodyStyle={{ padding: "20px 24px" }}
                >
                    {/* Glow Line */}
                    <div style={{
                        height: "2px",
                        background: `linear-gradient(90deg, ${accentColor}, #a29bfe, ${accentColor})`,
                        backgroundSize: "300% 100%",
                        animation: "gradientMove 4s ease infinite",
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                    }} />

                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: 4 }}>
                            <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>
                                Update Task Description
                            </Text>
                        </div>
                        <Input 
                            type="text" 
                            name="text" 
                            placeholder="Enter the updated task..."
                            required 
                            value={task}
                            onChange={e => setTask(e.target.value)}
                            size="large"
                            style={inputStyle} 
                        />

                        <Divider style={{ borderColor: borderColor, margin: "16px 0 12px 0" }} />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <Button
                                onClick={() => navigate('/viewtasks')}
                                size="middle"
                                style={{
                                    background: "transparent",
                                    border: `1px solid ${borderColor}`,
                                    color: textColor,
                                    borderRadius: 6,
                                    height: 38,
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="middle"
                                loading={loading}
                                icon={<SaveOutlined />}
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                                    border: "none",
                                    boxShadow: `0 4px 15px ${accentColor}44`,
                                    borderRadius: 6,
                                    padding: "0 24px",
                                    height: 38,
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            <style>{`
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .ant-input::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
            `}</style>
        </div>
    );
}

export default EditTask;