import React, { useState, useEffect } from "react";
import { 
  Input, 
  Button, 
  Form, 
  Select, 
  Switch, 
  notification, 
  Card, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Space, 
  Upload, 
  Avatar, 
  Spin,
  Statistic,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import axios from "axios";
import countriesData from "../sm_users/countries.json";
import { 
  UserAddOutlined, 
  ArrowLeftOutlined, 
  UploadOutlined,
  SaveOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function EmployeeForm() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Employee Basic Details
  const [selectedCountry, setSelectedCountry] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [jobDescription, setJobDescription] = useState([]);
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Salary States
  const [salary, setSalary] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [service, setService] = useState("");

  // === THEME VARIABLES ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    color: textColor,
    marginBottom: 8,
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getjobs");
      setJobDescription(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(previews).then((previewUrls) => setAdditionalImagePreviews(previewUrls));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    const formData = new FormData();
    formData.append("username", employeeName);
    formData.append("nationality", selectedNationality);
    const dateOfBirth = `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`;
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("isverified", isVerified);
    formData.append("address", address);
    formData.append("phonenumber", formattedPhoneNumber);
    formData.append("countrycode", countryCode);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("job_description", selectedJobDescription);
    if (profileImage) formData.append("profileImage", profileImage);
    additionalImages.forEach((image) => formData.append("additionalImages", image));
    formData.append("salary", salary);

    try {
      const response = await axios.post("http://localhost:5000/CreateEmployee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newEmployeeId = response.data.id; 

      if (salary && newEmployeeId) {
        await axios.post("http://localhost:5000/api/postsalary", {
          employee_id: newEmployeeId,
          job_description: selectedJobDescription,
          salary: parseFloat(salary),
          is_paid: isPaid,
          service: service || "Base Salary",
          date: salaryDate || new Date().toISOString().split('T')[0],
        });
      }

      notification.success({ message: "Success", description: "Employee and Salary added successfully!" });
      navigate("/employees");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      notification.error({ message: "Error", description: "Failed to add employee or salary." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      background: bgColor,
      padding: '30px 20px',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <Title level={2} style={{ color: textColor, marginBottom: 4 }}>
                <TeamOutlined style={{ color: accentColor, marginRight: 12 }} />
                Add New Employee
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Register a new employee to the system
              </Text>
            </div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/employees')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${borderColor}`,
                color: textColor,
                borderRadius: 8,
              }}
            >
              Back to Employees
            </Button>
          </div>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Main Form Card */}
        <Card style={{ 
          background: cardBg, 
          border: `1px solid ${borderColor}`, 
          borderRadius: 16, 
          boxShadow: cardShadow,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ 
            height: "3px", 
            background: `linear-gradient(90deg, ${accentColor}, #a29bfe, ${accentColor})`, 
            backgroundSize: "300% 100%", 
            animation: "gradientMove 4s ease infinite", 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0 
          }} />

          <div style={{ padding: '24px' }}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Row gutter={[24, 24]}>
                {/* Personal Information */}
                <Col span={24}>
                  <Title level={4} style={{ color: textColor, marginBottom: 16 }}>
                    <UserOutlined style={{ color: accentColor, marginRight: 8 }} />
                    Personal Information
                  </Title>
                  <Divider style={{ borderColor: borderColor }} />
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Employee Name</Text>}>
                    <Input 
                      placeholder="Full name" 
                      value={employeeName} 
                      onChange={(e) => setEmployeeName(e.target.value)} 
                      prefix={<UserOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Email</Text>}>
                    <Input 
                      placeholder="Email address" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      prefix={<MailOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                    {emailError && <Text style={{ color: "#ff4d4f" }}>{emailError}</Text>}
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Country</Text>}>
                    <Select 
                      placeholder="Select Country" 
                      value={selectedNationality} 
                      onChange={(val) => { 
                        setSelectedNationality(val); 
                        handleCountryChange({ target: { value: val } }); 
                      }}
                      dropdownStyle={{ background: inputBg }}
                      style={{ width: "100%" }}
                    >
                      {countries.map((c) => <Select.Option key={c.code} value={c.name}>{c.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Phone Number</Text>}>
                    <Input 
                      placeholder={`Phone (${countryCode})`} 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      prefix={<PhoneOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Date of Birth</Text>}>
                    <Space>
                      <Input 
                        placeholder="MM" 
                        type="number" 
                        min="1" 
                        max="12" 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)} 
                        style={{ width: 80, ...inputStyle }} 
                      />
                      <Input 
                        placeholder="DD" 
                        type="number" 
                        min="1" 
                        max="31" 
                        value={selectedDay} 
                        onChange={(e) => setSelectedDay(e.target.value)} 
                        style={{ width: 80, ...inputStyle }} 
                      />
                      <Input 
                        placeholder="YYYY" 
                        type="number" 
                        min="1900" 
                        max="2100" 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)} 
                        style={{ width: 100, ...inputStyle }} 
                      />
                    </Space>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Gender</Text>}>
                    <Select 
                      placeholder="Gender" 
                      value={gender} 
                      onChange={setGender} 
                      dropdownStyle={{ background: inputBg }} 
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="male">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Address</Text>}>
                    <Input 
                      placeholder="Address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      prefix={<GlobalOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                {/* Job Information */}
                <Col span={24}>
                  <Title level={4} style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>
                    <TeamOutlined style={{ color: accentColor, marginRight: 8 }} />
                    Job Information
                  </Title>
                  <Divider style={{ borderColor: borderColor }} />
                </Col>

                <Col span={24}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Job Description</Text>}>
                    <Select 
                      placeholder="Select Job" 
                      value={selectedJobDescription} 
                      onChange={setSelectedJobDescription} 
                      dropdownStyle={{ background: inputBg }} 
                      style={{ width: "100%" }}
                    >
                      {jobDescription.map((job) => <Select.Option key={job.id} value={job.job_description}>{job.job_description}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Salary Details */}
                <Col span={24}>
                  <Title level={4} style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>
                    <DollarOutlined style={{ color: accentColor, marginRight: 8 }} />
                    Salary Details
                  </Title>
                  <Divider style={{ borderColor: borderColor }} />
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Initial Salary ($)</Text>}>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={salary} 
                      onChange={(e) => setSalary(e.target.value)} 
                      prefix={<DollarOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Salary Date</Text>}>
                    <Input 
                      type="date" 
                      value={salaryDate} 
                      onChange={(e) => setSalaryDate(e.target.value)} 
                      prefix={<CalendarOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Payment Status</Text>}>
                    <Switch 
                      checked={isPaid} 
                      onChange={setIsPaid} 
                      checkedChildren="Paid" 
                      unCheckedChildren="Unpaid" 
                      style={{ background: isPaid ? "#00b894" : "#ff4d4f" }} 
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Service Note</Text>}>
                    <Input 
                      placeholder="E.g. Monthly Base" 
                      value={service} 
                      onChange={(e) => setService(e.target.value)} 
                      style={inputStyle} 
                    />
                  </Form.Item>
                </Col>

                {/* Images */}
                <Col span={24}>
                  <Title level={4} style={{ color: textColor, marginTop: 16, marginBottom: 16 }}>
                    <UploadOutlined style={{ color: accentColor, marginRight: 8 }} />
                    Images
                  </Title>
                  <Divider style={{ borderColor: borderColor }} />
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Profile Image</Text>}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <Input 
                        type="file" 
                        onChange={handleProfileImageChange} 
                        style={{ ...inputStyle, padding: "6px" }} 
                      />
                      {imagePreview && <Avatar size={64} src={imagePreview} shape="square" />}
                    </div>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label={<Text style={{ color: secondaryText }}>Additional Images</Text>}>
                    <Input 
                      type="file" 
                      multiple 
                      onChange={handleAdditionalImagesChange} 
                      style={{ ...inputStyle, padding: "6px" }} 
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {additionalImagePreviews.map((img, i) => <Avatar key={i} size={48} src={img} shape="square" />)}
                    </div>
                  </Form.Item>
                </Col>

                {/* Actions */}
                <Col span={24}>
                  <Divider style={{ borderColor: borderColor }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <Button 
                      onClick={() => navigate('/employees')}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        borderRadius: 8,
                        padding: '0 30px',
                        height: 40,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading} 
                      icon={<SaveOutlined />}
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                        border: 'none',
                        boxShadow: `0 4px 15px ${accentColor}44`,
                        borderRadius: 8,
                        padding: '0 30px',
                        height: 40,
                      }}
                    >
                      Add Employee
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes gradientMove { 
          0% { background-position: 0% 50%; } 
          50% { background-position: 100% 50%; } 
          100% { background-position: 0% 50%; } 
        }
        
        .ant-input, .ant-select-selector, .ant-picker {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input::placeholder {
          color: ${secondaryText} !important;
        }
        .ant-select-dropdown {
          background: ${inputBg} !important;
        }
        .ant-select-item {
          color: ${textColor} !important;
        }
        .ant-select-item:hover {
          background: rgba(108,92,231,0.1) !important;
        }
        .ant-select-item-option-selected {
          background: ${accentColor}22 !important;
        }
        .ant-picker-input > input {
          color: ${textColor} !important;
        }
        .ant-picker-suffix {
          color: ${secondaryText} !important;
        }
        .ant-form-item-label > label {
          color: ${secondaryText} !important;
        }
        .ant-switch-checked {
          background: #00b894 !important;
        }
        .ant-switch {
          background: #ff4d4f !important;
        }
        input::placeholder {
          color: ${secondaryText} !important;
        }
      `}</style>
    </div>
  );
}

export default EmployeeForm;