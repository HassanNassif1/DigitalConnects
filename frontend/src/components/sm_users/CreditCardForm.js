import React, { useState } from 'react';
import axios from 'axios';
import './CreditCardForm.css'; // Import CSS file for styles

const CreditCardForm = (user_id) => {
    const [formData, setFormData] = useState({
        card_holder_name: '',
        card_number: '',
        expiration_date: '',
        cvv: '',
        billing_address: '',
        user_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/post-credit-cards', formData);
            console.log('Success:', response.data);
            // Optionally reset the form or show a success message
            setFormData({
                card_holder_name: '',
                card_number: '',
                expiration_date: '',
                cvv: '',
                billing_address: '',
                user_id: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="credit-card-form">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-field">
                    <label htmlFor="card_holder_name">Card Holder Name:</label>
                    <input
                        type="text"
                        id="card_holder_name"
                        name="card_holder_name"
                        value={formData.card_holder_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="card_number">Card Number:</label>
                    <input
                        type="text"
                        id="card_number"
                        name="card_number"
                        value={formData.card_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="expiration_date">Expiration Date:</label>
                        <input
                            type="month"
                            id="expiration_date"
                            name="expiration_date"
                            value={formData.expiration_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-field">
                    <label htmlFor="billing_address">Billing Address:</label>
                    <input
                        type="text"
                        id="billing_address"
                        name="billing_address"
                        value={formData.billing_address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="user_id">User ID:</label>
                    <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default CreditCardForm;
