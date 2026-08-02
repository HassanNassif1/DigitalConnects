import React, { useEffect, useState } from "react";
import { Table, Spin, message, Empty, Select, Input, Card, Typography } from "antd";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const ExpensesLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch all expenses for dropdown
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

  // Fetch logs for selected expense
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

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Expense ID", dataIndex: "expense_id", key: "expense_id" },
    { title: "Field", dataIndex: "field_name", key: "field_name" },
    { title: "Old Value", dataIndex: "old_value", key: "old_value" },
    { title: "New Value", dataIndex: "new_value", key: "new_value" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        text
          ? new Date(text).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
  ];

  // Filtered logs
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
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #030316 0%, #071028 40%, #0b0e1a 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
        
          borderRadius: "20px",
         boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 40px rgba(198, 207, 242, 0.53)", // soft blue glow
          backgroundColor: "#0b0e1a",
          padding: "20px 25px",
        }}
        bordered={false}
      >
        <Title
          level={3}
          style={{
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "25px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          Expenses Logs
        </Title>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <label style={{ color: "white", marginBottom: "5px", display: "block" }}>
                Select Expense ID / Description
              </label>
              <Select
                showSearch
                placeholder="Select Expense"
                optionFilterProp="children"
                dropdownStyle={{ backgroundColor: "#0a0f1f", color: "#ffffff" }}
                style={{ width: "100%" }}
                onChange={(value) => {
                  const expense = expenses.find((e) => e.id === value);
                  setSelectedExpense(expense);
                }}
              >
                {expenses.map((exp) => (
                  <Option key={exp.id} value={exp.id} style={{ color: "#ffffff" }}>
                    {exp.id} — {exp.text}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ flex: 1, minWidth: "260px" }}>
              <label style={{ color: "white", marginBottom: "5px", display: "block" }}>
                Search Logs
              </label>
              <Input
                placeholder="Search by field or comment"
                style={{ width: "100%", color: "#ffffff" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin tip="Loading logs..." size="large" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <Empty description="No logs found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredLogs}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                position: ["bottomCenter"],
              }}
              size="middle"
              className="dark-table"
            />
          </div>
        )}
      </Card>

      <style>{`
        .dark-table .ant-table {
          background-color: #0b0e1a !important;
          color: #ffffff !important;
             boxShadow: "0 20px 35px rgba(0, 0, 0, 0.5)",

        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background-color: #071028 !important;
          color: #ffffff !important;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .dark-table .ant-table-tbody > tr > td {
          background-color: #0b0e1a !important;
          color: #d4d8e3 !important;
          border-color: #1e223a !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background-color: #162044 !important;
          color: #ffffff !important;
          transition: all 0.2s ease-in-out;
        }
        .ant-select-selector {
          background-color: #0a0f1f !important;
          color: #ffffff !important;
          border: 1px solid #1e223a !important;
          border-radius: 8px !important;
        }
        .ant-input {
          background-color: #0a0f1f !important;
          color: #ffffff !important;
          border: 1px solid #1e223a !important;
          border-radius: 8px !important;
        }
        .ant-empty-description {
          color: #ffffff !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .ant-card {
            padding: 15px !important;
          }
          .ant-table {
            font-size: 12px !important;
          }
          .ant-input,
          .ant-select-selector {
            font-size: 13px !important;
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
