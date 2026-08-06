// Topbar.js - Updated with creative loader for logout
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Typography, Tooltip, message } from 'antd';
import { 
  BellOutlined, 
  SettingOutlined, 
  PoweroffOutlined, 
  DashboardOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import axios from 'axios';
import LoaderOverlay from '../LoaderOverlay/LoaderOverlay';

const { Text } = Typography;

const Topbar = ({ 
  children, 
  accentColor = "#6c5ce7", 
  accentLight = "#a29bfe", 
  progressGreen = "#00b894", 
  highlightPink = "#fd79a8",
  secondaryText = "rgba(255,255,255,0.6)",
  borderColor = "rgba(255,255,255,0.06)",
  textColor = "#ffffff",
  totalCount = 0
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    setShowLoader(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('Logged out successfully');
        setTimeout(() => {
          setShowLoader(false);
          navigate('/');
        }, 1800);
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      message.error('Logout failed, but you have been redirected');
      setTimeout(() => {
        setShowLoader(false);
        navigate('/');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <LoaderOverlay 
        visible={showLoader} 
        message="Securing your session..."
        type="logout"
      />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        minHeight: '100vh', 
        background: '#0a0a1a' 
      }}>
        {/* Rest of your Topbar component remains the same */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(20, 20, 43, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '0 0 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          flex: '0 0 auto',
          zIndex: 10
        }}>
          <div style={{
            position: 'absolute',
            top: '-100px', right: '-100px',
            width: '300px', height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}22, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          {/* Left: Brand & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative', zIndex: 1 }}>
            <div style={{
              position: 'relative',
              width: 42, height: 42,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#fff',
              boxShadow: `0 0 25px ${accentColor}44`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className="logo-cube"
            >
              <DashboardOutlined />
            </div>

            <div>
              <Text strong style={{ color: textColor, fontSize: 16, letterSpacing: '0.5px' }}>Dashboard</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: -2 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.04)', 
                  padding: '2px 10px 2px 6px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div style={{   
                    width: 6, height: 6, borderRadius: '50%', background: progressGreen,
                    animation: 'pulseDot 2s ease-in-out infinite'
                  }} />
                  <Text style={{ color: secondaryText, fontSize: 11, fontWeight: 500 }}>Online</Text>
                </div>
                <Text style={{ color: secondaryText, fontSize: 11 }}>• {totalCount} records</Text>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              border: `1px solid ${borderColor}`
            }}>
              <Text style={{ color: secondaryText, fontSize: 12, fontWeight: 500 }}>
                {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </div>

            <div style={{ width: 1, height: 28, background: borderColor }} />

            <Tooltip title="Register New Admin">
              <Button 
                type="text" 
                icon={<UserAddOutlined />} 
                onClick={handleRegister}
                style={{ 
                  color: secondaryText, 
                  width: 38, 
                  height: 38, 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)', 
                  transition: 'all 0.2s ease', 
                  border: '1px solid transparent' 
                }} 
                className="topbar-btn register-btn"
              />
            </Tooltip>

            <Tooltip title="Notifications">
              <Button type="text" icon={<BellOutlined />} style={{ color: secondaryText, width: 38, height: 38, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s ease', border: '1px solid transparent' }} className="topbar-btn">
                <Badge count={3} size="small" style={{ background: highlightPink, boxShadow: `0 0 10px ${highlightPink}66` }} />
              </Button>
            </Tooltip>

            <Tooltip title="Settings">
              <Button type="text" icon={<SettingOutlined />} style={{ color: secondaryText, width: 38, height: 38, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s ease', border: '1px solid transparent' }} className="topbar-btn" />
            </Tooltip>

            <Tooltip title="Logout">
              <Button 
                type="text" 
                icon={<PoweroffOutlined />} 
                onClick={handleLogout}
                loading={loading}
                style={{ 
                  color: secondaryText, 
                  width: 38, 
                  height: 38, 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)', 
                  transition: 'all 0.2s ease', 
                  border: '1px solid transparent' 
                }} 
                className="topbar-btn logout"
              />
            </Tooltip>
          </div>

          <style>{`
            .topbar-btn:hover { background: rgba(108, 92, 231, 0.15) !important; color: #a29bfe !important; border-color: rgba(108, 92, 231, 0.2) !important; transform: translateY(-1px); }
            .topbar-btn.register-btn:hover { background: rgba(0, 184, 148, 0.15) !important; color: #00b894 !important; border-color: rgba(0, 184, 148, 0.2) !important; }
            .topbar-btn.logout:hover { background: rgba(255, 77, 79, 0.15) !important; color: #ff4d4f !important; border-color: rgba(255, 77, 79, 0.2) !important; }
            .logo-cube:hover { transform: rotate(8deg) scale(1.05); }
            @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
          `}</style>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;