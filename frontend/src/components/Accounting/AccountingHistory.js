import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';
import { Table, Input, Button, Modal, notification, DatePicker, Tooltip } from 'antd';
import axios from 'axios';
import './app.css';
import { BarChartOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';


import Sidebar from '../../components/SideBar/SideBar';
import html2pdf from 'html2pdf.js';
import ExcelJS from 'exceljs';
import digitalconnects from './digitalconnects.jpg';
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from '../Images/AnimatePhoto';
const { Search } = Input;

const AccountingHistory = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Add a class to the body and custom-table when dark mode is enabled
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.add('dark-mode-table');
      });
    } else {
      document.body.classList.remove('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.remove('dark-mode-table');
      });
    }
  }, [isDarkMode]);
  const fetchData = () => {
    axios
      .get('http://localhost:5000/api/AccountingDataHistory')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  
  const downloadPDFInvoice = (record) => {
    const invoiceHtml = `
    <div>
      <img src="${digitalconnects}" alt="Daemedia Logo" style="max-width: 50%; height: auto;" />
      <h1>Invoice for ${record.username}</h1>
      <Table style="width: 100%; border-collapse: collapse;">
        <tr>
        <td style="border: 1px solid #ddd; padding: 8px; color: black;">Client Name</td>

          <td style="border: 1px solid #ddd; padding: 8px; color: black;">${record.username}</td>
        </tr>
       
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">Package</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">${record.type}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">Amount</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">${record.amount}</td>
        </tr>
      
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">Plan Date</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: black;">${record.plan_date}</td>
        </tr>
      </table>
      <h5 style=" padding: 8px; color: black;">Thanks for Choosing Digital Connects ! </h5>
    </div>
  `;

    const element = document.createElement('div');
    element.innerHTML = invoiceHtml;

    const options = {
      margin: 10,
      filename: `invoice_${record.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf(element, options);
  };

const downloadExcelInvoice = (record) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Invoice');

  const excelColumns = [
    { header: 'Client Name', key: 'username' },
   
    { header: 'Package', key: 'type' },
    { header: 'Amount', key: 'amount' },
   
    { header: 'Plan Date', key: 'plan_date' },
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
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const excelFilename = `invoice_${record.id}.xlsx`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = excelFilename;
    link.click();
  });
};







  // ... your existing code

  // Add this function to update the data after editing

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Client Name', dataIndex: 'username', key: 'username' },

  {
    title: 'Plan Date',
    dataIndex: 'plan_date',
    key: 'plan_date',
    render: (text, record) => new Date(text).toLocaleDateString(),
  },
  { title: 'Package', dataIndex: 'type', key: 'type' },
 
  { title: 'Remaining Package', dataIndex: 'remaining', key: 'remaining' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { title: 'Price on me', dataIndex: 'price_on_me', key: 'price_on_me' },
  {
    title: 'Download PDF',
    key: 'downloadPDF',
    render: (text, record) => (
      <Button onClick={() => downloadPDFInvoice(record)}>Download PDF</Button>
    ),
  },
  {
    title: 'Download Excel',
    key: 'downloadExcel',
    render: (text, record) => (
      <Button onClick={() => downloadExcelInvoice(record)}>Download Excel</Button>
    ),
  },
  {
    title: 'Total Profit',
    key: 'totalProfit',
    render: (text, record) => {
      const amount = record.amount;
      const priceOnMe = record.price_on_me;
      const profit = amount - priceOnMe;
      return <span>${profit}</span>;
    },
  },

{
    title: 'Recover',
    key: 'recover',
    render: (text, record) => (
      <Button className={isDarkMode ? 'dark-mode-button' : ''} onClick={() => handleRecover(record.id)}>Recover</Button>
    ),
  },


];
const handleRecover = (id) => {
    const recoveredRecord = data.find((item) => item.id === id);
  
    // You can add confirmation logic here if needed
    axios
      .post('http://localhost:5000/RecoverData', {
        id: recoveredRecord.id,
        username: recoveredRecord.username,
        type: recoveredRecord.type,
       
        amount: recoveredRecord.amount,
        // Include the necessary fields in the recovered record
      
        plan_date: recoveredRecord.plan_date,
        price_on_me: recoveredRecord.price_on_me,
        remaining: recoveredRecord.remaining,
      })
      .then((response) => {
        // Assuming the recover request is successful, update the data
        const updatedData = [...data, recoveredRecord];
        setData(updatedData);
  
        // Remove the recovered record from the AccountingHistory table
        const updatedHistoryData = data.filter((item) => item.id !== id);
        setData(updatedHistoryData);
  
        console.log('Recovered Record:', recoveredRecord);
      })
      .catch((error) => {
        console.error('Error recovering data:', error);
      });
  };
  
  
  
  
const filteredData = data.filter((item) =>
  (item.username && item.username.toLowerCase().includes(searchText.toLowerCase())) 
);


const isDataAvailable = data.length > 0;





  




return (
  <div style={{ flex: 1, width: '65%', marginLeft: '25%' }}>
    <Sidebar />
    <div style={{ flex: 1 }}>
    <h1 className={isDarkMode ? 'dark-mode-h1' : ''}>Accounting History Data</h1>
    <Search
    
    placeholder="Search by username"
    onChange={(e) => setSearchText(e.target.value)}
    className={isDarkMode ? 'dark-mode-search' : 'light-mode-search'}
    style={{
      width: 200,
      height: 30,
      fontSize: 15,
      borderColor: isDarkMode ? 'white' : 'rgb(22, 22, 22)',
      marginBottom: 16,
      backgroundColor: isDarkMode ? 'rgb(22, 22, 22)' : 'white',
      color: isDarkMode ? 'white' : 'black',
    }}
    
  />
 
      {/* <Button href='/CreateAccounting'>Create New Invoice</Button>
      <Button href='/CreateQuotation'>Create New Quotation</Button> */}
      {isDataAvailable ? (
     <Table
     dataSource={filteredData}
     columns={columns}
     pagination={{
       pageSize: 10,
       style: {
         color: isDarkMode ? 'white' : 'black',
       },
     }}
     className={isDarkMode ? 'dark-mode-table' : 'light-mode-table'}
     headerClassName={isDarkMode ? 'dark-mode-table-header' : 'light-mode-table-header'}
   />
      ) : (
        <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          pageSize: 10,
          style: {
            color: isDarkMode ? 'white' : 'black',
          },
        }}
        className={isDarkMode ? 'dark-mode-table' : 'light-mode-table'}
        headerClassName={isDarkMode ? 'dark-mode-table-header' : 'light-mode-table-header'}
      />
      )}
      
    
   
    </div>
  </div>
);
};

export default AccountingHistory;