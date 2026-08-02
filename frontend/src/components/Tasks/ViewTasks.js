import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Sidebar from '../../components/SideBar/SideBar';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/viewtasks');
      console.log("Fetched tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Error fetching tasks. Please try again.');
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  // Format date/time for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
  
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  // Update task status (mark as Done)
  const updateTaskStatus = async (taskId, status) => {
    try {
      console.log(`Updating task ${taskId} status to ${status}`);
      await axios.put(`http://localhost:5000/updateTaskStatus/${taskId}`, { status });
      message.success('Task status updated successfully.');
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Error updating task status. Please try again.');
    }
  };

  // Table columns for Pending Tasks (with "Done" action)
  const pendingColumns = [
    { title: 'Text', dataIndex: 'text', key: 'text' },
    {
      title: 'Task Date',
      key: 'date',
      dataIndex: 'date',
      render: (text) => formatDate(text),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => updateTaskStatus(record.id, 'Done')}>
            Done
          </Button>
        </Space>
      ),
    },
  ];

  // Table columns for Completed Tasks (no actions)
  const completedColumns = [
    { title: 'Text', dataIndex: 'text', key: 'text' },
    {
      title: 'Task Date',
      key: 'date',
      dataIndex: 'date',
      render: (text) => formatDate(text),
    },
  ];

  // Split tasks based on status
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const completedTasks = tasks.filter(task => task.status === 'Done');

  return (
    <div style={{ flex: 1, width: '50%', marginLeft: '35%' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Tasks List</h1>
        <Button href='/CreateTasks'>Create New Tasks</Button>
        
        <h2>Pending Tasks</h2>
        <Table
          dataSource={pendingTasks}
          columns={pendingColumns}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default ViewTasks;
