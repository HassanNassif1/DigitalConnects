import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Button } from 'antd';
import profile from './a.png';
import digitalconnects from './digitalconnects.jpg';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function User() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const { userType } = responseData;

        toast.success(`Welcome ${username}! You are now logged in.`, { autoClose: 3000 });

        setTimeout(() => {
          sessionStorage.setItem('loggedInUser', JSON.stringify({ username, userType }));
          if (userType === 'Accountant') navigate('/accounting');
          else if (userType === 'IT') navigate('/maintenance');
          else if (userType === 'Manager') navigate('/accounting');
          else navigate('/');
        }, 3000);
      } else if (response.status === 404) {
        toast.error('Login failed. Please check your credentials.', { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="main"
      style={{
        backgroundImage: `url(${digitalconnects})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
       
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="form-wrapper"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          width: '720px',
          padding: '60px 50px',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35)',
          color: '#1e1e1e',
          textAlign: 'center',
        }}
      >
        {/* Profile Image */}
        <div className="container-image" style={{ marginBottom: '30px' }}>
          <img
            src={profile}
            alt="profile"
            className="profile"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '3px solid #fff',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)',
            }}
          />
        </div>

        {/* Title */}
        <h2
          style={{
            marginBottom: '40px',
            fontSize: '30px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '1px',
          }}
        >
          Sign In to Your Account
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="username"
            style={{
              display: 'block',
              textAlign: 'left',
              marginBottom: '8px',
              fontWeight: '500',
              color: 'white',
              fontSize: '16px',
            }}
          >
            Username
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              height: '55px',
              marginBottom: '25px',
              fontSize: '16px',
              borderRadius: '8px',
              color: 'black',
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: 'block',
              textAlign: 'left',
              marginBottom: '8px',
              fontWeight: '500',
              color: 'white',
              fontSize: '16px',
            }}
          >
            Password
          </label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              height: '55px',
              marginBottom: '35px',
              fontSize: '16px',
              borderRadius: '8px',
              color: 'black', // ✅ Password text visible
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          />

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: '55px',
              fontSize: '18px',
              backgroundColor: '#2e3192',
              borderRadius: '10px',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Login
          </Button>
        </form>

        <p style={{ marginTop: '30px', fontSize: '14px', color: '#dcdcdc' }}>
          © 2026 Digital Connects — All rights reserved
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default User;
