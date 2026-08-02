import React, { useState, useEffect } from "react";
import { Input, Button, Form, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from '../DarkMode/DarkModeContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddRecoveredAccount.css';

const { TextArea } = Input;

function AddRecoveredAccount() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [email_personal, setEmailPersonal] = useState('');
    const [emailError, setEmailError] = useState('');

    // Track the original social media data
    const [originalSocialMediaData, setOriginalSocialMediaData] = useState({
        instagram: '',
        facebook: '',
        snapchat: '',
        linkedin: '',
        tiktok: '',
        twitter: '',
        gmail:'',
        instagramEmail: '',
        facebookEmail: '',
        snapchatEmail: '',
        linkedinEmail: '',
        tiktokEmail: '',
        twitterEmail: '',
        gmailEmail:'',
        instagramPassword: '',
        facebookPassword: '',
        snapchatPassword: '',
        linkedinPassword: '',
        tiktokPassword: '',
        twitterPassword: '',
        gmailPassword:'',
        email:'',
        email_password:''
    });

    const [socialMediaData, setSocialMediaData] = useState({...originalSocialMediaData});

    const buttonColor = 'rgba(46,49,146,255)';
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSocialMediaChange = (platform, value) => {
        setSocialMediaData((prev) => ({
            ...prev,
            [platform]: value
        }));
    };

    const handleSubmit = async () => {
        // Validate email
        if (!isValidEmail(email_personal)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
    
        const formData = new FormData();
        formData.append('username', selectedUser);
        formData.append('email_personal', email_personal);
    
        const socialMediaKeys = ['instagram', 'facebook', 'snapchat', 'linkedin', 'tiktok', 'email','gmail', 'twitter'];
    
        // Only append changed fields to formData
        socialMediaKeys.forEach(platform => {
            formData.append(platform, socialMediaData[platform]);
            formData.append(`${platform}_email`, socialMediaData[`${platform}Email`]);
            formData.append(`${platform}_password`, socialMediaData[`${platform}Password`]);
        });
    
        try {
            const response = await axios.post('http://localhost:5000/CreateRecoveredAccount', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Check the response message
            if (response.data.message === 'Recovered account added successfully!') {
                navigate('/view-recovered-accounts');
                notification.success({
                    message: 'Success',
                    description: `${selectedUser} was added successfully.`,
                });
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setEmailError('An error occurred while submitting the form. Please try again.');
        }
    };
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                </div>
                <div className="col-md-9">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-10">
                            <h1 className="text-center mb-4">Add Recovered Hacked Account</h1>
                            <div className="card card-custom"  >
                                <div className="card-body card-body-custom" >
                                    <Form layout="vertical" onFinish={handleSubmit} >
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group row">
                                                    <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Client Name:</label>
                                                    <div className="col-sm-8">
                                                        <select
                                                            className='form-control'
                                                            name="username"
                                                            style={{ width: '100%' }}
                                                            onChange={(e) => setSelectedUser(e.target.value)}
                                                        >
                                                            <option value="">Select a client</option>
                                                            {users.map(user => (
                                                                <option value={user.username} key={user.id}>
                                                                    {user.username}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row" style={{backgroundColor:'red', flexGrow:1 ,}}>
                                                    <label htmlFor="email_personal" className="col-sm-4 col-form-label">Email:</label>
                                                    <div className="col-sm-8" style={{backgroundColor:'red', flexGrow:1 ,}} >
                                                        <Input
                                                            id="email_personal"
                                                            placeholder="Email"
                                                            value={email_personal}
                                                            onChange={(e) => setEmailPersonal(e.target.value)}
                                                            style={{ borderColor: emailError ? 'red' : '' }}
                                                        />
                                                        {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
                                                    </div>
                                                </div>
                                                {['instagram', 'facebook', 'snapchat', 'linkedin', 'tiktok', 'twitter', 'email', 'gmail'].map((platform) => (
                                                    <div className="form-group row" key={platform}>
                                                        <label className="col-sm-4 col-form-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                                                        <div className="col-sm-8">
                                                            <Input
                                                                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Username`}
                                                                value={socialMediaData[platform]}
                                                                onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                                                            />
                                                            
                                                            {platform !== 'email' && platform !== 'gmail' && (
                                                                <Input
                                                                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Email`}
                                                                    value={socialMediaData[`${platform}Email`]}
                                                                    onChange={(e) => handleSocialMediaChange(`${platform}Email`, e.target.value)}
                                                                />
                                                            )}
                                                            
                                                            <Input.Password
                                                                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Password`}
                                                                value={socialMediaData[`${platform}Password`] || ''}
                                                                onChange={(e) => handleSocialMediaChange(`${platform}Password`, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-sm-12 text-center">
                                                <Button type="primary" htmlType="submit" style={{ backgroundColor: buttonColor }}>
                                                    Submit
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddRecoveredAccount;
