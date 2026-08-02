import React, { useState, useEffect } from "react";
import { Input, Button, Form, notification, Typography, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecoveredAccount.css";

const { TextArea } = Input;
const { Option } = Select;

function AddRecoveredAccount() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [emailError, setEmailError] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [email_personal, setEmailPersonal] = useState("");

  const [socialMediaData, setSocialMediaData] = useState({
    instagram: "",
    facebook: "",
    snapchat: "",
    linkedin: "",
    tiktok: "",
    twitter: "",
    gmail: "",
    email: "",
    instagramEmail: "",
    facebookEmail: "",
    snapchatEmail: "",
    linkedinEmail: "",
    tiktokEmail: "",
    twitterEmail: "",
    gmailEmail: "",
    instagramPassword: "",
    facebookPassword: "",
    snapchatPassword: "",
    linkedinPassword: "",
    tiktokPassword: "",
    twitterPassword: "",
    gmailPassword: "",
    emailPassword: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSocialMediaChange = (field, value) => {
    setSocialMediaData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail(email_personal)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("username", selectedUser);
    formData.append("email_personal", email_personal);

    Object.keys(socialMediaData).forEach((key) => {
      if (socialMediaData[key]) formData.append(key, socialMediaData[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/CreateRecoveredAccount",
        formData
      );

      if (res.data.message === "Recovered account added successfully!") {
        notification.success({
          message: "Success",
          description: `${selectedUser} was added successfully.`,
        });
        navigate("/view-recovered-accounts");
      }
    } catch (err) {
      setEmailError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="add-recovered-container">
      <div className="add-recovered-card">
        <h1 className="add-recovered-title">Add Recovered / Hacked Account</h1>

        <Form layout="vertical" onFinish={handleSubmit}>
          <div className="add-recovered-grid">

            {/* USER SELECT */}
            <div className="recovered-field full-width">
              <label>Client Name</label>
             <Select
  placeholder="Select a client"
  value={selectedUser}
  onChange={(v) => setSelectedUser(v)}
>

                {users.map((u) => (
                  <Option key={u.id} value={u.username}>
                    {u.username}
                  </Option>
                ))}
              </Select>
            </div>

            {/* PERSONAL EMAIL */}
            <div className="recovered-field full-width">
              <label>Personal Email</label>
              <Input
                placeholder="Email"
                value={email_personal}
                onChange={(e) => setEmailPersonal(e.target.value)}
                style={{ borderColor: emailError ? "red" : "" }}
              />
              {emailError && <span style={{ color: "red" }}>{emailError}</span>}
            </div>

            {/* HOTMAIL */}
            <div className="recovered-field">
              <label>Hotmail Username</label>
              <Input
                value={socialMediaData.email}
                onChange={(e) => handleSocialMediaChange("email", e.target.value)}
              />
            </div>

            <div className="recovered-field">
              <label>Hotmail Password</label>
              <Input.Password
                value={socialMediaData.emailPassword}
                onChange={(e) =>
                  handleSocialMediaChange("emailPassword", e.target.value)
                }
              />
            </div>

            {/* GMAIL */}
            <div className="recovered-field">
              <label>Gmail Username</label>
              <Input
                value={socialMediaData.gmail}
                onChange={(e) => handleSocialMediaChange("gmail", e.target.value)}
              />
            </div>

            <div className="recovered-field">
              <label>Gmail Password</label>
              <Input.Password
                value={socialMediaData.gmailPassword}
                onChange={(e) =>
                  handleSocialMediaChange("gmailPassword", e.target.value)
                }
              />
            </div>

            {/* SOCIAL MEDIA LOOP */}
            {[
              "instagram",
              "facebook",
              "snapchat",
              "linkedin",
              "tiktok",
              "twitter",
            ].map((platform) => (
              <>
                <div className="recovered-field">
                  <label>{platform.toUpperCase()} Username</label>
                  <Input
                    value={socialMediaData[platform]}
                    onChange={(e) =>
                      handleSocialMediaChange(platform, e.target.value)
                    }
                  />
                </div>

                <div className="recovered-field">
                  <label>{platform.toUpperCase()} Email</label>
                  <Input
                    value={socialMediaData[`${platform}Email`]}
                    onChange={(e) =>
                      handleSocialMediaChange(`${platform}Email`, e.target.value)
                    }
                  />
                </div>

                <div className="recovered-field">
                  <label>{platform.toUpperCase()} Password</label>
                  <Input.Password
                    value={socialMediaData[`${platform}Password`]}
                    onChange={(e) =>
                      handleSocialMediaChange(
                        `${platform}Password`,
                        e.target.value
                      )
                    }
                  />
                </div>
              </>
            ))}

          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="recovered-submit-btn"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddRecoveredAccount;
