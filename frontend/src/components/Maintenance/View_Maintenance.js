


import React, { useState, useEffect } from 'react';
import { Table, Space, message, Button, notification,Form,Input } from 'antd';
import axios from 'axios';
import Sidebar from '../SideBar/SideBar';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import AnimatePhoto from '../Images/AnimatePhoto';

const View_Maintenance = () => {
  const [tasks, setTasks] = useState([]);
 
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

 





  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.add('dark-mode-table');
      });
      setIsDarkModeEnabled(true);
    } else {
      document.body.classList.remove('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.remove('dark-mode-table');
      });
      setIsDarkModeEnabled(false);
    }
  }, [isDarkMode]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/viewmaintenance');
      setTasks(response.data);
      applyFilter(response.data, filter);
     
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Error fetching tasks. Please try again.');
    }
  };
  useEffect(() => {
    fetchTasks();
  }
    )
  

 

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/updateMaintenanceStatus/${taskId}`, { status });
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status };
          }
          return task;
        });
        applyFilter(updatedTasks, filter);
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Error updating task status. Please try again.');
    }
  };
  

  const applyFilter = (data, filter) => {
    let filteredData;
    switch (filter) {
      case 'pending':
        filteredData = data.filter((task) => task.status === 'Pending');
        break;
      case 'done':
        filteredData = data.filter((task) => task.status === 'Done');
        break;
      default:
        filteredData = data;
    }
    setFilteredTasks(filteredData);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(tasks, newFilter);
  };

  const columns = [
    { title: 'Text', dataIndex: 'text', key: 'text' },
    { title: 'Task Number', dataIndex: 'number', key: 'number' },
    {
      title: 'Created At',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleString('en-US', { timeZone: 'Asia/Beirut' }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
       <Button
  type="primary"
  key={`done-${record.id}`}
  style={{
    background: record.status === 'Done' ? 'Green' : 'white',
    color: record.status === 'Done' ? 'white' : isDarkMode ? 'black' : 'black',
  }}
  onClick={() => handleStatusUpdate(record.id, 'Done')} // <-- Always sets status to 'Done'
  className={isDarkMode ? 'dark-mode-button' : ''}
>
  Done
</Button>
<Button
  type="default"
  key={`pending-${record.id}`}
  style={{
    background: record.status === 'Pending' ? 'red' : 'white',
    color: record.status === 'Pending' ? 'white' : isDarkMode ? 'black' : 'black',
  }}
  className={isDarkMode ? 'dark-mode-container' : ''}
  onClick={() => handleStatusUpdate(record.id, 'Pending')} // <-- Always sets status to 'Pending'
>
  Pending
</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ flex: 1, width: '50%', marginLeft: '35%' }}>
      {/* <Sidebar /> */}
      <div style={{ flex: 1 }}>
        <h1 className={isDarkMode ? 'dark-mode-h1' : ''}>Maintenance List</h1>
        <Button href='/createmaintenance' className={isDarkMode ? 'dark-mode-container' : ''}>
          Create New Tasks
        </Button>

        <div style={{ marginTop: '10px' }}>
          <Button
            type={filter === 'all' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('all')}
            className={isDarkMode ? 'dark-mode-container' : ''}
          >
            All Tasks
          </Button>
          <Button
            type={filter === 'pending' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('pending')}
            className={isDarkMode ? 'dark-mode-container' : ''}
          >
            Pending Tasks
          </Button>
          <Button
            type={filter === 'done' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('done')}
            className={isDarkMode ? 'dark-mode-container' : ''}
          >
            Done Tasks
          </Button>
        </div>
    
        <Table
          dataSource={filteredTasks}
          columns={columns}
          pagination={{
            pageSize: 10,
            style: { color: isDarkMode ? 'white' : 'black' },
          }}
          className={isDarkMode ? 'dark-mode-table' : 'light-mode-table'}
          headerClassName={isDarkMode ? 'dark-mode-table-header' : 'light-mode-table-header'}
        />
        
      </div>
    </div>
  );
};

export default View_Maintenance;
