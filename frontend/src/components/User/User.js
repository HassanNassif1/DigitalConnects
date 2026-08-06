// User.js - Complete Login Page with Creative Loader
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Button } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyCertificateOutlined,
  GlobalOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import profile from './a.png';
import digitalconnects from './digitalconnects.jpg';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import LoaderOverlay from '../LoaderOverlay/LoaderOverlay';

function User() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowLoader(true);

    try {
      const response = await fetch('http://localhost:5000/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const { userType } = responseData;
        toast.success(`Welcome back, ${username}! 🚀`);
        sessionStorage.setItem('loggedInUser', JSON.stringify({ username, userType }));
        setTimeout(() => {
          setShowLoader(false);
          navigate('/dashboard');
        }, 2000);
      } else {
        setShowLoader(false);
        toast.error('Access Denied. Invalid credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      setShowLoader(false);
      toast.error('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderOverlay 
        visible={showLoader} 
        message={`Welcome back, ${username || 'User'}!`}
        type="signin"
      />
      
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          background: '#0a0a1a',
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.06) 0%, transparent 50%)",
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          color: '#ffffff',
          zIndex: 9999,
        }}
      >
        {/* === AMBIENT FLOATING GLOW ORBS === */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            right: '15%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            animation: 'floatOrb1 12s ease-in-out infinite alternate',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'floatOrb2 15s ease-in-out infinite alternate-reverse',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            animation: 'floatOrb3 20s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* === MAIN CONTAINER - FULL WIDTH & HEIGHT === */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            width: '100%',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
        >
          {/* === LEFT PANEL - BRANDING (45%) === */}
          <div
            style={{
              flex: '0 0 45%',
              padding: '50px 45px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(79, 70, 229, 0.03))',
              borderRight: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              height: '100vh',
            }}
          >
            {/* Glowing Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #8b5cf6, #a78bfa, transparent)',
                animation: 'slideLine 3s ease-in-out infinite',
              }}
            />

            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              {/* Logo */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <img 
                  src={digitalconnects} 
                  alt="DigitalConnects" 
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.25)',
                  }}
                />
              </div>

              {/* Hero Text */}
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa',
                      padding: '5px 18px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                    }}
                  >
                    v3.0 • Secure Platform
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: '38px',
                    fontWeight: '800',
                    color: '#ffffff',
                    lineHeight: 1.15,
                    marginBottom: '14px',
                  }}
                >
                  Welcome to the
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Future of Work
                  </span>
                </h1>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.55)', 
                  fontSize: '15px', 
                  lineHeight: 1.7,
                }}>
                  Secure access to your workspace with cutting-edge authentication technology.
                </p>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.05))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <SafetyCertificateOutlined style={{ color: '#a78bfa', fontSize: '18px' }} />
                  </div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                    Enterprise-grade security
                  </span>
                </div>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(167, 139, 250, 0.05))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <GlobalOutlined style={{ color: '#c4b5fd', fontSize: '18px' }} />
                  </div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                    Global accessibility
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: '40px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.12)', fontSize: '11px', margin: 0, letterSpacing: '0.5px', textAlign: 'center' }}>
                  © 2026 Digital Connects Inc. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* === RIGHT PANEL - LOGIN (55%) === */}
          <div
            style={{
              flex: '0 0 55%',
              padding: '50px 45px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: 'rgba(255, 255, 255, 0.01)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                margin: '0 auto',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={profile}
                    alt="profile"
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      objectFit: 'cover',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                    }}
                  />
                </div>
              </div>

              {/* Form Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2
                  style={{
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '4px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Sign In
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '14px' }}>
                  Access your dashboard securely
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    size="large"
                    prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.25)' }} />}
                    style={{
                      height: '48px',
                      fontSize: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      borderRadius: '12px',
                    }}
                    className="dark-input"
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '11px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="large"
                      prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.25)' }} />}
                      suffix={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {password && (
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                              {[1, 2, 3, 4].map((level) => {
                                const isActive = password.length >= level * 2;
                                return (
                                  <div
                                    key={level}
                                    style={{
                                      width: '4px',
                                      height: isActive ? '14px' : '6px',
                                      background: isActive ? 'linear-gradient(to top, #a78bfa, #8b5cf6)' : 'rgba(255, 255, 255, 0.06)',
                                      transition: 'all 0.3s ease',
                                      borderRadius: '2px',
                                    }}
                                  />
                                );
                              })}
                            </div>
                          )}

                          <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ 
                              cursor: 'pointer', 
                              color: 'rgba(255, 255, 255, 0.35)', 
                              display: 'flex', 
                              alignItems: 'center',
                              fontSize: '18px',
                              transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'}
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </span>
                        </div>
                      }
                      style={{
                        height: '48px',
                        fontSize: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        borderRadius: '12px',
                      }}
                      className="dark-input"
                    />
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  disabled={loading}
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    border: 'none',
                    letterSpacing: '0.8px',
                    boxShadow: '0 4px 30px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <span className="loader-dots">•••</span>
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <span>Sign In →</span>
                  )}
                </Button>
              </form>

              <div
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#8b5cf6',
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
                  }}
                />
                <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '11px', fontWeight: '500' }}>
                  System online • SSL Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" theme="dark" />

        {/* === GLOBAL STYLES === */}
        <style>
          {`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body, html, #root {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
              overflow: hidden !important;
              background: #0a0a1a !important;
            }

            .dark-input {
              background: rgba(255, 255, 255, 0.05) !important;
              border: 1px solid rgba(255, 255, 255, 0.08) !important;
              color: #ffffff !important;
              border-radius: 12px !important;
              transition: all 0.3s ease !important;
            }

            .dark-input:hover {
              background: rgba(255, 255, 255, 0.08) !important;
              border-color: rgba(255, 255, 255, 0.15) !important;
            }

            .dark-input:focus {
              background: rgba(255, 255, 255, 0.08) !important;
              border-color: #8b5cf6 !important;
              box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15) !important;
            }

            .dark-input::placeholder {
              color: rgba(255, 255, 255, 0.2) !important;
            }

            .ant-input, 
            .ant-input-password, 
            .ant-input-affix-wrapper {
              background: rgba(255, 255, 255, 0.05) !important;
              border: 1px solid rgba(255, 255, 255, 0.08) !important;
              color: #ffffff !important;
              border-radius: 12px !important;
            }

            .ant-input-affix-wrapper input.ant-input {
              background: transparent !important;
              border: none !important;
            }

            .ant-input:focus, 
            .ant-input-affix-wrapper:focus, 
            .ant-input-affix-wrapper-focused {
              background: rgba(255, 255, 255, 0.08) !important;
              border-color: #8b5cf6 !important;
              box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15) !important;
            }

            .ant-input::placeholder,
            .ant-input-password input::placeholder {
              color: rgba(255, 255, 255, 0.2) !important;
            }

            .ant-btn-primary:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 6px 40px rgba(139, 92, 246, 0.4) !important;
            }

            .ant-btn-primary:active {
              transform: translateY(0px) !important;
            }

            .Toastify__toast-container {
              z-index: 99999 !important;
            }

            .Toastify__toast {
              background: #1a1a35 !important;
              border: 1px solid rgba(255, 255, 255, 0.08) !important;
              border-radius: 12px !important;
              color: #ffffff !important;
            }

            .loader-dots {
              animation: dots 1.4s steps(4, end) infinite;
              letter-spacing: 2px;
            }

            @keyframes dots {
              0% { opacity: 0.2; }
              20% { opacity: 1; }
              40% { opacity: 0.2; }
              60% { opacity: 1; }
              80% { opacity: 0.2; }
              100% { opacity: 1; }
            }

            /* === ORB ANIMATIONS === */
            @keyframes floatOrb1 {
              0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
              100% { transform: translate(-80px, 80px) scale(1.3); opacity: 1; }
            }
            @keyframes floatOrb2 {
              0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
              100% { transform: translate(60px, -100px) scale(1.2); opacity: 0.9; }
            }
            @keyframes floatOrb3 {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
              50% { transform: translate(-50%, -40%) scale(1.4); opacity: 0.7; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
            }

            @keyframes slideLine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }

            /* === RESPONSIVE === */
            @media (max-width: 1024px) {
              div[style*="flex: '0 0 45%'"] {
                flex: 0 0 40% !important;
              }
              div[style*="flex: '0 0 55%'"] {
                flex: 0 0 60% !important;
              }
              img[alt="DigitalConnects"] {
                width: 160px !important;
                height: 160px !important;
              }
              h1[style*="font-size: '38px'"] {
                font-size: 30px !important;
              }
            }

            @media (max-width: 768px) {
              div[style*="display: 'flex'"] {
                flex-direction: column !important;
              }
              div[style*="flex: '0 0 45%'"] {
                flex: 0 0 auto !important;
                height: auto !important;
                min-height: 40vh !important;
                padding: 30px 24px !important;
                border-right: none !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
              }
              div[style*="flex: '0 0 55%'"] {
                flex: 1 !important;
                height: auto !important;
                padding: 30px 24px !important;
                overflow-y: auto !important;
              }
              img[alt="DigitalConnects"] {
                width: 140px !important;
                height: 140px !important;
              }
              h1[style*="font-size: '38px'"] {
                font-size: 26px !important;
              }
              div[style*="maxWidth: '440px'"] {
                max-width: 100% !important;
              }
            }

            @media (max-width: 480px) {
              div[style*="padding: '50px 45px'"] {
                padding: 20px 16px !important;
              }
              h1[style*="font-size: '38px'"] {
                font-size: 22px !important;
              }
              .ant-input {
                height: 42px !important;
                font-size: 14px !important;
              }
              .ant-btn {
                height: 44px !important;
                font-size: 14px !important;
              }
              img[alt="DigitalConnects"] {
                width: 100px !important;
                height: 100px !important;
              }
            }
          `}
        </style>
      </div>
    </>
  );
}

export default User;