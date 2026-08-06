import React, { useState, useEffect } from "react";
import { Table, Input, Button, notification, Tooltip, Card, Typography, Space, Tag } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./quotation.css";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";
import digitalconnects from "./digitalconnects.jpg";
import { useNavigate } from "react-router-dom";
import AnimatePhoto from "../Images/AnimatePhoto";

const { Search } = Input;
const { Title, Text } = Typography;

const View_Quotation = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const { isDarkMode } = useDarkMode();
  const [searchText, setSearchText] = useState("");

  // === UNIFIED DARK THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.7)";

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/Quotation")
      .then((response) => {
        console.log("Recovered Data:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/EditQuotation/${id}`);
  };

  const handleDelete = (id) => {
    const deletedRecord = data.find((item) => item.id === id);
    console.log(deletedRecord);
    axios
      .delete(`http://localhost:5000/api/Remove_Quotation/${id}`)
      .then(() => {
        fetchData();
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

  const downloadPDFInvoice = (record) => {
    const currentDate = new Date().toLocaleDateString();
    const packages = record.type.split("+").map((item) => item.trim());
    const packagePrice = parseFloat(record.price);
    const totalPrice = packages.length * packagePrice;
    const quotationHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 90%;
            background-color: #D3D3D3;
          }
          #invoice-container {
            background-color: #D3D3D3;
            padding: 36px;
            min-height: 90%;
            box-sizing: border-box;
          }
          body, section, div {
            margin: 0;
            padding: 0;
          }
        </style>  
      </head>
      <body>
        <div id="invoice-container">
          <section id="invoice">
            <div class="invoice-content">
              <div class="my-5 py-5" style="padding-left:20px; padding-right:20px;">
                <div class="text-center" style="padding-bottom: 5px;">
                  <img src="${digitalconnects}" alt="Digital Connects Logo" style="max-width: 290px; height: 300px; margin-bottom: -150px; margin-top: -150px;" />
                </div>
                <br/><br/>
                <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                  <div style="flex: 1;">
                    <p style="font-weight: 500; color:rgb(11 14 134);">Quotation From</p>
                    <h4>Digital Connects</h4>
                    <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                      <li>digitalconnectsmedia@gmail.com</li>
                      <li style="margin-right:3px">+961 76 801 755</li>
                      <li>Beirut, Lebanon</li>
                    </ul>  
                  </div>
                  <div>
                    <p style="font-weight: 500; color:rgb(11 14 134);">Quotation To</p>
                    <h4>${record.username}</h4>
                    <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                      <li>${record.email}</li>
                      <li>${record.country_code} ${record.phone_number}</li>
                      <li>${record.address}, ${record.country}</li>
                    </ul>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid rgb(11 14 134); border-bottom: 2px solid rgb(11 14 134); margin: 20px 0; padding: 10px 0;">
                  <h2 style="font-size: 2rem; font-weight: 700; margin: 0;">Quotation</h2>
                  <div>
                    <p style="margin: 0;"><span style="font-weight: 500; margin-right:86px;">Date: ${currentDate}</span></p>
                  </div>
                </div>
                <div style="margin: 20px 0; margin-bottom:5px">
                  <table class="table table-striped border my-5" style="border-collapse: collapse;">
                    <thead style="background-color:rgb(11 14 134);">
                      <tr>
                        <th style="border-top: 2px solid rgb(11 14 134); padding: 8px; border-bottom: 2px solid rgb(11 14 134); color:white;">
                          <strong>Packages:</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      ${packages
                        .map(
                          (pkg) => `
                        <tr>
                          <td style="border-top: 2px solid rgb(11 14 134); padding: 8px;">${pkg}</td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style="border-top: 2px solid rgb(11 14 134); padding: 8px; font-weight: bold; color:red; text-align: right;">
                          Total Price: $${record.amount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h5 style="font-weight: 700;">Contact Us</h5>
                    <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                      <li><i class="custom-icon fas fa-map-marker-alt fa-sm me-2" style="color: rgb(11 14 134);"></i> Beirut, Lebanon</li>
                      <li><i class="custom-icon fas fa-phone-alt fa-sm me-2" style="color: rgb(11 14 134);"></i> +961 76 801 755</li>
                      <li><i class="custom-icon fas fa-envelope fa-sm me-2" style="color: rgb(11 14 134);"></i> digitalconnectsmedia@gmail.com</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style="font-weight: 700;">Our Social Media Accounts</h5>
                    <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                      <li style="display: flex; align-items: center;">
                        <i class="custom-icon fab fa-instagram fa-sm me-2" style="color: rgba(46, 49, 146, 1);"></i>
                        <span>Digitalconnectsmedia</span>
                      </li>
                      <li style="display: flex; align-items: center;">
                        <i class="custom-icon fab fa-facebook fa-sm me-2" style="color:rgba(46, 49, 146, 255);"></i>
                        <span>Digital Connects</span>
                      </li>
                      <li style="display: flex; align-items: center;">
                        <i class="custom-icon fab fa-twitter fa-sm me-2" style="color:rgba(46, 49, 146, 255);"></i>
                        <span>Digital Connects</span>
                      </li>
                      <li style="display: flex; align-items: center;">
                        <i class="custom-icon fab fa-linkedin fa-sm me-2" style="color:rgba(46, 49, 146, 255);"></i>
                        <span>Digital Connects</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="footer-bottom" style="border-top: 2px solid rgb(11 14 134); margin-top: 20px;">
                  <div style="text-align:center;">
                    <p style="margin: 0;">© 2024 Quotation. <a href="#" target="_blank" style="text-decoration: none;">Digital Connects</a></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
      </body>
    </html>
    `;
    const element = document.createElement("div");
    element.innerHTML = quotationHtml;
    const options = {
      margin: 5,
      filename: `digitalConnects_quotation.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5 },
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
      { header: "Amount", key: "price" },
      { header: "Phone Number", key: "number" },
    ];
    worksheet.columns = excelColumns.map((col) => ({
      header: col.header,
      key: col.key,
      width: 15,
    }));
    worksheet.addRow({
      username: record.username,
      type: record.type,
      amount: record.price,
      number: record.number,
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

  const filteredData = data.filter((item) =>
    item.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { 
      title: "Client Name", 
      dataIndex: "username", 
      key: "username",
      render: (text) => <span style={{ color: textColor, fontWeight: 500 }}>{text}</span>
    },
    { 
      title: "Phone Number", 
      dataIndex: "phone_number", 
      key: "phone_number",
      render: (text) => <span style={{ color: textColor }}>{text}</span>
    },
    {
      title: "Package",
      dataIndex: "type",
      key: "type",
      render: (text) => {
        const items = text.split("+").map((item) => `• ${item.trim()}`);
        return (
          <div>
            {items.map((item, index) => (
              <div key={index} style={{ color: textColor }}>{item}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span style={{ color: accentColor, fontWeight: 600 }}>${parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              onClick={() => handleEdit(record.id)} 
              icon={<EditOutlined />} 
              style={{
                background: 'rgba(255, 193, 7, 0.15)',
                border: `1px solid rgba(255, 193, 7, 0.3)`,
                color: '#ffc107',
                borderRadius: 8
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              onClick={() => handleDelete(record.id)} 
              icon={<DeleteOutlined />} 
              style={{
                background: 'rgba(255, 77, 79, 0.15)',
                border: `1px solid rgba(255, 77, 79, 0.3)`,
                color: '#ff4d4f',
                borderRadius: 8
              }}
            />
          </Tooltip>
          <Tooltip title="Download Quotation PDF">
            <Button
              onClick={() => downloadPDFInvoice(record)}
              icon={<FilePdfOutlined />}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${borderColor}`,
                color: '#ff4d4f',
                borderRadius: 8
              }}
            />
          </Tooltip>
          <Tooltip title="Download Excel">
            <Button
              onClick={() => downloadExcelInvoice(record)}
              icon={<FileExcelOutlined />}
              style={{
                background: 'rgba(0, 184, 148, 0.15)',
                border: `1px solid rgba(0, 184, 148, 0.3)`,
                color: '#00b894',
                borderRadius: 8
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: bgColor,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "30px",
      boxSizing: "border-box",
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 60px)",
      }}>
        
        {/* ===== HEADER ===== */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: 15
        }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              Quotations
            </Title>
            <Text style={{ color: secondaryText }}>Manage and export your client quotations.</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            href="/CreateQuotation"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
              border: "none",
              boxShadow: `0 4px 15px ${accentColor}44`,
              borderRadius: 8,
              height: 40
            }}
          >
            Create New Quotation
          </Button>
        </div>

        {/* ===== MAIN PANEL ===== */}
        <Card
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)",
            overflow: "hidden",
            flex: 1,
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* Search & Toolbar */}
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
            <Input
              placeholder="Search by username..."
              prefix={<SearchOutlined style={{ color: secondaryText }} />}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{
                width: 300,
                backgroundColor: inputBg,
                borderColor: borderColor,
                color: textColor,
                borderRadius: 8,
              }}
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            className="dark-table"
            rowKey="id"
          />
        </Card>
        
        <div style={{ marginTop: "40px", flexShrink: 0 }}>
          <AnimatePhoto />
        </div>
      </div>

           <style>{`
        /* Table overrides */
        .dark-table .ant-table {
          background-color: transparent !important;
          color: ${textColor} !important;
        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background-color: ${inputBg} !important;
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
        
        /* ===== FIX EMPTY STATE (NO DATA) ===== */
        .dark-table .ant-table-placeholder {
          background-color: ${inputBg} !important;
          border: none !important;
        }
        .dark-table .ant-empty-description {
          color: ${textColor} !important;
        }
        .dark-table .ant-empty-image svg {
          fill: ${textColor} !important;
          opacity: 0.4 !important;
        }
        /* ====================================== */
        
        .ant-table-thead > tr > th {
          color: ${textColor} !important;
        }
        
        .ant-input {
          background-color: ${inputBg} !important;
          color: ${textColor} !important;
          border: 1px solid ${borderColor} !important;
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

        @media (max-width: 768px) {
          .ant-card {
            padding: 15px !important;
          }
          .ant-input {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default View_Quotation;