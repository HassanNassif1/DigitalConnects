import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import countriesData from "../sm_users/countries.json"; // path to your JSON file
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
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./app.css";
import Sidebar from "../SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import verification from "../sm_users/verification.png";

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Main user data
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [socialMediaData, setSocialMediaData] = useState({});
  
  // Editing fields
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile-specific state
  const [profileFieldValues, setProfileFieldValues] = useState({
    username: "",
    nationality: "",
    date_of_birth: "",
  });
  const [profileJobDescription, setProfileJobDescription] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  
  // Country and phone states
  const [countries, setCountries] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Additional images state
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  
  // Job description list (fetched from backend)
  const [jobList, setJobList] = useState([]);
  
  const { isDarkMode } = useDarkMode();
  
  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee-view/${id}`);
      setUser(response.data.user);
      setImages(response.data.images);
      setSocialMediaData(response.data.user.social_media || {});
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  
  // Fetch available jobs
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
  }, [id]);
  
  // When user data loads, pre-fill profile fields
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
  
  // Helper to get profile image src
  const profileImageSrc = user?.profile_image
    ? `data:${user.profile_image_content_type};base64,${user.profile_image}`
    : null;
  
  // Handlers for file change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
    }
  };
  
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
  };
  
  // Country select change
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    const code = countryPhoneCodes[selected] || "";
    setCountryCode(code);
    // Append country code to phone number if not already present
    setPhoneNumber((prev) => (prev.startsWith(code) ? prev : code + prev));
  };
  
  // Image removal and update functions for additional images
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
            await axios.put(
              `http://localhost:5000/api/put-images-employee/${imageId}`,
              {
                user_id: id,
                image: imageData,
                image_type: newFile.type,
              }
            );
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
  
  // Profile field change for the edit form
  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileFieldValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  
  // Job description change handler
  const handleJobDescriptionChange = (value) => {
    setProfileJobDescription(value);
  };
  
  // Toggle editing mode
  const handleEditProfile = () => {
    setProfileFieldValues({
      username: user?.username || "",
      nationality: user?.nationality || "",
      date_of_birth: user?.date_of_birth || "",
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
  
  // Save profile updates including job description and profile image
  const handleSaveProfile = () => {
    // Use selectedNationality if available, otherwise fall back to user's nationality
    const nationalityToUpdate = selectedNationality || user.nationality;
    axios
      .put("http://localhost:5000/api/update-employee-field", {
        user_id: id,
        field: "username",
        value: profileFieldValues.username,
      })
      .then(() => {
        return axios.put("http://localhost:5000/api/update-employee-field", {
          user_id: id,
          field: "date_of_birth",
          value: profileFieldValues.date_of_birth,
        });
      })
      .then(() => {
        return axios.put("http://localhost:5000/api/update-employee-field", {
          user_id: id,
          field: "nationality",
          value: nationalityToUpdate,
        });
      })
      .then(() => {
        return axios.put("http://localhost:5000/api/update-employee-field", {
          user_id: id,
          field: "job_description",
          value: profileJobDescription,
        });
      })
      .then(() => {
        if (newProfileImage) {
          const formData = new FormData();
          formData.append("profile_image", newProfileImage);
          formData.append("user_id", id);
          return axios.put(
            "http://localhost:5000/api/update-profile-image-employee",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
        return Promise.resolve({
          data: {
            updatedProfileImage: profileImageSrc,
            updatedProfileImageContentType: user.profile_image_content_type,
          },
        });
      })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          profile_image: response.data.updatedProfileImage,
          profile_image_content_type: response.data.updatedProfileImageContentType,
          nationality: nationalityToUpdate,
          username: profileFieldValues.username,
          date_of_birth: profileFieldValues.date_of_birth,
          job_description: profileJobDescription,
        }));
        setIsEditingProfile(false);
        fetchUserData();
        notification.success({
          message: "Success",
          description: "Profile updated successfully.",
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        notification.error({
          message: "Error",
          description: "Failed to update profile.",
        });
      });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} `;
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar could be added here if needed */}
      <div
        style={{
          flex: 1,
          marginLeft: 300,
          padding: "20px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#333",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="fade-in" style={{ width: "80%", maxWidth: "1200px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
            Personal Info
          </Title>
  
          <Card
            className="transparent-card"
            hoverable
            cover={
              isEditingProfile ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ marginBottom: "10px" }}
                />
              ) : profileImageSrc ? (
                <img
                  alt="Profile"
                  src={profileImageSrc}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "8px",
                  }}
                />
              )
            }
            style={{ textAlign: "left", marginBottom: "20px" }}
          >
            <Meta
              title={
                isEditingProfile ? (
                  <>
                    <Input
                      name="username"
                      value={profileFieldValues.username}
                      onChange={handleProfileFieldChange}
                      style={{ marginBottom: "5px" }}
                    />
                  </>
                ) : (
                  <>
                    {user.username + "    "}
                    {user.count > 0 ? (
                      <Tooltip title="Verified">
              <img
                src={verification}
                alt="Verified Badge"
                style={{
                  width: "24px",
                  height: "24px",
                  marginLeft: "-6px",
                }}
              />
            </Tooltip>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
              description={
                isEditingProfile ? (
                  <>
                    <select
                      id="nationality"
                      className="form-select"
                      value={selectedNationality}
                      onChange={(e) => {
                        setSelectedNationality(e.target.value);
                        handleCountryChange(e);
                      }}
                      style={{ marginBottom: "8px", width: "100%" }}
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
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={
                        profileFieldValues.date_of_birth
                          ? new Date(profileFieldValues.date_of_birth).toLocaleDateString("en-CA")
                          : ""
                      }
                      onChange={handleProfileFieldChange}
                      style={{ marginBottom: "8px" }}
                    />
                    <Select
                      placeholder="Select Job Description"
                      value={profileJobDescription}
                      onChange={handleJobDescriptionChange}
                      style={{ width: "100%", marginBottom: "8px" }}
                    >
                      {jobList.map((job) => (
                        <Select.Option key={job.id} value={job.job_description}>
                          {job.job_description}
                        </Select.Option>
                      ))}
                    </Select>
                  </>
                ) : (
                  <>
                    {`Country: ${user.nationality} | Date Of Birth: ${formatDate(
                      user.date_of_birth
                    )} | Job: ${user.job_description || "N/A"}`}
                  </>
                )
              }
            />
            {isEditingProfile ? (
              <div>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSaveProfile}
                  style={{ marginRight: "8px" }}
                >
                  Save
                </Button>
                <Button
                  type="default"
                  icon={<MinusOutlined />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={handleEditProfile}
              >
                Edit
              </Button>
            )}
          </Card>
  
          <Divider />
          <div className="row"></div>
          <Divider />
  
          {/* ID / Passport Images Section */}
          <div>
            <Title level={3}>ID / Passport</Title>
            {images.length > 0 ? (
              <Row gutter={16}>
                {images.map((img, index) => (
                  <Col key={img.id} span={6}>
                    <div
                      className="fade-in scale-up"
                      style={{ marginBottom: "16px" }}
                    >
                      {img.image ? (
                        <img
                          alt={`Additional ${index}`}
                          src={`data:${img.image_type};base64,${img.image}`}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "8px",
                        }}
                      >
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleImagesChange(index)}
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveImages(index)}
                        />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Paragraph style={{ textAlign: "center" }}>
                No ID or Passport was Added
              </Paragraph>
            )}
  
            <Button
              icon={showUpload ? <MinusOutlined /> : <PlusOutlined />}
              style={{
                color: "blue",
                border: "1px solid blue",
                marginTop: "16px",
                borderRadius: 100,
              }}
              onClick={() => setShowUpload(!showUpload)}
            />
            <br />
            <br />
  
            {showUpload && (
              <div>
                <Form.Item name="additionalImages">
                  <Input
                    type="file"
                    id="additionalImages"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Button
                  icon={<CheckOutlined />}
                  type="primary"
                  onClick={() => {
                    // Upload additional images and then refresh user data
                    const formData = new FormData();
                    formData.append("userId", id);
                    additionalImages.forEach((image) => {
                      formData.append("additionalImages", image);
                    });
                    axios.post("http://localhost:5000/api/post-images-employee", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then(() => {
                      fetchUserData();
                      notification.success({
                        message: "Success",
                        description: "Additional images updated.",
                      });
                    })
                    .catch((error) => {
                      console.error("Failed to upload additional images:", error);
                      notification.error({
                        message: "Error",
                        description: "Failed to update additional images.",
                      });
                    });
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "blue",
                    border: "1px solid blue",
                    marginTop: "16px",
                    borderRadius: 100,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
