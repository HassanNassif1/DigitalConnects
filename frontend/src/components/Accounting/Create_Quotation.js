import React, { useState, useEffect } from "react";
import { Input, Button, message, DatePicker, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../SideBar/SideBar";
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";
import countriesData from "../sm_users/countries.json";
const { Option } = Select;

function Create_Quotation() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const buttonColor = 'rgba(46,49,146,255)';
    const { isDarkMode } = useDarkMode();
    const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
    const [formValues, setFormValues] = useState({
        plan_date: null,
        amount: '',
        email: '',
        price: '',
        username: '',
        type: '',
        ispaid: false,
        phone_number: '',
        country: '',
        nationality: '',
        address: ''
    });
    const [countryCode, setCountryCode] = useState(''); // New state for country code

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

    
    }, []);
useEffect(() => {
   setCountries(countriesData);
   
   const phoneCodeMap = countriesData.reduce((acc, country) => {
     acc[country.name] = country.phoneCode;
     return acc;
   }, {});
   
   setCountryPhoneCodes(phoneCodeMap);
 }, []);
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };
const handleCountryChange = (value) => {
    const selectedCountry = countries.find(country => country.name === value);
    setFormValues(prev => ({
        ...prev,
        country: value,
    }));
    setCountryCode(selectedCountry?.phoneCode || ''); // use phoneCode from JSON
};


    const handleDateChange = (date, dateString) => {
        setFormValues(prev => ({
            ...prev,
            plan_date: dateString,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const amount = parseFloat(formValues.amount);
        
        if (isNaN(amount)) {
            message.error('Amount must be a valid number.');
            return;
        }
    
        const payload = {
            plan_date: formValues.plan_date,
            amount: formValues.amount,
            email: formValues.email,
            username: formValues.username,
            type: formValues.type,
            price: formValues.price,
            ispaid: formValues.ispaid,
            phone_number: formValues.phone_number,
            country_code: countryCode,
            country: formValues.country,
            nationality: formValues.nationality,
            address: formValues.address,
        };
    
        console.log('Submitting payload:', payload);
    
        axios.post('http://localhost:5000/CreateQuotation', payload)
        .then(response => {
            message.success('Quotation created successfully!');
            navigate('/quotations');
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            message.error(error.response?.data?.error || 'Error submitting form');
        });
    };

    return (
        <>
            <div className={`container ${isDarkMode ? 'dark-mode' : ''}`} align="center">
                <div className="form-container" style={{ width: '60%', marginLeft: '35%' }}>
                    <h1 className={`my-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>Create Quotation</h1>
                    <form className="form-group" onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Username:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="username" 
                                    placeholder="User Name" 
                                    value={formValues.username} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Plan Date:</label>
                            <div className="col-sm-8">
                                <DatePicker 
                                    className='form-control' 
                                    onChange={handleDateChange} 
                                    style={{ width: '100%' }} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Price:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="amount" 
                                    placeholder="Price" 
                                    value={formValues.amount} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Email:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="email" 
                                    placeholder="Email" 
                                    value={formValues.email} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Package:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="type" 
                                    placeholder="Type" 
                                    value={formValues.type} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Phone Number:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="phone_number" 
                                    placeholder={`Phone Number (${countryCode})`} // Set placeholder to country code
                                    value={formValues.phone_number} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Country:</label>
                            <div className="col-sm-8">
                                <Select
                                    className='form-control'
                                    name="country"
                                    placeholder="Select Country"
                                    onChange={handleCountryChange}
                                    showSearch
                                    style={{ width: '100%' }}
                                    required
                                    optionFilterProp="children"
                                    filterOption={(input, option) => 
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                  {countries.map(country => (
    <Option value={country.name} key={country.code}>
        {country.name}
    </Option>
))}

                                </Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Nationality:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="nationality" 
                                    placeholder="Nationality" 
                                    value={formValues.nationality} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Address:</label>
                            <div className="col-sm-8">
                                <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="address" 
                                    placeholder="Address" 
                                    value={formValues.address} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%' }} 
                                />
                            </div>
                        </div>
                        <Button 
                            type='primary' 
                            htmlType="submit" 
                            style={{ backgroundColor: buttonColor, marginTop: 16, width: "100px", height: "40px" }}
                        >
                            Create
                        </Button>
                    </form>
                </div>
                <AnimatePhoto />
            </div>
        </>
    );
}

export default Create_Quotation;
