import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, message, Checkbox, Card, Row, Col, Typography, Divider, Space, Tag, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  TagOutlined,
  WalletOutlined,
  PercentageOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Edit_Accounting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Theme variables matching UsersPage
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.7)";

  const [record, setRecord] = useState({
    username: "",
    plan_date: "",
    amount: "",
    package: "",
    remaining_payment: "",
    price_on_me: "",
    remaining_package: "",
  });
  const [isPaid, setIsPaid] = useState(false);
  const [remainingChanged, setRemainingChanged] = useState(null);
  const [remainingHistory, setRemainingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch record data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No ID provided");
        setLoading(false);
        return;
      }

      console.log("Fetching record with ID:", id);
      setLoading(true);
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/GetAccountingById/${id}`
        );
        console.log("Fetched record data:", response.data);
        
        const item = response.data;
        setRecord({
          username: item.username || "",
          plan_date: item.plan_date || "",
          amount: item.amount || "",
          package: item.package || "",
          remaining_payment: item.remaining_payment || "",
          price_on_me: item.price_on_me || "",
          remaining_package: item.remaining_package || "",
        });
        setIsPaid(!!item.is_paid);
        setRemainingChanged(item.remaining_changed || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error fetching accounting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch remaining package history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/RemainingPackageHistory/${id}`
        );
        setRemainingHistory(response.data);
      } catch (error) {
        console.error("Error fetching remaining package history:", error);
      }
    };

    if (id) fetchHistory();
  }, [id]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setRecord((prev) => ({
      ...prev,
      [name]:
        name === "plan_date"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));

    if (name === "remaining_package") {
      setRemainingChanged(new Date().toISOString());
    }
  };

  // Handle update
  const handleUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      ...record,
      is_paid: isPaid,
      remaining_changed: remainingChanged,
    };

    console.log("Updating with payload:", payload);

    try {
      const response = await axios.put(
        `http://localhost:5000/UpdateAccounting/${id}`,
        payload
      );
      message.success(response.data.message || "Record updated successfully");
      navigate("/accounting");
    } catch (error) {
      console.error("Error updating:", error);
      message.error(error.response?.data?.message || "Error updating record");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: bgColor,
      }}>
        <Spin size="large" tip="Loading record..." />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: bgColor,
      minHeight: "100vh",
      padding: "30px",
      overflowX: "hidden",
      width: "100%",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        overflowX: "hidden",
        padding: "0 10px",
      }}>
        
        {/* Header with Back Button */}
        <div style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <SaveOutlined style={{ color: accentColor, marginRight: 12 }} />
                Edit Invoice
              </Title>
              <Text style={{ color: secondaryText }}>
                Update invoice details for invoice #{id}
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

          <form onSubmit={handleUpdate}>
            <Row gutter={[24, 24]}>
              
              {/* Username - Disabled */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <UserOutlined style={{ marginRight: 6, color: accentColor }} />
                    Username
                  </Text>
                </div>
                <Input
                  name="username"
                  value={record.username}
                  disabled
                  size="large"
                  style={{
                    background: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: 8,
                    opacity: 0.6,
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
                <Input
                  type="date"
                  name="plan_date"
                  value={record.plan_date}
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
                  value={record.amount}
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

              {/* Package */}
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <TagOutlined style={{ marginRight: 6, color: accentColor }} />
                    Package
                  </Text>
                </div>
                <Input
                  name="package"
                  value={record.package}
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

              {/* Remaining Payment */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <WalletOutlined style={{ marginRight: 6, color: accentColor }} />
                    Remaining Payment
                  </Text>
                </div>
                <Input
                  name="remaining_payment"
                  value={record.remaining_payment}
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

              {/* Price on Me */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <PercentageOutlined style={{ marginRight: 6, color: accentColor }} />
                    Price On Me
                  </Text>
                </div>
                <Input
                  name="price_on_me"
                  value={record.price_on_me}
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

              {/* Remaining Package */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: secondaryText, fontSize: 13 }}>
                    <TagOutlined style={{ marginRight: 6, color: accentColor }} />
                    Remaining Package
                  </Text>
                </div>
                <Input
                  name="remaining_package"
                  value={record.remaining_package}
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

              {/* Paid Checkbox */}
              <Col span={24}>
                <div style={{
                  background: inputBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <Checkbox
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    style={{ color: textColor }}
                  >
                    <span style={{ color: textColor }}>
                      {isPaid ? (
                        <><CheckCircleOutlined style={{ color: "#00b894" }} /> Mark as Paid</>
                      ) : (
                        <><ClockCircleOutlined style={{ color: "#fdcb6e" }} /> Mark as Pending</>
                      )}
                    </span>
                  </Checkbox>
                  <Tag color={isPaid ? "success" : "warning"} style={{ marginLeft: "auto" }}>
                    {isPaid ? "Paid" : "Pending"}
                  </Tag>
                </div>
              </Col>

              {/* Remaining History */}
              {remainingHistory.length > 0 && (
                <Col span={24}>
                  <Divider style={{ borderColor: borderColor }}>
                    <Text style={{ color: secondaryText }}>
                      <HistoryOutlined style={{ marginRight: 8, color: accentColor }} />
                      Change History
                    </Text>
                  </Divider>
                  <div style={{
                    background: inputBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    padding: "16px",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}>
                    {remainingHistory.map((entry, idx) => (
                      <div key={idx} style={{
                        padding: "8px 12px",
                        borderBottom: idx < remainingHistory.length - 1 ? `1px solid ${borderColor}` : "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}>
                        <Text style={{ color: secondaryText, fontSize: 12 }}>
                          {new Date(entry.updated_at).toLocaleString("en-US", {
                            timeZone: "Asia/Beirut",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                        <Text style={{ color: textColor, fontSize: 13 }}>
                          <span style={{ color: secondaryText }}>From</span>
                          <Tag color="red" style={{ margin: "0 4px" }}>{entry.previous_value}</Tag>
                          <span style={{ color: secondaryText }}>➜</span>
                          <Tag color="green" style={{ margin: "0 4px" }}>{entry.updated_value}</Tag>
                        </Text>
                      </div>
                    ))}
                  </div>
                </Col>
              )}

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
                    loading={submitting}
                    icon={<SaveOutlined />}
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                      border: "none",
                      boxShadow: `0 4px 15px ${accentColor}44`,
                      borderRadius: 8,
                      padding: "0 30px",
                    }}
                  >
                    {submitting ? "Updating..." : "Update Invoice"}
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

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        input[type="number"]::-webkit-inner-spin-button {
          opacity: 0.5;
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

        .ant-message .ant-message-notice-content {
          background: ${inputBg} !important;
          border: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          border-radius: 8px !important;
        }

        .ant-spin-text {
          color: ${textColor} !important;
        }

        .ant-spin-dot-item {
          background-color: ${accentColor} !important;
        }

        @media (max-width: 768px) {
          .ant-card-body {
            padding: 16px !important;
          }
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(108, 92, 231, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(108, 92, 231, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Edit_Accounting;