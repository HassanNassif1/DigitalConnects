import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card, Divider, Space, message, Spin } from "antd";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import AnimatePhoto from "../Images/AnimatePhoto";
import { WalletOutlined, CalendarOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function ExpensivesForm() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    date: ''
  });

  // === CONSTANT DARK THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // Single unified input style
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: 'Arial',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    height: 44,
    border: `1px solid ${borderColor}`,
    marginBottom: 16,
    backgroundColor: inputBg,
    color: textColor,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const API_BASE = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.text || !formData.amount || !formData.date) {
      message.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (isNaN(formData.amount)) {
      message.error("Amount must be a valid number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/AddExpensives`, {
        text: formData.text,
        amount: parseFloat(formData.amount),
        date: formData.date
      });

      if (response.status === 200) {
        message.success("Expense added successfully!");
        setTimeout(() => {
          navigate('/expensives?refresh=true');
        }, 1500);
        setFormData({ text: '', amount: '', date: '' });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      message.error(error.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        padding: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        width: "100%",
        margin: 0,
      }}
    >
      <div style={{ width: "100%", maxWidth: "100%", padding: "20px 24px" }}>
        
        {/* ===== HEADER ===== */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/expensives')}
              style={{
                color: secondaryText,
                fontSize: '14px',
                padding: '4px 12px',
              }}
            >
              Back
            </Button>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              <WalletOutlined style={{ color: accentColor, marginRight: 10 }} />
              Add Expense
            </Title>
            <div style={{ width: 60 }} />
          </div>
          <Text style={{ color: secondaryText, fontSize: 13 }}>Record a new financial expense for your records.</Text>
        </div>

        {/* ===== MAIN FORM CARD ===== */}
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
          {/* Animated Top Glow Line */}
          <div
            style={{
              height: "2px",
              background: `linear-gradient(90deg, ${accentColor}, #a29bfe, ${accentColor})`,
              backgroundSize: "300% 100%",
              animation: "gradientMove 4s ease infinite",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          />

          <form onSubmit={handleSubmit}>
            {/* Description */}
            <div style={{ marginBottom: 4 }}>
              <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>Description</Text>
            </div>
            <Input
              type="text"
              className="form-control"
              name="text"
              placeholder="Enter expense description..."
              value={formData.text}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                height: 40,
                marginBottom: 12,
              }}
            />

            {/* Amount */}
            <div style={{ marginTop: 4, marginBottom: 4 }}>
              <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>Amount ($)</Text>
            </div>
            <Input
              type="number"
              className="form-control"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              style={{
                ...inputStyle,
                height: 40,
                marginBottom: 12,
              }}
            />

            {/* Date */}
            <div style={{ marginTop: 4, marginBottom: 4 }}>
              <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>
                <CalendarOutlined style={{ marginRight: 6, color: accentColor }} />
                Date
              </Text>
            </div>
            <Input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                height: 40,
                marginBottom: 12,
              }}
            />

            <Divider style={{ borderColor: borderColor, margin: "16px 0 12px 0" }} />

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              name="submit"
              size="large"
              block
              icon={loading ? <Spin size="small" /> : <SaveOutlined />}
              disabled={loading}
              style={{
                background: loading ? '#4a4a6a' : `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                border: "none",
                boxShadow: `0 4px 15px ${accentColor}44`,
                height: 42,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 8,
                color: "#ffffff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.transform = "scale(1)";
              }}
            >
              {loading ? "Adding..." : "Add Expense"}
            </Button>

          </form>
        </Card>
        
        <div style={{ marginTop: "30px" }}>
          <AnimatePhoto />
        </div>
      </div>

      {/* ===== CSS ANIMATIONS & OVERRIDES ===== */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        input[type="date"] {
          color: #ffffff !important;
          background-color: #1a1a2e !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default ExpensivesForm;