import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  DatePicker,
  notification,
  Tooltip,
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Spin,
  Empty,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  WalletOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { MonthPicker, YearPicker } = DatePicker;
const { Title, Text } = Typography;

function ExpensivesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("currentMonth");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // === FIXED DARK MODE THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // ===== API BASE URL =====
  const API_BASE = "http://localhost:5000";

  // ===== API FUNCTIONS =====
  const fetchSelectedMonthExpenses = async (month) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/expensivesselectedmonth`, {
        params: { date: month },
      });
      setData(response.data);
      setCurrentFilter("selectedMonth");
      setSelectedMonth(month);
    } catch (error) {
      console.error("Error fetching selected month expenses:", error);
      message.error("Failed to fetch selected month expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedYearExpenses = async (year) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/expensivesselectedyear`, {
        params: { date: year },
      });
      setData(response.data);
      setCurrentFilter("selectedYear");
      setSelectedYear(year);
    } catch (error) {
      console.error("Error fetching selected year expenses:", error);
      message.error("Failed to fetch selected year expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentMonthExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/expensivescurrentmonth`);
      setData(response.data);
      setCurrentFilter("currentMonth");
    } catch (error) {
      console.error("Error fetching current month expenses:", error);
      message.error("Failed to fetch current month expenses");
      await fetchAllExpenses();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/expensives`);
      setData(response.data);
      setCurrentFilter("all");
    } catch (error) {
      console.error("Error fetching all expenses:", error);
      message.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  // ===== REFRESH FUNCTION =====
  const refreshData = useCallback(() => {
    if (currentFilter === "currentMonth") fetchCurrentMonthExpenses();
    else if (currentFilter === "selectedMonth") fetchSelectedMonthExpenses(selectedMonth);
    else if (currentFilter === "selectedYear") fetchSelectedYearExpenses(selectedYear);
    else if (currentFilter === "all") fetchAllExpenses();
    else fetchCurrentMonthExpenses();
  }, [currentFilter, selectedMonth, selectedYear]);

  // ===== CRUD FUNCTIONS =====
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/Delete_Expense/${id}`);
      notification.success({
        message: "Deleted",
        description: "Expense record removed successfully.",
      });
      refreshData();
    } catch (error) {
      console.error("Error deleting the expense:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete the expense.",
      });
    }
  };

  const handleEdit = (id) => navigate(`/EditExpensives/${id}`);

  // ===== FILTERS =====
  const applySearchFilter = () => {
    const filtered = data.filter((item) =>
      item.text.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchCurrentMonthExpenses();
  }, []);

  // ===== SEARCH EFFECT =====
  useEffect(() => {
    applySearchFilter();
  }, [data, searchText]);

  // ===== LISTEN FOR NAVIGATION STATE =====
  useEffect(() => {
    if (window.location.search.includes('refresh=true')) {
      refreshData();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refreshData]);

  const totalAmount = filteredData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // ===== TABLE COLUMNS =====
  const columns = [
    {
      title: "Description",
      dataIndex: "text",
      key: "text",
      render: (text) => <span style={{ color: textColor, fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (text) => (
        <span style={{ color: "#fd79a8", fontWeight: 600 }}>
          ${Number(text).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text) => (
        <Tag style={{ background: inputBg, border: `1px solid ${borderColor}`, color: textColor }}>
          {new Date(text).toLocaleDateString()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => handleEdit(record.id)}
              icon={<EditOutlined />}
              style={{
                background: "rgba(255, 193, 7, 0.15)",
                border: "none",
                color: "#ffc107",
                borderRadius: "50%",
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
              style={{
                background: "rgba(255, 77, 79, 0.15)",
                border: "none",
                color: "#ff4d4f",
                borderRadius: "50%",
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        padding: "0",
        display: "flex",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        width: "100%",
        margin: 0,
      }}
    >
      <div style={{ width: "100%", maxWidth: "100%", padding: "20px 24px" }}>
        
        {/* ===== TOP HEADER ===== */}
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              <WalletOutlined style={{ color: accentColor, marginRight: 10 }} />
              Expense Tracker
            </Title>
            <Text style={{ color: secondaryText, fontSize: 13 }}>Monitor, filter, and manage your financial outflows.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/AddExpensives')}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
              border: "none",
              boxShadow: `0 4px 15px ${accentColor}44`,
              height: 36,
              borderRadius: 8,
              color: "#ffffff",
              fontSize: 13,
            }}
          >
            Add New
          </Button>
        </div>

        {/* ===== STATS CARDS ===== */}
        <Row gutter={[12, 12]} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={8}>
            <Card
              style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, boxShadow: cardShadow }}
              bodyStyle={{ padding: "12px 16px" }}
            >
              <Text style={{ color: secondaryText, fontSize: 11 }}>TOTAL EXPENSES</Text>
              <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>
                ${totalAmount.toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, boxShadow: cardShadow }}
              bodyStyle={{ padding: "12px 16px" }}
            >
              <Text style={{ color: secondaryText, fontSize: 11 }}>RECORDS FOUND</Text>
              <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>
                {filteredData.length}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, boxShadow: cardShadow }}
              bodyStyle={{ padding: "12px 16px" }}
            >
              <Text style={{ color: secondaryText, fontSize: 11 }}>ACTIVE FILTER</Text>
              <div style={{ fontSize: 14, fontWeight: 600, color: accentColor, textTransform: 'capitalize' }}>
                {currentFilter === "currentMonth" && <><CalendarOutlined /> This Month</>}
                {currentFilter === "selectedMonth" && <><CalendarOutlined /> {selectedMonth}</>}
                {currentFilter === "selectedYear" && <><CalendarOutlined /> {selectedYear}</>}
                {currentFilter === "all" && <><UnorderedListOutlined /> All Time</>}
              </div>
            </Card>
          </Col>
        </Row>

        {/* ===== GLASS FILTER TOOLBAR ===== */}
        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            marginBottom: "16px",
            boxShadow: cardShadow,
          }}
          bodyStyle={{ padding: "12px 16px" }}
        >
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Search by description..."
                prefix={<SearchOutlined style={{ color: secondaryText }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="middle"
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                  height: 36,
                }}
              />
            </Col>

            <Col xs={12} md={4}>
              <MonthPicker
                placeholder="Month"
                onChange={(value) => {
                  if (value) {
                    const monthStr = value.format("YYYY-MM");
                    fetchSelectedMonthExpenses(monthStr);
                  }
                }}
                size="middle"
                style={{
                  width: "100%",
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                  height: 36,
                }}
              />
            </Col>
            <Col xs={12} md={4}>
              <YearPicker
                placeholder="Year"
                onChange={(value) => {
                  if (value) {
                    const yearStr = value.format("YYYY");
                    fetchSelectedYearExpenses(yearStr);
                  }
                }}
                size="middle"
                style={{
                  width: "100%",
                  background: inputBg,
                  borderColor: borderColor,
                  color: textColor,
                  borderRadius: 8,
                  height: 36,
                }}
              />
            </Col>

            <Col xs={24} md={8} style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
              <Button
                onClick={() => { fetchAllExpenses(); }}
                icon={<UnorderedListOutlined />}
                size="small"
                style={{
                  background: "transparent",
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  borderRadius: 6,
                  height: 32,
                }}
              >
                All
              </Button>
              <Button
                onClick={() => { 
                  setSearchText("");
                  refreshData(); 
                }}
                icon={<ReloadOutlined />}
                size="small"
                style={{
                  background: "transparent",
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  borderRadius: 6,
                  height: 32,
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>

        {/* ===== DATA TABLE ===== */}
        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: cardShadow,
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Spin spinning={loading}>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              locale={{
                emptyText: (
                  <Empty 
                    description="No expenses found" 
                    style={{ 
                      color: secondaryText,
                      padding: '40px 0',
                    }}
                  />
                )
              }}
              pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
                style: { color: textColor, margin: "8px 0" },
                showTotal: (total) => (
                  <span style={{ color: secondaryText, fontSize: 13 }}>Total {total} records</span>
                ),
              }}
              size="middle"
            />
          </Spin>
        </Card>
        
      </div>

      <style>{`
        .ant-table {
          background: transparent !important;
          color: ${textColor} !important;
        }
        .ant-table-thead > tr > th {
          background: ${inputBg} !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
          font-weight: 600 !important;
          padding: 10px 12px !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          padding: 10px 12px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.08) !important;
        }
        .ant-table-placeholder {
          background: transparent !important;
        }
        .ant-table-placeholder .ant-empty-description {
          color: ${secondaryText} !important;
        }

        .ant-picker {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
          height: 36px !important;
        }
        .ant-picker-input > input {
          color: ${textColor} !important;
        }
        .ant-picker-suffix {
          color: ${secondaryText} !important;
        }
        .ant-picker-dropdown {
          background: ${inputBg} !important;
          border: 1px solid ${borderColor} !important;
        }
        .ant-picker-header-view {
          color: ${textColor} !important;
        }
        .ant-picker-cell-inner {
          color: ${textColor} !important;
        }
        .ant-picker-cell-disabled .ant-picker-cell-inner {
          color: ${secondaryText} !important;
        }
        .ant-picker-cell-selected .ant-picker-cell-inner {
          background: ${accentColor} !important;
        }

        .ant-pagination-item a {
          color: ${textColor} !important;
        }
        .ant-pagination-item-active {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-pagination-item-ellipsis {
          color: ${secondaryText} !important;
        }
        .ant-pagination-prev button,
        .ant-pagination-next button {
          color: ${textColor} !important;
        }

        .ant-input {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
          height: 36px !important;
        }
        .ant-input::placeholder {
          color: ${secondaryText} !important;
        }

        .ant-card-head {
          color: ${textColor} !important;
        }
        .ant-card-head-title {
          color: ${textColor} !important;
        }

        .ant-spin-text {
          color: ${textColor} !important;
        }
        .ant-spin-dot-item {
          background-color: ${accentColor} !important;
        }
      `}</style>
    </div>
  );
}

export default ExpensivesList;