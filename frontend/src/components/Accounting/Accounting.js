import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  notification,
  DatePicker,
  Tooltip,
  Switch,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
  Badge,
  Dropdown,
  Menu,
  Typography,
  Divider,
  Select,
  Modal,
  Progress,
  Empty,
  Spin,
} from "antd";
import moment from "moment-timezone";
import axios from "axios";
import "./app.css";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";
import digitalconnects from "./digitalconnects.jpg";
import { useNavigate } from "react-router-dom";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CloseOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined,
  WalletOutlined,
  PercentageOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Accounting = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Theme variables - Updated to match UsersPage
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  // State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalPriceOnMe, setTotalPriceOnMe] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalUniqueClients, setTotalUniqueClients] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [chartData, setChartData] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const handleEdit = (id) => {
    navigate(`/UpdateAccounting/${id}`);
  };

  // Filtering functions
  const filterDataByCurrentDay = (record) => {
    const currentDate = new Date();
    const recordDate = new Date(record.plan_date);
    return (
      recordDate.getDate() === currentDate.getDate() &&
      recordDate.getMonth() === currentDate.getMonth() &&
      recordDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const filterDataByDateRange = (record) => {
    if (!startDate || !endDate) return true;
    const recordDate = new Date(record.plan_date);
    return recordDate >= startDate && recordDate <= endDate;
  };

  const filterDataByDateDay = (record) => {
    if (!selectedDate) return true;
    const recordDate = new Date(record.plan_date);
    const selectedDateObj = new Date(selectedDate);
    return (
      recordDate.getDate() === selectedDateObj.getDate() &&
      recordDate.getMonth() === selectedDateObj.getMonth() &&
      recordDate.getFullYear() === selectedDateObj.getFullYear()
    );
  };

  const handleFilterByCurrentDay = () => {
    const filteredRecords = data.filter(filterDataByCurrentDay);
    setData(filteredRecords);
    setFilterType("today");
  };

  // Chart data generator
  const generateChartData = (filteredRecords) => {
    const chartLabels = [];
    const chartDataValues = [];
    const groupedData = filteredRecords.reduce((acc, record) => {
      const recordDate = new Date(record.plan_date);
      const monthYearKey = `${recordDate.toLocaleString('default', { month: 'short' })} ${recordDate.getFullYear()}`;
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = 0;
      }
      acc[monthYearKey] += record.amount - record.price_on_me;
      return acc;
    }, {});
    Object.keys(groupedData).forEach((key) => {
      chartLabels.push(key);
      chartDataValues.push(groupedData[key]);
    });
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "Total Profit",
          data: chartDataValues,
          backgroundColor: "rgba(108, 92, 231, 0.4)",
          borderColor: "#6c5ce7",
          borderWidth: 2,
          borderRadius: 4,
          tension: 0.4,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: { size: 12, weight: "600" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(20,20,43,0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context) => `Profit: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
        ticks: {
          color: "rgba(255,255,255,0.7)",
        },
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
        ticks: {
          color: "rgba(255,255,255,0.7)",
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  // Fetch all data
  const fetchAllData = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        setData(response.data);
        setSelectedMonth("");
        setSelectedYear("");
        setFilterType("all");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        notification.error({
          message: "Error",
          description: "Failed to fetch accounting data.",
        });
      });
  };

  const fetchCurrentMonthData = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        setData(response.data);
        const currentDate = new Date();
        setSelectedMonth(currentDate.getMonth() + 1);
        setSelectedYear(currentDate.getFullYear());
        setFilterType("month");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const filterRemainingPackages = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        const remainingData = response.data.filter(
          (record) => record.is_paid !== true
        );
        setData(remainingData);
        setSelectedMonth("");
        setSelectedYear("");
        setFilterType("remaining");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const filterDataByMonthAndYear = (record) => {
    if (!selectedMonth || !selectedYear) return true;
    const recordDate = new Date(record.plan_date);
    const recordMonth = recordDate.getMonth() + 1;
    const recordYear = recordDate.getFullYear();
    return recordMonth === selectedMonth && recordYear === selectedYear;
  };

  const handleDateChange = (date, dateString) => {
    if (date) {
      setSelectedMonth(date.month() + 1);
      setSelectedYear(date.year());
      setFilterType("month");
    } else {
      setSelectedMonth("");
      setSelectedYear("");
    }
  };

  const handleOpenChange = (open) => {};

  // PDF and Excel download functions (keep as is)
  const downloadPDFInvoice = (record) => {
    // ... existing code ...
  };

  const downloadPDFRemaining = (record) => {
    // ... existing code ...
  };

  const downloadExcelInvoice = (record) => {
    // ... existing code ...
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Invoice",
      content: "Are you sure you want to delete this invoice? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        axios
          .delete(`http://localhost:5000/api/Remove_Data/${id}`)
          .then(() => {
            fetchAllData();
            notification.success({
              message: "Success",
              description: "Invoice deleted successfully.",
            });
          })
          .catch((error) => {
            console.error("Error deleting the record:", error);
            notification.error({
              message: "Error",
              description: "Failed to delete the record.",
            });
          });
      },
    });
  };

  const handleToggleIsPaid = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/UpdateIsPaid/${id}`, {
        isPaid: !currentStatus,
      });
      setData((prevData) =>
        prevData.map((record) =>
          record.id === id ? { ...record, is_paid: !currentStatus } : record
        )
      );
      notification.success({
        message: "Success",
        description: `Payment status updated to ${!currentStatus ? "Paid" : "Not Paid"}.`,
      });
    } catch (error) {
      console.error("Error updating isPaid status:", error);
      notification.error({
        message: "Error",
        description: "Failed to update payment status.",
      });
    }
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#ffffff" }}>{text}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            {record.email || ""}
          </div>
        </div>
      ),
    },
    {
      title: "Plan Date",
      dataIndex: "plan_date",
      key: "plan_date",
      sorter: (a, b) => new Date(a.plan_date) - new Date(b.plan_date),
      render: (text) => (
        <span style={{ color: "#ffffff" }}>
          {text ? new Date(text).toLocaleDateString() : ""}
        </span>
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      render: (text) => {
        const items = text ? text.split("+").map((item) => item.trim()) : [];
        return (
          <div>
            {items.map((item, i) => (
              <Tag key={i} color="blue" style={{ marginBottom: 4, color: "#ffffff", background: "rgba(24,144,255,0.2)", borderColor: "rgba(24,144,255,0.3)" }}>
                {item}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Remaining",
      dataIndex: "remaining_package",
      key: "remaining_package",
      render: (text) => {
        const items = text ? text.split("+").map((item) => item.trim()) : [];
        return (
          <div>
            {items.map((item, i) => (
              <Tag key={i} color="orange" style={{ marginBottom: 4, color: "#ffffff", background: "rgba(255,165,0,0.2)", borderColor: "rgba(255,165,0,0.3)" }}>
                {item}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <span style={{ color: "#00b894", fontWeight: 600 }}>${text}</span>
      ),
    },
    {
      title: "Price On Me",
      dataIndex: "price_on_me",
      key: "price_on_me",
      render: (text) => (
        <span style={{ color: "#fdcb6e", fontWeight: 600 }}>${text}</span>
      ),
    },
    {
      title: "Profit",
      key: "profit",
      render: (text, record) => (
        <span style={{ color: "#6c5ce7", fontWeight: 700 }}>
          ${(record.amount - record.price_on_me).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Badge
          status={record.is_paid ? "success" : "warning"}
          text={record.is_paid ? "Paid" : "Pending"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 280,
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setDetailModalVisible(true);
              }}
              size="small"
              style={{ color: "#6c5ce7", background: "rgba(108,92,231,0.1)", borderColor: "rgba(108,92,231,0.2)" }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              size="small"
              style={{ color: "#1890ff", background: "rgba(24,144,255,0.1)", borderColor: "rgba(24,144,255,0.2)" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              size="small"
              danger
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu style={{ background: "#1a1a35", borderColor: "rgba(255,255,255,0.06)" }}>
                <Menu.Item key="1" onClick={() => downloadPDFInvoice(record)} style={{ color: "#ffffff" }}>
                  <FilePdfOutlined /> Invoice PDF
                </Menu.Item>
                <Menu.Item key="2" onClick={() => downloadPDFRemaining(record)} style={{ color: "#ffffff" }}>
                  <FilePdfOutlined /> Remaining PDF
                </Menu.Item>
                <Menu.Item key="3" onClick={() => downloadExcelInvoice(record)} style={{ color: "#ffffff" }}>
                  <FileExcelOutlined /> Excel Export
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button size="small" icon={<DownloadOutlined />} style={{ color: "#ffffff", background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const filteredData = data
    .filter((item) =>
      item.username &&
      item.username.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(filterDataByMonthAndYear)
    .filter(filterDataByDateRange)
    .filter(filterDataByDateDay);

  useEffect(() => {
    const filteredRecords = data
      .filter((item) =>
        item.username &&
        item.username.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter(filterDataByDateRange)
      .filter(filterDataByDateDay)
      .filter(filterDataByMonthAndYear);

    const totalAmountValue = filteredRecords
      .reduce((total, record) => total + Number(record.amount), 0)
      .toFixed(2);
    setTotalAmount(totalAmountValue);

    const totalProfitValue = filteredRecords
      .reduce((total, record) => total + (record.amount - record.price_on_me), 0)
      .toFixed(2);
    setTotalProfit(parseFloat(totalProfitValue) === 0 ? "0.00" : totalProfitValue);

    const totalPriceOnMeValue = filteredRecords
      .reduce((total, record) => total + Number(record.price_on_me), 0)
      .toFixed(2);
    setTotalPriceOnMe(totalPriceOnMeValue);

    const uniqueClientsSet = new Set();
    filteredRecords.forEach((currentUser) => {
      if (currentUser.username)
        uniqueClientsSet.add(currentUser.username.toLowerCase());
    });
    setTotalUniqueClients(uniqueClientsSet.size);
    setTotalInvoices(filteredRecords.length);

    if (filteredRecords.length > 0) {
      setChartData(generateChartData(filteredRecords));
    } else {
      setChartData(null);
    }
  }, [data, searchText, selectedMonth, selectedYear, startDate, endDate, selectedDate]);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Quick filter buttons
  const filterButtons = [
    { key: "all", label: "View All", action: fetchAllData, icon: <ReloadOutlined /> },
    { key: "today", label: "Today", action: handleFilterByCurrentDay, icon: <CalendarOutlined /> },
    { key: "month", label: "This Month", action: fetchCurrentMonthData, icon: <CalendarOutlined /> },
    { key: "remaining", label: "Remaining", action: filterRemainingPackages, icon: <WalletOutlined /> },
  ];

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "flex-start", 
      background: bgColor, 
      minHeight: "100vh",
      padding: "30px 20px",
      overflowX: "hidden",
      width: "100%",
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "1400px",
        margin: "0 auto",
        overflowX: "hidden",
        padding: "0 10px",
      }}>
        {/* ====== HEADER ====== */}
        <div style={{ marginBottom: 30 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ color: "#ffffff", marginBottom: 4 }}>
                <BarChartOutlined style={{ color: accentColor, marginRight: 12 }} />
                Accounting Dashboard
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Manage invoices, track payments, and monitor financial performance
              </Text>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchAllData}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    borderRadius: 8,
                  }}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  href="/CreateAccounting"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                    border: "none",
                    boxShadow: `0 4px 15px ${accentColor}44`,
                    borderRadius: 8,
                  }}
                >
                  Create Invoice
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  href="/CreateQuotation"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${borderColor}`,
                    color: "#ffffff",
                    borderRadius: 8,
                  }}
                >
                  Create Quotation
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* ====== STATISTICS CARDS ====== */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Profit</Text>}
                value={`$${totalProfit}`}
                prefix={<DollarOutlined style={{ color: "#00b894" }} />}
                valueStyle={{ color: "#00b894" }}
              />
              <Progress percent={75} showInfo={false} strokeColor="#00b894" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Amount</Text>}
                value={`$${totalAmount}`}
                prefix={<WalletOutlined style={{ color: "#6c5ce7" }} />}
                valueStyle={{ color: "#6c5ce7" }}
              />
              <Progress percent={65} showInfo={false} strokeColor="#6c5ce7" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Price On Me</Text>}
                value={`$${totalPriceOnMe}`}
                prefix={<PercentageOutlined style={{ color: "#fdcb6e" }} />}
                valueStyle={{ color: "#fdcb6e" }}
              />
              <Progress percent={45} showInfo={false} strokeColor="#fdcb6e" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Total Invoices</Text>}
                value={totalInvoices}
                prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress percent={100} showInfo={false} strokeColor="#1890ff" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Unique Clients</Text>}
                value={totalUniqueClients}
                prefix={<TeamOutlined style={{ color: "#ff6b6b" }} />}
                valueStyle={{ color: "#ff6b6b" }}
              />
              <Progress percent={80} showInfo={false} strokeColor="#ff6b6b" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16,
              boxShadow: cardShadow,
            }}>
              <Statistic
                title={<Text style={{ color: secondaryText }}>Pending</Text>}
                value={data.filter(r => !r.is_paid).length}
                prefix={<Badge status="warning" />}
                valueStyle={{ color: "#fdcb6e" }}
              />
              <Progress 
                percent={data.length > 0 ? Math.round((data.filter(r => !r.is_paid).length / data.length) * 100) : 0} 
                showInfo={false} 
                strokeColor="#fdcb6e" 
              />
            </Card>
          </Col>
        </Row>

        {/* ====== CHART ====== */}
        {chartData && (
          <Card style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`, 
            borderRadius: 16, 
            marginBottom: 24, 
            overflow: "hidden",
            boxShadow: cardShadow,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text strong style={{ color: "#ffffff", fontSize: 16 }}>
                <BarChartOutlined style={{ marginRight: 8 }} /> Profit Trends
              </Text>
              <Tag color="purple" style={{ color: "#fff", background: "rgba(108,92,231,0.2)", borderColor: "rgba(108,92,231,0.3)" }}>Monthly Overview</Tag>
            </div>
            <div style={{ height: 300, overflow: "hidden" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card>
        )}

        {/* ====== FILTERS & SEARCH ====== */}
        <Card style={{ 
          background: cardBg, 
          border: `1px solid ${borderColor}`, 
          borderRadius: 16, 
          marginBottom: 24, 
          overflow: "hidden",
          boxShadow: cardShadow,
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Search by client name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined style={{ color: secondaryText }} />}
                style={{
                  background: inputBg,
                  borderColor: borderColor,
                  color: "#ffffff",
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <DatePicker.MonthPicker
                onChange={handleDateChange}
                onOpenChange={handleOpenChange}
                placeholder="Select Month"
                style={{ 
                  width: "100%", 
                  background: inputBg, 
                  borderColor: borderColor,
                  color: "#ffffff",
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <DatePicker
                placeholder="Select Date"
                onChange={(date, dateString) => setSelectedDate(dateString)}
                style={{ 
                  width: "100%", 
                  background: inputBg, 
                  borderColor: borderColor,
                  color: "#ffffff",
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <RangePicker
                onChange={(dates) => {
                  if (dates) {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  } else {
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
                style={{ 
                  width: "100%", 
                  background: inputBg, 
                  borderColor: borderColor,
                  color: "#ffffff",
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col xs={24} md={4}>
              <Space size={4} wrap>
                {filterButtons.map((btn) => (
                  <Button
                    key={btn.key}
                    icon={btn.icon}
                    onClick={btn.action}
                    size="small"
                    style={{
                      background: filterType === btn.key ? accentColor : "transparent",
                      color: filterType === btn.key ? "#fff" : "#ffffff",
                      border: `1px solid ${filterType === btn.key ? accentColor : borderColor}`,
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: "12px",
                    }}
                  >
                    {btn.label}
                  </Button>
                ))}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* ====== TABLE ====== */}
        <Card 
          style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`, 
            borderRadius: 16, 
            overflow: "hidden",
            boxShadow: cardShadow,
            position: "relative",
          }}
          bodyStyle={{ padding: "0", overflow: "hidden" }}
        >
          {/* Animated Gradient Header Bar */}
          <div style={{
            height: "3px",
            background: "linear-gradient(90deg, #6c5ce7, #a29bfe, #fd79a8, #6c5ce7)",
            backgroundSize: "300% 100%",
            animation: "gradientMove 4s ease infinite",
            borderRadius: "16px 16px 0 0",
          }} />
          
          {/* Table Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: `1px solid ${borderColor}`,
            background: "rgba(255,255,255,0.02)",
            flexWrap: "wrap",
            gap: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(108,92,231,0.05))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6c5ce7",
                fontSize: 18,
                border: `1px solid ${borderColor}`,
              }}>
                <FileTextOutlined />
              </div>
              <div>
                <Text strong style={{ color: "#ffffff", fontSize: 16, display: "block" }}>
                  Invoices
                </Text>
                <Text style={{ color: secondaryText, fontSize: 12 }}>
                  {filteredData.length} records found
                </Text>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(0,184,148,0.1)",
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00b894" }} />
                <Text style={{ color: secondaryText, fontSize: 11 }}>
                  Paid: {data.filter(r => r.is_paid).length}
                </Text>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(253,203,110,0.1)",
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fdcb6e" }} />
                <Text style={{ color: secondaryText, fontSize: 11 }}>
                  Pending: {data.filter(r => !r.is_paid).length}
                </Text>
              </div>
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                onClick={fetchAllData}
                style={{ 
                  color: secondaryText,
                  transition: "all 0.3s ease",
                }}
                loading={loading}
                onMouseEnter={(e) => e.currentTarget.style.color = "#6c5ce7"}
                onMouseLeave={(e) => e.currentTarget.style.color = secondaryText}
              />
            </div>
          </div>

          <Spin spinning={loading} tip="Loading invoices...">
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} invoices`,
                pageSizeOptions: ["10", "20", "50", "100"],
                style: { 
                  padding: "12px 24px",
                  borderTop: `1px solid ${borderColor}`,
                },
              }}
              scroll={{ x: "max-content" }}
              style={{ 
                background: "transparent",
                overflow: "hidden",
              }}
              rowClassName={() => "dark-table-row"}
              className="creative-dark-table"
            />
          </Spin>

          {/* Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 24px",
            borderTop: `1px solid ${borderColor}`,
            background: "rgba(255,255,255,0.01)",
            flexWrap: "wrap",
            gap: "8px",
          }}>
            <Text style={{ color: secondaryText, fontSize: 11 }}>
              © 2024 Digital Connects • All rights reserved
            </Text>
            <Text style={{ color: secondaryText, fontSize: 11 }}>
              <DollarOutlined style={{ marginRight: 4, color: "#6c5ce7" }} />
              Total Revenue: ${totalAmount}
            </Text>
          </div>
        </Card>
      </div>

      {/* ====== DETAIL MODAL ====== */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        title={
          <Space>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(108,92,231,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c5ce7',
              fontSize: 18,
              border: `1px solid ${borderColor}`,
            }}>
              <FileTextOutlined />
            </div>
            <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 600 }}>Invoice Details</span>
            {selectedRecord && (
              <Badge 
                status={selectedRecord.is_paid ? "success" : "warning"} 
                text={
                  <span style={{ color: selectedRecord.is_paid ? "#00b894" : "#fdcb6e" }}>
                    {selectedRecord.is_paid ? "Paid" : "Pending"}
                  </span>
                }
              />
            )}
          </Space>
        }
        style={{ 
          background: bgColor,
          maxHeight: '90vh',
        }}
        bodyStyle={{ 
          background: bgColor,
          padding: '24px',
          maxHeight: 'calc(90vh - 110px)',
          overflowY: 'auto',
        }}
        className="detail-modal"
        closeIcon={<CloseOutlined style={{ color: secondaryText }} />}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Client</Text>
                  <div style={{ color: "#ffffff", fontWeight: 600, fontSize: 15 }}>
                    {selectedRecord.username || 'N/A'}
                  </div>
                  <div style={{ color: secondaryText, fontSize: 12 }}>
                    {selectedRecord.email || 'No email'}
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Plan Date</Text>
                  <div style={{ color: "#ffffff", fontWeight: 600, fontSize: 15 }}>
                    {selectedRecord.plan_date ? new Date(selectedRecord.plan_date).toLocaleDateString() : "N/A"}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Amount</Text>
                  <div style={{ color: "#00b894", fontWeight: 700, fontSize: 20 }}>
                    ${selectedRecord.amount}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Price On Me</Text>
                  <div style={{ color: "#fdcb6e", fontWeight: 700, fontSize: 20 }}>
                    ${selectedRecord.price_on_me}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Profit</Text>
                  <div style={{ color: "#6c5ce7", fontWeight: 700, fontSize: 20 }}>
                    ${(selectedRecord.amount - selectedRecord.price_on_me).toFixed(2)}
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" style={{ 
                  background: inputBg, 
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Package Details</Text>
                  <div style={{ marginTop: 8 }}>
                    {selectedRecord.package ? selectedRecord.package.split("+").map((item, i) => (
                      <Tag key={i} color="blue" style={{ 
                        marginBottom: 4, 
                        color: "#ffffff", 
                        background: "rgba(24,144,255,0.2)", 
                        borderColor: "rgba(24,144,255,0.3)" 
                      }}>
                        {item.trim()}
                      </Tag>
                    )) : <Text style={{ color: secondaryText }}>No packages</Text>}
                  </div>
                </Card>
              </Col>
              {selectedRecord.remaining_package && (
                <Col span={24}>
                  <Card size="small" style={{ 
                    background: inputBg, 
                    border: `1px solid ${borderColor}`,
                    borderRadius: 12,
                  }}>
                    <Text style={{ color: secondaryText, fontSize: 11 }}>Remaining Packages</Text>
                    <div style={{ marginTop: 8 }}>
                      {selectedRecord.remaining_package.split("+").map((item, i) => (
                        <Tag key={i} color="orange" style={{ 
                          marginBottom: 4, 
                          color: "#ffffff", 
                          background: "rgba(255,165,0,0.2)", 
                          borderColor: "rgba(255,165,0,0.3)" 
                        }}>
                          {item.trim()}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* ====== STYLES ====== */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Table Dark Mode Styles */
        .creative-dark-table .ant-table {
          background: transparent !important;
        }

        .creative-dark-table .ant-table-thead > tr > th {
          background: rgba(20, 20, 43, 0.8) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          border-bottom: 2px solid rgba(108, 92, 231, 0.2) !important;
          padding: 14px 16px !important;
        }

        .creative-dark-table .ant-table-tbody > tr {
          background: transparent !important;
          transition: all 0.3s ease !important;
        }

        .creative-dark-table .ant-table-tbody > tr > td {
          background: rgba(20, 20, 43, 0.6) !important;
          color: #ffffff !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
          padding: 14px 16px !important;
        }

        .creative-dark-table .ant-table-tbody > tr:nth-child(even) > td {
          background: rgba(26, 26, 53, 0.6) !important;
        }

        .creative-dark-table .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.12) !important;
          border-bottom-color: rgba(108, 92, 231, 0.15) !important;
        }

        .creative-dark-table .ant-table-tbody > tr:hover {
          box-shadow: 0 2px 20px rgba(108, 92, 231, 0.08);
        }

        /* White text for all table cells */
        .creative-dark-table .ant-table-tbody > tr > td .ant-typography,
        .creative-dark-table .ant-table-tbody > tr > td span,
        .creative-dark-table .ant-table-tbody > tr > td div,
        .creative-dark-table .ant-table-tbody > tr > td a {
          color: #ffffff !important;
        }

        /* Badge text in table */
        .creative-dark-table .ant-badge-status-text {
          color: #ffffff !important;
        }

        /* Tag text in table */
        .creative-dark-table .ant-tag {
          color: #ffffff !important;
        }

        .creative-dark-table .ant-tag-blue {
          background: rgba(24, 144, 255, 0.2) !important;
          border-color: rgba(24, 144, 255, 0.3) !important;
        }

        .creative-dark-table .ant-tag-orange {
          background: rgba(255, 165, 0, 0.2) !important;
          border-color: rgba(255, 165, 0, 0.3) !important;
        }

        /* Pagination */
        .creative-dark-table .ant-pagination {
          background: transparent !important;
          padding: 12px 0 !important;
        }

        .creative-dark-table .ant-pagination-item {
          background: rgba(20, 20, 43, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
        }

        .creative-dark-table .ant-pagination-item a {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .creative-dark-table .ant-pagination-item:hover {
          border-color: #6c5ce7 !important;
          background: rgba(108, 92, 231, 0.1) !important;
        }

        .creative-dark-table .ant-pagination-item:hover a {
          color: #6c5ce7 !important;
        }

        .creative-dark-table .ant-pagination-item-active {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe) !important;
          border-color: #6c5ce7 !important;
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3) !important;
        }

        .creative-dark-table .ant-pagination-item-active a {
          color: #ffffff !important;
        }

        .creative-dark-table .ant-pagination-prev button,
        .creative-dark-table .ant-pagination-next button {
          color: rgba(255, 255, 255, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          background: rgba(20, 20, 43, 0.6) !important;
        }

        .creative-dark-table .ant-pagination-prev button:hover,
        .creative-dark-table .ant-pagination-next button:hover {
          color: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }

        .creative-dark-table .ant-pagination-options {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .creative-dark-table .ant-pagination-options .ant-select-selector {
          background: rgba(20, 20, 43, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          color: #ffffff !important;
          border-radius: 8px !important;
        }

        .creative-dark-table .ant-pagination-options .ant-select-selector:hover {
          border-color: #6c5ce7 !important;
        }

        .creative-dark-table .ant-spin-dot-item {
          background-color: #6c5ce7 !important;
        }

        .creative-dark-table .ant-spin-text {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .creative-dark-table .ant-empty-description {
          color: rgba(255, 255, 255, 0.4) !important;
        }

        .creative-dark-table .ant-checkbox-wrapper {
          color: #ffffff !important;
        }

        .creative-dark-table .ant-checkbox-inner {
          background: rgba(20, 20, 43, 0.6) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .creative-dark-table .ant-checkbox-checked .ant-checkbox-inner {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }

        .creative-dark-table .ant-badge-status-dot {
          width: 8px !important;
          height: 8px !important;
        }

        .creative-dark-table .ant-badge-status-success {
          background-color: #00b894 !important;
        }

        .creative-dark-table .ant-badge-status-warning {
          background-color: #fdcb6e !important;
        }

        /* Detail Modal Styles */
        .detail-modal .ant-modal-content {
          background: #0a0a1a !important;
          border: 1px solid ${borderColor} !important;
          border-radius: 16px !important;
        }
        .detail-modal .ant-modal-title {
          color: #ffffff !important;
        }
        .detail-modal .ant-modal-close {
          color: rgba(255,255,255,0.5) !important;
        }
        .detail-modal .ant-modal-close:hover {
          color: #fff !important;
        }
        .detail-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid ${borderColor} !important;
          border-radius: 16px 16px 0 0 !important;
        }
        .detail-modal .ant-modal-body {
          background: transparent !important;
        }
        .detail-modal .ant-card {
          background: transparent !important;
        }

        /* Scrollbar styling */
        .detail-modal .ant-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .detail-modal .ant-modal-body::-webkit-scrollbar-track {
          background: ${bgColor};
        }
        .detail-modal .ant-modal-body::-webkit-scrollbar-thumb {
          background: ${borderColor};
          border-radius: 3px;
        }
        .detail-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: ${accentColor}44;
        }
      `}</style>
    </div>
  );
};

export default Accounting;