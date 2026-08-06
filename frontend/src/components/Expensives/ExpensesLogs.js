import React, { useEffect, useState } from "react";
import { Table, Spin, message, Empty, Select, Input, Card, Typography, Tag, Space, Button } from "antd";
import axios from "axios";
import { 
  FileTextOutlined, 
  SearchOutlined, 
  HistoryOutlined, 
  ReloadOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const ExpensesLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [search, setSearch] = useState("");

  // === UNIFIED DARK THEME VARIABLES ===
  const bgColor = "#0b0b16";
  const cardBg = "#141426";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.08)";
  const inputBg = "#1a1a2e";
  const accentColor = "#6c5ce7";

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/expensives");
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        message.error("Failed to fetch expenses");
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (!selectedExpense) return;
    let isMounted = true;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/expense-logs/${selectedExpense.id}`
        );
        if (isMounted) setLogs(response.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
        message.error("Failed to fetch logs");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();
    return () => (isMounted = false);
  }, [selectedExpense]);

  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id", 
      width: 70,
      render: (text) => <Tag style={{ background: inputBg, color: textColor, borderColor: borderColor }}>#{text}</Tag>
    },
    { title: "Expense ID", dataIndex: "expense_id", key: "expense_id" },
    { title: "Field", dataIndex: "field_name", key: "field_name" },
    { 
      title: "Old Value", 
      dataIndex: "old_value", 
      key: "old_value",
      render: (text) => <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{text || "-"}</span>
    },
    { 
      title: "New Value", 
      dataIndex: "new_value", 
      key: "new_value",
      render: (text) => <span style={{ color: accentColor, fontWeight: 600 }}>{text || "-"}</span>
    },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        text ? (
          <Tag icon={<ClockCircleOutlined />} color="purple" style={{ color: '#fff', background: `${accentColor}44`, border: 'none' }}>
            {new Date(text).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Tag>
        ) : "-",
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.comment?.toLowerCase().includes(search.toLowerCase()) ||
      log.field_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.old_value?.toLowerCase().includes(search.toLowerCase()) ||
      log.new_value?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <Card
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0",
          background: `linear-gradient(145deg, ${cardBg}, #101025)`,
          padding: "30px",
          border: "none",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
        }}
        bordered={false}
        bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* ===== CREATIVE HEADER ===== */}
        <div style={{ 
          marginBottom: "28px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          paddingBottom: "20px", 
          borderBottom: `1px solid ${borderColor}`,
          flexWrap: "wrap",
          gap: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ 
              width: 48, height: 48, 
              borderRadius: 14, 
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${accentColor}33`,
              fontSize: 22, color: accentColor
            }}>
              <HistoryOutlined />
            </div>
            <div>
              <Title level={3} style={{ color: textColor, margin: 0, fontWeight: 700 }}>
                Expense Audit Logs
              </Title>
              <Space size={4}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  <FileTextOutlined style={{ marginRight: 6 }} /> 
                  {filteredLogs.length} records found
                </Text>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor }} />
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  {selectedExpense ? `Tracking: ${selectedExpense.text}` : 'No expense selected'}
                </Text>
              </Space>
            </div>
          </div>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: `1px solid ${borderColor}`, 
              color: textColor,
              borderRadius: 10,
              transition: 'all 0.2s ease'
            }}
          >
            Refresh
          </Button>
        </div>

        {/* ===== CONTROLS PANEL ===== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: inputBg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${borderColor}` }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: "block", marginBottom: 6 }}>
              <FileTextOutlined style={{ marginRight: 6, color: accentColor }} />
              Select Expense
            </label>
            <Select
              showSearch
              placeholder="Choose an expense to audit..."
              optionFilterProp="children"
              dropdownStyle={{ backgroundColor: inputBg, color: textColor }}
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => {
                const expense = expenses.find((e) => e.id === value);
                setSelectedExpense(expense);
              }}
            >
              {expenses.map((exp) => (
                <Option key={exp.id} value={exp.id} style={{ color: textColor }}>
                  <Space>
                    <Tag style={{ background: accentColor, color: '#fff', border: 'none' }}>{exp.id}</Tag>
                    {exp.text}
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ background: inputBg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${borderColor}` }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: "block", marginBottom: 6 }}>
              <SearchOutlined style={{ marginRight: 6, color: accentColor }} />
              Search Audit Trail
            </label>
            <Input
              placeholder="Filter by field, comment, or value..."
              size="large"
              style={{ 
                width: "100%", 
                color: textColor, 
                background: 'transparent', 
                border: 'none',
                padding: 0
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ===== TABLE AREA ===== */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Spin tip="Decrypting audit logs..." size="large" style={{ color: textColor }} />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Empty 
                description={
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {selectedExpense ? "No audit logs found for this expense." : "Select an expense to view its logs."}
                  </span>
                } 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            </div>
          ) : (
            <div style={{ overflowX: "auto", flex: 1 }}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredLogs}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  position: ["bottomCenter"],
                  style: { color: textColor, marginTop: 16 },
                }}
                size="middle"
                className="dark-table"
                style={{ flex: 1 }}
              />
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
            System v2.0 • Encrypted Audit Trail
          </Text>
          {selectedExpense && (
            <Tag color="purple" style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44`, color: textColor }}>
              Currently viewing Expense #{selectedExpense.id}
            </Tag>
          )}
        </div>
      </Card>

      <style>{`
        .dark-table .ant-table {
          background-color: transparent !important;
          color: ${textColor} !important;
        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background-color: transparent !important;
          color: ${textColor} !important;
          font-weight: 600;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          background-color: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(108, 92, 231, 0.08) !important;
          color: ${textColor} !important;
        }
        
        .ant-select-selector {
          background-color: transparent !important;
          color: ${textColor} !important;
          border: none !important;
          border-radius: 8px !important;
          box-shadow: none !important;
        }
        .ant-select-selection-item {
          color: ${textColor} !important;
        }
        .ant-select-arrow {
          color: ${textColor} !important;
        }
        .ant-input {
          background-color: transparent !important;
          color: ${textColor} !important;
          border: none !important;
          border-radius: 8px !important;
          box-shadow: none !important;
        }
        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        
        .ant-pagination-item a {
          color: ${textColor} !important;
        }
        .ant-pagination-item-active {
          background-color: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-pagination-prev button,
        .ant-pagination-next button {
          color: ${textColor} !important;
        }
        .ant-pagination-item-ellipsis {
          color: ${textColor} !important;
        }

        .ant-empty-description {
          color: ${textColor} !important;
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          .ant-table {
            font-size: 12px !important;
          }
          h3 {
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpensesLogs;