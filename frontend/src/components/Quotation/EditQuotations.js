import React, { useState, useEffect } from "react";
import { Input, Button, message, DatePicker, Select } from 'antd';
import { useNavigate ,useParams} from 'react-router-dom';
import Sidebar from "../SideBar/SideBar";
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import AnimatePhoto from "../Images/AnimatePhoto";

const { Option } = Select;

function EditQuotation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const buttonColor = 'rgba(46,49,146,255)';
    const { isDarkMode } = useDarkMode();
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
    console.log('users',users)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://localhost:5000/api/GetQuotationById/${id}`);
                    const formattedRecord = response.data.map(item => ({
                        ...item,
                        plan_date: new Date(item.plan_date).toISOString().split('T')[0]
                    }));
                    setUsers(formattedRecord);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Error fetching accounting data');
            }
        };

        fetchData();
    }, [id]);

    const handleDateChange = (date, dateString) => {
        setFormValues(prev => ({
            ...prev,
            plan_date: dateString,
        }));
    };
    const handleCountryChange = (value) => {
        const selectedCountry = countries.find(country => country.name.common === value);
        setFormValues(prev => ({
            ...prev,
            country: value,
        }));
        setCountryCode(selectedCountry?.idd?.root + (selectedCountry?.idd?.suffixes[0] || '')); // Set country code
    };


    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setUsers((prevRecord) => {
            const updatedRecord = [...prevRecord];
            updatedRecord[index] = {
                ...updatedRecord[index],
                [name]: name === 'plan_date' ? new Date(value).toISOString().split('T')[0] : value,
            };
            return updatedRecord;
        });
    };
    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const updatedRecord = users[0];
            const response = await axios.put(`http://localhost:5000/UpdateQuotation/${id}`, {
                ...updatedRecord,
                platform: selectedPlatform,
            });

            if (response.status === 200) {
                message.success(response.data.message);
                navigate('/quotations');
            } else {
                message.error(`Update failed: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating users:', error.response ? error.response.data : error.message);
            message.error('Error updating users');
        }
    };

    return (
        <>

            <div className={`container ${isDarkMode ? 'dark-mode' : ''}`} align="center">
                <div className="form-container" style={{ width: '60%', marginLeft: '35%' }}>
                    <h1 >Edit Quotation</h1>
                    <form className="form-group" onSubmit={handleUpdate}>
                    {users.map((e, index) => (
                            <div key={index}>
                                <div className="form-group row">
                                <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Username:</label>
                                <div className="col-sm-8">
                                    <Input 
                                    type="text" 
                                    className='form-control' 
                                    name="username" 
                                    placeholder="User Name" 
                                    value={e.username} 
                                    onChange={(event) => handleChange(event, index)}
                                    required 
                                    style={{ width: '100%' }} 
                                    />
                                </div>
                                </div>

                                <div className="form-group row">
                                <label className={`col-sm-4 col-form-label ${isDarkMode ? 'text-light' : ''}`}>Plan Date:</label>
                                <div className="col-sm-8">
                                    <Input 
                                    type="date"
                                    className='form-control' 
                                    value={new Date(e.plan_date).toISOString().split('T')[0]}
                                    onChange={(event) => handleChange(event, index)}
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
                                    value={e.amount} 
                                    onChange={(event) => handleChange(event, index)}
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
                                    value={e.email} 
                                    onChange={(event) => handleChange(event, index)}
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
                                    placeholder="Package" 
                                    value={e.type} 
                                    onChange={(event) => handleChange(event, index)}
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
                                    placeholder={`Phone Number (${countryCode})`} 
                                    value={e.phone_number} 
                                    onChange={(event) => handleChange(event, index)}
                                    required 
                                    style={{ width: '100%' }} 
                                    />
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
                                    value={e.nationality} 
                                    onChange={(event) => handleChange(event, index)}
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
                                    value={e.address} 
                                    onChange={(event) => handleChange(event, index)}
                                    required 
                                    style={{ width: '100%' }} 
                                    />
                                </div>
                                </div>
                            </div>
                            ))}

                        <Button 
                            type='primary' 
                            htmlType="submit" 
                            style={{ backgroundColor: buttonColor, marginTop: 16, width: "100px", height: "40px" }}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
                <AnimatePhoto />
            </div>
        </>
    );
}

export default EditQuotation;
