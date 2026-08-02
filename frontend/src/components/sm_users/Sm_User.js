import React, { useState, useEffect } from "react";
import { Table, Input, Button, Card, Tooltip, notification } from "antd";
import axios from "axios";
import Sidebar from "../../components/SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import maleImage from "./male.jpg";
import otherImage from "./other.jpg";
import femaleImage from "./female.jpg";
import vipImage from "./vipimage.png";
import verification from "./verification.png";
import {
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Sm_User = () => {
  const [data, setData] = useState([]);
  const [userRecords, setUserRecords] = useState({});
  const [searchText, setSearchText] = useState("");
  const { isDarkMode } = useDarkMode();
  const [countClients, setCountClients] = useState(0);
  const navigate = useNavigate();

  const countUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/userscount");
      setCountClients(response.data.user_count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchClient = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setData(response.data);

      const userIds = response.data.map((user) => user.id);
      const recordsPromises = userIds.map((id) =>
        axios.get(`http://localhost:5000/api/user-accounting/${id}`)
      );

      const recordsResponses = await Promise.all(recordsPromises);
      const recordsStatus = {};
      recordsResponses.forEach((response, index) => {
        recordsStatus[userIds[index]] = response.data.hasRecords;
      });
      setUserRecords(recordsStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchClient();
    countUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/delete-user-completely/${id}`
      );
      fetchClient();
      countUsers();
      notification.success({
        message: "Success",
        description: "Record deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while deleting the record. Please try again.",
      });
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/user/${userId}`);
  };

  const columns = [
    {
      title: "Profile Image",
      key: "image",
      render: (text, record) => {
        const base64Image = record.image;
        const gender = record.gender;
        const defaultImage =
          gender === "male"
            ? maleImage
            : gender === "female"
            ? femaleImage
            : otherImage;
        return (
          <img
            src={base64Image || defaultImage}
            alt={record.username}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.4)",
            }}
          />
        );
      },
    },
    {
      title: "Client Name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <span style={{ color: "#fff" }}>
          {text}
          {record.count > 0 && (
            <Tooltip title="Verified">
              <img
                src={verification}
                alt="Verified"
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 6,
                }}
              />
            </Tooltip>
          )}
          {record.sum >= 1000 && (
            <img
              src={vipImage}
              alt="VIP"
              style={{
                width: 18,
                height: 18,
                marginLeft: 4,
                marginBottom: 2,
              }}
            />
          )}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const phoneNumber = record.phonenumber;
        const countryCode = record.countrycode;
        const whatsappLink = `https://wa.me/${countryCode}${phoneNumber}`;

        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={() => handleViewDetails(record.id)}
              icon={<EyeOutlined />}
              style={{
                backgroundColor: "#0a84ff",
                color: "#fff",
                borderRadius: "50%",
                width: 40,
                height: 40,
                border: "none",
              }}
            />
            <Button
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                border: "none",
              }}
            />
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                style={{
                  backgroundColor: "#25D366",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  border: "none",
                }}
              >
                <i
                  className="fa-brands fa-whatsapp"
                  style={{
                    fontSize: "20px",
                    color: "white",
                  }}
                ></i>
              </Button>
            </a>
          </div>
        );
      },
    },
  ];

  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #030316 0%, #071028 40%, #0b0e1a 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        title={<span style={{ color: "white" }}>Client List</span>}
        className="glow-card"
       style={{
          width: "100%",
        
          borderRadius: "20px",
         boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 40px rgba(198, 207, 242, 0.53)", // soft blue glow
          backgroundColor: "#0b0e1a",
          padding: "20px 25px",
        }}
        bordered={false}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <label style={{ color: "white" }}>Search Client</label>
          <Input
            placeholder="Type to search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#0a0f1f",
              color: "#ffffff",
              border: "none",
              boxShadow: "inset 0 0 8px rgba(0,140,255,0.3)",
            }}
          />
          <h3 style={{ color: "white", textAlign: "center" }}>
            Total Clients: {countClients}
          </h3>
          <Button
            href="/CreateUser"
            type="primary"
            style={{
              background: "linear-gradient(90deg, #007bff, #00b4ff)",
              border: "none",
              color: "white",
              borderRadius: "8px",
              width: "200px",
              alignSelf: "center",
              boxShadow: "0 0 15px rgba(0,180,255,0.4)",
            }}
          >
            Create New Client
          </Button>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </Card>

      <style>{`
        .table-row-light { background-color: #0b0e1a; color: #ffffff; }
        .table-row-dark { background-color: #0a0f1f; color: #ffffff; }

        .ant-table {
          border: none !important;
        }

        .ant-table-thead > tr > th {
          background-color: #071028 !important;
          color: #ffffff !important;
          font-weight: bold;
          border: none !important;
        }

        .ant-table-tbody > tr > td {
          border: none !important;
        }

        .ant-table-tbody > tr:hover {
          background-color: #1b1f36 !important;
          color: #ffffff;
        }

        .glow-card::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 25px;
          background: radial-gradient(ellipse at center, rgba(0,140,255,0.6) 0%, transparent 80%);
          filter: blur(25px);
          z-index: 0;
        }

        @media (max-width: 768px) {
          .ant-table {
            font-size: 12px;
          }
          .glow-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Sm_User;
