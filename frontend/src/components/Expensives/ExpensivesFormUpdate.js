import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import AnimatePhoto from "../Images/AnimatePhoto";

function ExpensivesFormUpdate() {
  const buttonColor = "rgba(46,49,146,255)";
  const { id } = useParams();
  const [data, setData] = useState({ id: "", text: "", amount: "", date: "" });
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/expensive-by-id/${id}`
        );
        if (response.data && response.data.length > 0) {
          setData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch expense details.");
      }
    };
    fetchData();
  }, [id]);

  // Update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/update-expensive/${id}`,
        data
      );
      if (response.status === 200) {
        message.success("Expense updated successfully!");
        navigate("/expensives");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      message.error("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontFamily: "Arial",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
    height: 50,
    borderColor: isDarkMode ? "white" : "rgb(22, 22, 22)",
    marginBottom: 16,
    backgroundColor: isDarkMode ? "rgb(22, 22, 22)" : "white",
    color: isDarkMode ? "white" : "black",
  };

  return (
    <>
      <div align="center">
        <div
          className="form-container"
          style={{ width: "60%", marginLeft: "28%", marginTop: "10%" }}
        >
          <form className="form-group" onSubmit={handleUpdate}>
            <h3 className={isDarkMode ? "dark-mode-h1" : ""}>Description:</h3>
            <Input
              type="text"
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
              className="form-control"
              name="text"
              placeholder="Description"
              required
              style={inputStyle}
            />
            <div className="form-group mt-3">
              <h3 className={isDarkMode ? "dark-mode-h1" : ""}>Amount:</h3>
              <Input
                type="text"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
                className="form-control"
                name="amount"
                placeholder="Amount"
                required
                style={inputStyle}
              />
            </div>
            <h3 className={isDarkMode ? "dark-mode-h1" : ""}>Date:</h3>
            <div className={isDarkMode ? "dark-mode-h1" : ""}>
              <Input
                type="date"
                value={
                  data.date
                    ? new Date(data.date).toLocaleDateString("en-CA") // Format to YYYY-MM-DD
                    : "" // Fallback value if the date is invalid
                }
                onChange={(e) => setData({ ...data, date: e.target.value })}
                className="form-control"
                name="date"
                required
                style={inputStyle}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: buttonColor }}
            >
              Update Expense
            </Button>
          </form>
        </div>
        <AnimatePhoto />
      </div>
    </>
  );
}

export default ExpensivesFormUpdate;
