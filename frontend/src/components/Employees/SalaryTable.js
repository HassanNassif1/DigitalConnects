import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Typography, Divider, Input, Switch, Select, Tooltip, notification, DatePicker, Card, Row, Col, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, PlusOutlined, SearchOutlined, CalendarOutlined, DollarOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { MonthPicker, YearPicker } = DatePicker;

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalNotPaid, setTotalNotPaid] = useState(0);
  const [employees, setEmployees] = useState([]);
  
  // New record state
  const [newRecord, setNewRecord] = useState({
    employee_id: '',
    job_description: '',
    salary: '',
    is_paid: false,
    service: '',
    date: '',
  });

  // NEW: State to track which row is currently being edited (ID or 'new_record')
  const [editingRowId, setEditingRowId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState("currentMonth");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const { isDarkMode } = useDarkMode();

  // === UNIFIED DARK THEME ===
  const bgColor = "#0b0b16";
  const cardBg = "#141426";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.08)";
  const inputBg = "#1a1a2e";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255, 255, 255, 0.6)";
  const successGreen = "#00b894";

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    color: textColor,
    height: '40px',
  };

  useEffect(() => {
    fetchEmployees();
    fetchSalariesCurrentMonth();
    setCurrentFilter("currentMonth");
  }, []);

  const showNotification = (type, message) => {
    notification[type]({ message: message, duration: 2 });
  };

  // ===== API FETCH FUNCTIONS =====
  const fetchSalariesCurrentMonth = async () => {
    const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
    const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      setSalaries(response.data);
      
      const total = response.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching current month salaries:', error);
    }
  };

  const fetchSalariesSelectedMonth = async (monthStr) => {
    const startOfMonth = moment(monthStr, "YYYY-MM").startOf('month').format("YYYY-MM-DD");
    const endOfMonth = moment(monthStr, "YYYY-MM").endOf('month').format("YYYY-MM-DD");
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      setSalaries(response.data);
      
      const total = response.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching salaries for selected month:', error);
    }
  };

  const fetchSalariesSelectedYear = async (yearStr) => {
    const startOfYear = moment(yearStr, "YYYY").startOf('year').format("YYYY-MM-DD");
    const endOfYear = moment(yearStr, "YYYY").endOf('year').format("YYYY-MM-DD");
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      setSalaries(response.data);
      
      const total = response.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching salaries for selected year:', error);
    }
  };

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getsalaries');
      setSalaries(response.data);
      
      const total = response.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalSalary(total);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariespaid');
      const totalPaidFetched = responsePaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalPaid(totalPaidFetched);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesnotpaid');
      const totalNotPaidFetched = responseNotPaid.data.reduce((acc, item) => acc + Number(item.salary), 0);
      setTotalNotPaid(totalNotPaidFetched);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employee');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // ===== FRONTEND UI HELPERS =====
  const handleEmployeeChange = (value, record) => {
    const selectedEmployee = employees.find(emp => emp.id === value);
    const job_description = selectedEmployee ? selectedEmployee.job_description : '';
    if (record.key === 'new_record') {
      setNewRecord(prev => ({ ...prev, employee_id: value, job_description }));
    } else {
      setSalaries(prevSalaries =>
        prevSalaries.map(salary =>
          salary.id === record.id ? { ...salary, employee_id: value, job_description } : salary
        )
      );
    }
  };

  const handleNewRecordChange = (field, value, record) => {
    if (record.key === 'new_record') {
      setNewRecord(prev => ({ ...prev, [field]: value }));
    } else {
      setSalaries(prevSalaries =>
        prevSalaries.map(salary =>
          salary.id === record.id ? { ...salary, [field]: value } : salary
        )
      );
    }
  };

  const isFormValid = () => {
    return newRecord.employee_id && newRecord.salary && newRecord.date;
  };

  const resetNewRecord = () => {
    setNewRecord({
      employee_id: '',
      job_description: '',
      salary: '',
      is_paid: false,
      service: '',
      date: '',
    });
  };

  // NEW: Start editing a specific row
  const startEditing = (record) => {
    setEditingRowId(record.id || record.key);
  };

  // NEW: Cancel editing a specific row
  const cancelEditing = () => {
    setEditingRowId(null);
  };

  // ===== OPTIMISTIC CRUD UPDATES =====

  // 1. ADD / UPDATE SALARY (Optimistic)
  const handleSubmit = async (record) => {
    const isNew = record.key === 'new_record';
    const currentSalaries = [...salaries]; // Backup for revert

    try {
      if (isNew) {
        // OPTIMISTIC ADD
        const optimisticRecord = { ...newRecord, id: Date.now(), key: null }; 
        setSalaries(prev => [optimisticRecord, ...prev]);
        resetNewRecord(); // Clear inputs immediately

        // Background API Call
        const response = await axios.post('http://localhost:5000/api/postsalary', newRecord);
        // Replace temporary ID with real DB ID on success
        setSalaries(prev => prev.map(item => item.id === optimisticRecord.id ? response.data : item));
        showNotification('success', 'Salary record added successfully!');
      } else {
        // OPTIMISTIC UPDATE
        setSalaries(prev => prev.map(item => item.id === record.id ? { ...record } : item));
        setEditingRowId(null); // Exit edit mode immediately

        // Background API Call
        await axios.put(`http://localhost:5000/api/updatesalary/${record.id}`, { ...record });
        showNotification('success', 'Salary record updated successfully!');
      }

      // Recalculate totals
      fetchSalariesCurrentMonth();

    } catch (error) {
      console.error('Error:', error);
      // REVERT: If API fails, restore the old state
      setSalaries(currentSalaries);
      showNotification('error', 'Operation failed. Changes reverted.');
    }
  };

  // 2. DELETE SALARY (Optimistic)
  const handleDelete = async (id) => {
    const currentSalaries = [...salaries]; // Backup for revert

    try {
      // OPTIMISTIC DELETE: Remove from table immediately
      setSalaries(prev => prev.filter(item => item.id !== id));

      // Background API Call
      await axios.delete(`http://localhost:5000/api/deletesalary/${id}`);
      showNotification('success', 'Salary record deleted successfully!');
      
      // Recalculate totals
      fetchSalariesCurrentMonth();

    } catch (error) {
      console.error('Error deleting record:', error);
      // REVERT: If API fails, restore the old state
      setSalaries(currentSalaries);
      showNotification('error', 'Failed to delete record.');
    }
  };

  // ===== TABLE COLUMNS =====
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_id',
      width: 180,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Select
            value={text || undefined}
            onChange={(value) => handleEmployeeChange(value, record)}
            style={{ width: '100%', height: '40px', background: inputBg, color: textColor }}
            placeholder="Select Employee"
            disabled={!isEditing && record.key !== 'new_record'}
            dropdownStyle={{ background: inputBg }}
          >
            {employees.map(emp => (
              <Option key={emp.id} value={emp.id} style={{ color: textColor }}>
                {emp.username}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Job',
      dataIndex: 'job_description',
      width: 200,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Input
            value={text}
            onChange={(e) => handleNewRecordChange('job_description', e.target.value, record)}
            style={inputStyle}
            disabled={!isEditing && record.key !== 'new_record'}
          />
        );
      },
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      width: 150,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Input
            type="number"
            value={text}
            onChange={(e) => handleNewRecordChange('salary', e.target.value, record)}
            style={inputStyle}
            disabled={!isEditing && record.key !== 'new_record'}
          />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_paid',
      width: 120,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Switch
            checked={text}
            onChange={(checked) => handleNewRecordChange('is_paid', checked, record)}
            checkedChildren="Paid"
            unCheckedChildren="Unpaid"
            style={{ background: text ? successGreen : '#ff4d4f' }}
            disabled={!isEditing && record.key !== 'new_record'}
          />
        );
      },
    },
    {
      title: 'Service',
      dataIndex: 'service',
      width: 180,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Input
            value={text}
            onChange={(e) => handleNewRecordChange('service', e.target.value, record)}
            style={inputStyle}
            disabled={!isEditing && record.key !== 'new_record'}
          />
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 150,
      render: (text, record) => {
        const isEditing = editingRowId === (record.id || record.key);
        return (
          <Input
            type="date"
            value={text ? text.slice(0, 10) : ''}
            onChange={(e) => handleNewRecordChange('date', e.target.value, record)}
            style={inputStyle}
            disabled={!isEditing && record.key !== 'new_record'}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      render: (text, record) => {
        const isNew = record.key === 'new_record';
        const isEditing = editingRowId === (record.id || record.key);

        if (isNew) {
          return (
            <Tooltip title="Add Record">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleSubmit(record)}
                disabled={!isFormValid()}
                style={{ background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`, border: 'none', borderRadius: 8 }}
              />
            </Tooltip>
          );
        }

        if (isEditing) {
          return (
            <Space>
              <Tooltip title="Save Changes">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => handleSubmit(record)}
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`, border: 'none', borderRadius: 8 }}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  icon={<CloseOutlined />}
                  onClick={cancelEditing}
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${borderColor}`, color: textColor, borderRadius: 8 }}
                />
              </Tooltip>
            </Space>
          );
        }

        return (
          <Space>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                onClick={() => startEditing(record)}
                style={{ background: 'rgba(255, 193, 7, 0.15)', border: 'none', borderRadius: 8, color: '#ffc107' }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                style={{ background: 'rgba(255, 77, 79, 0.15)', border: 'none', borderRadius: 8, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Space>
        );
      },
    }
  ];

  const filteredSalaries = salaries.filter(salary => {
    const employee = employees.find(emp => emp.id === salary.employee_id);
    return employee ? employee.username.toLowerCase().includes(searchQuery.toLowerCase()) : false;
  });

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: bgColor, display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{ width: "100%", maxWidth: "1400px" }}>
        
        {/* ===== HEADER ===== */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={3} style={{ color: textColor, margin: 0 }}>
              Salary Management
            </Title>
            <Text style={{ color: secondaryText }}>Manage employee payroll and payment status.</Text>
          </div>
          
          {/* ===== FILTER & CONTROLS SECTION ===== */}
          <Space wrap>
            <Input 
              placeholder="Search by username..." 
              prefix={<SearchOutlined style={{ color: secondaryText }} />} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ width: 220, background: inputBg, borderColor, color: textColor, borderRadius: 8 }} 
            />
            <MonthPicker
              placeholder="Month"
              onChange={(value) => {
                if (value) {
                  const monthStr = value.format("YYYY-MM");
                  setSelectedMonth(monthStr);
                  fetchSalariesSelectedMonth(monthStr);
                  setCurrentFilter("selectedMonth");
                }
              }}
              style={{ width: 140, background: inputBg, borderColor, color: textColor, borderRadius: 8 }}
              className="dark-datepicker"
            />
            <YearPicker
              placeholder="Year"
              onChange={(value) => {
                if (value) {
                  const yearStr = value.format("YYYY");
                  setSelectedYear(yearStr);
                  fetchSalariesSelectedYear(yearStr);
                  setCurrentFilter("selectedYear");
                }
              }}
              style={{ width: 120, background: inputBg, borderColor, color: textColor, borderRadius: 8 }}
              className="dark-datepicker"
            />
            <Button onClick={() => { fetchSalaries(); setCurrentFilter("all"); }} style={{ background: "transparent", border: `1px solid ${borderColor}`, color: textColor, borderRadius: 8 }}>All</Button>
            <Button onClick={() => { fetchSalariesCurrentMonth(); setCurrentFilter("currentMonth"); }} style={{ background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`, border: "none", color: "#fff", borderRadius: 8 }}>Current Month</Button>
          </Space>
        </div>

        {/* ===== STATS CARDS ===== */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Card style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }}>
              <Text style={{ color: secondaryText, fontSize: 12 }}>TOTAL SALARY</Text>
              <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>${totalSalary.toFixed(2)}</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, borderColor: successGreen }}>
              <Text style={{ color: secondaryText, fontSize: 12 }}>TOTAL PAID</Text>
              <div style={{ fontSize: 20, fontWeight: 700, color: successGreen }}>${totalPaid.toFixed(2)}</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }}>
              <Text style={{ color: secondaryText, fontSize: 12 }}>TOTAL UNPAID</Text>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ff4d4f' }}>${totalNotPaid.toFixed(2)}</div>
            </Card>
          </Col>
        </Row>

        {/* ===== SALARY TABLE ===== */}
        <Card style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} bodyStyle={{ padding: 0, overflowX: 'auto' }}>
          <Table
            dataSource={[{ ...newRecord, key: 'new_record' }, ...filteredSalaries]}
            columns={columns}
            pagination={{ pageSize: 10 }}
            className="dark-table"
            rowKey="id"
            style={{ minWidth: 800 }}
            rowClassName={(record) => {
              // Highlight the row being edited with a purple glow
              const isEditing = editingRowId === (record.id || record.key);
              return isEditing ? "editing-row" : "";
            }}
          />
        </Card>
        
      </div>

      <style>{`
        .dark-table .ant-table { background: transparent !important; color: ${textColor} !important; }
        .dark-table .ant-table-container { border: none !important; }
        .dark-table .ant-table-thead > tr > th { background: ${inputBg} !important; color: ${textColor} !important; border-bottom: 1px solid ${borderColor} !important; }
        .dark-table .ant-table-tbody > tr > td { background: transparent !important; color: ${textColor} !important; border-bottom: 1px solid ${borderColor} !important; }
        .dark-table .ant-table-tbody > tr:hover > td { background: rgba(108, 92, 231, 0.08) !important; }
        
        /* Glowing effect for the row currently being edited */
        .editing-row td {
          background: rgba(108, 92, 231, 0.15) !important;
          box-shadow: inset 0 0 15px rgba(108, 92, 231, 0.1);
        }
        
        .ant-select-selector { background: ${inputBg} !important; border-color: ${borderColor} !important; color: ${textColor} !important; }
        .ant-select-dropdown { background: ${inputBg} !important; }
        .ant-select-item { color: ${textColor} !important; }
        
        .ant-picker { background: ${inputBg} !important; border-color: ${borderColor} !important; color: ${textColor} !important; }
        .ant-picker-input > input { color: ${textColor} !important; }
        .ant-picker-suffix { color: ${secondaryText} !important; }
        .ant-picker-dropdown { background: ${inputBg} !important; }
        
        .ant-input { background: ${inputBg} !important; border-color: ${borderColor} !important; color: ${textColor} !important; }
        .ant-input::placeholder { color: rgba(255, 255, 255, 0.3) !important; }
        
        .ant-pagination-item a { color: ${textColor} !important; }
        .ant-pagination-item-active { background: ${accentColor} !important; border-color: ${accentColor} !important; }
        
        @media (max-width: 768px) {
          .ant-table { font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default SalaryTable;