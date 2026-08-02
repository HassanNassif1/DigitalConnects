import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  notification,
  DatePicker,
  Tooltip,
  Switch,
} from "antd";
import moment from "moment-timezone";


import axios from "axios";
import "./app.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "../../components/SideBar/SideBar";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";
import digitalconnects from "./digitalconnects.jpg";
import { useNavigate } from "react-router-dom";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { Search } = Input;
const buttonStyle = {
  background: "linear-gradient(145deg, midnightblue, #3a4ed5)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 18px",
  fontWeight: "500",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

const buttonHoverStyle = {
  background: "linear-gradient(145deg, #2c2c9c, #1c1c70)",
  transform: "translateY(-2px)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
};

const Accounting = () => {
  let navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/UpdateAccounting/${id}`);
  };

  const { isDarkMode } = useDarkMode();

  // State declarations
  const [data, setData] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalPriceOnMe, setTotalPriceOnMe] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalUniqueClients, setTotalUniqueClients] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  // Default filter is "view all": empty values
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Profit",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  // const chartOptions = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Month-Year",
  //         color: "white",
  //       },
  //       grid: {
  //         color: isDarkMode
  //           ? "rgba(255, 255, 255, 0.1)"
  //           : "rgba(0, 0, 0, 0.1)",
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: "Total Profit ($)",
  //        color: "white",
  //       },
  //       grid: {
  //         color: isDarkMode
  //           ? "rgba(255, 255, 255, 0.1)"
  //           : "rgba(0, 0, 0, 0.1)",
  //       },
  //       ticks: {
  //         callback: (value) => `$${value}`,
  //       },
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: true,
  //       labels: {
  //         color: "white",
  //       },
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (context) => `Total Profit: $${context.parsed.y}`,
  //       },
  //       backgroundColor: isDarkMode
  //         ? "rgba(0, 0, 0, 0.8)"
  //         : "rgba(255, 255, 255, 0.8)",
  //     color: "white",
  //     },
  //   },
  // };

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
    if (!startDate || !endDate) {
      return true;
    }
    const recordDate = new Date(record.plan_date);
    return recordDate >= startDate && recordDate <= endDate;
  };

  const filterDataByDateDay = (record) => {
    if (!selectedDate) {
      return true;
    }
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
  };

  // Chart data generator
  const generateChartData = (filteredRecords) => {
    const chartLabels = [];
    const chartDataValues = [];
    const groupedData = filteredRecords.reduce((acc, record) => {
      const recordDate = new Date(record.plan_date);
      const monthYearKey = `${recordDate.getMonth() + 1}-${recordDate.getFullYear()}`;
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
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Fetch all data – default "View All" (no month/year filter)
  const fetchAllData = () => {
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        setData(response.data);
        // Clear any month/year filtering so that view all is the default.
        setSelectedMonth("");
        setSelectedYear("");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Function to fetch current month data when needed.
  const fetchCurrentMonthData = () => {
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        setData(response.data);
        const currentDate = new Date();
        setSelectedMonth(currentDate.getMonth() + 1);
        setSelectedYear(currentDate.getFullYear());
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchAllDataByRangeDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      console.error("Both start and end dates must be selected");
      return;
    }
    axios
      .get("http://localhost:5000/api/AccountingDataByRangeDate", {
        params: { startDate, endDate },
      })
      .then((response) => {
        setData(response.data);
        // Clear month/year filters when filtering by date range.
        setSelectedMonth("");
        setSelectedYear("");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Fetch data by a specific date
  const fetchDataByDate = (selectedDate) => {
    if (!selectedDate) {
      console.error("Date must be selected");
      return;
    }
    axios
      .get("http://localhost:5000/api/AccountingDataByDate", {
        params: { selectedDate },
      })
      .then((response) => {
        setData(response.data);
        setSelectedMonth("");
        setSelectedYear("");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Default view is "View All"
    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDataByDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAllDataByRangeDate(startDate, endDate);
    }
  }, [startDate, endDate]);

  // When clicking "Remaining Only" we filter out paid records (is_paid === true)
  const filterRemainingPackages = () => {
    axios
      .get("http://localhost:5000/api/AccountingData")
      .then((response) => {
        const remainingData = response.data.filter(
          (record) => record.is_paid !== true
        );
        setData(remainingData);
        // Clear month/year filters.
        setSelectedMonth("");
        setSelectedYear("");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const filterDataByMonthAndYear = (record) => {
    if (!selectedMonth || !selectedYear) {
      return true;
    }
    const recordDate = new Date(record.plan_date);
    const recordMonth = recordDate.getMonth() + 1;
    const recordYear = recordDate.getFullYear();
    return recordMonth === selectedMonth && recordYear === selectedYear;
  };

  const handleDateChange = (date, dateString) => {
    if (date) {
      setSelectedMonth(date.month() + 1); // moment months are zero-indexed
      setSelectedYear(date.year());
    } else {
      setSelectedMonth("");
      setSelectedYear("");
    }
  };

  // No action needed on open change for the MonthPicker
  const handleOpenChange = (open) => {};

  // PDF and Excel download functions remain unchanged

  const downloadPDFInvoice = (record) => {
    const currentDate = new Date().toLocaleDateString();
    const packages = record.package ? record.package.split("+") : [];
    const remainingPackages = record.remaining_package
      ? record.remaining_package.split("+")
      : [];
    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <style>
              html, body { margin: 0; padding: 0; height: 100%; background-color: #D3D3D3; }
              #invoice-container { background-color: #D3D3D3; padding: 36px; min-height: 100%; box-sizing: border-box; }
              body, section, div { margin: 0; padding: 0; }
          </style>  
      </head>
      <body>
      <div id="invoice-container">
          <section id="invoice">
              <div class="invoice-content">
                  <div class="my-5 py-5" style="padding-left:20px; padding-right:20px;">
                      <div class="text-center">
                          <img src="${digitalconnects}" alt="Digital Connects Logo" style="max-width: 300px; height: 300px; margin-bottom: -150px; margin-top: -110px;" />
                      </div>
                      <br/><br/>
                      <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                          <div style="flex: 1;">
                              <p style="font-weight: 500; color:rgba(46, 49, 146, 255);">Invoice From</p>
                              <h4>Digital Connects</h4>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li>digitalconnectsmedia@gmail.com</li>
                                  <li>+961 76 801 755</li>
                                  <li>Beirut, Lebanon</li>
                              </ul>   
                          </div>
                          <div>
                              <p style="font-weight: 500; color:rgba(46, 49, 146, 255);">Invoice To</p>
                              <h4>${record.username}</h4>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li>${record.email}</li>
                                  <li>+${record.countrycode} ${record.phone_number}</li>
                                  <li>${record.address}, ${record.nationality}</li>
                              </ul>
                          </div>
                          
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid rgba(46, 49, 146, 255); border-bottom: 2px solid rgba(46, 49, 146, 255); margin: 20px 0; padding: 10px 0;">
                          <h2 style="font-size: 2rem; font-weight: 700; margin: 0;">Invoice</h2>
                          <div style="margin-right:2%;">
                              <p style="margin: 0;"><span style="font-weight: 500;">Date: ${currentDate}</span> </p>
                          </div>
                      </div>
                      <div style="margin: 20px 0;">
                          <table class="table table-striped border my-5" style="border-collapse: collapse;">
                              <thead style="background-color:rgba(46, 49, 146, 255);">
                                  <tr>
                                      <th style="border: 1px solid #ddd; padding: 8px; color:white;">Service</th>
                                      <th style="border: 1px solid #ddd; padding: 8px; color:white;">Remaining</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  ${packages.map((item, index) => `
                                      <tr>
                                          <td style="border: 1px solid #ddd; padding: 8px;">${item.trim()}</td>
                                          <td style="border: 1px solid #ddd; padding: 8px;">${remainingPackages[index] ? remainingPackages[index].trim() : ""}</td>
                                      </tr>
                                  `).join("")}
                              </tbody>
                              <tfoot>
                                  <tr>
                                      <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total Price</td>
                                      <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">$${record.amount}</td>
                                  </tr>
                              </tfoot>
                          </table>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                          <div>
                              <h5 style="font-weight: 700;">Contact Us</h5>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li><i class="fas fa-map-marker-alt" style="color: rgba(46, 49, 146, 255);"></i> Beirut, Lebanon</li>
                                  <li><i class="fas fa-phone-alt" style="color: rgba(46, 49, 146, 255);"></i> +961 76 801 755</li>
                                  <li><i class="fas fa-envelope" style="color: rgba(46, 49, 146, 255);"></i> digitalconnectsmedia@gmail.com</li>
                              </ul>
                          </div>
                          <div>
                              <h5 style="font-weight: 700;">Our Social Media Accounts</h5>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li><i class="fab fa-instagram" style="color: rgba(46, 49, 146, 1);"></i> Digitalconnectsmedia</li>
                                  <li><i class="fab fa-facebook" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                                  <li><i class="fab fa-twitter" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                                  <li><i class="fab fa-linkedin" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                              </ul>
                          </div>
                      </div>
                      <div id="footer-bottom" style="border-top: 2px solid rgba(46, 49, 146, 255); margin-top: 20px;">
                          <div style="padding: 10px 0; text-align:center;">
                              <p style="margin: 0;">© 2024 Invoice. <span target="_blank" style="text-decoration: none; color: #6c757d;">Digital Connects</span></p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
      </div>
      </body>
      </html>
    `;
    const element = document.createElement("div");
    element.innerHTML = invoiceHtml;
    const options = {
      margin: 3,
      filename: `digitalConnects_invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  const downloadPDFRemaining = (record) => {
    const currentDate = new Date().toLocaleDateString();
    const packages = record.package ? record.package.split("+") : [];
    const remainingPackages = record.remaining_package
      ? record.remaining_package.split("+")
      : [];
    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <style>
              html, body { margin: 0; padding: 0; height: 100%; background-color: #D3D3D3; }
              #invoice-container { background-color: #D3D3D3; padding: 36px; min-height: 100%; box-sizing: border-box; }
              body, section, div { margin: 0; padding: 0; }
          </style>  
      </head>
      <body>
      <div id="invoice-container">
          <section id="invoice">
              <div class="invoice-content">
                  <div class="my-5 py-5" style="padding-left:20px; padding-right:20px;">
                      <div class="text-center" style="padding-bottom: 5px;">
                          <img src="${digitalconnects}" alt="Digital Connects Logo" style="max-width: 300px; height: 300px; margin-bottom: -150px; margin-top: -110px;" />
                      </div>
                      <br/><br/>
                      <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                          <div style="flex: 1;">
                              <p style="font-weight: 500; color:rgba(46, 49, 146, 255);">Remaining From</p>
                              <h4>Digital Connects</h4>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li>digitalconnectsmedia@gmail.com</li>
                                  <li>+961 76 801 755</li>
                                  <li>Beirut, Lebanon</li>
                              </ul>   
                          </div>
                          <div>
                              <p style="font-weight: 500; color:rgba(46, 49, 146, 255);">Remaining To</p>
                              <h4>${record.username}</h4>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li>${record.email}</li>
                                  <li>+${record.countrycode} ${record.phone_number}</li>
                                  <li>${record.address}, ${record.nationality}</li>
                              </ul>
                          </div>
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid rgba(46, 49, 146, 255); border-bottom: 2px solid rgba(46, 49, 146, 255); margin: 20px 0; padding: 10px 0;">
                          <h2 style="font-size: 2rem; font-weight: 700; margin: 0;">Remaining</h2>
                          <div style="margin-right:2%;">
                              <p style="margin: 0;"><span style="font-weight: 500;">Date: ${currentDate}</span> </p>
                          </div>
                      </div>
                      <div style="margin: 20px 0;">
                          <table class="table table-striped border my-5" style="border-collapse: collapse;">
                              <thead style="background-color:rgba(46, 49, 146, 255);">
                                  <tr>
                                      <th style="border: 1px solid #ddd; padding: 8px; color:white;">Service</th>
                                      <th style="border: 1px solid #ddd; padding: 8px; color:white;">Remaining</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  ${packages.map((item, index) => `
                                      <tr>
                                          <td style="border: 1px solid #ddd; padding: 8px;">${item.trim()}</td>
                                          <td style="border: 1px solid #ddd; padding: 8px;">${remainingPackages[index] ? remainingPackages[index].trim() : ""}</td>
                                      </tr>
                                  `).join("")}
                              </tbody>
                          </table>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                          <div>
                              <h5 style="font-weight: 700;">Contact Us</h5>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li><i class="fas fa-map-marker-alt" style="color: rgba(46, 49, 146, 255);"></i> Beirut, Lebanon</li>
                                  <li><i class="fas fa-phone-alt" style="color: rgba(46, 49, 146, 255);"></i> +961 76 801 755</li>
                                  <li><i class="fas fa-envelope" style="color: rgba(46, 49, 146, 255);"></i> digitalconnectsmedia@gmail.com</li>
                              </ul>
                          </div>
                          <div>
                              <h5 style="font-weight: 700;">Our Social Media Accounts</h5>
                              <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                                  <li><i class="fab fa-instagram" style="color: rgba(46, 49, 146, 1);"></i> Digitalconnectsmedia</li>
                                  <li><i class="fab fa-facebook" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                                  <li><i class="fab fa-twitter" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                                  <li><i class="fab fa-linkedin" style="color: rgba(46, 49, 146, 255);"></i> Digital Connects</li>
                              </ul>
                          </div>
                      </div>
                      <div id="footer-bottom" style="border-top: 2px solid rgba(46, 49, 146, 255); margin-top: 20px;">
                          <div style="padding: 10px 0; text-align:center;">
                              <p style="margin: 0;">© 2024 Invoice. <a href="#" target="_blank" style="text-decoration: none; color: #6c757d;">Digital Connects</a></p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
      </div>
      </body>
      </html>
    `;
    const element = document.createElement("div");
    element.innerHTML = invoiceHtml;
    const options = {
      margin: 3,
      filename: `digitalConnects_remaining.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  const downloadExcelInvoice = (record) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");
    const excelColumns = [
      { header: "Client Name", key: "username" },
      { header: "Package", key: "type" },
      { header: "Amount", key: "amount" },
      { header: "Plan Date", key: "plan_date" },
    ];
    worksheet.columns = excelColumns.map((col) => ({
      header: col.header,
      key: col.key,
      width: 15,
    }));
    worksheet.addRow({
      username: record.username,
      type: record.type,
      amount: record.amount,
      plan_date: record.plan_date,
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const excelFilename = `invoice_${record.id}.xlsx`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = excelFilename;
      link.click();
    });
  };

  const handleDelete = (id) => {
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
  };

  // Update is_paid status
  const handleToggleIsPaid = async (id, currentStatus) => {
    try {
      console.log(
        `Toggling isPaid for ID: ${id}, Current Status: ${currentStatus}`
      );
      await axios.patch(`http://localhost:5000/api/UpdateIsPaid/${id}`, {
        isPaid: !currentStatus,
      });
      setData((prevData) =>
        prevData.map((record) =>
          record.id === id ? { ...record, is_paid: !currentStatus } : record
        )
      );
    } catch (error) {
      console.error("Error updating isPaid status:", error);
    }
  };

 const columns = [
    {
      title: "Client Name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => (
        <span className="table-text table-text-strong">{text}</span>
      ),
    },
    {
      title: "Plan Date",
      dataIndex: "plan_date",
      key: "plan_date",
      sorter: (a, b) => new Date(a.plan_date) - new Date(b.plan_date),
      render: (text) => (
        <span className="table-text">
          {text ? new Date(text).toLocaleDateString() : ""}
        </span>
      ),
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
      render: (text) => {
        const items = text
          ? text.split("+").map((item) => `• ${item.trim()}`)
          : [];
        return (
          <div className="table-text">
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Remaining Package",
      dataIndex: "remaining_package",
      key: "remaining_package",
      render: (text) => {
        const items = text
          ? text.split("+").map((item) => `• ${item.trim()}`)
          : [];
        return (
          <div className="table-text">
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span className="text-blue">${text}</span>,
    },
    {
      title: "Price On Me",
      dataIndex: "price_on_me",
      key: "price_on_me",
      render: (text) => <span className="text-gold">${text}</span>,
    },
    {
      title: "Profit",
      key: "total_profit",
      render: (text, record) => (
        <span className="text-green">
          ${record.amount - record.price_on_me}
        </span>
      ),
    },
    {
      title: "Remaining Payment",
      dataIndex: "remaining_payment",
      key: "remaining_payment",
      render: (text, record) => (
        <span className="table-text">
          {record.is_paid ? 0 : text || 0}
        </span>
      ),
    },
    {
      title: "Is Paid?",
      dataIndex: "is_paid",
      key: "is_paid",
      render: (isPaid, record) => (
        <Switch
          checked={isPaid}
          checkedChildren="Paid"
          unCheckedChildren="Not Paid"
          onChange={() => handleToggleIsPaid(record.id, isPaid)}
          style={{
            backgroundColor: isPaid ? "#16a34a" : "#dc2626",
            width: 85,
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="action-btns">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              className="action-btn edit-btn"
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className="action-btn delete-btn"
            />
          </Tooltip>

          <Tooltip title="Invoice PDF">
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => downloadPDFInvoice(record)}
              className="action-btn pdf-btn"
            />
          </Tooltip>

          <Tooltip title="Remaining PDF">
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => downloadPDFRemaining(record)}
              className="action-btn remaining-btn"
            />
          </Tooltip>

          <Tooltip title="Excel Export">
            <Button
              icon={<FileExcelOutlined />}
              onClick={() => downloadExcelInvoice(record)}
              className="action-btn excel-btn"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredData = data
    .filter((item) =>
      item.username && item.username.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(filterDataByMonthAndYear)
    .filter(filterDataByDateRange)
    .filter(filterDataByDateDay);

  useEffect(() => {
    const filteredRecords = data
      .filter((item) =>
        item.username && item.username.toLowerCase().includes(searchText.toLowerCase())
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
    }
  }, [data, searchText, selectedMonth, selectedYear, startDate, endDate, selectedDate]);

 return (
  <div
    style={{
      width: "100%",
      marginLeft: 0,
      padding: "30px",
      borderRadius: "16px",
      background: "linear-gradient(180deg, #030316 0%, #071028 40%, #0b0e1a 100%)",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 140, 255, 0.3)",
      color: "white",
      minHeight: "100vh",
    }}
  >
    <div style={{width:"100%"}}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "26px",
          color: "#00b4ff",
          marginBottom: "10px",
        }}
      >
        📊 Accounting Dashboard
      </h1>
      <hr style={{ borderColor: "#0b2c4a", marginBottom: "25px" }} />

      {/* 🔍 Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "25px",
        }}
      >
        <input
          type="search"
          placeholder="Search by username..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "60%",
            padding: "10px 15px",
            borderRadius: "10px",
            border: "1px solid #00b4ff",
            background: "#0a0f1f",
            color: "white",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 0 10px rgba(0, 180, 255, 0.3)",
          }}
        />
      </div>

      {/* 📅 Date Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <DatePicker.MonthPicker
          onChange={handleDateChange}
          onOpenChange={handleOpenChange}
          className="custom-date"
          placeholder="Select Month"
        />

        <DatePicker
          placeholder="Select Date"
          onChange={(date, dateString) => setSelectedDate(dateString)}
          className="custom-date"
        />
      </div>

      {/* 🧭 Action Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <Button className="custom-btn" href="/CreateAccounting">
          💼 Create Invoice
        </Button>
        <Button className="custom-btn" href="/CreateQuotation">
          🧾 Create Quotation
        </Button>
        <Button className="custom-btn" onClick={fetchAllData}>
          📁 View All
        </Button>
        <Button className="custom-btn" onClick={fetchCurrentMonthData}>
          📆 Current Month
        </Button>
        <Button className="custom-btn" onClick={filterRemainingPackages}>
          ⏳ Remaining Only
        </Button>
        <Button className="custom-btn" onClick={handleFilterByCurrentDay}>
          📅 Current Day
        </Button>
      </div>

      {/* 📆 Range Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <DatePicker
          placeholder="From Date"
          onChange={handleStartDateChange}
          className="custom-date"
        />
        <DatePicker
          placeholder="To Date"
          onChange={handleEndDateChange}
          className="custom-date"
        />
      </div>

      {/* 📈 Chart */}
      {/* {chartData && (
        <div
          style={{
            margin: "0 auto 40px auto",
            width: "350px",
            background: "#0a0f1f",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,180,255,0.3)",
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      )} */}

      {/* 📋 Table */}
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={data.length ? false : { pageSize: 30 }}
        className="light-mode-table"
      />

      {/* 💰 Totals Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          width:"100%",
          marginTop: "40px",
          textAlign: "center",
        }}
      >
      <div className="stat-card profit">💵 Total Profit: ${totalProfit}</div>
<div className="stat-card total-price">💰 Total Price On Me: ${totalPriceOnMe}</div>
<div className="stat-card total-amount">💸 Total Amount: ${totalAmount}</div>
<div className="stat-card unique-clients">👥 Unique Clients: {totalUniqueClients}</div>
<div className="stat-card total-invoices">🧾 Total Invoices: {totalInvoices}</div>

      </div>
    </div>

    {/* 💅 Styles */}
    <style>{`
      .custom-btn {
        background: linear-gradient(90deg, #007bff, #00b4ff);
        border: none;
        color: white !important;
        font-weight: 600;
        border-radius: 10px;
        padding: 10px 15px;
        box-shadow: 0 4px 10px rgba(0,180,255,0.3);
        transition: 0.3s ease;
      }

      .custom-btn:hover {
        background: linear-gradient(90deg, #00b4ff, #007bff);
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0,180,255,0.5);
      }

      .custom-date {
        flex: 1;
        background-color: #0a0f1f !important;
        border: 1px solid #007bff !important;
        border-radius: 8px !important;
        color: #ffffff !important;
        box-shadow: inset 0 0 8px rgba(0, 140, 255, 0.3);
        padding: 8px 12px;
        font-weight: 500;
      }

      .custom-date input {
        color: #ffffff !important;
        background-color: transparent !important;
      }

      .custom-date .ant-picker-suffix {
        color: #00b4ff !important;
      }

      .ant-picker-panel {
        background-color: #0a0f1f !important;
        color: #ffffff !important;
      }

      .ant-picker-cell-inner {
        color: #ffffff !important;
      }

      .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
        background-color: #007bff !important;
        color: #ffffff !important;
        border-radius: 6px !important;
      }

 .stat-card {
  padding: 16px;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 800;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 30px rgba(3,6,24,0.6);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.6);
}

/* Individual gradients matching your example style */
.stat-card.profit {
  background: linear-gradient(135deg, rgb(255,127,80), rgb(255,99,71)); /* Coral/Orange */
}

.stat-card.total-price {
  background: linear-gradient(135deg, rgb(46, 49, 146), rgb(27, 31, 77)); /* Blue/Purple */
}

.stat-card.total-amount {
  background: linear-gradient(135deg, rgb(32,178,170), rgb(60,179,113)); /* Teal/Green */
}

.stat-card.unique-clients {
  background: linear-gradient(135deg, rgb(255,215,0), rgb(255,165,0)); /* Gold/Orange */
}

.stat-card.total-invoices {
  background: linear-gradient(135deg, rgb(30,144,255), rgb(0,191,255)); /* Sky Blue */
}

.stat-card .card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-card .card-number {
  font-size: 24px;
  font-weight: 800;
}

.stat-card .card-note {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}


      @media (max-width: 768px) {
        .custom-btn {
          width: 100%;
        }

        .custom-date {
          width: 100%;
        }
      }
    `}</style>
  </div>
);

};

export default Accounting;
