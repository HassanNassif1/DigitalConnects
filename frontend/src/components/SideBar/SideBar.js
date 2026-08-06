import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faMoneyBills } from '@fortawesome/free-solid-svg-icons';
import digitalconnectsLogo from '../Images/digitalconnects.png';
import {
  faAdd,
  faEye,
  faTasks,
  faUser,
  faUserFriends,
  faShield,
  faMoneyCheck,
  faPen,
  faSignOut,
  faUserCheck,
  faDashboard,
  faHistory,
  faArchive,
  faClipboardList,
  faUsersCog,
  faChartLine,
  faCog,
  faBell,
  faSearch,
  faFileAlt,
  faFolderOpen,
  faBox,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faYoutube,
  faXTwitter,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";

function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const platforms = [
    { id: 1, type: "Instagram", icon: faInstagram, color: "#E4405F" },
    { id: 2, type: "Facebook", icon: faFacebook, color: "#1877F2" },
    { id: 3, type: "Tiktok", icon: faTiktok, color: "#000000" },
    { id: 4, type: "Youtube", icon: faYoutube, color: "#FF0000" },
    { id: 5, type: "X", icon: faXTwitter, color: "#000000" },
    { id: 6, type: "Snap", icon: faSnapchat, color: "#FFFC00" },
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getPlatformIcon = (type) => {
    switch (type) {
      case "Instagram": return faInstagram;
      case "Facebook": return faFacebook;
      case "Tiktok": return faTiktok;
      case "Youtube": return faYoutube;
      case "X": return faXTwitter;
      case "Snap": return faSnapchat;
      default: return null;
    }
  };

  const menuItems = [
    {
      id: "Accounting",
      icon: faMoneyCheck,
      label: "Accounting",
      subItems: [
        { path: "/CreateAccounting", label: "Add Invoice" },
        { path: "/accounting", label: "View Invoices" },
        { path: "/AddExpensives", label: "Add Expenses" },
        { path: "/expensives", label: "View Expenses" },
      ]
    },
     {
      id: "Salary",
      icon: faMoneyBills,
      label: "Salary",
      subItems: [
        { path: "/Salary", label: "Salary" },
       
      ]
    },
    
    {
      id: "Recovery",
      icon: faShield,
      label: "Recovery",
      subItems: [
        { path: "/view-recovered-accounts", label: "View Recovered" },
        { path: "/AddRecoveredAccount", label: "Add Recovered" },
      ]
    },
    {
      id: "Tasks",
      icon: faTasks,
      label: "Tasks",
      subItems: [
        { path: "/CreateTasks", label: "Create Task" },
        { path: "/viewtasks", label: "View Tasks" },
      ]
    },
    {
      id: "Clients",
      icon: faUser,
      label: "Clients",
      subItems: [
        { path: "/Users", label: "View Clients" },
        { path: "/CreateUser", label: "Add Clients" },
      ]
    },
    {
      id: "Employees",
      icon: faUserFriends,
      label: "Employees",
      subItems: [
        { path: "/employees", label: "View Employees" },
        { path: "/AddEmployees", label: "Add Employees" },
        { path: "/jobs", label: "Jobs" },
      ]
    },
    {
      id: "UsersManagement",
      icon: faUsersCog,
      label: "Users Management",
      subItems: [
        { path: "/UserTypes", label: "User Types" },
        { path: "/UsersPage", label: "Users" },
      ]
    },
    {
      id: "Quotations",
      icon: faPen,
      label: "Quotations",
      subItems: [
        { path: "/CreateQuotation", label: "Create Quote" },
        { path: "/quotations", label: "View Quotes" },
      ]
    },
    {
      id: "Platforms",
      icon: faUserCheck,
      label: "Platforms",
      subItems: platforms.map(p => ({
        path: `/${p.type.toLowerCase()}/view/${p.id}`,
        label: p.type,
        icon: getPlatformIcon(p.type),
        color: p.color
      }))
    },
    {
      id: "SystemLogs",
      icon: faClipboardList,
      label: "System Logs",
      subItems: [
        { path: "/SystemLogs", label: "View All Logs" },
      ]
    },
  ];

  return (
    <div className="sidebar-wrapper">
      <nav className="modern-sidebar">
        
        {/* ===== BRAND SECTION - COMPACT ===== */}
        <div className="sidebar-brand">
          <div className="brand-container">
            <Link to="/dashboard" className="brand-link">
              <div className="logo-wrapper">
                <img 
                  src={digitalconnectsLogo} 
                  alt="Digital Connects" 
                  className="brand-logo"
                />
                <div className="brand-badge">v3.0</div>
              </div>
              
              <div className="brand-divider" />
              
              <button className="dashboard-main-btn">
                <FontAwesomeIcon icon={faDashboard} />
                <span>Dashboard</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ===== MENU - PUSHED UP ===== */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const isExpanded = openDropdown === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <li 
                key={item.id} 
                className={`menu-group ${isExpanded ? "expanded" : ""}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="menu-header" onClick={() => toggleDropdown(item.id)}>
                  <div className="header-left">
                    <div className={`icon-wrapper ${isExpanded ? "active" : ""}`}>
                      <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                    </div>
                    <span className="menu-title">{item.label}</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={isExpanded ? faChevronDown : faChevronRight} 
                    className={`menu-arrow ${isExpanded ? "rotate" : ""}`} 
                  />
                </div>
                
                <div className={`submenu-container ${isExpanded ? "open" : ""}`}>
                  <ul className="submenu-list">
                    {item.subItems.map((subItem, index) => (
                      <li key={index}>
                        <Link to={subItem.path} className="submenu-link">
                          <span className="dot" />
                          {subItem.icon && (
                            <FontAwesomeIcon 
                              icon={subItem.icon} 
                              className="platform-sub-icon" 
                              style={subItem.color ? { color: subItem.color } : {}}
                            />
                          )}
                          <span>{subItem.label}</span>
                          {subItem.label === "View All Logs" && (
                            <span className="badge-new">New</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ===== FOOTER SECTION - COMPACT ===== */}
        <div className="sidebar-footer">
          <div className="footer-divider" />
          
       
        </div>

      </nav>

      <style>{`
        /* ===== SIDEBAR WRAPPER ===== */
        .sidebar-wrapper {
          display: flex;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .modern-sidebar {
          width: 280px;
          height: 100%;
          background: linear-gradient(180deg, #07070f 0%, #0c0e1e 40%, #05050d 100%);
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          padding: 12px 16px 16px 16px;
          border-right: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: 4px 0 40px rgba(0, 0, 0, 0.9), inset -1px 0 0 rgba(255, 255, 255, 0.02);
          overflow-y: auto;
          box-sizing: border-box;
          transition: width 0.3s ease;
          position: relative;
        }

        /* ===== SCROLLBAR ===== */
        .modern-sidebar::-webkit-scrollbar { width: 3px; }
        .modern-sidebar::-webkit-scrollbar-track { background: transparent; }
        .modern-sidebar::-webkit-scrollbar-thumb { 
          background: linear-gradient(180deg, #6c5ce7, #a29bfe); 
          border-radius: 10px; 
        }

        /* ===== BRAND SECTION - COMPACT ===== */
        .sidebar-brand { 
          margin-bottom: 12px; 
          padding-bottom: 10px; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
        }

        .brand-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          width: 100%;
        }

        .logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .brand-logo {
          height: 200px;
          width: auto;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 0 20px rgba(108, 92, 231, 0.12));
        }

        .brand-logo:hover {
          transform: scale(1.05);
        }

        .brand-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          color: white;
          font-size: 8px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 10px rgba(108, 92, 231, 0.4);
        }

        .brand-divider {
          width: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.25), transparent);
          margin: 0;
        }

        /* ===== DASHBOARD BUTTON - COMPACT ===== */
        .dashboard-main-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 6px 20px;
          border-radius: 30px;
          background: linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(162, 155, 254, 0.05));
          border: 1px solid rgba(108, 92, 231, 0.2);
          color: #c4b5fd;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 100%;
          max-width: 140px;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .dashboard-main-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transition: left 0.5s ease;
        }

        .dashboard-main-btn:hover::before {
          left: 100%;
        }

        .dashboard-main-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 30px rgba(108, 92, 231, 0.4);
          background: linear-gradient(135deg, #6c5ce7, #5a4bd1);
          color: #ffffff;
          border-color: transparent;
        }

        .dashboard-main-btn:hover svg {
          color: #ffffff !important;
        }

        .dashboard-main-btn:active {
          transform: scale(0.95);
        }

        /* ===== MENU - FIXED SCROLLING ===== */
        .sidebar-menu { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
          display: flex; 
          flex-direction: column; 
          gap: 1px; 
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-top: 2px;
          min-height: 0; /* Important for flex scrolling */
        }
        
        .menu-group {
          background: transparent;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible; /* Changed from 'hidden' to 'visible' */
          position: relative;
          flex-shrink: 0;
        }

        .menu-group::before {
          content: ''; 
          position: absolute; 
          left: 0; 
          top: 50%;
          transform: translateY(-50%);
          height: 0%;
          width: 3px;
          background: linear-gradient(180deg, #6c5ce7, #a29bfe);
          border-radius: 0 4px 4px 0; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
        }

        .menu-group.expanded::before, 
        .menu-group:hover::before { 
          height: 60%;
          opacity: 1;
        }

        .menu-group.expanded { 
          background: rgba(108, 92, 231, 0.04); 
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02); 
        }

        .menu-header {
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          padding: 6px 12px 6px 10px; 
          cursor: pointer;
          font-size: 12.5px; 
          font-weight: 500; 
          color: #9ca3af;
          transition: all 0.3s ease;
          border-radius: 8px;
          position: relative;
        }

        .menu-header:hover { 
          color: #e2e8f0; 
          background: rgba(255, 255, 255, 0.02);
        }

        .header-left { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
        }

        .icon-wrapper {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .icon-wrapper.active {
          background: rgba(108, 92, 231, 0.15);
        }

        .menu-icon { 
          font-size: 13px; 
          color: #6c5ce7; 
          transition: all 0.3s ease;
        }

        .menu-group.expanded .menu-icon { 
          color: #a29bfe; 
        }

        .menu-title {
          transition: color 0.3s ease;
          font-size: 12.5px;
        }

        .menu-group.expanded .menu-title {
          color: #e2e8f0;
        }

        .menu-arrow { 
          font-size: 9px; 
          color: #4b5563; 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }

        .menu-arrow.rotate { 
          transform: rotate(90deg); 
          color: #a29bfe; 
        }

        /* ===== SUBMENU - SCROLLABLE ===== */
        .submenu-container {
          max-height: 0; 
          opacity: 0;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
          overflow: hidden;
        }

        .submenu-container.open { 
          max-height: 300px; 
          opacity: 1; 
          overflow-y: auto; /* Added scrolling for submenu */
          overflow-x: hidden;
        }

        /* Custom scrollbar for submenu */
        .submenu-container.open::-webkit-scrollbar {
          width: 2px;
        }

        .submenu-container.open::-webkit-scrollbar-track {
          background: transparent;
        }

        .submenu-container.open::-webkit-scrollbar-thumb {
          background: rgba(108, 92, 231, 0.3);
          border-radius: 10px;
        }

        .submenu-container.open::-webkit-scrollbar-thumb:hover {
          background: rgba(108, 92, 231, 0.6);
        }
        
        .submenu-list {
          list-style: none; 
          padding: 0 8px 6px 14px; 
          margin: 0;
          display: flex; 
          flex-direction: column; 
          gap: 1px;
        }

        .submenu-link {
          display: flex; 
          align-items: center; 
          gap: 8px;
          padding: 5px 10px; 
          border-radius: 6px;
          color: #9ca3af; 
          text-decoration: none; 
          font-size: 12px; 
          font-weight: 400;
          transition: all 0.25s ease;
          position: relative;
        }

        .submenu-link:hover {
          background: rgba(108, 92, 231, 0.08);
          color: #f3f4f6;
          transform: translateX(3px);
        }

        .submenu-link .dot {
          width: 3px; 
          height: 3px; 
          border-radius: 50%;
          background: #4b5563; 
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .submenu-link:hover .dot { 
          background: #6c5ce7; 
          box-shadow: 0 0 12px rgba(108, 92, 231, 0.6); 
        }
        
        .platform-sub-icon { 
          font-size: 13px; 
          width: 14px; 
          text-align: center; 
          flex-shrink: 0;
        }

        .badge-new {
          margin-left: auto;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          color: white;
          font-size: 7px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ===== FOOTER - COMPACT ===== */
        .sidebar-footer {
          margin-top: auto; 
          padding-top: 10px;
          display: flex; 
          flex-direction: column; 
          gap: 8px;
          flex-shrink: 0;
        }

        .footer-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
        }

        .footer-actions {
          display: flex;
          gap: 6px;
        }

        .footer-btn {
          flex: 1;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 6px;
          padding: 6px 10px; 
          border-radius: 8px; 
          text-decoration: none;
          font-size: 11px; 
          font-weight: 500;
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: #9ca3af; 
          transition: all 0.3s ease;
        }

        .footer-btn:hover {
          transform: translateY(-1px);
        }

        .footer-btn.logout:hover { 
          color: #f87171; 
          background: rgba(239, 68, 68, 0.08); 
          border-color: rgba(239, 68, 68, 0.2); 
        }

        .footer-btn.register:hover { 
          color: #34d399; 
          background: rgba(16, 185, 129, 0.08); 
          border-color: rgba(16, 185, 129, 0.2); 
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .modern-sidebar { width: 72px; padding: 12px 8px; }
          .brand-text, .menu-title, .menu-arrow, .footer-btn span, .search-input, .stat-label, .brand-badge { display: none; }
          .menu-header { padding: 8px 6px; justify-content: center; }
          .header-left { gap: 0; }
          .icon-wrapper { width: 30px; height: 30px; }
          .menu-icon { margin: 0; font-size: 14px; }
          .dashboard-main-btn { max-width: 36px !important; padding: 6px !important; border-radius: 50% !important; }
          .dashboard-main-btn span { display: none; }
          .search-container { display: none; }
          .submenu-container.open {
            position: absolute; 
            left: 72px; 
            top: -10px;
            background: #0c0e1e; 
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 0 12px 12px 0; 
            padding: 10px; 
            width: 200px;
            box-shadow: 8px 10px 30px rgba(0,0,0,0.9);
            max-height: 300px; 
            overflow-y: auto;
            z-index: 100;
          }
          .menu-group { position: relative; }
          .footer-actions { flex-direction: column; }
          .footer-btn { padding: 6px; }
          .brand-logo { height: 35px !important; }
        }
      `}</style>
    </div>
  );
}

export default Sidebar;