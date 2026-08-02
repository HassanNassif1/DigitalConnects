import React,{useState,useEffect} from "react";
import Sidebar from "../SideBar/SideBar";
import './app.css';
import { Table, Input, Button } from 'antd';
import { faInstagram, faFacebook, faTiktok, faYoutube, faAccessibleIcon, faScreenpal, faTwitter, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import digitalconnects from './digitalconnects.jpg';
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
function Instagram() {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const buttonColor = isDarkMode ? 'black' : 'white';
  const fontColor = isDarkMode ? 'white' : 'black';
  const imageBackground = isDarkMode ? 'transparent' : 'initial'; // Set background to transparent in dark mode
  useEffect(() => {
    // Add a class to the body and custom-table when dark mode is enabled
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.add('dark-mode-table');
      });
      setIsDarkModeEnabled(true);
    } else {
      document.body.classList.remove('dark-mode');
      document.querySelectorAll('.custom-table').forEach(table => {
        table.classList.remove('dark-mode-table');
      });
      setIsDarkModeEnabled(false);
    }
  }, [isDarkMode]);
  return (
    <div align='center'>
   
      <div className="movingImageContainer">
        <img
          className="movingImage"
          src={digitalconnects}
          alt="digitalconnects"
        
        />
      </div>
      <a href="http://www.Instagram.com">
        <Button
          className="StyledPlatform"
          style={{ backgroundColor: buttonColor, color: fontColor }}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </Button>
      </a>
      <AnimatePhoto/>
    </div>
  );
}

export default Instagram;