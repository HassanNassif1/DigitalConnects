import React, { useState, useEffect } from "react";
import { Input, Button, Form, Select, Switch, notification } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Ensure this file contains the animated background CSS
import countriesData from "../sm_users/countries.json";
const { TextArea } = Input;

function EmployeeForm() {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [jobDescription, setJobDecription] = useState([]);
  const [selectedjobDescription, setSelectedJobDecription] = useState([]);
  const [selectedAge, setSelectedAge] = useState("");
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
  const [isVerified, setIsVerified] = useState(false);
  const buttonColor = "rgba(46,49,146,255)";
  const { isDarkMode } = useDarkMode();
  const navigateTo = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getjobs");
      setJobDecription(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

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

  // Updated: Only update selected country and countryCode; do not modify the phoneNumber field.
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    const code = countryPhoneCodes[selected] || "";
    setCountryCode(code);
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

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent further execution if email is invalid
    }

    // Remove spaces from phoneNumber on submission
    const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "");

    const formData = new FormData();
    formData.append("username", employeeName);
    formData.append("nationality", selectedNationality);

    // Construct the dateOfBirth from separate month, day, and year
    const dateOfBirth = `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`;
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("isverified", isVerified);
    formData.append("address", address);
    formData.append("phonenumber", formattedPhoneNumber);
    formData.append("countrycode", countryCode);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("job_description", selectedjobDescription);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    additionalImages.forEach((image) => {
      formData.append("additionalImages", image);
    });
    try {
      const response = await axios.post("http://localhost:5000/CreateEmployee", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message === "Employee added successfully!") {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
        navigateTo("/employees"); // Navigate to /employees page on success
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">{/* Sidebar can be placed here if needed */}</div>
        <div className="col-md-9">
          <div className="row justify-content-center mt-5">
            <div className="col-md-10">
              <h1 className="text-center mb-4">Add Employee</h1>
              <div className="card card-custom">
                <div className="card-body card-body-custom">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label htmlFor="username" className="col-sm-4 col-form-label">
                          Employee Name:
                        </label>
                        <div className="col-sm-8">
                          <Form.Item name="username">
                            <Input
                              id="username"
                              placeholder="Employee Name"
                              value={employeeName}
                              onChange={(e) => setEmployeeName(e.target.value)}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="nationality" className="col-sm-4 col-form-label">
                          Country:
                        </label>
                        <div className="col-sm-8">
                          <Form.Item name="nationality">
                            <select
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
                                <option key={country.code} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="dob" className="col-sm-4 col-form-label">
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
                                  onChange={(e) => setSelectedMonth(e.target.value)}
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
                                  onChange={(e) => setSelectedDay(e.target.value)}
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
                                  onChange={(e) => setSelectedYear(e.target.value)}
                                  min="1900"
                                  max="2100"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="email" className="col-sm-4 col-form-label">
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
                        <label htmlFor="address" className="col-sm-4 col-form-label">
                          Address:
                        </label>
                        <div className="col-sm-8">
                          <Form.Item name="address">
                            <Input
                              id="address"
                              placeholder="Address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group row">
                        <label htmlFor="job" className="col-sm-4 col-form-label">
                          Job Description:
                        </label>
                        <div className="col-sm-8">
                          <Form.Item name="job">
                            <Select
                              id="job"
                              placeholder="Employee's Job"
                              onChange={(value) => setSelectedJobDecription(value)}
                            >
                              {jobDescription.map((job) => (
                                <Select.Option key={job.id} value={job.job_description}>
                                  {job.job_description}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="phonenumber" className="col-sm-4 col-form-label">
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
                        <label htmlFor="gender" className="col-sm-4 col-form-label">
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
                              <Select.Option value="female">Female</Select.Option>
                              <Select.Option value="other">Other</Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="profileImage" className="col-sm-4 col-form-label">
                          Profile Image:
                        </label>
                        <div className="col-sm-8 d-flex align-items-center">
                          <Form.Item name="profileImage" className="mb-0">
                            <Input type="file" id="profileImage" onChange={handleProfileImageChange} />
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
                        <label htmlFor="additionalImages" className="col-sm-4 col-form-label">
                          Additional Images:
                        </label>
                        <div className="col-sm-8">
                          <Form.Item name="additionalImages">
                            <Input type="file" id="additionalImages" multiple onChange={handleAdditionalImagesChange} />
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
                  <div className="form-group row">
                    <div className="col-sm-12 text-center">
                      <Button type="button" onClick={handleSubmit} style={{ backgroundColor: buttonColor, color: "white" }}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;
