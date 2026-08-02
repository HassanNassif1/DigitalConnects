import React, { useState, useEffect } from "react";
import { Input, Button, message, Checkbox, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDarkMode } from '../DarkMode/DarkModeContext'; 
import './Create_Accounting.css';
import AnimatePhoto from "../Images/AnimatePhoto";

const { Option } = Select;

function Create_Accounting() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    countrycode: '',
    address: '',
    nationality: ''
  });
  const [invoiceData, setInvoiceData] = useState({
    package: '',
    remaining: '',
    amount: '',
    remaining_payment: '',
    priceonme: '',
    plandate: ''
  });

  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleUserChange = (value) => {
    const selectedUser = users.find(user => user.id === parseInt(value));
    if (selectedUser) {
      setSelectedUserId(value);
      setUserDetails({
        username: selectedUser.username,
        phoneNumber: selectedUser.phonenumber,
        email: selectedUser.email,
        countrycode: selectedUser.countrycode,
        address: selectedUser.address,
        nationality: selectedUser.nationality
      });
    } else {
      setSelectedUserId(null);
      setUserDetails({
        username: '',
        phoneNumber: '',
        email: '',
        countrycode: '',
        address: '',
        nationality: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const invoiceDataToSubmit = {
      userId: selectedUserId,
      username: userDetails.username,
      phoneNumber: userDetails.phoneNumber,
      email: userDetails.email,
      package: invoiceData.package,
      remainingPackage: invoiceData.remaining,
      amount: parseFloat(invoiceData.amount),
      remaining_payment: isNaN(parseFloat(invoiceData.remaining_payment)) ? 0 : parseFloat(invoiceData.remaining_payment),
      priceOnMe: isNaN(parseFloat(invoiceData.priceonme)) ? 0 : parseFloat(invoiceData.priceonme),
      planDate: invoiceData.plandate,
      isPaid: isPaid,
      countrycode: userDetails.countrycode,
      address: userDetails.address,
      nationality: userDetails.nationality
    };
    try {
      await axios.post('http://localhost:5000/api/accounting_invoices', invoiceDataToSubmit);
      message.success('Invoice Added Successfully');
      navigate('/accounting');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(error.response?.data?.error || 'Error submitting form');
    }
  };

  return (
    <div className="create-accounting-container">
      <div className="form-card">
        <h2 className="form-title">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="accounting-form">
          <div className="grid-form">
            
            {/* Select user */}
            <div className="form-field full-width">
              <label>Client Name</label>
              <Select
                placeholder="Select a user"
                onChange={handleUserChange}
                style={{ width: "100%" }}
                size="large"
                showSearch
              >
                {users.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.username}
                  </Option>
                ))}
              </Select>
            </div>

            {/* User details (read-only) */}
            {[
              { label: "Phone Number", name: "phoneNumber", value: userDetails.phoneNumber },
              { label: "Email", name: "email", value: userDetails.email },
              { label: "Country Code", name: "countrycode", value: userDetails.countrycode },
              { label: "Address", name: "address", value: userDetails.address },
              { label: "Nationality", name: "nationality", value: userDetails.nationality },
            ].map((f, i) => (
              <div className="form-field" key={i}>
                <label>{f.label}</label>
                <Input value={f.value} disabled size="large" />
              </div>
            ))}

            {/* Invoice details */}
            {[
              { label: "Package", name: "package", value: invoiceData.package },
              { label: "Remaining Package", name: "remaining", value: invoiceData.remaining },
              { label: "Amount", name: "amount", value: invoiceData.amount },
              { label: "Remaining Payment", name: "remaining_payment", value: invoiceData.remaining_payment },
              { label: "Price on Me", name: "priceonme", value: invoiceData.priceonme },
              { label: "Plan Date", name: "plandate", value: invoiceData.plandate, type: "date" }
            ].map((f, i) => (
              <div className="form-field" key={i}>
                <label>{f.label}</label>
                <Input
                  type={f.type || "text"}
                  name={f.name}
                  value={f.value}
                  onChange={handleInputChange}
                  size="large"
                />
              </div>
            ))}

            <div className="form-field full-width checkbox-field">
              <Checkbox
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              >
                Is Paid?
              </Checkbox>
            </div>
          </div>
          

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="submit-btn"
          >
            Create Invoice
          </Button>
           <AnimatePhoto />
        </form>
        
      </div>
     
    </div>
  );
}

export default Create_Accounting;
