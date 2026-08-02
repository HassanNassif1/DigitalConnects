// User.jsx

import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import './Register.css';
import digitalconnects from './digitalconnects.jpg';
import digitalconnects1 from './digitalconnects1.jpg';
import axios from 'axios';
import Sidebar from '../SideBar/SideBar';

const Register = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [Users, setUsers] = useState([]);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedUser(value);
  };
  const buttonColor = 'rgba(46,49,146,255)';
const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  boxSizing: 'border-box',
  fontFamily: 'Arial',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  height: 50,
  borderColor: isDarkMode ? 'white' : 'rgb(22, 22, 22)',
  marginBottom: 16,
  backgroundColor: isDarkMode ? 'rgb(22, 22, 22)' : 'white',
  color: isDarkMode ? 'white' : 'black',
};

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios
      .get('http://localhost:5000/api/user_type')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Add a class to the body and custom-table when dark mode is enabled
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.querySelectorAll('.custom-table').forEach((table) => {
        table.classList.add('dark-mode-table');
      });
      setIsDarkModeEnabled(true);
    } else {
      document.body.classList.remove('dark-mode');
      document.querySelectorAll('.custom-table').forEach((table) => {
        table.classList.remove('dark-mode-table');
      });
      setIsDarkModeEnabled(false);
    }
  }, [isDarkMode]);

  return (
    <div className="main">
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col span={8}>
          <div className="sub-main">
            <div className="imgs">
              <div >
                <img
                  src={isDarkMode ? digitalconnects : digitalconnects1}
                  alt="profile"
                  className="profile"
                />
              </div>
            </div>
            <div>
              <h1>Registration</h1>
              <div>
                <form method="post" action={'http://localhost:5000/AddAdmin'}>
                <Input
  className="input"
  type="text"
  placeholder="Enter your username"
  name="username"
  prefix={<UserOutlined />}
  style={{
    ...inputStyle,
    backgroundColor: isDarkMode ? 'rgb(22, 22, 22)' : 'white',
    color: isDarkMode ? 'white' : 'black',
  }}
/>
<Input
  className="input"
  type="password"
  placeholder="Enter your password"
  name="password"
  prefix={<LockOutlined />}
  style={{
    ...inputStyle,
    backgroundColor: isDarkMode ? 'rgb(22, 22, 22)' : 'white',
    color: isDarkMode ? 'white' : 'black',
  }}
/>
                  <div>
                    <h3>Platform:</h3>
                    <select
                      className="select-list"
                      name="user_type"
                      style={inputStyle}
                      onChange={handleTypeChange}
                      value={selectedUser}
                    >
                      {Users.map((data) => (
                        <option value={data.type} key={data.type}>
                          {data.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button className="button" type="primary" htmlType="submit" style={{ backgroundColor: buttonColor }}>
                    Register
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
