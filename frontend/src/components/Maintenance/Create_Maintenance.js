import React,{useState,useEffect}from "react";
import { Table, Input, Button } from 'antd';
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
function Create_Maintenance() {
    const buttonColor = 'rgba(46,49,146,255)';
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
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
    return (
        <div align="center">
            <Sidebar />
            <div className="form-container" style={{ width: '60%',marginLeft:'32%',marginTop:'10%' }}>
                <form className='form-group' method="post" action={`http://localhost:5000/CreateMaintenance`} >
                    <Input type="text" className={isDarkMode ? 'dark-mode-input-placeholder' : ''} name="text" placeholder="Create a Task" required style={inputStyle} />
              
                  
                    {/* Replace the normal button with Ant Design Button */}
                    <Button type='primary' htmlType="submit" name="submit" style={{ backgroundColor: buttonColor }} >Create Task</Button>
                </form>
            </div>
            <AnimatePhoto/>
        </div>
    )
}

export default Create_Maintenance;
