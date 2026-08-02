import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Card,notification } from 'antd';
import axios from 'axios';
import './ViewRecoveredAccounts.css';
import Sidebar from '../../components/SideBar/SideBar';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const ViewRecoveredAccounts = () => {
    const [data, setData] = useState([]);
    const [userRecords, setUserRecords] = useState({});
    const [searchText, setSearchText] = useState('');
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();

    const fetchClient = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/recoveredAccounts');
            setData(response.data);

            // Fetch accounting records for each user
            const userIds = response.data.map(user => user.id);
            const recordsPromises = userIds.map(id =>
                axios.get(`http://localhost:5000/api/user-accounting/${id}`)
            );

            const recordsResponses = await Promise.all(recordsPromises);
            const recordsStatus = {};
            recordsResponses.forEach((response, index) => {
                recordsStatus[userIds[index]] = response.data.hasRecords;
            });
            setUserRecords(recordsStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchClient();
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const handleViewDetails = (userId) => {
        navigate(`/recoverAccountProfile/${userId}`);
    };

    const handleDelete = async (userId) => {
        try {
            // First, delete from edit_history
            await axios.delete(`http://localhost:5000/api/editHistory/${userId}`);
            console.log('Edit history deleted');
    
            // Then, delete from recovered_accounts
            await axios.delete(`http://localhost:5000/api/deleteRecoveredAccounts/${userId}`);
            console.log('Account deleted');
    
            // Fetch the updated data
            await fetchClient();
    
            notification.success({
                message: 'Success',
                description: 'Account deleted successfully.',
            });
        } catch (error) {
            console.error('Delete error:', error.response ? error.response.data : error.message);
        }
    };
    
    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    }
    
    

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
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <div className="action-btns">

        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
          className="action-btn view-btn"
        />

        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewProfile(record.sm_id)}
          className="action-btn view-btn"
        />

        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
          className={`action-btn delete-btn ${
            userRecords[record.id] ? "blue-btn" : "red-btn"
          }`}
        />

      </div>
    ),
  },
];



    const filteredData = data.filter((item) =>
        item.username.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
  <div className="recovered-accounts-dashboard">
    <Card
      className="glow-box"
      title={<h3 className="table-title">Recovered Accounts List</h3>}
      bordered={false}
    >
      <div className="top-bar">
        <Input
          placeholder="Search by username"
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        <Button
          href="/AddRecoveredAccount"
          className="create-btn"
        >
          Create New Account
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        className="styled-table"
      />
    </Card>
  </div>
);

};

export default ViewRecoveredAccounts;
