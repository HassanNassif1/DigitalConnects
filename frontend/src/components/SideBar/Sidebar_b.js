import React, { useState, useEffect } from 'react';
import './app.css';
import { Link } from 'react-router-dom';
import digitalconnects from './digitalconnects.gif';
import digitalconnects1 from './digitalconnects.gif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faBookOpen, faEye, faHandPaper, faHome, faHouse, faInbox, faLaptop, faLaptopHouse, faMobileScreen, faMoneyBill, faMoneyCheck, faPen, faPerson, faRegistered, faSignOut, faTasks, faTrash, faUser, faUserCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTiktok, faYoutube, faAccessibleIcon, faScreenpal, faTwitter,faXTwitter, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { useReminder } from '../Reminder/ReminderContext';
import Reminder from '../Reminder/Reminder';
import reminderSound from './reminder.mp3';
import { useUserContext } from '../UserRights/UserContext';
import { useLocation } from 'react-router-dom';
function Sidebar({}) {
    // const { userType } = useUserContext();
  
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const userType = loggedInUser?.userType;
    const [sidebarImage, setSidebarImage] = useState(digitalconnects);
    const { isReminderVisible, showReminder, hideReminder } = useReminder(); // Use the reminder context
    const [tasks, setTasks] = useState([]);
    const [audio] = useState(new Audio(reminderSound));
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [activePlatform, setActivePlatform] = useState(null); // State to track active platform
    const [hasShownReminder, setHasShownReminder] = useState(false); 

    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    const [platforms, setPlatforms] = useState([]);
 
    useEffect(() => {
        // Update the sidebar image based on dark mode
        setSidebarImage(isDarkMode ? digitalconnects : digitalconnects1);
    }, [isDarkMode]);
    
    useEffect(() => {
        const checkAndShowReminder = async () => {
            try {
              const response = await axios.get('http://localhost:5000/viewtasks');
              const pendingTasks = response.data.filter((task) => task.status === 'Pending');
              setTasks(pendingTasks);
          
              if (pendingTasks.length > 0 && isSidebarOpened) {
                showReminder();
                // Play the reminder sound when the reminder is shown
                audio.play();
              } else {
                hideReminder();
              }
            } catch (error) {
              console.error('Error fetching tasks:', error);
            }
          };
        
    
        // Initial check and show reminder when the sidebar is opened
        checkAndShowReminder();
    
        // Set up a recurring check every 1 minute only if the sidebar is opened
        const intervalId = isSidebarOpened && setInterval(checkAndShowReminder,3600000);
    
        // Cleanup the interval on component unmount or when the sidebar is closed
        return () => {
          clearInterval(intervalId);
          hideReminder();
        };
      }, [isSidebarOpened]); // Run the effect when isSidebarOpened changes
    
      useEffect(() => {
        // Simulate a button click every 1 minute
        const buttonIntervalId = setInterval(() => {
          toggleSidebar();
        }, 3600000);
    
        // Cleanup the interval on component unmount to avoid memory leaks
        return () => clearInterval(buttonIntervalId);
      }, []); // Empty dependency array to run the effect only once // Run the effect when isSidebarOpened changes
    
      const toggleSidebar = () => {
        setIsSidebarOpened(!isSidebarOpened);
      };
    useEffect( () => {
        // Make an API call to fetch the platform data when the component mounts
        fetch('http://127.0.0.1:5000/api/sm_platforms') // Replace with your actual API endpoint
            .then((response) => response.json())
            .then((data) => {
                setPlatforms(data);
                console.log(data, 'dataaaaaaaaaaaaaa');
            })
            .catch((error) => {
                console.error('Error fetching platform data:', error);
            });
           
    }, []);

 


    const getPlatformIcon = (type) => {
        switch (type) {
            case 'Instagram':
                return faInstagram;
            case 'Facebook':
                return faFacebook;
            case 'Tiktok':
                return faTiktok;
            case 'Youtube':
                return faYoutube;
                case 'X':
                    return faXTwitter;
                    case 'Snap':
                        return faSnapchat;
            default:
                return null;
        }
    };

    return (
        <div className={`admin-sidebarr ${isDarkMode ? 'dark-mode-sidebar' : ''}`}>
            
  <button onClick={toggleSidebar} style={{ display: 'none' }}>Toggle Sidebar</button>
                   <div className="toggle-dark-mode">
                <label>
                    <button style={{background:'transparent',borderColor:'transparent'}}>
                    <h2 checked={isDarkMode} onClick={toggleDarkMode}>
                    {isDarkMode ? "🌙" : "☀️"}
                    </h2>
                    </button>
                </label>
            </div>
            <div>
            <img src={sidebarImage} alt="digitalconnects" className='circle-image' />
            </div>
            <ul className="admin-menu">
         
                {userType !== 'Accountant' &&  userType !== 'IT' &&
                <li className="dropdown">
                    
                    <div className="dropdown-header">
                        <FontAwesomeIcon icon={faTasks} /> Tasks
                    </div>
                    <div className="dropdown-content">
                        <li>
                            <Link to="/CreateTasks">
                                <FontAwesomeIcon icon={faAdd} /> Create Task
                            </Link>
                        </li>
                        <li>
                            <Link to="/viewtasks">
                                <FontAwesomeIcon icon={faTasks} /> View Tasks
                            </Link>
                        </li>
                        {/* Add more dropdown items for Users as needed */}
                    </div>

                
                </li>
}
     
{userType !== 'IT' && 
                <li className="dropdown">
                    <div className="dropdown-header">
                  
                                <FontAwesomeIcon icon={faMoneyCheck} /> Accounting System
                           
                    </div>
                    <div className="dropdown-content">
                    <li>
                            <Link to="/CreateAccounting">
                                <FontAwesomeIcon icon={faAdd} /> Add Invoices
                            </Link>
                        </li>
                    <li>
                            <Link to="/accounting">
                                <FontAwesomeIcon icon={faEye} /> View Invoices
                            </Link>
                        </li>
                       
                        <li>
                            <Link to="/AddExpensives">
                                <FontAwesomeIcon icon={faAdd} /> Add Expenses
                            </Link>
                        </li>
                        <li>
                            <Link to="/expensives">
                                <FontAwesomeIcon icon={faEye} /> View Expenses
                            </Link>
                        </li>
                        <li>
                            <Link to="/AddEmployees">
                                <FontAwesomeIcon icon={faAdd} /> Add Employees
                            </Link>
                        </li>
                        <li>
                            <Link to="/employees">
                                <FontAwesomeIcon icon={faEye} /> View Employees
                            </Link>
                        </li>
                        

                        {/* Add more dropdown items for Users as needed */}

                    </div>
                </li>
}
    

{userType !== 'IT' && 
                <li className="dropdown">
                    <div className="dropdown-header">
                        <FontAwesomeIcon icon={faPen} /> Quotations
                    </div>
                    <div className="dropdown-content">
                        <li>
                            <Link to="/CreateQuotation">
                                <FontAwesomeIcon icon={faAdd} /> Create Quotation
                            </Link>
                        </li>
                        <li>
                            <Link to="/quotations">
                                <FontAwesomeIcon icon={faEye} /> View Quotation
                            </Link>
                        </li>
                        {/* Add more dropdown items for Users as needed */}

                    </div>
                </li>
}
                {userType !== 'Accountant' &&
                <li className="dropdown" >

                    <div className="dropdown-header">
                        <FontAwesomeIcon icon={faLaptop} /> Social Media Management
                    </div>
                    <div className="dropdown-content">
                        {platforms.map((platform) => (
                           <li key={platform.id}>
                           <Link
                               to={`/${platform.type.toLowerCase()}/view/${platform.id}`}
                               onClick={() => setActivePlatform(platform.type)} 
                           >
                               <FontAwesomeIcon icon={getPlatformIcon(platform.type)} /> {platform.type}
                           </Link>
                       </li>
                        ))}
                    </div>
                </li>
}
            {userType !== 'Accountant' && userType !== 'IT' &&
           
                <li className="dropdown">
                    <div className="dropdown-header">
                        <FontAwesomeIcon icon={faUser} /> Clients
                    </div>
                    <div className="dropdown-content">
                        <li>
                            <Link to="/Users">
                                <FontAwesomeIcon icon={faEye} /> Clients Details
                            </Link>
                        </li>
                        <li>
                            <Link to="/CreateUser">
                                <FontAwesomeIcon icon={faAdd} /> Add Clients
                            </Link>
                        </li>
                        {/* Add more dropdown items for Users as needed */}
                    </div>
                </li>
            
}




{userType !== 'IT' &&  userType !== 'IT' && 
            <li>
                <Link to="/Register">
                    <FontAwesomeIcon icon={faUserCheck} />Register
                </Link>
            </li>
}
{userType !== 'Accountant' &&
<li className="dropdown">
                    
                    <div className="dropdown-header">
                        <FontAwesomeIcon icon={faTasks} /> Maintenance
                    </div>
                    <div className="dropdown-content">
                        <li>
                            <Link to="/CreateMaintenance">
                                <FontAwesomeIcon icon={faAdd} /> Create Maintenance
                            </Link>
                        </li>
                        <li>
                            
                            <Link to="/maintenance">
                                <FontAwesomeIcon icon={faTasks} /> View Maintenance
                            </Link>
                        </li>
                    </div>

                
                </li>
}
                <Reminder isVisible={isReminderVisible} />

                {/* Profile icon for Logout link */}
           
                  
                <div >
                    <Link to="/" >
                        <FontAwesomeIcon icon={faSignOut} style={{marginLeft:'4%'}} /> Log Out
                        <br/>
                    </Link>
                    </div>  
                    
                
              
            </ul>
            
        </div>
    );
}

export default Sidebar;