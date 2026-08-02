import React,{useState,useEffect} from "react";
import { Table, Input, Button,DatePicker} from 'antd';
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
function ExpensivesForm() {
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
    return (<>
        <div align="center">
            
            <div className="form-container" style={{ width: '60%',marginLeft:'28%',marginTop:'10%' }}>
                <form className='form-group' method="post" action={`http://localhost:5000/api/AddExpensives`} >
                <h3 className={isDarkMode ? 'dark-mode-h1' : ''}>Description:</h3>
                    <Input type="text" className='form-control' name="text" placeholder="Description" required style={inputStyle} />
                    <div className='form-group mt-3'>
                    <h3 className={isDarkMode ? 'dark-mode-h1' : ''}>Amount:</h3>
                        <Input type="text" className='form-control' name="amount" placeholder="Amount" required style={inputStyle} />
                    </div>
                    <h3 className={isDarkMode ? 'dark-mode-h1' : ''}> Date:</h3>
                    <div className={isDarkMode ? 'dark-mode-h1' : ''}>
                        <Input type="date" className='form-control' name="date" required   style={inputStyle}/>
                    </div>
                    
                    {/* Replace the normal button with Ant Design Button */}
                    <Button type='primary' htmlType="submit" name="submit" style={{ backgroundColor: buttonColor }}>Add Expensive</Button>
                 
                </form>
            </div>
            <AnimatePhoto/>
        </div>
        </>
    )
}

export default ExpensivesForm;
