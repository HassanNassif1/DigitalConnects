import React, { useState, useEffect } from "react";
import { Input, Button, message, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../SideBar/SideBar";
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const JobList = () => {
    const navigate = useNavigate();
    const [jobDescription, setJobDescription] = useState(''); // For adding new jobs
    const [jobs, setJobs] = useState([]);
    const [editableJobId, setEditableJobId] = useState(null); // Track which job is editable
    const [editableDescription, setEditableDescription] = useState(''); // Track the description being edited
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getjobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDescription) return;

        try {
            await axios.post('http://localhost:5000/postjob', { job_description: jobDescription });
            setJobDescription(''); // Clear input after adding job
            fetchJobs();
            message.success('Job added successfully!');
        } catch (error) {
            console.error('Error adding job:', error);
            message.error('Error adding job. Please try again.');
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/deletejob/${jobId}`);
            fetchJobs();
            message.success('Job deleted successfully!');
        } catch (error) {
            console.error('Error deleting job:', error);
            message.error('Error deleting job. Please try again.');
        }
    };

    const handleEditToggle = (jobId) => {
        if (editableJobId === jobId) {
            setEditableJobId(null); // Exit edit mode
            setEditableDescription(''); // Clear editable description
        } else {
            const job = jobs.find(j => j.id === jobId);
            setEditableJobId(jobId); // Enter edit mode
            setEditableDescription(job.job_description); // Set editable description to current job description
            setJobDescription(''); // Clear input for new job description
        }
    };

    const handleEditSave = async (jobId) => {
        try {
            await axios.put(`http://localhost:5000/updatejob/${jobId}`, { job_description: editableDescription });
            fetchJobs();
            setEditableJobId(null); // Exit edit mode
            setEditableDescription(''); // Clear editable description after saving
            message.success('Job updated successfully!');
        } catch (error) {
            console.error('Error updating job:', error);
            message.error('Error updating job. Please try again.');
        }
    };

    const inputStyle = {
        width: '80%',
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Job Description',
            dataIndex: 'job_description',
            key: 'job_description',
            render: (text, record) => (
                <Input
                    value={editableJobId === record.id ? editableDescription : text} // Show editable description or original text
                    onChange={(e) => setEditableDescription(e.target.value)} // Update editable description
                    style={inputStyle}
                    disabled={editableJobId !== record.id} // Disable if not editing
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button
                        style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            borderRadius: '100px',
                            marginLeft: 10,
                            width: '40px',
                            height: '40px',
                        }}
                        onClick={() => editableJobId === record.id ? handleEditSave(record.id) : handleEditToggle(record.id)} // Toggle edit/save
                        icon={<EditOutlined />}
                    />
                    <Button
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '100px',
                            marginLeft: 10,
                            width: '40px',
                            height: '40px',
                        }}
                        onClick={() => handleDelete(record.id)}
                        icon={<DeleteOutlined />}
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <div className={`container ${isDarkMode ? 'dark-mode' : ''}`} align="center">
                <div className="form-container" style={{ width: '60%', marginLeft: '35%' }}>
                    <h1 className={`my-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>Job Listings</h1>
                    <form className="form-group" onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Enter job description"
                            required
                            style={inputStyle}
                        />
                        <Button
                            type='primary'
                            htmlType="submit"
                            style={{ backgroundColor: 'rgba(46,49,146,255)', marginTop: 16, width: "100px", height: "40px" }}
                        >
                            Add Job
                        </Button>
                    </form>

                    <h2 className={`my-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>Current Jobs</h2>
                    <Table
                        dataSource={jobs}
                        columns={columns}
                        rowKey="id" // Use the job ID as the key
                        pagination={false} // Disable pagination if you want all in one view
                    />
                </div>
                <AnimatePhoto />
            </div>
        </>
    );
};

export default JobList;
