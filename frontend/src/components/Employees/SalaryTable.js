import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Typography, Divider, Input, Switch, Select, Tooltip, notification, DatePicker } from 'antd';
import Sidebar from "../SideBar/SideBar";
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { MonthPicker, YearPicker } = DatePicker;

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalNotPaid, setTotalNotPaid] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [newRecord, setNewRecord] = useState({
    employee_id: '',
    job_description: '',
    salary: '',
    is_paid: false,
    service: '',
    date: '',
  });
  const [disabled, setDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // New state for the filtering mode and selected values
  const [currentFilter, setCurrentFilter] = useState("currentMonth"); // "currentMonth", "selectedMonth", "selectedYear", "all"
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Initially load current month's salaries
  useEffect(() => {
    fetchSalariesCurrentMonth();
    setCurrentFilter("currentMonth");
  }, []);

  const showNotification = (type, message) => {
    notification[type]({
      message: message,
      duration: 2,
    });
  };

  const EditToggle = () => {
    setDisabled(!disabled);
  };

  // Fetch salaries for the current month
  const fetchSalariesCurrentMonth = async () => {
    const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
    const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      setSalaries(response.data);
      const total = response.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: currentMonthStart, to_date: currentMonthEnd },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching current month salaries:', error);
    }
  };

  // Fetch salaries based on a selected month (using date range derived from the month)
  const fetchSalariesSelectedMonth = async (monthStr) => {
    const startOfMonth = moment(monthStr, "YYYY-MM").startOf('month').format("YYYY-MM-DD");
    const endOfMonth = moment(monthStr, "YYYY-MM").endOf('month').format("YYYY-MM-DD");
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      setSalaries(response.data);
      const total = response.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: startOfMonth, to_date: endOfMonth },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching salaries for selected month:', error);
    }
  };

  // Fetch salaries based on a selected year (using date range derived from the year)
  const fetchSalariesSelectedYear = async (yearStr) => {
    const startOfYear = moment(yearStr, "YYYY").startOf('year').format("YYYY-MM-DD");
    const endOfYear = moment(yearStr, "YYYY").endOf('year').format("YYYY-MM-DD");
    try {
      const response = await axios.get('http://localhost:5000/api/getsalariesbydate', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      setSalaries(response.data);
      const total = response.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalSalary(total);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesbydatenotpaid', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      const totalNotPaid = responseNotPaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalNotPaid(totalNotPaid);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariesbydatepaid', {
        params: { from_date: startOfYear, to_date: endOfYear },
      });
      const totalPaid = responsePaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalPaid(totalPaid);
    } catch (error) {
      console.error('Error fetching salaries for selected year:', error);
    }
  };

  // View all salaries (removing any filters)
  const fetchSalaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getsalaries');
      setSalaries(response.data);
      const total = response.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalSalary(total);

      const responsePaid = await axios.get('http://localhost:5000/api/getsalariespaid');
      const totalPaidFetched = responsePaid.data.reduce((acc, item) => acc + item.salary, 0);
      setTotalPaid(totalPaidFetched);

      const responseNotPaid = await axios.get('http://localhost:5000/api/getsalariesnotpaid');
      const totalNotPaidFetched = responseNotPaid.data.reduce((acc, item) => acc + item.salary, 0);
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

  const handleSubmit = async (record) => {
    try {
      if (record.key === 'new_record') {
        await axios.post('http://localhost:5000/api/postsalary', newRecord);
        showNotification('success', 'Salary record added successfully!');
      } else {
        await axios.put(`http://localhost:5000/api/updatesalary/${record.id}`, { ...record });
        setDisabled(!disabled);
        showNotification('success', 'Salary record updated successfully!');
      }
      // Refresh the data based on the current filter mode
      if (currentFilter === "all") {
        fetchSalaries();
      } else if (currentFilter === "currentMonth") {
        fetchSalariesCurrentMonth();
      } else if (currentFilter === "selectedMonth") {
        fetchSalariesSelectedMonth(selectedMonth);
      } else if (currentFilter === "selectedYear") {
        fetchSalariesSelectedYear(selectedYear);
      }
      resetNewRecord();
    } catch (error) {
      console.error('Error updating/adding record:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deletesalary/${id}`);
      showNotification('success', 'Salary record deleted successfully!');
      // Refresh data based on current filter
      if (currentFilter === "all") {
        fetchSalaries();
      } else if (currentFilter === "currentMonth") {
        fetchSalariesCurrentMonth();
      } else if (currentFilter === "selectedMonth") {
        fetchSalariesSelectedMonth(selectedMonth);
      } else if (currentFilter === "selectedYear") {
        fetchSalariesSelectedYear(selectedYear);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
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

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_id',
      width: 200,
      render: (text, record) => (
        <Select
          value={text || undefined}
          onChange={(value) => handleEmployeeChange(value, record)}
          style={{ width: '100%', height: '40px' }}
          placeholder="Select Employee"
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        >
          {employees.map(emp => (
            <Option key={emp.id} value={emp.id}>
              {emp.username}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Job Description',
      dataIndex: 'job_description',
      width: 230,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleNewRecordChange('job_description', e.target.value, record)}
          style={{ height: '40px' }}
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        />
      ),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      width: 200,
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleNewRecordChange('salary', e.target.value, record)}
          style={{ height: '40px' }}
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        />
      ),
    },
    {
      title: 'Is Paid',
      dataIndex: 'is_paid',
      width: 200,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => handleNewRecordChange('is_paid', checked, record)}
          checkedChildren="Paid"
          unCheckedChildren="Not Paid"
          style={{ backgroundColor: text ? 'green' : 'red' }}
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        />
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service',
      width: 200,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleNewRecordChange('service', e.target.value, record)}
          style={{ height: '40px' }}
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 200,
      render: (text, record) => (
        <Input
          type="date"
          value={text ? text.slice(0, 10) : ''}
          onChange={(e) => handleNewRecordChange('date', e.target.value, record)}
          style={{ height: '40px' }}
          disabled={disabled === true && record.key === 'new_record' ? false : disabled}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      render: (text, record) => (
        <>
          <Tooltip title="Save">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSubmit(record)}
              disabled={!isFormValid() && record.key === 'new_record'}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          {record.key === "new_record" ? null : (
            <>
              <Tooltip title="Delete">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                  style={{ marginRight: 8 }}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  type="link"
                  danger
                  icon={<EditOutlined />}
                  onClick={EditToggle}
                />
              </Tooltip>
            </>
          )}
        </>
      ),
    }
  ];

  // Filter salaries by employee username based on the search query
  const filteredSalaries = salaries.filter(salary => {
    const employee = employees.find(emp => emp.id === salary.employee_id);
    return employee ? employee.username.toLowerCase().includes(searchQuery.toLowerCase()) : false;
  });

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', minHeight: '150vh' }}>
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Salary Management</Title>
          <Divider />
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Input 
              placeholder="Search by username" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ width: 200 }} 
            />
            <br /><br />
            {/* Month and Year Pickers for filtering */}
            <MonthPicker
              placeholder="Select Month"
              onChange={(value) => {
                if (value) {
                  const monthStr = value.format("YYYY-MM");
                  setSelectedMonth(monthStr);
                  fetchSalariesSelectedMonth(monthStr);
                  setCurrentFilter("selectedMonth");
                }
              }}
              style={{ width: 200, marginTop: '10px', marginRight: '10px' }}
            />
            <YearPicker
              placeholder="Select Year"
              onChange={(value) => {
                if (value) {
                  const yearStr = value.format("YYYY");
                  setSelectedYear(yearStr);
                  fetchSalariesSelectedYear(yearStr);
                  setCurrentFilter("selectedYear");
                }
              }}
              style={{ width: 200, marginTop: '10px', marginRight: '10px' }}
            />
            <br />
            <Button
              onClick={() => {
                fetchSalaries();
                setCurrentFilter("all");
              }}
              style={{ marginTop: '10px', marginRight: '10px' }}
            >
              View All
            </Button>
            <Button
              onClick={() => {
                fetchSalariesCurrentMonth();
                setCurrentFilter("currentMonth");
              }}
              style={{ marginTop: '10px' }}
            >
              Current Month
            </Button>
          </div>
          <br />
          <Table
            dataSource={[{ ...newRecord, key: 'new_record' }, ...filteredSalaries]}
            columns={columns}
            pagination={false}
            style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', marginLeft: 310 }}
          />
          <div style={{ marginLeft: 700 }} className="StyledProfit">
            Total Not Paid: ${totalNotPaid.toFixed(2)}
          </div>
          <div style={{ marginLeft: 700 }} className="StyledProfit">
            Total Paid: ${totalPaid.toFixed(2)}
          </div>
          <div style={{ marginLeft: 700 }} className="StyledProfit">
            Total All: ${totalSalary.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryTable;
