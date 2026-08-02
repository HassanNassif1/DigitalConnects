import React, { useState, useEffect } from "react";
import "./app.css";
import { Link } from "react-router-dom";
import digitalconnects from "./digitalconnects.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faYoutube,
  faXTwitter,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import { useDarkMode } from "../DarkMode/DarkModeContext";

function Sidebar() {
  const { isDarkMode } = useDarkMode();
  const [sidebarImage, setSidebarImage] = useState(digitalconnects);

  const [openDropdown, setOpenDropdown] = useState(null); // track which dropdown is open
  const [activePlatform, setActivePlatform] = useState(null);

  const platforms = [
    { id: 1, type: "Instagram" },
    { id: 2, type: "Facebook" },
    { id: 3, type: "Tiktok" },
    { id: 4, type: "Youtube" },
    { id: 5, type: "X" },
    { id: 6, type: "Snap" },
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getPlatformIcon = (type) => {
    switch (type) {
      case "Instagram":
        return faInstagram;
      case "Facebook":
        return faFacebook;
      case "Tiktok":
        return faTiktok;
      case "Youtube":
        return faYoutube;
      case "X":
        return faXTwitter;
      case "Snap":
        return faSnapchat;
      default:
        return null;
    }
  };

  return (
    <div className="sidebar-container">
      <div className="admin-sidebar">
        {/* Dashboard */}
        <div className="sidebar-logo">
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faDashboard} className="icon-glow" />
          </Link>
        </div>

      

<ul className="admin-menu">
  {/* Accounting */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Accounting")}>
      <FontAwesomeIcon icon={faMoneyCheck} />
      <span>Accounting</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Accounting" ? "open" : ""}`} />
    </div>
    {openDropdown === "Accounting" && (
      <ul className="dropdown-list">
        <Link to="/CreateAccounting"><li><FontAwesomeIcon icon={faAdd} /> Add Invoice</li></Link>
        <Link to="/accounting"><li><FontAwesomeIcon icon={faEye} /> View Invoices</li></Link>
        <Link to="/AddExpensives"><li><FontAwesomeIcon icon={faAdd} /> Add Expenses</li></Link>
        <Link to="/expensives"><li><FontAwesomeIcon icon={faEye} /> View Expenses</li></Link>
      </ul>
    )}
  </li>

  {/* Recovery */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Recovery")}>
      <FontAwesomeIcon icon={faShield} />
      <span>Recovery</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Recovery" ? "open" : ""}`} />
    </div>
    {openDropdown === "Recovery" && (
      <ul className="dropdown-list">
        <Link to="/view-recovered-accounts"><li><FontAwesomeIcon icon={faEye} /> View Recovered Accounts</li></Link>
        <Link to="/AddRecoveredAccount"><li><FontAwesomeIcon icon={faAdd} /> Add Recovered Accounts</li></Link>
      </ul>
    )}
  </li>

  {/* History */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("History")}>
      <FontAwesomeIcon icon={faArchive} />
      <span>History</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "History" ? "open" : ""}`} />
    </div>
    {openDropdown === "History" && (
      <ul className="dropdown-list">
        <Link to="/Invoices_History"><li><FontAwesomeIcon icon={faHistory} /> Invoices</li></Link>
        <Link to="/Expenses_History"><li><FontAwesomeIcon icon={faHistory} /> Expenses</li></Link>
      </ul>
    )}
  </li>

  {/* Tasks */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Tasks")}>
      <FontAwesomeIcon icon={faTasks} />
      <span>Tasks</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Tasks" ? "open" : ""}`} />
    </div>
    {openDropdown === "Tasks" && (
      <ul className="dropdown-list">
        <Link to="/CreateTasks"><li><FontAwesomeIcon icon={faAdd} /> Create Task</li></Link>
        <Link to="/viewtasks"><li><FontAwesomeIcon icon={faEye} /> View Tasks</li></Link>
      </ul>
    )}
  </li>

  {/* Clients */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Clients")}>
      <FontAwesomeIcon icon={faUser} />
      <span>Clients</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Clients" ? "open" : ""}`} />
    </div>
    {openDropdown === "Clients" && (
      <ul className="dropdown-list">
        <Link to="/Users"><li><FontAwesomeIcon icon={faEye} /> View Clients</li></Link>
        <Link to="/CreateUser"><li><FontAwesomeIcon icon={faAdd} /> Add Clients</li></Link>
      </ul>
    )}
  </li>

  {/* Employees */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Employees")}>
      <FontAwesomeIcon icon={faUserFriends} />
      <span>Employees</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Employees" ? "open" : ""}`} />
    </div>
    {openDropdown === "Employees" && (
      <ul className="dropdown-list">
        <Link to="/employees"><li><FontAwesomeIcon icon={faEye} /> View Employees</li></Link>
        <Link to="/AddEmployees"><li><FontAwesomeIcon icon={faAdd} /> Add Employees</li></Link>
        <Link to="/jobs"><li><FontAwesomeIcon icon={faTasks} /> Jobs</li></Link>
        <Link to="/salary"><li><FontAwesomeIcon icon={faMoneyCheck} /> Salary</li></Link>
      </ul>
    )}
  </li>

  {/* Quotations */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Quotations")}>
      <FontAwesomeIcon icon={faPen} />
      <span>Quotations</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Quotations" ? "open" : ""}`} />
    </div>
    {openDropdown === "Quotations" && (
      <ul className="dropdown-list">
        <Link to="/CreateQuotation"><li><FontAwesomeIcon icon={faAdd} /> Create Quotation</li></Link>
        <Link to="/quotations"><li><FontAwesomeIcon icon={faEye} /> View Quotations</li></Link>
      </ul>
    )}
  </li>

  {/* Platforms */}
  <li className="dropdown">
    <div className="dropdown-header" onClick={() => toggleDropdown("Platforms")}>
      <FontAwesomeIcon icon={faUserCheck} />
      <span>Platforms</span>
      <FontAwesomeIcon icon={faChevronDown} className={`arrow ${openDropdown === "Platforms" ? "open" : ""}`} />
    </div>
    {openDropdown === "Platforms" && (
      <ul className="dropdown-list">
        {platforms.map((platform) => (
          <Link
            key={platform.id}
            to={`/${platform.type.toLowerCase()}/view/${platform.id}`}
            onClick={() => setActivePlatform(platform.type)}
          >
            <li>
              <FontAwesomeIcon icon={getPlatformIcon(platform.type)} /> {platform.type}
            </li>
          </Link>
        ))}
      </ul>
    )}
  </li>
</ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="logout-btn">
            <FontAwesomeIcon icon={faSignOut} />
          </Link>
          <Link to="/Register" className="register-btn">
            <FontAwesomeIcon icon={faUserCheck} />
          </Link>
        </div>
      </div>

      {/* Sidebar Styles */}
      <style>{`
        .sidebar-container { display: flex; min-height: 100vw; }
        .admin-sidebar { width: 250px; background: linear-gradient(180deg, #030316, #0b0e1a); color: white; display: flex; flex-direction: column; padding: 20px 15px; box-shadow: 5px 0 15px rgba(0,0,0,0.3);}
        .sidebar-logo { text-align: center; margin-bottom: 30px; }
        .icon-glow { font-size: 28px; color: #00b4ff; transition: 0.3s; }
        .icon-glow:hover { color: #66d9ff; text-shadow: 0 0 15px #00b4ff; transform: scale(1.1); }
      
/* Container for each dropdown block */
/* Container for each dropdown block */
.dropdown {
  background: rgba(255, 255, 255, 0.05); /* grey, semi-transparent */
  border-radius: 12px; /* rounded corners */
  padding: 16px; /* inner spacing */
  margin-bottom: 20px; /* spacing between dropdown boxes */
  box-shadow: 0 2px 6px rgba(0,0,0,0.25); /* subtle depth */
  width: 100%; /* make box full width of sidebar */
  box-sizing: border-box; /* include padding in width */
  transition: all 0.3s ease;
}

/* Header inside the box */
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: #00b4ff;
  padding: 12px 16px; /* internal padding */
  border-radius: 8px; /* header slightly rounded */
  width: 100%; /* header takes full width of the grey box */
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.dropdown-header:hover {
  color: #66d9ff;
  background: rgba(255, 255, 255, 0.12); /* hover effect */
  transform: scale(1.02);
  box-shadow: 0 4px 10px rgba(0,0,0,0.35);
}



        .dropdown-list { margin-top: 10px; margin-left: 15px; display: flex; flex-direction: column; gap: 6px; animation: fadeIn 0.2s ease-in-out; }
        .dropdown-list li { background: rgba(255,255,255,0.05); padding: 8px 10px; border-radius: 8px; transition: 0.3s; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .dropdown-list li:hover { background: rgba(0,180,255,0.2); transform: translateX(4px); color: #00b4ff; }
        .dropdown-list a { text-decoration: none; color: white;font:25px }
        .sidebar-footer { margin-top: auto; display: flex; justify-content: space-around; padding-top: 20px; }
        .logout-btn, .register-btn { font-size: 20px; transition: 0.3s; }
        .logout-btn:hover { color: #ff4d4f; transform: scale(1.1); }
        .register-btn:hover { color: #00ff99; transform: scale(1.1); }

        @keyframes fadeIn { from {opacity:0; transform: translateY(-5px);} to {opacity:1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}

export default Sidebar;
