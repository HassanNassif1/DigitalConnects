import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Table, Typography, Divider, Input } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import "./RecoveredAccountProfile.css";
import Sidebar from "../../components/SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";

const { Title } = Typography;

const RecoveredAccountProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState({});
  const [originalSocialMediaData, setOriginalSocialMediaData] = useState({});
  const [editHistory, setEditHistory] = useState([]);
  const [editHistoryEmail, setEditHistoryEmail] = useState([]);
  const [editHistoryPassword, setEditHistoryPassword] = useState([]);
  const [editHistoryUsername, setEditHistoryUsername] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [editState, setEditState] = useState({});
  const [showPasswordColumn, setShowPasswordColumn] = useState(true);
  const [visiblePasswordsOldValue, setVisiblePasswordsOldValue] = useState({}); 
  const [visiblePasswordsNewValue, setVisiblePasswordsNewValue] = useState({}); 

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/recoveredAccountProfile/${id}`
      );
      setUser(response.data);
      const data = {
        instagram: response.data.instagram,
        facebook: response.data.facebook,
        snapchat: response.data.snapchat,
        linkedin: response.data.linkedin,
        tiktok: response.data.tiktok,
        twitter: response.data.twitter,
        gmail: response.data.gmail_username,
        instagram_email: response.data.instagram_email,
        facebook_email: response.data.facebook_email,
        snapchat_email: response.data.snapchat_email,
        linkedin_email: response.data.linkedin_email,
        tiktok_email: response.data.tiktok_email,
        twitter_email: response.data.twitter_email,
        gmail_email: response.data.gmail_email,
        instagram_password: response.data.instagram_password,
        facebook_password: response.data.facebook_password,
        snapchat_password: response.data.snapchat_password,
        linkedin_password: response.data.linkedin_password,
        tiktok_password: response.data.tiktok_password,
        twitter_password: response.data.twitter_password,
        gmail_password: response.data.gmail_password,
        email: response.data.email_username,
        email_password: response.data.email_password,
      };
      setSocialMediaData(data);
      setOriginalSocialMediaData(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchEditHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/edit-history/${id}`
      );
      setEditHistory(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };
  const fetchEditHistoryEmail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/edit-history-email/${id}`
      );
      setEditHistoryEmail(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };
  const fetchEditHistoryPassword = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/edit-history-password/${id}`
      );
      setEditHistoryPassword(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };
  const fetchEditHistoryUsername = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/edit-history-username/${id}`
      );
      setEditHistoryUsername(response.data);
    } catch (error) {
      console.error("Error fetching edit history:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEditHistory();
    fetchEditHistoryEmail();
    fetchEditHistoryPassword();
    fetchEditHistoryUsername()
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const togglePasswordVisibility = (platform) => {
    setPasswordVisibility((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };
  const togglePasswordVisibilityOldValue = (index) => {
    setVisiblePasswordsOldValue((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const togglePasswordVisibilityNewValue = (index) => {
    setVisiblePasswordsNewValue((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleUpdate = async (platform) => {
    const updates = {};
    const platformLower = platform.toLowerCase();

    // Check and update email
    if (
      socialMediaData[`${platformLower}_email`] !==
      originalSocialMediaData[`${platformLower}_email`]
    ) {
      updates.email = socialMediaData[`${platformLower}_email`];
    }

    // Check and update password
    if (
      socialMediaData[`${platformLower}_password`] !==
      originalSocialMediaData[`${platformLower}_password`]
    ) {
      updates.password = socialMediaData[`${platformLower}_password`];
    }

    // Check and update username (corrected)
    if (
      socialMediaData[`${platformLower}`] !==
      originalSocialMediaData[`${platformLower}`]
    ) {
      updates.username = socialMediaData[`${platformLower}`]; // Correct key usage
    }

    console.log("updates", updates);

    // Proceed if there are any updates
    if (Object.keys(updates).length > 0) {
      try {
        await axios.put("http://localhost:5000/api/update-social-media", {
          user_id: id,
          updates: {
            [platformLower]: updates,
          },
        });

        // Refresh data after update
        fetchUserData();
        fetchEditHistoryEmail();
        fetchEditHistoryPassword();
        fetchEditHistoryUsername();
      } catch (error) {
        console.error("Error updating:", error);
      }
    }

    // Close edit mode after update
    setEditState((prev) => ({ ...prev, [platform]: false }));
  };

  const handleEmailUpdate = async (platform) => {
    const platformLower = platform.toLowerCase();
    const updates = {};

    // Map fields to database column names
    const usernameField = `${platformLower}_username`;
    const passwordField = `${platformLower}_password`;

    const newUsername = socialMediaData[platformLower];
    const newPassword = socialMediaData[`${platformLower}_password`];

    // Validate input
    if (!newUsername && !newPassword) {
      console.error("No updates provided");
      return;
    }

    // Construct updates object with correct keys
    if (newUsername) updates[usernameField] = newUsername;
    if (newPassword) updates[passwordField] = newPassword;

    console.log("Updates to be sent:", updates);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/update-recovered-accounts-email",
        {
          user_id: id,
          updates: {
            [platformLower]: updates,
          },
        }
      );

      if (response.status === 200) {
        console.log(`Successfully updated ${platformLower}`);
        fetchUserData(); // Refresh the data
        fetchEditHistory(); // Refresh edit history
      } else {
        console.error("Failed to update. Response:", response);
      }
    } catch (error) {
      console.error("Error updating email account details:", error.message);
    }

    // Reset edit state
    setEditState((prev) => ({ ...prev, [platform]: false }));
  };

  const toggleEdit = (platform) => {
    setEditState((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const socialMediaLinks = [
    {
      platform: "Instagram",
      url: socialMediaData.instagram,
      email: socialMediaData.instagram_email,
      password: socialMediaData.instagram_password,
    },
    {
      platform: "Facebook",
      url: socialMediaData.facebook,
      email: socialMediaData.facebook_email,
      password: socialMediaData.facebook_password,
    },
    {
      platform: "Snapchat",
      url: socialMediaData.snapchat,
      email: socialMediaData.snapchat_email,
      password: socialMediaData.snapchat_password,
    },
    {
      platform: "LinkedIn",
      url: socialMediaData.linkedin,
      email: socialMediaData.linkedin_email,
      password: socialMediaData.linkedin_password,
    },
    {
      platform: "TikTok",
      url: socialMediaData.tiktok,
      email: socialMediaData.tiktok_email,
      password: socialMediaData.tiktok_password,
    },
    {
      platform: "Twitter",
      url: socialMediaData.twitter,
      email: socialMediaData.twitter_email,
      password: socialMediaData.twitter_password,
    },
  ];

  const emailLinks = [
    {
      platform: "Gmail",
      url: socialMediaData.gmail_username,
      password: socialMediaData.gmail_password,
    },
    {
      platform: "Email",
      url: socialMediaData.email,
      password: socialMediaData.email_password,
    },
  ];

  const socialMediaSource = socialMediaLinks.map((link) => ({
    key: link.platform,
    platform: link.platform,
    url: link.url || "N/A",
    password: link.password || "",
  }));

  const emailSource = emailLinks.map((link) => ({
    key: link.platform,
    platform: link.platform,
    url: link.url || "N/A",
    password: link.password || "",
  }));

  const socialMediaColumns = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (text) => (
        <strong>{text}</strong>
      )
    },
    {
      title: "User Name",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <>
              <Input
                value={
                  socialMediaData[`${record.platform.toLowerCase()}`] || ""
                }
                onChange={(e) =>
                  setSocialMediaData((prev) => ({
                    ...prev,
                    [`${record.platform.toLowerCase()}`]: e.target.value,
                  }))
                }
                style={{ width: "70%" }}
              />
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleUpdate(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          ) : (
            <>
              <span>
                {socialMediaData[`${record.platform.toLowerCase()}`] || "N/A"}
              </span>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => toggleEdit(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <>
              <Input
                value={
                  socialMediaData[`${record.platform.toLowerCase()}_email`]
                }
                onChange={(e) =>
                  setSocialMediaData((prev) => ({
                    ...prev,
                    [`${record.platform.toLowerCase()}_email`]: e.target.value,
                  }))
                }
                style={{ width: "70%" }}
              />
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleUpdate(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          ) : (
            <>
              <span>
                {socialMediaData[`${record.platform.toLowerCase()}_email`]}
              </span>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => toggleEdit(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: "Updated Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <>
              <Input
                value={
                  socialMediaData[
                    `${record.platform.toLowerCase()}_password`
                  ] || ""
                }
                onChange={(e) =>
                  setSocialMediaData((prev) => ({
                    ...prev,
                    [`${record.platform.toLowerCase()}_password`]:
                      e.target.value,
                  }))
                }
                type={passwordVisibility[record.platform] ? "text" : "password"}
                style={{ width: "70%" }}
              />
              <Button
                type="link"
                icon={
                  passwordVisibility[record.platform] ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )
                }
                onClick={() => togglePasswordVisibility(record.platform)}
                style={{ marginLeft: "8px" }}
              />
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleUpdate(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          ) : (
            <>
              <span>
                {passwordVisibility[record.platform]
                  ? socialMediaData[
                      `${record.platform.toLowerCase()}_password`
                    ] || "N/A"
                  : "********"}
              </span>
              <Button
                type="link"
                icon={
                  passwordVisibility[record.platform] ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )
                }
                onClick={() => togglePasswordVisibility(record.platform)}
                style={{ marginLeft: "8px" }}
              />
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => toggleEdit(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const emailColumns = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (text) => (
        <strong>{text}</strong>
      )
    },
    {
      title: "User Name",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {editState[record.platform] ? (
            <>
              <Input
                value={
                  socialMediaData[`${record.platform.toLowerCase()}`] || ""
                }
                onChange={(e) =>
                  setSocialMediaData((prev) => ({
                    ...prev,
                    [`${record.platform.toLowerCase()}`]: e.target.value,
                  }))
                }
                style={{ width: "70%" }}
              />
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleEmailUpdate(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          ) : (
            <>
              <span>
                {socialMediaData[`${record.platform.toLowerCase()}`] || "N/A"}
              </span>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => toggleEdit(record.platform)}
                style={{ marginLeft: "8px", color: "blue" }}
              />
            </>
          )}
        </div>
      ),
    },
    ...(showPasswordColumn
      ? [
          {
            title: "Updated Password",
            dataIndex: "password",
            key: "password",
            render: (text, record) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {editState[record.platform] ? (
                  <>
                    <Input
                      value={
                        socialMediaData[
                          `${record.platform.toLowerCase()}_password`
                        ] || ""
                      }
                      onChange={(e) =>
                        setSocialMediaData((prev) => ({
                          ...prev,
                          [`${record.platform.toLowerCase()}_password`]:
                            e.target.value,
                        }))
                      }
                      type={
                        passwordVisibility[record.platform]
                          ? "text"
                          : "password"
                      }
                      style={{ width: "70%" }}
                    />
                    <Button
                      type="link"
                      icon={
                        passwordVisibility[record.platform] ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => togglePasswordVisibility(record.platform)}
                      style={{ marginLeft: "8px" }}
                    />
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => handleEmailUpdate(record.platform)}
                      style={{ marginLeft: "8px", color: "blue" }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {passwordVisibility[record.platform]
                        ? socialMediaData[
                            `${record.platform.toLowerCase()}_password`
                          ] || "N/A"
                        : "********"}
                    </span>
                    <Button
                      type="link"
                      icon={
                        passwordVisibility[record.platform] ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => togglePasswordVisibility(record.platform)}
                      style={{ marginLeft: "8px" }}
                    />
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => toggleEdit(record.platform)}
                      style={{ marginLeft: "8px", color: "blue" }}
                    />
                  </>
                )}
              </div>
            ),
          },
        ]
      : []), // Conditionally include this column
  ];

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          marginLeft: 300,
          padding: "20px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#333",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "80%", maxWidth: "1200px", margin: "0 auto" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Account Details
          </Title>
          <Divider />

          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h3>Client Name: {user.username}</h3>
          </div>

          <Title level={3}>Social Media Accounts</Title>
          <Table
            columns={socialMediaColumns}
            dataSource={socialMediaSource}
            pagination={false}
            style={{ marginBottom: "20px" }}
          />
          <Title level={3}>Email Accounts</Title>
          <Table
            columns={emailColumns}
            dataSource={emailSource}
            pagination={false}
            style={{ marginBottom: "20px" }}
          />
          {/* <Title level={3}>Email History</Title>
          <Table
            columns={[
              {
                title: "Account",
                dataIndex: "modified_field",
                key: "modified_field",
                render: (text) => {
                  const displayText = (text || "N/A").replace(/_/g, " ");
                  return (
                    <strong
                      style={{
                        color: displayText === "N/A" ? "red" : "inherit",
                        fontWeight: displayText === "N/A" ? "bold" : "bold",
                      }}
                    >
                      {displayText}
                    </strong>
                  );
                },
              },
              {
                title: "Old Value",
                dataIndex: "old_value",
                key: "old_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsOldValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityOldValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return (
                    <span
                      style={{
                        color: text === "N/A" ? "red" : "inherit",
                        fontWeight: text === "N/A" ? "bold" : "normal",
                      }}
                    >
                      {text || "N/A"}
                    </span>
                  );
                },
              },
              {
                title: "New Value",
                dataIndex: "new_value",
                key: "new_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsNewValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityNewValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return text || "N/A";
                },
              },
              {
                title: "Modified Date",
                dataIndex: "modified_date",
                key: "modified_date",
                render: (text) => (
                  <span>{new Date(text).toLocaleString("en-US", { hour12: true })}</span>
                ),
              },
            ]}
            dataSource={editHistoryEmail.map((entry, index) => ({
              key: index,
              modified_field: entry.modified_field,
              old_value: entry.old_value || "N/A",
              new_value: entry.new_value,
              modified_date: entry.modified_date,
            }))}
            pagination={false}
            scroll={{
              y: 400, 
              x: "100%",
            }}
          /> */}
          <Title level={3}>Password History</Title>
          <Table
            columns={[
              {
                title: "Account",
                dataIndex: "modified_field",
                key: "modified_field",
                render: (text) => {
                  const displayText = (text || "N/A").replace(/_/g, " ");
                  return (
                    <span
                      style={{
                        color: displayText === "N/A" ? "red" : "inherit",
                        fontWeight: displayText === "N/A" ? "bold" : "bold",
                      }}
                    >
                      {displayText}
                    </span>
                  );
                },
              },
              {
                title: "Old Value",
                dataIndex: "old_value",
                key: "old_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsOldValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityOldValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return (
                    <span
                      style={{
                        color: text === "N/A" ? "red" : "inherit",
                        fontWeight: text === "N/A" ? "bold" : "normal",
                      }}
                    >
                      {text || "N/A"}
                    </span>
                  );
                },
              },
              {
                title: "New Value",
                dataIndex: "new_value",
                key: "new_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsNewValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityNewValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return text || "N/A";
                },
              },
              {
                title: "Modified Date",
                dataIndex: "modified_date",
                key: "modified_date",
                render: (text) => (
                  <span>{new Date(text).toLocaleString("en-US", { hour12: true })}</span>
                ),
              },
            ]}
            dataSource={editHistoryPassword.map((entry, index) => ({
              key: index,
              modified_field: entry.modified_field,
              old_value: entry.old_value || "N/A",
              new_value: entry.new_value,
              modified_date: entry.modified_date,
            }))}
            pagination={false}
            scroll={{
              y: 400, 
              x: "100%",
            }}
          />
          <Title level={3}>Email Account History</Title>
          <Table
            columns={[
              {
                title: "Account",
                dataIndex: "modified_field",
                key: "modified_field",
                render: (text) => {
                  const displayText = (text || "N/A").replace(/_/g, " ");
                  return (
                    <span
                      style={{
                        color: displayText === "N/A" ? "red" : "inherit",
                        fontWeight: displayText === "N/A" ? "bold" : "bold",
                      }}
                    >
                      {displayText}
                    </span>
                  );
                },
              },
              {
                title: "Old Value",
                dataIndex: "old_value",
                key: "old_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsOldValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityOldValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return (
                    <span
                      style={{
                        color: text === "N/A" ? "red" : "inherit",
                        fontWeight: text === "N/A" ? "bold" : "normal",
                      }}
                    >
                      {text || "N/A"}
                    </span>
                  );
                },
              },
              {
                title: "New Value",
                dataIndex: "new_value",
                key: "new_value",
                render: (text, record, index) => {
                  if (
                    record.modified_field?.toLowerCase().includes("password")
                  ) {
                    const isVisible = visiblePasswordsNewValue[index];
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>
                          {isVisible ? text : "****"}
                        </span>
                        <Button
                          icon={
                            isVisible ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )
                          }
                          onClick={() => togglePasswordVisibilityNewValue(index)}
                          type="link"
                        />
                      </div>
                    );
                  }
                  return text || "N/A";
                },
              },
              {
                title: "Modified Date",
                dataIndex: "modified_date",
                key: "modified_date",
                render: (text) => (
                  <span>{new Date(text).toLocaleString("en-US", { hour12: true })}</span>
                ),
              },
            ]}
            dataSource={editHistoryUsername.map((entry, index) => ({
              key: index,
              modified_field: entry.modified_field,
              old_value: entry.old_value || "N/A",
              new_value: entry.new_value,
              modified_date: entry.modified_date,
            }))}
            pagination={false}
            scroll={{
              y: 400, 
              x: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecoveredAccountProfile;
