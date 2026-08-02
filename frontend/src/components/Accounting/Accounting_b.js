import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tooltip, DatePicker, Switch } from 'antd';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Sidebar from '../SideBar/SideBar';
import html2pdf from 'html2pdf.js';
import ExcelJS from 'exceljs';
import digitalconnects from './digitalconnects.jpg';
import { useNavigate } from 'react-router-dom';
import { FilePdfOutlined, FileExcelOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const { Search } = Input;

const Accounting = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [data, setData] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalPriceOnMe, setTotalPriceOnMe] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalUniqueClients, setTotalUniqueClients] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredRecords = data
      .filter(item => item.username && item.username.toLowerCase().includes(searchText.toLowerCase()))
      .filter(filterDataByDateRange)
      .filter(filterDataByMonthAndYear);

    const totalAmountValue = filteredRecords.reduce((total, record) => total + (Number(record.amount) || 0), 0);
    setTotalAmount(totalAmountValue);

    const totalProfitValue = filteredRecords.reduce((total, record) => total + (Number(record.amount) - Number(record.price_on_me) || 0), 0);
    setTotalProfit(totalProfitValue);

    const totalPriceOnMeValue = filteredRecords.reduce((total, record) => total + (Number(record.price_on_me) || 0), 0);
    setTotalPriceOnMe(totalPriceOnMeValue);

    const uniqueClientsSet = new Set(filteredRecords.map(record => record.id));
    setTotalUniqueClients(uniqueClientsSet.size);

    setTotalInvoices(filteredRecords.length);

    const chartData = generateChartData(filteredRecords);
    setChartData(chartData);
  }, [data, searchText, startDate, endDate, selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/AccountingData');
      setData(response.data);
      const currentDate = new Date();
      setSelectedMonth(currentDate.getMonth() + 1);
      setSelectedYear(currentDate.getFullYear());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (date, dateString) => {
    if (date) {
      setSelectedMonth(date.month() + 1);
      setSelectedYear(date.year());
    } else {
      setSelectedMonth('');
      setSelectedYear('');
    }
  };

  const filterDataByDateRange = (record) => {
    if (!startDate || !endDate) return true;
    const recordDate = new Date(record.plan_date);
    return recordDate >= startDate && recordDate <= endDate;
  };

  const filterDataByMonthAndYear = (record) => {
    if (!selectedMonth || !selectedYear) return true;
    const recordDate = new Date(record.plan_date);
    return recordDate.getMonth() + 1 === selectedMonth && recordDate.getFullYear() === selectedYear;
  };

  const handleFilterByCurrentDay = () => {
    const currentDate = new Date();
    const filteredRecords = data.filter(record => {
      const recordDate = new Date(record.plan_date);
      return recordDate.toDateString() === currentDate.toDateString();
    });
    setData(filteredRecords);
  };

  const generateChartData = (filteredRecords) => {
    const groupedData = filteredRecords.reduce((acc, record) => {
      const recordDate = new Date(record.plan_date);
      const monthYearKey = `${recordDate.getMonth() + 1}-${recordDate.getFullYear()}`;
      acc[monthYearKey] = (acc[monthYearKey] || 0) + (record.amount - record.price_on_me);
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const dataValues = labels.map(label => groupedData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Total Profit',
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const handleToggleIsPaid = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/UpdateIsPaid/${id}`, { isPaid: !currentStatus });
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating isPaid status:', error);
    }
  };
  
  const downloadPDFInvoice = (record) => {
    const invoiceHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${digitalconnects}" alt="Company Logo" style="max-width: 150px; height: auto;" />
          <h1 style="color: #8f8061;">Digital Connects</h1>
          <p style="color: #7e8d9f; font-size: 20px;">Invoice &gt;&gt; <strong>ID: #${record.id}</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 16px; color: #8f8061;">To: ${record.username}</p>
              <p>${record.address || 'Street, City'}</p>
              <p>${record.city || 'State, Country'}</p>
              <p><strong>Phone:</strong> ${record.phone || '123-456-789'}</p>
            </div>
            <div style="text-align: right;">
              <p style="color: #7e8d9f; font-size: 16px;">Invoice</p>
              <p><strong>ID:</strong> #${record.id}</p>
              <p><strong>Creation Date:</strong> ${new Date(record.plan_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style="color: #8f8061;">${record.isPaid ? 'Paid' : 'Unpaid'}</span></p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="border-bottom: 2px solid #8f8061; padding-bottom: 10px;">Details</h2>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 70%;">
              <p><strong>Package:</strong> ${record.type}</p>
              <p><strong>Amount:</strong> $${record.amount}</p>
              <p><strong>Plan Date:</strong> ${new Date(record.plan_date).toLocaleDateString()}</p>
            </div>
            <div style="width: 30%; text-align: right;">
              <h3 style="color: #8f8061;">Total: $${record.amount}</h3>
            </div>
          </div>
        </div>
        <div>
          <p style="font-size: 14px; color: #7e8d9f;">Thank you for your business!</p>
        </div>
      </div>
    `;
  
    const element = document.createElement('div');
    element.innerHTML = invoiceHtml;
  
    html2pdf().from(element).save(`invoice_${record.id}.pdf`);
  };

  const downloadExcelInvoice = (record) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice');

    worksheet.columns = [
      { header: 'Client Name', key: 'username' },
      { header: 'Package', key: 'type' },
      { header: 'Amount', key: 'amount' },
      { header: 'Plan Date', key: 'plan_date' },
    ];

    worksheet.addRow({
      username: record.username,
      type: record.type,
      amount: record.amount,
      plan_date: record.plan_date,
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice_${record.id}.xlsx`;
      link.click();
    });
  };

  const handleEdit = (id) => {
    navigate(`/UpdateAccounting/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Find the record to be deleted
      const deletedRecord = data.find((item) => item.id === id);
  
      // Perform the delete operation
      await axios.delete(`http://localhost:5000/api/Remove_Data/${id}`);
  
      // Update the data state manually for immediate UI feedback
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
  
      // Optionally, you can re-fetch the data to ensure consistency
      await fetchData();
  
      // Optional: You can log or use the deleted record if needed
      console.log('Deleted Record:', deletedRecord);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  

  const columns = [
    { title: 'Client Name', dataIndex: 'username', key: 'username' },
    {
      title: 'Plan Date',
      dataIndex: 'plan_date',
      key: 'plan_date',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.plan_date) - new Date(b.plan_date),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Package',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const items = text.split('+').map(item => `• ${item.trim()}`);
        return <div>{items.map((item, index) => <div key={index}>{item}</div>)}</div>;
      },
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Price On Me', dataIndex: 'price_on_me', key: 'price_on_me' },
    {
      title: 'Is Paid?',
      dataIndex: 'ispaid',
      key: 'ispaid',
      render: (isPaid, record) => (
        <Switch
          checked={isPaid}
          checkedChildren="Paid"
          unCheckedChildren="Not Paid"
          onChange={() => handleToggleIsPaid(record.accounting_id, isPaid)}
          style={{ backgroundColor: isPaid ? 'green' : 'red' }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Tooltip title="Edit">
            <Button onClick={() => handleEdit(record.accounting_id)} icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button onClick={() => handleDelete(record.accounting_id)} icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button onClick={() => downloadPDFInvoice(record)} icon={<FilePdfOutlined />} />
          </Tooltip>
          <Tooltip title="Download Excel">
            <Button onClick={() => downloadExcelInvoice(record)} icon={<FileExcelOutlined />} />
          </Tooltip>
        </div>
      ),
    },
    // Add this column for the total profit
    {
      title: 'Profit',
      key: 'total_profit',
      render: (text, record) => (
        <div>{`$${record.amount - record.price_on_me}`}</div>
      ),
    },
  ];

  return (
    <div className={`accounting-container ${isDarkMode ? 'dark-mode' : ''}`} style={{marginLeft:"50px"}}>
      <Sidebar className="sidebar" />
      <div className="accounting-content">
        <h1>Accounting</h1>
        <Search
          placeholder="Search by client name"
          onSearch={value => setSearchText(value)}
          style={{ marginBottom: 16, width: '900px' }}
        />
        <DatePicker.RangePicker
          onChange={(dates, dateStrings) => {
            setStartDate(dates ? new Date(dateStrings[0]) : null);
            setEndDate(dates ? new Date(dateStrings[1]) : null);
          }}
          style={{ marginBottom: 16 }}
        />
        <Button onClick={handleFilterByCurrentDay} style={{ marginBottom: 16 }}>
          Filter By Current Day
        </Button>
        <DatePicker.MonthPicker
          onChange={handleDateChange}
          style={{ marginBottom: 16}}
        />
        <Button onClick={fetchData} style={{ marginBottom: 16 }}>
          Reset Filters
        </Button>
        <Button onClick={() => navigate('/CreateAccounting')} style={{ marginBottom: 16 }}>
          Add Client
        </Button>

        <div className="chart">
          {chartData && <Bar data={chartData} />}
        </div>
        <div className="actions">
          <Tooltip title="Export to Excel">
            <Button icon={<FileExcelOutlined />} onClick={() => downloadExcelInvoice(data)} />
          </Tooltip>
          <Tooltip title="Export to PDF">
            <Button icon={<FilePdfOutlined />} onClick={() => data.forEach(downloadPDFInvoice)} />
          </Tooltip>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false} 
        />
        <div className="totals">
          <div className={`StyledProfit ${isDarkMode ? 'dark-mode-container' : ''}`}>Total Profit: ${totalProfit}</div>
          <div className={`StyledProfit ${isDarkMode ? 'dark-mode-container' : ''}`}>Total Price On Me: ${totalPriceOnMe}</div>
          <div className={`StyledProfit ${isDarkMode ? 'dark-mode-container' : ''}`}>Total Amount: ${totalAmount}</div>
          <div className={`StyledProfit ${isDarkMode ? 'dark-mode-container' : ''}`}>Total Unique Clients: {totalUniqueClients}</div>
          <div className={`StyledProfit ${isDarkMode ? 'dark-mode-container' : ''}`}>Total Invoices: {totalInvoices}</div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
