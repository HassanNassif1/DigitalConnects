import React, { useState, useEffect } from "react";
import { Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";

function CreateTasks() {
    const buttonColor = 'rgba(46,49,146,255)';
    const { isDarkMode } = useDarkMode();
    const [task, setTask] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.querySelectorAll('.custom-table').forEach(table => {
                table.classList.add('dark-mode-table');
            });
        } else {
            document.body.classList.remove('dark-mode');
            document.querySelectorAll('.custom-table').forEach(table => {
                table.classList.remove('dark-mode-table');
            });
        }
    }, [isDarkMode]);

    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontFamily: 'Arial',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        height: 50,
        borderColor: isDarkMode ? 'white' : 'rgb(22, 22, 22)',
        marginBottom: 16,
        backgroundColor: isDarkMode ? 'rgb(22, 22, 22)' : 'white',
        color: isDarkMode ? 'white' : 'black',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.trim()) {
            notification.error({
                message: 'Task Required',
                description: 'Please enter a task before submitting.',
            });
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/CreateTasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: task }), // Send task as JSON
            });

            if (response.ok) {
                notification.success({
                    message: 'Task Created',
                    description: 'Your task has been created successfully!',
                });
                setTask(''); // Clear input
                navigate('/viewtasks');
            } else {
                notification.error({
                    message: 'Submission Failed',
                    description: 'There was an error creating your task. Please try again.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Network Error',
                description: 'Unable to connect to the server. Please try again later.',
            });
        }
    };

    return (
        <>
            <div align="center">
                <div className="form-container" style={{ width: '60%', marginLeft: '32%', marginTop: '10%' }}>
                    <div className='form-group'>
                        <Input 
                            type="text" 
                            className={isDarkMode ? 'dark-mode-input-placeholder' : ''} 
                            name="text" 
                            placeholder="Create a Task" 
                            required 
                            value={task}
                            onChange={e => setTask(e.target.value)}
                            style={inputStyle} 
                        />
                        <Button 
                            type='primary' 
                            name="submit" 
                            style={{ backgroundColor: buttonColor }} 
                            onClick={handleSubmit}
                        >
                            Create Task
                        </Button>
                    </div>
                </div>
                <AnimatePhoto />
            </div>
        </>
    );
}

export default CreateTasks;
