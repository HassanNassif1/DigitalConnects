import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, message, Checkbox } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import "./EditAccounting.css";

const Edit_Accounting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [record, setRecord] = useState({
    username: "",
    plan_date: "",
    amount: "",
    package: "",
    remaining_payment: "",
    price_on_me: "",
    remaining_package: "",
  });
  const [isPaid, setIsPaid] = useState(false);
  const [remainingChanged, setRemainingChanged] = useState(null);
  const [remainingHistory, setRemainingHistory] = useState([]);

  // Fetch record data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/GetAccountingById/${id}`
        );

        console.log("Fetched record:", response.data);

      const item = response.data; // now it's a single object
setRecord({
  username: item.username || "",
  plan_date: item.plan_date || "",
  amount: item.amount || "",
  package: item.package || "",
  remaining_payment: item.remaining_payment || "",
  price_on_me: item.price_on_me || "",
  remaining_package: item.remaining_package || "",
});
setIsPaid(item.is_paid);

        setIsPaid(!!item.is_paid);
        setRemainingChanged(item.remaining_changed || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error fetching accounting data");
      }
    };

    fetchData();
  }, [id]);

  // Fetch remaining package history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/RemainingPackageHistory/${id}`
        );
        setRemainingHistory(response.data);
      } catch (error) {
        console.error("Error fetching remaining package history:", error);
      }
    };

    if (id) fetchHistory();
  }, [id]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setRecord((prev) => ({
      ...prev,
      [name]:
        name === "plan_date"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));

    if (name === "remaining_package") {
      setRemainingChanged(new Date().toISOString());
    }
  };

  // Handle update
  const handleUpdate = async (event) => {
    event.preventDefault();

    const payload = {
      ...record,
      is_paid: isPaid,
      remaining_changed: remainingChanged,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/UpdateAccounting/${id}`,
        payload
      );

      message.success(response.data.message || "Record updated successfully");
      navigate("/accounting");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Error updating record");
    }
  };

  return (
    <div className={`container ${isDarkMode ? "dark-mode" : ""}`} align="center">
      <div className={`form-container ${isDarkMode ? "dark-mode" : ""}`}>
        <h1>Edit Accounting Record</h1>

        <form className="form-group" onSubmit={handleUpdate}>
          <div style={{ border: "1px solid #888", padding: "20px" }}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label>Username</label>
              <Input
                name="username"
                value={record.username}
                disabled
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Plan Date */}
            <div style={{ marginBottom: 16 }}>
              <label>Plan Date</label>
              <Input
                type="date"
                name="plan_date"
                value={record.plan_date}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <label>Amount</label>
              <Input
                type="number"
                name="amount"
                value={record.amount}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Package */}
            <div style={{ marginBottom: 16 }}>
              <label>Package</label>
              <Input
                type="text"
                name="package"
                value={record.package}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Remaining Payment */}
            <div style={{ marginBottom: 16 }}>
              <label>Remaining Payment</label>
              <Input
                type="text"
                name="remaining_payment"
                value={record.remaining_payment}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Price on Me */}
            <div style={{ marginBottom: 16 }}>
              <label>Price on Me</label>
              <Input
                type="text"
                name="price_on_me"
                value={record.price_on_me}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Remaining Package */}
            <div style={{ marginBottom: 16 }}>
              <label>Remaining Package</label>
              <Input
                type="text"
                name="remaining_package"
                value={record.remaining_package}
                onChange={handleInputChange}
                className={`custom-input ${isDarkMode ? "dark-input" : ""}`}
              />
            </div>

            {/* Paid Checkbox */}
            <div style={{ marginBottom: 16 }}>
              <Checkbox
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              >
                Paid
              </Checkbox>
            </div>

            {/* Remaining History */}
            {remainingHistory.length > 0 && (
              <div className="mt-2 text-start">
                <h6>Change History:</h6>
                <div className="history-container">
                  <ul className="list-unstyled">
                    {remainingHistory.map((entry, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: "18px",
                          color: isDarkMode ? "#ddd" : "#1465d7ff",
                        }}
                      >
                        <strong>
                          {new Date(entry.updated_at).toLocaleString("en-US", {
                            timeZone: "Asia/Beirut",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </strong>
                        <br />
                        <span>
                          From <em>{entry.previous_value}</em> ➜{" "}
                          <em>{entry.updated_value}</em>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className={`custom-button ${isDarkMode ? "dark-button" : ""}`}
            style={{ marginTop: 16 }}
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Edit_Accounting;
