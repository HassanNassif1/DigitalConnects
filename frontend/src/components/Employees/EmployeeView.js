import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import countriesData from "../sm_users/countries.json";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Input,
  Form,
  Select,
  notification,
  Tooltip,
  Space,
  Spin,
  Upload,
  Avatar,
  Table,
  Tag,
  Badge,
  Statistic,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  CrownOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import "./app.css";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import verification from "../sm_users/verification.png";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profileFieldValues, setProfileFieldValues] = useState({
    username: "",
    nationality: "",
    date_of_birth: "",
  });
  const [profileJobDescription, setProfileJobDescription] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  
  const [countries, setCountries] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [jobList, setJobList] = useState([]);

  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loadingSalary, setLoadingSalary] = useState(false);
  
  const { isDarkMode } = useDarkMode();

  // === THEME VARIABLES (matching UsersPage) ===
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#1a1a35";
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";
  const successGreen = "#00b894";

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    background: inputBg,
    border: `1px solid ${borderColor}`,
    color: textColor,
    marginBottom: 8,
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/employee-view/${id}`);
      console.log("Employee Data:", response.data); 
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setImages(response.data.images || []);
      } else {
        setUser({}); 
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser({}); 
    } finally {
      setLoading(false); 
    }
  };
  
  const fetchSalaryHistory = async () => {
    if (!id) return;
    setLoadingSalary(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/getsalariesbydate`, {
        params: { 
          from_date: '2000-01-01',
          to_date: new Date().toISOString().split('T')[0] 
        }
      });
      const employeeSalaries = response.data.filter(s => s.employee_id === parseInt(id));
      setSalaryHistory(employeeSalaries);
    } catch (error) {
      console.error("Error fetching salary history:", error);
    } finally {
      setLoadingSalary(false);
    }
  };
  
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getjobs");
      setJobList(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    fetchJobs();
    fetchSalaryHistory();
  }, [id]);
  
  useEffect(() => {
    if (user) {
      setSelectedNationality(user.nationality);
      setProfileFieldValues({
        username: user.username || "",
        nationality: user.nationality || "",
        date_of_birth: user.date_of_birth || "",
      });
      setProfileJobDescription(user.job_description || "");
    }
  }, [user]);

  useEffect(() => {
    setCountries(countriesData);
    const phoneCodeMap = countriesData.reduce((acc, country) => {
      acc[country.name] = country.phoneCode;
      return acc;
    }, {});
    setCountryPhoneCodes(phoneCodeMap);
  }, []);
  
  const profileImageSrc = user?.profile_image
    ? `data:${user.profile_image_content_type};base64,${user.profile_image}`
    : null;

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setNewProfileImage(file);
  };
  
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
  };
  
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    const code = countryPhoneCodes[selected] || "";
    setCountryCode(code);
    setPhoneNumber((prev) => (prev.startsWith(code) ? prev : code + prev));
  };
  
  const handleRemoveImages = async (index) => {
    const imageId = images[index].image_id;
    try {
      await axios.delete(`http://localhost:5000/api/delete-image-employee/${imageId}`);
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };
  
  const handleImagesChange = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const newFile = event.target.files[0];
      if (newFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageData = reader.result.split(",")[1];
          const imageId = images[index].image_id;
          try {
            await axios.put(`http://localhost:5000/api/put-images-employee/${imageId}`, {
              user_id: id,
              image: imageData,
              image_type: newFile.type,
            });
            fetchUserData();
          } catch (error) {
            console.error("Failed to update image:", error);
          }
        };
        reader.readAsDataURL(newFile);
      }
    };
    fileInput.click();
  };
  
  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileFieldValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  
  const handleJobDescriptionChange = (value) => setProfileJobDescription(value);
  
  const handleEditProfile = () => {
    setProfileFieldValues({
      username: user?.username || "",
      nationality: user?.nationality || "",
      date_of_birth: user?.date_of_birth || "",
      salary: user?.salary || "",
    });
    setSelectedNationality(user?.nationality || "");
    setProfileJobDescription(user?.job_description || "");
    setIsEditingProfile(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileFieldValues({
      username: user?.username || "",
      nationality: user?.nationality || "",
      date_of_birth: user?.date_of_birth || "",
    });
    setProfileJobDescription(user?.job_description || "");
  };
  
  const handleSaveProfile = () => {
    const nationalityToUpdate = selectedNationality || user.nationality;

    setUser((prevUser) => ({
      ...prevUser,
      username: profileFieldValues.username,
      nationality: nationalityToUpdate,
      date_of_birth: profileFieldValues.date_of_birth,
      job_description: profileJobDescription,
      salary: parseFloat(profileFieldValues.salary) || 0,
    }));
    setIsEditingProfile(false);

    axios
      .put("http://localhost:5000/api/update-employee-profile", {
        user_id: id,
        username: profileFieldValues.username,
        nationality: nationalityToUpdate,
        date_of_birth: profileFieldValues.date_of_birth,
        job_description: profileJobDescription,
        salary: parseFloat(profileFieldValues.salary) || 0,
      })
      .then(() => {
        if (newProfileImage) {
          const formData = new FormData();
          formData.append("profile_image", newProfileImage);
          formData.append("user_id", id);
          return axios.put(
            "http://localhost:5000/api/update-profile-image-employee",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
        return Promise.resolve();
      })
      .then(() => {
        notification.success({
          message: "Success",
          description: "Profile updated successfully.",
        });
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setUser(user);
        setIsEditingProfile(true);
        notification.error({
          message: "Error",
          description: "Failed to update profile. Please try again.",
        });
      });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const salaryColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => text ? new Date(text).toLocaleDateString() : "N/A",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      align: "right",
      render: (text) => <span style={{ color: successGreen, fontWeight: 600 }}>${(text || 0).toFixed(2)}</span>,
    },
    {
      title: "Status",
      dataIndex: "is_paid",
      key: "is_paid",
      render: (text) => text ? <Tag color="success" style={{ color: '#fff' }}>Paid</Tag> : <Tag color="error" style={{ color: '#fff' }}>Unpaid</Tag>,
    },
  ];

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: bgColor }}>
      <Spin size="large">
        <div style={{ padding: 50, color: textColor }}>Loading employee data...</div>
      </Spin>
    </div>
  );
  
  if (!user) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: bgColor, color: textColor }}>
      User not found
    </div>
  );

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
                Employee Profile
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                View and manage employee details
              </Text>
            </div>
            <Button
              onClick={() => navigate('/employees')}
              icon={<ArrowLeftOutlined />}
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

        <Row gutter={[24, 24]}>
          {/* Left Column: Profile Image */}
          <Col xs={24} md={6}>
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16, 
              textAlign: "center", 
              boxShadow: cardShadow,
            }}>
              {isEditingProfile ? (
                <div style={{ marginBottom: 16 }}>
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ color: textColor }} />
                </div>
              ) : null}
              
              <Avatar 
                size={140} 
                src={profileImageSrc} 
                style={{ border: `4px solid ${accentColor}`, marginBottom: 16 }}
                icon={<UserOutlined />}
              />
              
              <Title level={4} style={{ color: textColor, marginBottom: 4 }}>{user.username}</Title>
              <Text style={{ color: secondaryText }}>{user.job_description || "No job assigned"}</Text>
              <Divider style={{ borderColor: borderColor }} />
              
              {user.count > 0 && (
                <Tooltip title="Verified">
                  <img src={verification} alt="Verified" style={{ width: 24, height: 24 }} />
                </Tooltip>
              )}
              
              <div style={{ marginTop: 16 }}>
                <Statistic 
                  title={<Text style={{ color: secondaryText, fontSize: 12 }}>Base Salary</Text>}
                  value={`$${(user.salary || 0).toFixed(2)}`}
                  valueStyle={{ color: successGreen, fontSize: 20 }}
                  prefix={<DollarOutlined />}
                />
              </div>
            </Card>
          </Col>

          {/* Right Column: Details & Images */}
          <Col xs={24} md={18}>
            {/* Profile Details Card */}
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16, 
              boxShadow: cardShadow,
              marginBottom: 24,
            }}>
              {isEditingProfile ? (
                <div>
                  <Title level={4} style={{ color: textColor }}>Edit Details</Title>
                  <Divider style={{ borderColor: borderColor }} />
                  
                  <Input 
                    name="username" 
                    value={profileFieldValues.username} 
                    onChange={handleProfileFieldChange} 
                    placeholder="Username" 
                    prefix={<UserOutlined style={{ color: secondaryText }} />}
                    style={inputStyle} 
                  />
                  
                  <Select 
                    style={{ width: "100%", marginBottom: 8 }} 
                    placeholder="Select Country"
                    value={selectedNationality || profileFieldValues.nationality} 
                    onChange={(val) => setSelectedNationality(val)}
                    dropdownStyle={{ background: inputBg }}
                  >
                    {countries.map((c) => <Select.Option key={c.code} value={c.name}>{c.name}</Select.Option>)}
                  </Select>

                  <Input 
                    type="date" 
                    name="date_of_birth" 
                    value={profileFieldValues.date_of_birth} 
                    onChange={handleProfileFieldChange} 
                    style={inputStyle} 
                    prefix={<CalendarOutlined style={{ color: secondaryText }} />}
                  />
                  
                  <Select 
                    placeholder="Job Description" 
                    value={profileJobDescription} 
                    onChange={handleJobDescriptionChange} 
                    style={{ width: "100%", marginBottom: 8 }} 
                    dropdownStyle={{ background: inputBg }}
                  >
                    {jobList.map((job) => <Select.Option key={job.id} value={job.job_description}>{job.job_description}</Select.Option>)}
                  </Select>

                  <div style={{ marginBottom: 8 }}>
                    <Text style={{ color: secondaryText, display: "block", marginBottom: 4 }}>Salary ($)</Text>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={profileFieldValues.salary || ""} 
                      onChange={(e) => setProfileFieldValues({ ...profileFieldValues, salary: e.target.value })} 
                      prefix={<DollarOutlined style={{ color: secondaryText }} />}
                      style={inputStyle} 
                    />
                  </div>

                  <Space style={{ marginTop: 16 }}>
                    <Button 
                      type="primary" 
                      icon={<CheckOutlined />} 
                      onClick={handleSaveProfile}
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                        border: 'none',
                        boxShadow: `0 4px 15px ${accentColor}44`,
                      }}
                    >
                      Save
                    </Button>
                    <Button 
                      icon={<MinusOutlined />} 
                      onClick={handleCancelEdit}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={4} style={{ color: textColor, margin: 0 }}>Employee Information</Title>
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />} 
                      onClick={handleEditProfile}
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                        border: 'none',
                        boxShadow: `0 4px 15px ${accentColor}44`,
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                  <Divider style={{ borderColor: borderColor }} />
                  
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Username</Text>
                      <Text style={{ color: textColor, fontSize: 15 }}>{user.username || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Country</Text>
                      <Text style={{ color: textColor, fontSize: 15 }}>{user.nationality || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Date of Birth</Text>
                      <Text style={{ color: textColor, fontSize: 15 }}>{formatDate(user.date_of_birth)}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Email</Text>
                      <Text style={{ color: textColor, fontSize: 15 }}>{user.email || "N/A"}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Phone</Text>
                      <Text style={{ color: textColor, fontSize: 15 }}>+{user.countrycode} {user.phonenumber}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text style={{ color: secondaryText, display: 'block', fontSize: 12 }}>Job</Text>
                      <Tag style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44`, color: accentColor }}>
                        {user.job_description || "N/A"}
                      </Tag>
                    </Col>
                  </Row>
                </div>
              )}
            </Card>

            {/* Salary History Card */}
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16, 
              boxShadow: cardShadow,
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ color: textColor, margin: 0 }}>
                  <DollarOutlined style={{ color: accentColor, marginRight: 8 }} />
                  Salary History
                </Title>
                <Badge count={salaryHistory.length} style={{ background: accentColor }} />
              </div>
              <Divider style={{ borderColor: borderColor }} />
              <Table 
                columns={salaryColumns} 
                dataSource={salaryHistory} 
                rowKey="id"
                loading={loadingSalary}
                pagination={{ pageSize: 5 }}
                className="dark-table"
              />
            </Card>

            {/* ID / Passport Images Card */}
            <Card style={{ 
              background: cardBg, 
              border: `1px solid ${borderColor}`, 
              borderRadius: 16, 
              boxShadow: cardShadow,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ color: textColor, margin: 0 }}>
                  <InboxOutlined style={{ color: accentColor, marginRight: 8 }} />
                  ID / Passport
                </Title>
                <Button 
                  icon={<PlusOutlined />} 
                  onClick={() => setShowUpload(!showUpload)}
                  style={{
                    background: 'rgba(108,92,231,0.1)',
                    border: `1px solid ${accentColor}44`,
                    color: accentColor,
                  }}
                >
                  {showUpload ? 'Cancel' : 'Add Images'}
                </Button>
              </div>
              <Divider style={{ borderColor: borderColor }} />
              
              {showUpload && (
                <div style={{ marginBottom: 16 }}>
                  <Input 
                    type="file" 
                    multiple 
                    onChange={handleAdditionalImagesChange} 
                    style={{ ...inputStyle, padding: '6px' }} 
                  />
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("userId", id);
                      additionalImages.forEach((image) => formData.append("additionalImages", image));
                      axios.post("http://localhost:5000/api/post-images-employee", formData, { 
                        headers: { "Content-Type": "multipart/form-data" } 
                      })
                      .then(() => { 
                        fetchUserData(); 
                        notification.success({ message: "Success", description: "Images uploaded." });
                        setShowUpload(false);
                      })
                      .catch(() => notification.error({ message: "Error", description: "Upload failed." }));
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                      border: 'none',
                      marginTop: 8,
                    }}
                  >
                    Upload Images
                  </Button>
                </div>
              )}
              
              <Row gutter={[16, 16]}>
                {images.length > 0 ? images.map((img, index) => (
                  <Col xs={12} sm={8} md={6} key={img.id}>
                    <Card style={{ background: inputBg, border: `1px solid ${borderColor}` }}>
                      <img 
                        alt="ID" 
                        src={`data:${img.image_type};base64,${img.image}`} 
                        style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} 
                      />
                      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
                        <Tooltip title="Edit">
                          <Button 
                            icon={<EditOutlined />} 
                            onClick={() => handleImagesChange(index)}
                            style={{ color: accentColor }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button 
                            icon={<DeleteOutlined />} 
                            danger 
                            onClick={() => handleRemoveImages(index)} 
                          />
                        </Tooltip>
                      </div>
                    </Card>
                  </Col>
                )) : (
                  <Col span={24}>
                    <Text style={{ color: secondaryText, textAlign: 'center', display: 'block', padding: '20px' }}>
                      No ID or Passport images added.
                    </Text>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      
      <style>{`
        .dark-table .ant-table {
          background: transparent !important;
          color: ${textColor} !important;
        }
        .dark-table .ant-table-container {
          border: none !important;
        }
        .dark-table .ant-table-thead > tr > th {
          background: ${inputBg} !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .dark-table .ant-table-tbody > tr > td {
          background: transparent !important;
          color: ${textColor} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .dark-table .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.08) !important;
        }
        .dark-table .ant-pagination-item a { 
          color: ${textColor} !important; 
        }
        .dark-table .ant-pagination-item-active { 
          background: ${accentColor} !important; 
          border-color: ${accentColor} !important; 
        }
        .dark-table .ant-pagination-prev button,
        .dark-table .ant-pagination-next button {
          color: ${secondaryText} !important;
          border-color: ${borderColor} !important;
        }
        
        .ant-input, .ant-select-selector, .ant-picker {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-select-dropdown {
          background: ${inputBg} !important;
        }
        .ant-select-item {
          color: ${textColor} !important;
        }
        .ant-input::placeholder {
          color: ${secondaryText} !important;
        }
        input::placeholder {
          color: ${secondaryText} !important;
        }
      `}</style>
    </div>
  );
};

export default EmployeeView;