import React, { useState, useEffect } from 'react';
import { Table, Button, notification, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import reminderSound from './reminder.mp3';
import Sidebar from '../SideBar/SideBar';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [audio] = useState(new Audio(reminderSound));
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [reminderTimers, setReminderTimers] = useState([]);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/viewtasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      notification.error({ message: 'Error fetching tasks. Please try again.' });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = moment();

      tasks.forEach(task => {
        const reminderTime = moment(task.reminderdatetime);
        // Check if reminder time is equal to current time and not already notified
        if (reminderTime.isSame(now, 'minute')) {
          notification.info({
            message: 'Reminder',
            description: `Reminder for task: ${task.text}`,
          });
          audio.play(); // Play reminder sound
          setReminderTimers(prev => [...prev, task.id]); // Add to notified list
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [tasks, audio, reminderTimers]);


  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/updateTaskStatus/${taskId}`, { status });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task status:', error);
      notification.error({ message: 'Error updating task status. Please try again.' });
    }
  };

  // Handle reminder date and time change
  const handleReminderChange = async (dateTime, taskId) => {
    const formattedDateTime = dateTime;
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, reminderdatetime: formattedDateTime } : task
    );
    setTasks(updatedTasks);
    await axios.put(`http://localhost:5000/updateTaskReminder/${taskId}`, { reminderdatetime: formattedDateTime });
  };

  // Table columns configuration
  const columns = [
    { title: 'Task', dataIndex: 'text', key: 'text' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Reminder Date & Time',
      key: 'reminderdatetime',
      render: (text, record) => (
        <DatePicker
          showTime
          value={record.reminderdatetime ? moment(record.reminderdatetime) : null}
          onChange={(date) => handleReminderChange(date, record.id)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="primary" onClick={() => updateTaskStatus(record.id, 'Done')}>
          Mark as Done
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', width:'55%', marginLeft:400 }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Button href="/CreateTasks" style={{ marginBottom: '20px' }}>
          Create Task
        </Button>
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default Tasks;
