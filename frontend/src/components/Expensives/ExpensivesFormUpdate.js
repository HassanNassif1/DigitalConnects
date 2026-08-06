import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card, Divider, message, Spin } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import AnimatePhoto from "../Images/AnimatePhoto";
import { WalletOutlined, CalendarOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function ExpensivesFormUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({ id: "", text: "", amount: "", date: "" });
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  // === CONSTANT DARK THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // Unified input style
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontFamily: "Arial",
    fontSize: "14px",
    transition: "all 0.3s ease",
    height: 40,
    border: `1px solid ${borderColor}`,
    marginBottom: 12,
    backgroundColor: inputBg,
    color: textColor,
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        console.log("Fetching expense with ID:", id);
        
        const response = await axios.get(
          `http://localhost:5000/api/expensive-by-id/${id}`
        );
        
        console.log("Fetched data:", response.data);
        
        if (response.data && response.data.length > 0) {
          const expense = response.data[0];
          setData({
            id: expense.id || "",
            text: expense.text || "",
            amount: expense.amount || "",
            date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : ""
          });
        } else {
          message.error("Expense not found");
          setTimeout(() => {
            navigate("/expensives");
          }, 1500);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        
        if (error.response && error.response.status === 404) {
          message.error("Expense not found");
        } else {
          message.error(error.response?.data?.message || "Failed to fetch expense details.");
        }
        
        setTimeout(() => {
          navigate("/expensives");
        }, 2000);
      } finally {
        setFetchLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    } else {
      message.error("Invalid expense ID");
      navigate("/expensives");
    }
  }, [id, navigate]);

  // ===== UPDATE HANDLER =====
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!data.text || !data.text.trim()) {
      message.error("Please enter a description");
      setLoading(false);
      return;
    }
    
    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
      message.error("Please enter a valid amount");
      setLoading(false);
      return;
    }
    
    if (!data.date) {
      message.error("Please select a date");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        text: data.text.trim(),
        amount: parseFloat(data.amount),
        date: data.date
      };
      
      console.log("Updating with payload:", payload);
      
      const response = await axios.put(
        `http://localhost:5000/api/update-expensive/${id}`,
        payload
      );
      
      if (response.status === 200) {
        message.success("Expense updated successfully!");
        setTimeout(() => {
          navigate("/expensives?refresh=true");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      message.error(error.response?.data?.message || "Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLE INPUT CHANGE =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ===== LOADING STATE =====
  if (fetchLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: bgColor, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <Spin size="large" tip="Loading expense details..." />
      </div>
    );
  }

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
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              <WalletOutlined style={{ color: accentColor, marginRight: 10 }} />
              Update Expense
            </Title>
            <Text style={{ color: secondaryText, fontSize: 13 }}>Modify the details of your expense record.</Text>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/expensives")}
            style={{ 
              background: "transparent", 
              border: `1px solid ${borderColor}`, 
              color: textColor,
              borderRadius: 6,
              padding: "0 12px",
              height: 34,
            }}
            size="small"
          >
            Back
          </Button>
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

          <form onSubmit={handleUpdate}>
            {/* Description */}
            <div style={{ marginBottom: 4 }}>
              <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>Description</Text>
            </div>
            <Input
              type="text"
              name="text"
              value={data.text}
              onChange={handleInputChange}
              placeholder="Enter expense description..."
              required
              style={inputStyle}
            />

            {/* Amount */}
            <div style={{ marginTop: 4, marginBottom: 4 }}>
              <Text style={{ color: textColor, fontWeight: 500, display: "block", marginBottom: 4, fontSize: 13 }}>Amount ($)</Text>
            </div>
            <Input
              type="number"
              name="amount"
              value={data.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              required
              step="0.01"
              min="0"
              style={inputStyle}
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
              name="date"
              value={data.date}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />

            <Divider style={{ borderColor: borderColor, margin: "16px 0 12px 0" }} />

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              icon={<SaveOutlined />}
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
              {loading ? "Updating..." : "Update Expense"}
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

export default ExpensivesFormUpdate;