import React, { useEffect, useState } from 'react';
import { Input, Button, Spin, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  RocketOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import digitalconnects from './digitalconnects.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [selectedUserType, setSelectedUserType] = useState('');
  const [userTypes, setUserTypes] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user_type')
      .then((response) => {
        setUserTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user types:', error);
        message.error('Failed to load user types');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password || !selectedUserType) {
      message.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/AddAdmin', {
        username,
        password,
        user_type: selectedUserType,
      });

      if (response.status === 201) {
        message.success(`Admin "${username}" created successfully!`);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response?.status === 400) {
        message.error(error.response.data.message || 'Username already exists');
      } else {
        message.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        background: '#0a0a1a',
        position: 'fixed',
        top: 0,
        left: 180,
        overflow: 'hidden',
      }}
    >
      {/* Ambient Glow Orbs */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          right: '-5%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.10) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-15%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Container - Split Layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        {/* LEFT PANEL - Branding & Info */}
        <div
          style={{
            flex: '0 0 42%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 50px',
            background: 'linear-gradient(160deg, rgba(139, 92, 246, 0.06) 0%, rgba(10, 10, 26, 0) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.04)',
            position: 'relative',
          }}
        >
          {/* Decorative rings */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              height: '450px',
              border: '1px solid rgba(139, 92, 246, 0.05)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              border: '1px solid rgba(139, 92, 246, 0.03)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              <img 
                src={digitalconnects} 
                alt="DigitalConnects" 
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '22px',
                  objectFit: 'cover',
                  boxShadow: '0 20px 60px rgba(139, 92, 246, 0.35)',
                  border: '2px solid rgba(139, 92, 246, 0.15)',
                }}
              />
            </div>

            {/* Dashboard Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(139, 92, 246, 0.10)',
                padding: '6px 16px',
                borderRadius: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(139, 92, 246, 0.08)',
              }}
            >
              <DashboardOutlined style={{ color: '#8b5cf6', fontSize: '14px' }} />
              <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
                Dashboard • v3.0
              </span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: '38px',
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: '12px',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',
              }}
            >
              <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Admin Registration
              </span>
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.45)',
                maxWidth: '400px',
                margin: '0 auto 20px',
                lineHeight: '1.7',
              }}
            >
              Create a new administrator account and start managing your digital ecosystem with confidence.
            </p>

            {/* Feature badges */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                marginTop: '30px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <SafetyOutlined style={{ color: '#8b5cf6', fontSize: '16px' }} />
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px', fontWeight: '500' }}>Secure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <RocketOutlined style={{ color: '#8b5cf6', fontSize: '16px' }} />
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px', fontWeight: '500' }}>Fast Setup</span>
              </div>
            </div>

            {/* Navigation menu mockup */}
            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                maxWidth: '380px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {['Accounting', 'Recovery', 'Tasks', 'Clients', 'Employees', 'Users', 'Quotations', 'Platforms', 'System Logs'].map((item, index) => (
                <span
                  key={index}
                  style={{
                    color: 'rgba(255, 255, 255, 0.25)',
                    fontSize: '11px',
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '4px',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Registration Form */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Form Header */}
            <div style={{ marginBottom: '32px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(139, 92, 246, 0.10)',
                  color: '#a78bfa',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(139, 92, 246, 0.10)',
                  marginBottom: '12px',
                }}
              >
                V3.0 • Secure Registration
              </span>
              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px',
                  letterSpacing: '-0.3px',
                }}
              >
                Create Account
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '14px', margin: 0 }}>
                Fill in the details to create a new administrator account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}>
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  size="large"
                  prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '16px' }} />}
                  style={{
                    height: '50px',
                    fontSize: '15px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '2px solid rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                  }}
                  className="dark-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    size="large"
                    prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '16px' }} />}
                    suffix={
                      <span 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                          cursor: 'pointer', 
                          color: 'rgba(255, 255, 255, 0.35)', 
                          display: 'flex', 
                          alignItems: 'center',
                          fontSize: '18px',
                          padding: '4px',
                          borderRadius: '6px',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'}
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </span>
                    }
                    style={{
                      height: '50px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '2px solid rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                    }}
                    className="dark-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}>
                  User Type
                </label>
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '2px solid rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'auto',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                  }}
                  className="dark-select"
                  required
                >
                  <option value="" style={{ background: '#0a0a1a', color: '#fff' }}>
                    Select user type
                  </option>
                  {userTypes.map((data) => (
                    <option 
                      key={data.type || data.id} 
                      value={data.type}
                      style={{ background: '#0a0a1a', color: '#fff' }}
                    >
                      {data.type}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                disabled={loading}
                style={{
                  height: '54px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  border: 'none',
                  letterSpacing: '0.5px',
                  boxShadow: '0 8px 40px rgba(139, 92, 246, 0.30)',
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Spin size="small" style={{ color: 'white' }} />
                    <span>Registering...</span>
                  </span>
                ) : (
                  <span>Create Account →</span>
                )}
              </Button>
            </form>

            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                type="text"
                onClick={() => navigate('/')}
                style={{
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ArrowLeftOutlined />
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .dark-input {
            background: rgba(255, 255, 255, 0.04) !important;
            border: 2px solid rgba(255, 255, 255, 0.06) !important;
            color: #ffffff !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
          }

          .dark-input:hover {
            background: rgba(255, 255, 255, 0.07) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
          }

          .dark-input:focus {
            background: rgba(255, 255, 255, 0.07) !important;
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.10) !important;
          }

          .dark-input::placeholder {
            color: rgba(255, 255, 255, 0.20) !important;
          }

          .dark-select {
            background: rgba(255, 255, 255, 0.04) !important;
            border: 2px solid rgba(255, 255, 255, 0.06) !important;
            color: #ffffff !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
          }

          .dark-select:hover {
            background: rgba(255, 255, 255, 0.07) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
          }

          .dark-select:focus {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.10) !important;
          }

          .dark-select option {
            background: #0a0a1a !important;
            color: #ffffff !important;
          }

          .ant-btn-primary:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 50px rgba(139, 92, 246, 0.40) !important;
          }

          .ant-btn-primary:active {
            transform: translateY(0px) !important;
          }

          /* Scrollbar */
          div[style*="overflowY: auto"]::-webkit-scrollbar {
            width: 4px;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-track {
            background: transparent;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.30);
            border-radius: 10px;
          }
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.50);
          }

          @media (max-width: 900px) {
            div[style*="flex: 0 0 42%"] {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Register;