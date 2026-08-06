// LoaderOverlay.js - Reusable loader component
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined, SecurityScanOutlined } from '@ant-design/icons';

const LoaderOverlay = ({ visible, message, type = 'signin' }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 10, 26, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        flexDirection: 'column',
        animation: 'fadeInLoader 0.4s ease-out',
      }}
    >
      {/* Glow orbs behind loader */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulseGlow 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'floatOrbSmall 3s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'floatOrbSmall 3.5s ease-in-out infinite alternate-reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Main loader content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated ring */}
        <div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: '3px solid rgba(139, 92, 246, 0.1)',
              animation: 'spin 1.5s linear infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#8b5cf6',
              borderBottomColor: '#a78bfa',
              animation: 'spin 1s cubic-bezier(0.65, 0, 0.35, 1) infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              right: '15px',
              bottom: '15px',
              borderRadius: '50%',
              border: '2px solid rgba(167, 139, 250, 0.08)',
              animation: 'spin 2s linear infinite reverse',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              right: '30px',
              bottom: '30px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderLeftColor: 'rgba(139, 92, 246, 0.3)',
              borderRightColor: 'rgba(139, 92, 246, 0.3)',
              animation: 'spin 1.8s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#8b5cf6',
              fontSize: '36px',
            }}
          >
            {type === 'signin' ? (
              <SecurityScanOutlined />
            ) : (
              <LoadingOutlined />
            )}
          </div>
        </div>

        {/* Text content */}
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.3px',
            }}
          >
            {message || (type === 'signin' ? 'Signing you in...' : 'Logging you out...')}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '13px',
                fontWeight: '400',
              }}
            >
              {type === 'signin' ? 'Securing your workspace' : 'Securing your session'}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#8b5cf6',
                animation: 'dotPulse 1.4s ease-in-out infinite',
                marginLeft: '2px',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#a78bfa',
                animation: 'dotPulse 1.4s ease-in-out 0.2s infinite',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#c4b5fd',
                animation: 'dotPulse 1.4s ease-in-out 0.4s infinite',
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            marginTop: '24px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd, #8b5cf6)',
              backgroundSize: '300% 100%',
              animation: 'progressSlide 1.5s ease-in-out infinite',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInLoader {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulseGlow {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          }

          @keyframes floatOrbSmall {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(30px, -40px) scale(1.2); }
          }

          @keyframes dotPulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }

          @keyframes progressSlide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default LoaderOverlay;