import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Select,
  Switch,
  notification,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Ensure this file contains the animated background CSS
import "./CreditCardForm.css";
import CreditCardForm from "./CreditCardForm";
import countriesData from "./countries.json"; // path to your JSON file
function Sm_Create_User() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [isCardDetailsVisible, setIsCardDetailsVisible] = useState(false);
  const [isBusinessProfile, setIsBusinessProfile] = useState(false);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [instagram, setInstagram] = useState("");
  const [instagramEmail, setInstagramEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [facebookEmail, setFacebookEmail] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [snapchatEmail, setSnapchatEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [linkedinEmail, setLinkedinEmail] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [tiktokEmail, setTiktokEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [twitterEmail, setTwitterEmail] = useState("");
  const [gmail, setGmail] = useState("");
  const [hotmail, setHotmail] = useState("");
  const [gmailEmail, setGmailEmail] = useState("");
  const [instagramPassword, setInstagramPassword] = useState("");
  const [facebookPassword, setFacebookPassword] = useState("");
  const [snapchatPassword, setSnapchatPassword] = useState("");
  const [linkedinPassword, setLinkedinPassword] = useState("");
  const [tiktokPassword, setTiktokPassword] = useState("");
  const [twitterPassword, setTwitterPassword] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [hotmailPassword, setHotmailPassword] = useState("");
  const [instagramBackupCode, setInstagramBackupCode] = useState("");
  const [facebookBackupCode, setFacebookBackupCode] = useState("");
  const [snapchatBackupCode, setSnapchatBackupCode] = useState("");
  const [linkedinBackupCode, setLinkedinBackupCode] = useState("");
  const [tiktokBackupCode, setTiktokBackupCode] = useState("");
  const [twitterBackupCode, setTwitterBackupCode] = useState("");
  const [gmailBackupCode, setGmailBackupCode] = useState("");
  const [hotmailBackupCode, setHotmailBackupCode] = useState("");
  const handleIsBusinessProfile = (e) => {
    setIsBusinessProfile(e.target.checked);
  };
  const buttonColor = "rgba(46,49,146,255)";
  const { isDarkMode } = useDarkMode();
  const handleYearChange = (e) => {
    setExpirationYear(e.target.value);
    // Optionally handle saving or any additional logic here
  };

  const handleMonthChange = (e) => {
    setExpirationMonth(e.target.value);
    // Optionally handle saving or any additional logic here
  };

  const toggleCardDetails = () => {
    setIsCardDetailsVisible((prevState) => !prevState);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
useEffect(() => {
  setCountries(countriesData);
  
  const phoneCodeMap = countriesData.reduce((acc, country) => {
    acc[country.name] = country.phoneCode;
    return acc;
  }, {});
  
  setCountryPhoneCodes(phoneCodeMap);
}, []);

  useEffect(() => {
    if (selectedNationality) {
      fetchAddresses(selectedNationality);
    }
  }, [selectedNationality]);
  const fetchAddresses = (country) => {
    const apiKey = "YOUR_API_KEY"; // Replace with your actual OpenCage API key
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${country}&key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const newAddresses = data.results.map((result) => result.formatted);
        setAddresses(newAddresses);
      })
      .catch((error) => console.error("Error fetching addresses:", error));
  };

  const [cards, setCards] = useState([
    {
      cardHolderName: "",
      cardNumber: "",
      expirationYear: "",
      expirationMonth: "",
      cvv: "",
      billingAddress: "",
      cardType: "",
      customCardType: "",
    },
  ]);

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        cardHolderName: "",
        cardNumber: "",
        expirationYear: "",
        expirationMonth: "",
        cvv: "",
        billingAddress: "",
        cardType: "",
        customCardType: "",
      },
    ]);
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    const code = countryPhoneCodes[selected] || "";
    setCountryCode(code);
    setPhoneNumber((prev) => (prev.startsWith(code) ? prev : code + prev));
  };
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setAdditionalImages(files);

    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((previewUrls) => {
      setAdditionalImagePreviews(previewUrls);
    });
  };
  const handleSubmit = async (e) => {
    const formattedExpirationDate = `${expirationYear}-${expirationMonth}-01`;

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent further execution if email is invalid
    }

    const formData = new FormData();
    formData.append("username", e.username);
    formData.append("business_name", e.businessname)
    formData.append("nationality", selectedNationality);

    // Construct the dateOfBirth from separate month, day, and year
    const dateOfBirth = `${selectedYear}-${selectedMonth.padStart(
      2,
      "0"
    )}-${selectedDay.padStart(2, "0")}`;
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("isverified", true);
    formData.append("address", e.address);
    formData.append("phonenumber", phoneNumber);
    formData.append("countrycode", countryCode);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("instagram", instagram);
    formData.append("facebook", facebook);
    formData.append("snapchat", snapchat);
    formData.append("linkedin", linkedin);
    formData.append("tiktok", tiktok);
    formData.append("twitter", twitter);
    formData.append("gmail", gmail);
    formData.append("hotmail", hotmail);
    formData.append("instagramPassword", instagramPassword);
    formData.append("facebookPassword", facebookPassword);
    formData.append("snapchatPassword", snapchatPassword);
    formData.append("linkedinPassword", linkedinPassword);
    formData.append("tiktokPassword", tiktokPassword);
    formData.append("twitterPassword", twitterPassword);
    formData.append("gmailPassword", gmailPassword);
    formData.append("hotmailPassword", hotmailPassword);
    formData.append("instagramEmail", instagramEmail);
    formData.append("facebookEmail", facebookEmail);
    formData.append("snapchatEmail", snapchatEmail);
    formData.append("linkedinEmail", linkedinEmail);
    formData.append("tiktokEmail", tiktokEmail);
    formData.append("twitterEmail", twitterEmail);
    formData.append("gmailEmail", gmailEmail);
    formData.append("instagramBackupCode", instagramBackupCode);
    formData.append("facebookBackupCode", facebookBackupCode);
    formData.append("snapchatBackupCode", snapchatBackupCode);
    formData.append("linkedinBackupCode", linkedinBackupCode);
    formData.append("tiktokBackupCode", tiktokBackupCode);
    formData.append("twitterBackupCode", twitterBackupCode);
    formData.append("gmailBackupCode", gmailBackupCode);
    formData.append("hotmailBackupCode", hotmailBackupCode);

    // Append multiple credit card details
    cards.forEach((card, index) => {
      formData.append(`card_holder_name_${index}`, card.cardHolderName);
      formData.append(`card_number_${index}`, card.cardNumber);
      formData.append(
        `expiration_date_${index}`,
        `${card.expirationYear}-${card.expirationMonth}-01`
      );
      formData.append(`cvv_${index}`, card.cvv);
      formData.append(`billing_address_${index}`, card.billingAddress);
      formData.append(
        `card_type_${index}`,
        card.cardType === "Other" ? card.customCardType : card.cardType
      );
    });

    console.log(cards);

    // Append profile image if available
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Append additional images
    additionalImages.forEach((image) => {
      formData.append("additionalImages", image);
    });

    const response = await axios.post(
      "http://localhost:5000/create-user-and-credit-card",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (
      response.data.message === "User and credit cards created successfully!" ||
      response.data.message ===
        "User created successfully, but no credit card information provided."
    ) {
      navigate("/Users"); // Navigate to /Users page on success
      notification.success({
        message: "Success",
        description: response.data.message,
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ alignItems: "baseline"}}>
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <div className="row justify-content-center mt-5">
            <div className="col-md-10">
              <h1 className="text-center mb-4">Add Client</h1>
              <div className="card card-custom">
                <div className="card-body card-body-custom">
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    encType="multipart/form-data"
                  >
                    <h5 align="center">Is Business Profile ?</h5                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      >
                    <br />
                    <div align="center">
                      <Checkbox
                        checked={isBusinessProfile}
                        onChange={(e) => handleIsBusinessProfile(e)}
                      >
                        Yes
                      </Checkbox>
                      <Checkbox
                        checked={!isBusinessProfile}
                        onChange={() => setIsBusinessProfile(false)}
                      >
                        No
                      </Checkbox>
                    </div>
                    <br />
                    <br />
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label
                            htmlFor="username"
                            className="col-sm-4 col-form-label"
                          >
                            Client Name:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="username">
                              <Input id="username" placeholder="Client Name" />
                            </Form.Item>
                          </div>
                        </div>
                        {isBusinessProfile && (
                          <div className="form-group row">
                            <label
                              htmlFor="businessname"
                              className="col-sm-4 col-form-label"
                            >
                              Business Name:
                            </label>
                            <div className="col-sm-8">
                              <Form.Item name="businessname">
                                <Input
                                  id="businessname"
                                  placeholder="Business Name"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        )}

                        <div className="form-group row">
                          <label
                            htmlFor="nationality"
                            className="col-sm-4 col-form-label"
                          >
                            Country:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="nationality">
                              <select
                              required
                                id="nationality"
                                className="form-select"
                                value={selectedNationality}
                                onChange={(e) => {
                                  setSelectedNationality(e.target.value);
                                  handleCountryChange(e);
                                }}
                              >
                                <option value="" disabled>
                                  Select a country
                                </option>
                                {countries.map((country) => (
                                  <option
                                    key={country.code}
                                    value={country.name}
                                  >
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </Form.Item>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="dob"
                            className="col-sm-4 col-form-label"
                          >
                            Date Of Birth:
                          </label>
                          <div className="col-sm-8">
                            <div className="row">
                              <div className="col">
                                <Form.Item name="month">
                                  <Input
                                    id="month"
                                    type="number"
                                    placeholder="Month"
                                    value={selectedMonth}
                                    onChange={(e) =>
                                      setSelectedMonth(e.target.value)
                                    }
                                    min="1"
                                    max="12"
                                  />
                                </Form.Item>
                              </div>
                              <div className="col">
                                <Form.Item name="day">
                                  <Input
                                    id="day"
                                    type="number"
                                    placeholder="Day"
                                    value={selectedDay}
                                    onChange={(e) =>
                                      setSelectedDay(e.target.value)
                                    }
                                    min="1"
                                    max="31"
                                  />
                                </Form.Item>
                              </div>
                              <div className="col">
                                <Form.Item name="year">
                                  <Input
                                    id="year"
                                    type="number"
                                    placeholder="Year"
                                    value={selectedYear}
                                    onChange={(e) =>
                                      setSelectedYear(e.target.value)
                                    }
                                    min="1900"
                                    max="2100"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="email"
                            className="col-sm-4 col-form-label"
                          >
                            Email:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item
                              name="email"
                              validateStatus={emailError ? "error" : ""}
                              help={emailError}
                            >
                              <Input
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="address"
                            className="col-sm-4 col-form-label"
                          >
                            Address:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="address">
                              <Input id="address" placeholder="Address" />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="phonenumber"
                            className="col-sm-4 col-form-label"
                          >
                            Phone Number:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="phonenumber">
                              <Input
                                id="phonenumber"
                                placeholder={`Phone Number (${countryCode})`}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                              />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="gender"
                            className="col-sm-4 col-form-label"
                          >
                            Gender:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="gender">
                              <Select
                                id="gender"
                                placeholder="Select Gender"
                                value={gender}
                                onChange={(value) => setGender(value)}
                              >
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">
                                  Female
                                </Select.Option>
                                <Select.Option value="other">
                                  Other
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="profileImage"
                            className="col-sm-4 col-form-label"
                          >
                            Profile Image:
                          </label>
                          <div className="col-sm-8 d-flex align-items-center">
                            <Form.Item name="profileImage" className="mb-0">
                              <Input
                                type="file"
                                id="profileImage"
                                onChange={handleProfileImageChange}
                              />
                            </Form.Item>
                            {imagePreview && (
                              <img
                                src={imagePreview}
                                alt="Selected preview"
                                style={{
                                  marginLeft: "20px",
                                  width: "100px",
                                  height: "auto",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="additionalImages"
                            className="col-sm-4 col-form-label"
                          >
                            Additional Images:
                          </label>
                          <div className="col-sm-8">
                            <Form.Item name="additionalImages">
                              <Input
                                type="file"
                                id="additionalImages"
                                multiple
                                onChange={handleAdditionalImagesChange}
                              />
                            </Form.Item>
                            <div className="d-flex flex-wrap mt-2">
                              {additionalImagePreviews.map((preview, index) => (
                                <img
                                  key={index}
                                  src={preview}
                                  alt={`Additional preview ${index}`}
                                  style={{
                                    width: "100px",
                                    height: "auto",
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />

                    {isCardDetailsVisible && (
                      <>
                        <div align="center">
                          <h2 align="center">Card Details</h2>
                          {cards.map((card, index) => (
                            <div
                              key={index}
                              className="form-container-card"
                              align="center"
                              style={{
                                alignItems: "center",
                                margin: 20,
                                gap: 20,
                              }}
                            >
                              <div className="form-field">
                                <label htmlFor={`card_holder_name_${index}`}>
                                  Card Holder Name:
                                </label>
                                <input
                                  type="text"
                                  id={`card_holder_name_${index}`}
                                  name="card_holder_name"
                                  value={card.cardHolderName}
                                  style={{ height: 40 }}
                                  onChange={(e) =>
                                    handleCardChange(
                                      index,
                                      "cardHolderName",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="form-field">
                                <label htmlFor={`card_number_${index}`}>
                                  Card Number:
                                </label>
                                <Form.Item name={`card_number_${index}`}>
                                  <Input.Password
                                    id={`card_number_${index}`}
                                    name="card_number"
                                    value={card.cardNumber}
                                    style={{ height: 40 }}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "cardNumber",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Item>
                              </div>
                              <div className="form-row">
                                <div className="form-field">
                                  <label htmlFor={`expiration_date_${index}`}>
                                    Expiration Date:
                                  </label>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <select
                                      id={`expiration_year_${index}`}
                                      value={card.expirationYear}
                                      onChange={(e) =>
                                        handleCardChange(
                                          index,
                                          "expirationYear",
                                          e.target.value
                                        )
                                      }
                                      style={{ width: 85 }}
                                    >
                                      <option value="">YY</option>
                                      {Array.from({ length: 20 }, (_, i) => (
                                        <option
                                          key={i}
                                          value={new Date().getFullYear() + i}
                                        >
                                          {new Date().getFullYear() + i}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      id={`expiration_month_${index}`}
                                      value={card.expirationMonth}
                                      onChange={(e) =>
                                        handleCardChange(
                                          index,
                                          "expirationMonth",
                                          e.target.value
                                        )
                                      }
                                      style={{ width: 80 }}
                                    >
                                      <option value="">MM</option>
                                      {Array.from({ length: 12 }, (_, i) => (
                                        <option
                                          key={i}
                                          value={String(i + 1).padStart(2, "0")}
                                        >
                                          {String(i + 1).padStart(2, "0")}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="form-field">
                                  <label htmlFor={`cvv_${index}`}>CVV:</label>
                                  <Form.Item name={`cvv_${index}`}>
                                    <Input.Password
                                      id={`cvv_${index}`}
                                      name="cvv"
                                      value={card.cvv}
                                      style={{ width: 70, height: 47 }}
                                      onChange={(e) =>
                                        handleCardChange(
                                          index,
                                          "cvv",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="form-field">
                                <label htmlFor={`billing_address_${index}`}>
                                  Billing Address:
                                </label>
                                <input
                                  type="text"
                                  id={`billing_address_${index}`}
                                  name="billing_address"
                                  value={card.billingAddress}
                                  style={{ height: 40 }}
                                  onChange={(e) =>
                                    handleCardChange(
                                      index,
                                      "billingAddress",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                />
                              </div>
                              <div className="form-field">
                                <label htmlFor={`card_type_${index}`}>
                                  Card Type:
                                </label>
                                <select
                                  id={`card_type_${index}`}
                                  name="card_type"
                                  value={card.cardType}
                                  onChange={(e) =>
                                    handleCardChange(
                                      index,
                                      "cardType",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    height: 40,
                                    background: "rgba(255, 255, 255, 0.2)",
                                    border: "white",
                                    padding: 10,
                                  }}
                                >
                                  <option value="">Select a card type</option>
                                  <option value="Debit Card">Debit Card</option>
                                  <option value="Credit Card">
                                    Credit Card
                                  </option>
                                  <option value="Master Card">
                                    Master Card
                                  </option>
                                  <option value="Wish Card">Wish Card</option>
                                  <option value="OMT Card">OMT Card</option>
                                  <option value="American Express">
                                    American Express
                                  </option>
                                  <option value="Visa Card">Visa Card</option>
                                  <option value="Other">Other</option>
                                </select>
                                {card.cardType === "Other" && (
                                  <input
                                    type="text"
                                    placeholder="Please specify"
                                    value={card.customCardType}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "customCardType",
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      marginTop: 10,
                                      height: 40,
                                      width: "100%",
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={addCard}
                            align="left"
                            style={{
                              marginTop: "20px",
                              backgroundColor: buttonColor,
                              color: "white",
                              alignItems: "right",
                            }}
                            icon={<PlusOutlined />}
                          />
                        </div>
                      </>
                    )}
                    <br />
                    <div className="form-group row">
                      <div className="col-sm-12 text-center">
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ backgroundColor: buttonColor }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCardDetails}
                      style={{ background: "transparent", fontSize: 40 }}
                    >
                      💳
                    </button>
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

export default Sm_Create_User;
