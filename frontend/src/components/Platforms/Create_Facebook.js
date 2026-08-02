// import React, { useState, useEffect } from "react";
// import { Table, Input, Button } from 'antd';
// import Sidebar from "../SideBar/SideBar";
// import axios from "axios";

// function Create_Facebook() {
//     const [data, setData] = useState([]);
//     const [packageData, setPackageData] = useState([]);
//     const [reachData, setReachData] = useState([]);
//     const [engagement, setEngagement] = useState([]);

//     const [user, setUser] = useState([]);
//     const [selectedType, setSelectedType] = useState("");
//     const [selectedAmount, setSelectedAmount] = useState("");
//     const buttonColor = 'rgb(46, 124, 134)';

//     useEffect(() => {
//         // Fetch data from the API when the component mounts
//         axios
//             .get('http://localhost:5000/api/followers_likes_fb')
//             .then((response) => {
//                 setData(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });
//             axios
//             .get('http://localhost:5000/api/boost_engagement')
//             .then((response) => {
//                 setEngagement(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });

//         axios
//             .get('http://localhost:5000/api/users')
//             .then((response) => {
//                 setUser(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });

//         axios
//             .get('http://localhost:5000/api/fbpackages')
//             .then((response) => {
//                 setPackageData(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });

//         axios
//             .get('http://localhost:5000/api/reachboost')
//             .then((response) => {
//                 setReachData(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);

//     const handleTypeChange = (event) => {
//         const value = event.target.value;
//         setSelectedType(value);

//         // Find the corresponding amount based on the selected type
//         const selectedPackage = packageData.find((item) => item.type === value);
//         const selectedReach = reachData.find((item) => item.reach === value);
//         const selectedEngage = engagement.find((item) => item.engagement === value);

//         const selectedfollowers_likes = data.find((item) => item.type === value);

//         if (selectedPackage) {
//             setSelectedAmount(selectedPackage.amount);
//         }
//         if (selectedReach) {
//             setSelectedAmount(selectedReach.reach_amount);
//         }
//         if (selectedEngage) {
//             setSelectedAmount(selectedEngage.engagement_amount);
//         }
//         if (selectedfollowers_likes) {
//             setSelectedAmount(selectedfollowers_likes.amount);
//         }
//     };

//     // Create an array of amounts based on selectedType
//     const amountOptions = [
//         ...packageData.map(data => data.amount),
//         ...engagement.map(data => data.engagement_amount),
//         ...reachData.map(data => data.reach_amount),
//         ...data.map(data => data.amount)
//     ];
//     const selectStyle = {
//         width: '100%',
//         padding: '8px',
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         boxSizing: 'border-box',
//         fontFamily: 'Arial',
//         fontSize: '14px',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease',
    
//         // Add more CSS properties as needed
    
//         ':hover': {
//             borderColor: 'blue', // Change border color on hover
//             backgroundColor: '#f0f0f0', // Change background color on hover
//         },
//     };
    
//     return (
//         <div align="center">
//             <Sidebar />
//             <div className="form-container" style={{ width: '60%', marginLeft: '18%', marginTop: '10%' }}>
//                 <form className='form-group' method="post" action={`http://localhost:5000/CreateFacebook`} >
//                     <div className='form-group mt-3'>
//                         <Input type="text" className='form-control' name="fbusername" placeholder="Facebook" required />
//                     </div>
//                     <div>
//     Username:
//     <select className='select-list' name="username" style={selectStyle}>
//         {user.map(data => <option value={data.username} key={data.username}>{data.username}</option>)}
//     </select>
// </div>

// <div>
//     Type:
//     <select className='select-list' name="type" style={selectStyle} onChange={handleTypeChange} value={selectedType}>
//         {[
//             ...data.map(data => data.type),
//             ...engagement.map(data =>data.engagement),
//             ...packageData.map(data => data.type),
//             ...reachData.map(data => data.reach),
//         ].map(option => (
//             <option value={option} key={option}>
//                 {option}
//             </option>
//         ))}
//     </select>
// </div>

// <div>
//     Amount:
//     <select className='select-list' name="amount" value={selectedAmount} style={selectStyle}>
//         {amountOptions.map(option => (
//             <option value={option} key={option}>
//                 {option}
//             </option>
//         ))}
//     </select>
// </div>


//                     <div className='form-group mt-3'>
//                         <Input type="date" className='form-control' name="plandate" placeholder="Destination" required />
//                     </div>
//                     {/* Replace the normal button with Ant Design Button */}
//                     <Button type='primary' htmlType="submit" name="submit" style={{ backgroundColor: buttonColor }}>Add User</Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Create_Facebook;
