import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  DatePicker,
  notification,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { MonthPicker, YearPicker } = DatePicker;

function ExpensivesList() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // New state to track current filter and selected dates
  const [currentFilter, setCurrentFilter] = useState("currentMonth"); // "currentMonth", "selectedMonth", "selectedYear", "all"
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Fetch expenses for a specific month
  const fetchSelectedMonthExpenses = async (month) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/expensivesselectedmonth",
        {
          params: { date: month }, // Pass the selected month in 'YYYY-MM' format
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching selected month expenses:", error);
    }
  };

  // Fetch expenses for a specific year
  const fetchSelectedYearExpenses = async (year) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/expensivesselectedyear",
        {
          params: { date: year }, // Pass the selected year in 'YYYY' format
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching selected year expenses:", error);
    }
  };

  // Fetch expenses for the current month
  const fetchCurrentMonthExpenses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/expensivescurrentmonth"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching current month expenses:", error);
    }
  };

  // Fetch all expenses
  const fetchAllExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expensives");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching all expenses:", error);
    }
  };

  // Helper function to refresh data based on the current filter
  const refreshDataBasedOnFilter = () => {
    if (currentFilter === "currentMonth") {
      fetchCurrentMonthExpenses();
    } else if (currentFilter === "selectedMonth") {
      fetchSelectedMonthExpenses(selectedMonth);
    } else if (currentFilter === "selectedYear") {
      fetchSelectedYearExpenses(selectedYear);
    } else if (currentFilter === "all") {
      fetchAllExpenses();
    }
  };

  // Delete expense and refresh based on the current filter
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Delete_Expense/${id}`);
      refreshDataBasedOnFilter(); // Refresh based on the active filter
      notification.success({
        message: "Success",
        description: "Expense deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting the expense:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete the expense.",
      });
    }
  };

  // Navigate to the edit page
  const handleEdit = (id) => {
    navigate(`/EditExpensives/${id}`);
  };

  // Filter data based on search text
  const applySearchFilter = () => {
    const filtered = data.filter((item) =>
      item.text.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

const totalAmount = filteredData.reduce(
  (sum, item) => sum + (Number(item.amount) || 0),
  0
);



  useEffect(() => {
    // Load current month expenses by default
    fetchCurrentMonthExpenses();
    setCurrentFilter("currentMonth");
  }, []);

  useEffect(() => {
    applySearchFilter(); // Apply search filter whenever data or search text changes
  }, [data, searchText]);

  const columns = [
    {
      title: "Description",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
     render: (text) => `$${Number(text).toFixed(2)}`

    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Tooltip title="Edit">
            <Button
              onClick={() => handleEdit(record.id)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ flex: 1, width: "50%", marginLeft: "35%" }}>
      <h1>Expenses List</h1>
      <Input
        placeholder="Search by Description"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={isDarkMode ? "dark-mode-search" : "light-mode-search"}
        style={{
          height: 30,
          width: 210,
          marginBottom: 16,
          backgroundColor: isDarkMode ? "rgb(22, 22, 22)" : "white",
          color: isDarkMode ? "white" : "black",
        }}
      />
      <br />
      <MonthPicker
        onChange={(value) => {
          if (value) {
            const monthStr = value.format("YYYY-MM");
            setSelectedMonth(monthStr);
            fetchSelectedMonthExpenses(monthStr);
            setCurrentFilter("selectedMonth");
          }
        }}
        className={isDarkMode ? "dark-mode-datepicker" : ""}
        style={{
          width: 200,
          height: 30,
          fontSize: 15,
          marginBottom: 16,
          backgroundColor: isDarkMode ? "rgb(22, 22, 22)" : "white",
          color: isDarkMode ? "white" : "black",
        }}
      />

      <YearPicker
        onChange={(value) => {
          if (value) {
            const yearStr = value.format("YYYY");
            setSelectedYear(yearStr);
            fetchSelectedYearExpenses(yearStr);
            setCurrentFilter("selectedYear");
          }
        }}
        className={isDarkMode ? "dark-mode-datepicker" : ""}
        style={{
          width: 200,
          height: 30,
          fontSize: 15,
          borderColor: "rgb(22, 22, 22)",
          marginBottom: 16,
          backgroundColor: isDarkMode ? "rgb(22, 22, 22)" : "white",
          color: isDarkMode ? "white" : "black",
        }}
      />
      <Button
        href="/AddExpensives"
        className={isDarkMode ? "dark-mode-button" : ""}
      >
        Create New Record
      </Button>
      <br />
      <Button
        onClick={() => {
          fetchAllExpenses();
          setCurrentFilter("all");
        }}
        className={isDarkMode ? "dark-mode-button" : ""}
        style={{ marginTop: 16 }}
      >
        View All
      </Button>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          pageSize: 10,
          style: {
            color: isDarkMode ? "white" : "black",
          },
        }}
        className={isDarkMode ? "dark-mode-table" : "light-mode-table"}
        style={{ marginTop: 16 }}
      />
      <div
        className={`StyledProfit ${isDarkMode ? "dark-mode-container" : ""}`}
        style={{
          marginTop: 16,
          color:  "white",
          fontWeight: "bold",
        }}
      >
        Total Amount: ${totalAmount.toFixed(2)}
      </div>
    </div>
  );
}

export default ExpensivesList;
