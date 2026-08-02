import React, { useState, useEffect } from "react";
import { Table, Input, Button, notification, Tooltip } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./quotation.css";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import Sidebar from "../../components/SideBar/SideBar";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";
import digitalconnects from "./digitalconnects.jpg";
import { useNavigate } from "react-router-dom";
import AnimatePhoto from "../Images/AnimatePhoto";

const { Search } = Input;

const View_Quotation = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const { isDarkMode } = useDarkMode();
  const [searchText, setSearchText] = useState("");

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

  const columns = [
    { title: "Client Name", dataIndex: "username", key: "username" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    {
      title: "Package",
      dataIndex: "type",
      key: "type",
      render: (text) => {
        const items = text.split("+").map((item) => `• ${item.trim()}`);
        return (
          <div>
            {items.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <>${parseFloat(text).toFixed(2)}</>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Tooltip title="Edit">
            <Button onClick={() => handleEdit(record.id)} icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="Download Quotation PDF">
            <Button
              onClick={() => downloadPDFInvoice(record)}
              icon={<FilePdfOutlined />}
              style={{ color: "red" }}
            />
          </Tooltip>
          <Tooltip title="Download Excel">
            <Button
              onClick={() => downloadExcelInvoice(record)}
              icon={<FileExcelOutlined />}
              style={{ color: "green" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ flex: 1, width: "65%", marginLeft: "27%" }}>
      <div style={{ flex: 1 }}>
        <h1 style={{color:"white"}}>Quotations</h1>
        <Search
          placeholder="Search by username"
          onChange={(e) => setSearchText(e.target.value)}
          className={isDarkMode ? "dark-mode-search" : "light-mode-search"}
          style={{
            width: 200,
            height: 30,
            fontSize: 15,
            borderColor: isDarkMode ? "white" : "rgb(22, 22, 22)",
            marginBottom: 16,
            backgroundColor: isDarkMode ? "rgb(22, 22, 22)" : "white",
            color: isDarkMode ? "white" : "black",
          }}
        />
        <Button href="/CreateQuotation" style={{ marginLeft: 830 }}>
          Create New Quotation
        </Button>
        <br /><br />
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          className={isDarkMode ? "dark-mode-table" : "light-mode-table"}
          headerClassName={
            isDarkMode
              ? "dark-mode-table-header"
              : "light-mode-table-header"
          }
        />
        {/* <AnimatePhoto/> */}
      </div>
    </div>
  );
};

export default View_Quotation;
