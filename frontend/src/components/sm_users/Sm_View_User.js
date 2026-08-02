import React, { useState, useEffect, StyleSheet } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Row,
  Col,
  Select,
  Typography,
  Divider,
  Input,
  Table,
  Upload,
  Form,
  notification,
  Switch,
  Tooltip,
} from "antd";
import countriesData from "./countries.json"; // path to your JSON file
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  MinusOutlined,
  EyeTwoTone,
  CheckOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faYoutube,
  faXTwitter,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import "./app.css";
import verification from "./verification.png";
import Sidebar from "../../components/SideBar/SideBar";
import { useDarkMode } from "../DarkMode/DarkModeContext";
import "./BankCard.css";
import maleImage from "./male.jpg";
import other from "./other.jpg";
import femaleImage from "./female.jpg";
import logo from "./logo.png";
import chip from "./chip.png";
import eagle from "./eagle.png";
import vipbadge from "./vipbadge.png";
import font from "./credit-card-font/CreditCard-26Me.ttf";

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const Sm_View_User = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [user, setUser] = useState([]);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [images, setImages] = useState([]);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [gmailData, setGmailData] = useState({});
  const [newPlatform, setNewPlatform] = useState("Select Platform");
  const [newAddEmail, setNewAddEmail] = useState("");
  const [newAddPassword, setNewAddPassword] = useState("");
  const [newAddUsername, setNewAddUsername] = useState("");
  const [newBCode, setNewBCode] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [newAccountVisible, setNewAccountVisible] = useState({});
  const [newAccountData, setNewAccountData] = useState({});
  const [isCardDetailsVisible, setIsCardDetailsVisible] = useState(false);
  const [isNewPlatformVisible, setIsNewPlatformVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [cardId, setCardId] = useState(0);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [backupCodeVisible, setBackupCodeVisible] = useState({});
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [searchTextPassword, setSearchTextPassword] = useState("");
  const [searchTextEmail, setSearchTextEmail] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardTypeOther, setCardTypeOther] = useState("");
  const [customCardType, setCustomCardType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCardNumberVisible, setCardNumberVisible] = useState(false);
  const [isCvvVisible, setCvvVisible] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [newAddBackupCode, setNewAddBackupCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const toggleBackupCodeVisible = (platform, social_id) => {
    setBackupCodeVisible((prev) => ({ ...prev, [platform]: social_id }));
  };
  const handleSearchPassword = (value) => {
    setSearchTextPassword(value);
  };
  const handleSearchEmail = (value) => {
    setSearchTextEmail(value);
  };

  const handleAddNewBackupCode = (e) => {
    setNewAddBackupCode(e);
  };
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    const code = countryPhoneCodes[selected] || "";
    setCountryCode(code);
    setPhoneNumber((prev) => (prev.startsWith(code) ? prev : code + prev));
  };
  const handleSubmitNewAccount = async (platform, event) => {
    const accountData = { ...newAccountData[platform] };
    platform = platform.toLowerCase();
    try {
      await axios.post(`http://localhost:5000/api/add-social-media-account`, {
        user_id: id,
        platform,
        ...accountData,
      });
      notification.success({
        message: "Success",
        description: `${platform} account added successfully.`,
      });
      setNewAccountVisible((prev) => ({ ...prev, [platform]: false }));
      fetchUserData();
      event.preventDefault();
    } catch (error) {
      console.error(
        `Error adding new ${platform} account:`,
        error.response?.data || error.message
      );
    }
  };

  const handleSubmitNewPlatform = async () => {
    if (newPlatform !== "Select Platform") {
      try {
        await axios.post(`http://localhost:5000/api/add-social-media-account`, {
          user_id: id,
          platform: newPlatform.toLocaleLowerCase(),
          username: newAddUsername,
          email: newAddEmail,
          password: newAddPassword,
          backupcode: newBCode,
        });
        notification.success({
          message: "Success",
          description: `${newPlatform} account added successfully.`,
        });
        fetchUserData();
        setNewPlatform("Select Platform");
        setNewAddUsername("");
        setNewAddEmail("");
        setNewAddPassword("");
        setNewBCode("");
        setIsNewPlatformVisible(false);
      } catch (error) {
        console.error(
          `Error adding new account:`,
          error.response?.data || error.message
        );
      }
    } else {
      notification.error({
        description: `Select a Platform.`,
      });
    }
  };

  const handleSubmitAddNewBackupCode = async (platform, social_id) => {
    platform = platform.toLowerCase();
    console.log(platform, social_id, newAddBackupCode);
    try {
      await axios.post(`http://localhost:5000/api/add-backup-code`, {
        id: social_id,
        platform: platform,
        backupcode: newAddBackupCode,
      });
      notification.success({
        message: "Success",
        description: `Backupcode account added successfully.`,
      });

      fetchUserData();
      setNewBackupCodeVisible(!newBackupCodeVisible);
      setNewAddBackupCode("");
    } catch (error) {
      console.error(
        `Error adding new ${platform} account:`,
        error.response?.data || error.message
      );
    }
  };

  const handleVisible = () => {
    setIsVisible(!isVisible);
  };

  const handleAddAccount = (platform, social_id) => {
    setNewAccountVisible((prev) => ({ ...prev, [platform]: social_id }));
  };
  const handleNewAccountChange = (platform, field, value) => {
    setNewAccountData((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const styles = {
    mainContainer: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "300px",
      position: "flex",
    },
    container: {
      flex: 1,
      padding: 5,
      borderRadius: 10,
      height: 200,
    },
    header: {
      flexDirection: "row",
      display: "flex",
      justifyContent: "space-between",
      flex: 1,
    },
    header1: {
      padding: 15,
      paddingLeft: 30,
      color: "rgb(218,165,32)",
      fontFamily: "Courier",
      fontSize: 15,
      textShadow: `
              -1px -1px 0 rgba(0, 0, 0, 0.5),
              -2px -2px 0 rgba(0, 0, 0, 0.4),
              3px 3px 0 rgba(0, 0, 0, 0.3),
              -4px -4px 0 rgba(0, 0, 0, 0.2)
          `,
    },
    header2: {
      margin: -5,
    },
    body: {
      paddingLeft: 40,
      paddingRight: 40,
      display: "flex",
      flex: 2,
      flexDirection: "column",
      gap: 10,
    },
    body1: {
      alignItems: "left",
    },
    body2: {
      textAlign: "center",
      fontWeight: 300,
    },
    body3: {
      textAlign: "right",
      paddingRight: 50,
      color: "rgb(218,165,32)",
      fontSize: 13,
      textShadow: `
              -1px -1px 0 rgba(0, 0, 0, 0.5),
              -2px -2px 0 rgba(0, 0, 0, 0.4),
              3px 3px 0 rgba(0, 0, 0, 0.3),
              -4px -4px 0 rgba(0, 0, 0, 0.2)
          `,
    },
    footer: {
      alignItems: "flex-start",
      paddingLeft: 30,
      color: "rgb(218,165,32)",
      fontFamily: "Courier",
      fontSize: 15,
      textShadow: `
              -1px -1px 0 rgba(0, 0, 0, 0.5),
              -2px -2px 0 rgba(0, 0, 0, 0.4),
              3px 3px 0 rgba(0, 0, 0, 0.3),
              -4px -4px 0 rgba(0, 0, 0, 0.2)
          `,
    },
  };

  const addCard = () => {
    setIsAddingCard(!isAddingCard);
  };
  const handleEdit = (creditCardId) => {
    setIsEditing(!isEditing);

    if (isEditing === false) {
      axios
        .get(`http://localhost:5000/getid-credit-cards/${creditCardId}`)
        .then((response) => {
          setCardId(response.data.id);
          setCardHolderName(response.data.card_holder_name);
          setCardNumber(response.data.card_number);
          setExpirationYear(
            new Date(response.data.expiration_date).getFullYear()
          );
          setExpirationMonth(
            String(
              new Date(response.data.expiration_date).getMonth() + 1
            ).padStart(2, "0")
          );
          setCvv(response.data.cvv);
          setBillingAddress(response.data.billing_address);
          setCardType(response.data.card_type);
          setCustomCardType(response.data.custom_card_type);
        })
        .catch((err) => {
          setError("Failed to fetch data");
          console.error(err);
        });
    }
  };

  const handleCardTypeChange = (e) => {
    const value = e.target.value;
    setCardType(value);

    // Clear custom input if the user selects something other than "Other"
    if (value !== "Other") {
      setCustomCardType("");
    }
  };

  const handleFlip = (cardId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId], // Toggle flip state for the specific card ID
    }));
    setFlipped(!flipped);
  };
  const [passwordVisibility, setPasswordVisibility] = useState({
    instagram: false,
    facebook: false,
    snapchat: false,
    linkedin: false,
    tiktok: false,
    twitter: false,
    gmail: false,
  });
  const [emailVisibility, setEmailVisibility] = useState({
    instagram: false,
    facebook: false,
    snapchat: false,
    linkedin: false,
    tiktok: false,
    twitter: false,
    gmail: false,
  });
  const [usernameHistory, setUsernameHistory] = useState([]);

  const [emailHistory, setEmailHistory] = useState([]);
  const [newUsernameVisible, setNewUsernameVisible] = useState({});
  const [newPasswordVisible, setNewPasswordVisible] = useState({});
  const [newEmailVisible, setNewEmailVisible] = useState({});
  const [newBackupCodeVisible, setNewBackupCodeVisible] = useState({});
  const [newEditBackupCodeVisible, setNewEditBackupCodeVisible] = useState({});
  const [newPassword, setNewPassword] = useState({});
  const [newEmail, setNewEmail] = useState({});
  const [newBackupCode, setNewBackupCode] = useState({});
  const [newEditBackupCode, setNewEditBackupCode] = useState({});
  const [newUsername, setNewUsername] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [visiblePasswordIndexes, setVisiblePasswordIndexes] = useState({});
  const { isDarkMode } = useDarkMode();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonColor = "rgba(46,49,146,255)";
  const [profileFieldValues, setProfileFieldValues] = useState({
    username: user?.username || "",
    nationality: user?.nationality || "",
    date_of_birth: user?.date_of_birth || "",
  });
  const [expirationYear, setExpirationYear] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const filteredDataPassword = passwordHistory.filter(
    (entry) =>
      entry.platform.toLowerCase().includes(searchTextPassword.toLowerCase()) ||
      entry.old_password
        .toLowerCase()
        .includes(searchTextPassword.toLowerCase()) ||
      (entry.account_id &&
        entry.account_id.toString().includes(searchTextPassword)) // if you want to search by account_id as well
  );

  const filteredDataEmail = emailHistory.filter(
    (entry) =>
      entry.platform.toLowerCase().includes(searchTextEmail.toLowerCase()) ||
      entry.old_email.toLowerCase().includes(searchTextEmail.toLowerCase()) ||
      (entry.account_id &&
        entry.account_id.toString().includes(searchTextEmail)) // if you want to search by account_id as well
  );

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user-view/${id}`
      );
      setUser(response.data.user);
      setImages(response.data.images);
      setCreditCards(response.data.credit_cards || []);

      // Extract social media data
      const socialMediaData = response.data.user.social_media[0] || {}; // Assuming social_media is an array with one object

      const socialMediaArray = [];

      // Iterate through the social media platforms
      Object.keys(socialMediaData).forEach((platform) => {
        const platformData = socialMediaData[platform];

        // Ensure platformData has platformInfo to prevent errors
        if (platformData && platformData.platformInfo) {
          platformData.platformInfo.forEach((account) => {
            socialMediaArray.push({
              id: account.id,
              platform: platform.charAt(0).toUpperCase() + platform.slice(1), // Capitalize the platform name
              username: account.username || platform, // Default to platform name if username is missing
              url:
                platform === "gmail" || platform === "hotmail"
                  ? `mailto:${account.email}` // Handle email-based platforms
                  : `https://www.${platform}.com/${account.username}`, // Handle standard social media platforms
              icon:
                platform === "gmail"
                  ? "fab fa-google"
                  : platform === "hotmail"
                  ? "fa fa-inbox"
                  : `fab fa-${platform}`, // Font Awesome icon class
              password: account.password,
              email: account.email,
              backupcode: account.backupcode || null,
              backupcodes: account.backupcodes || [],
            });
          });
        }
      });

      // Sort the social media array by platform name alphabetically
      socialMediaArray.sort((a, b) => a.platform.localeCompare(b.platform));

      // Set the social media links state
      setSocialMediaLinks(socialMediaArray);

      // Fetch password history (assuming you have an API endpoint for this)
      const passwordResponse = await axios.get(
        `http://localhost:5000/api/get-password-history/${id}`
      );
      setPasswordHistory(passwordResponse.data.history);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const toggleCardDetails = () => {
    setIsCardDetailsVisible(!isCardDetailsVisible);
  };
  const fetchEmailHistory = () => {
    axios
      .get(`http://localhost:5000/api/get-email-history/${id}`)
      .then((res) => {
        setEmailHistory(res.data.history);
      })
      .catch((error) => {
        console.error("Error fetching email history:", error);
      });
  };

  useEffect(() => {
    fetchEmailHistory();
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUsernameHistory();
  }, [id]);
  

useEffect(() => {
  setCountries(countriesData);
  
  const phoneCodeMap = countriesData.reduce((acc, country) => {
    acc[country.name] = country.phoneCode;
    return acc;
  }, {});
  
  setCountryPhoneCodes(phoneCodeMap);
}, []);


  useEffect(() => {
    if (isEditing) {
      setCardHolderName(user.card_holder_name);
      setCardNumber(user.card_number);
      if (isEditing) {
        const expirationDate = user.expiration_date
          ? new Date(user.expiration_date)
          : null;
        if (expirationDate) {
          setExpirationYear(expirationDate.getFullYear());
          setExpirationMonth(
            String(expirationDate.getMonth() + 1).padStart(2, "0")
          ); // Months are 0-based
        }
      }
      setCvv(user.cvv);
      setBillingAddress(user.billing_address);
      setCardType(user.card_type);
    }
  }, [isEditing, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const dateOfBirth = new Date(user.date_of_birth);
  const formattedDate = dateOfBirth.toUTCString();

  const profileImageSrc = user?.profile_image
    ? `data:${user.profile_image_content_type};base64,${user.profile_image}`
    : null;

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("userId", id); // Ensure id is defined and correct
    additionalImages.forEach((image) => {
      formData.append("additionalImages", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchUserData();
    } catch (error) {
      if (error.response) {
        console.error("Failed to upload image:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleRemoveImages = async (index) => {
    const imageId = images[index].image_id;
    try {
      await axios.delete(`http://localhost:5000/api/delete-image/${imageId}`);
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      fetchUserData();
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
            const response = await axios.put(
              `http://localhost:5000/api/put-images/${imageId}`,
              {
                user_id: id,
                image: imageData,
                image_type: newFile.type,
              }
            );
            setImages((prevImages) => {
              const updatedImages = [...prevImages];
              updatedImages[index] = {
                ...updatedImages[index],
                image: newFile,
              };
              return updatedImages;
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
  const handleDeleteCard = async (creditId) => {
    try {
      await axios.delete(
        `http://localhost:5000/delete-credit-cards/${creditId}`
      );
      fetchUserData(); // Refresh user data after deletion
    } catch (err) {
      console.log("error:", err.response?.data || err.message);
    }
  };

  const togglePasswordVisibility = (platform) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [platform]: !prevState[platform],
    }));
  };

  const toggleEmailVisibility = (platform) => {
    setEmailVisibility((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleAddNewPassword = (platform, social_id) => {
    setNewPasswordVisible((prevState) => ({
      ...prevState,
      [platform]: social_id,
    }));
  };
  const handleAddNewUsername = (platform, social_id) => {
    setNewUsernameVisible((prevState) => ({
      ...prevState,
      [platform]: social_id,
    }));
  };
  const handleAddNewEmail = (platform, social_id) => {
    setNewEmailVisible((prev) => ({
      ...prev,
      [platform]: social_id,
    }));
  };
  const handleAddBackupCode = (platform, social_id) => {
    setNewBackupCodeVisible((prev) => ({
      ...prev,
      [platform]: social_id,
    }));
  };
  const handleEditNewBackupCode = (platform, codeId) => {
    console.log("Editing backup code with ID:", codeId);

    // Set the visibility for the specific backup code being edited
    setNewEditBackupCodeVisible((prevState) => ({
      ...prevState,
      [platform]: codeId, // Store the specific backup code ID for the platform
    }));
  };

  const handleHideNewPassword = (platform) => {
    setNewPasswordVisible((prevState) => ({
      ...prevState,
      [platform]: false,
    }));
  };

  const handleNewPasswordChange = (platform, event) => {
    setNewPassword((prevState) => ({
      ...prevState,
      [platform]: event.target.value,
    }));
  };
  const handleNewEmailChange = (platform, e) => {
    setNewEmail((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));
  };
  const handleNewBackupCodeChange = (platform, e) => {
    setNewBackupCode((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));
  };
  const handleNewEditBackupCodeChange = (platform, e) => {
    setNewEditBackupCode((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));
  };

  const handleNewUsernameChange = (platform, e) => {
    setNewUsername((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));
  };

  const fetchUsernameHistory = () => {
    axios
      .get(`http://localhost:5000/api/get-username-history/${id}`)
      .then((res) => {
        setUsernameHistory(res.data.history);
      })
      .catch((error) => {
        console.error("Error fetching username history:", error);
      });
  };
  
  const handleSubmitNewPassword = (platform, social_id) => {
    console.log("platform", platform);
    console.log("social_id", social_id);
    const userID = id;
    axios
      .put("http://localhost:5000/api/update-social-media-password", {
        user_id: userID,
        id: social_id,
        platform: platform.toLowerCase(),
        new_password: newPassword[platform],
      })
      .then((response) => {
        setSocialMediaData((prevData) => ({
          ...prevData,
          [`${platform.toLowerCase()}_password`]: newPassword[platform],
        }));

        // Update password history
        axios
          .get(`http://localhost:5000/api/get-password-history/${id}`)
          .then((res) => {
            setPasswordHistory(res.data.history);
          })
          .catch((error) => {
            console.error("Error fetching updated password history:", error);
          });

        handleHideNewPassword(platform);

        fetchUserData();
        setNewPassword((prev) => ({
          ...prev,
          [platform]: "", // Clear the input field
        }));
      })
      .catch((error) => {
        console.error("Error updating password:", error);
      });
  };

  const handleSubmitNewEmail = (platform, social_id) => {
    const userID = id;
    console.log("platform", platform);
    console.log("social_id", social_id);
    axios
      .put("http://localhost:5000/api/update-social-media-email", {
        user_id: userID,
        id: social_id,
        platform: platform.toLowerCase(),
        new_email: newEmail[platform],
      })
      .then((response) => {
        setSocialMediaData((prevData) => ({
          ...prevData,
          [`${platform.toLowerCase()}_email`]: newEmail[platform],
        }));

        // Update email history
        fetchEmailHistory(); // Refresh email history after update

        handleHideNewEmail(platform);
        fetchUserData();
        setNewEmail((prev) => ({
          ...prev,
          [platform]: "", // Clear the input field
        }));
      })
      .catch((error) => {
        console.error("Error updating email:", error);
      });
  };
  const handleSubmitNewBackupCode = (platform, social_id) => {
    const userID = id;
    axios
      .put("http://localhost:5000/api/update-social-media-backupcode", {
        user_id: userID,
        platform: platform.toLowerCase(),
        id: social_id,
        new_email: newBackupCode[platform],
      })
      .then((response) => {
        setSocialMediaData((prevData) => ({
          ...prevData,
          [`${platform.toLowerCase()}_backupcode`]: newBackupCode[platform],
        }));

        // Update email history
        fetchEmailHistory(); // Refresh email history after update

        handleHideNewBackupCode(platform);
        fetchUserData();
        setNewBackupCode((prev) => ({
          ...prev,
          [platform]: "", // Clear the input field
        }));
      })
      .catch((error) => {
        console.error("Error updating email:", error);
      });
  };
  const handleEditBackupCode = (platform, backupcode_id, social_id) => {
    const userID = id;
    console.log(
      userID,
      backupcode_id,
      platform,
      social_id,
      newEditBackupCode[platform]
    );
    axios
      .put("http://localhost:5000/api/update-backupcode", {
        user_id: userID,
        platform: platform.toLowerCase(),
        id: social_id,
        backupcode_id: backupcode_id,
        new_email: newEditBackupCode[platform],
      })
      .then((response) => {
        setSocialMediaData((prevData) => ({
          ...prevData,
          [`${platform.toLowerCase()}_backupcode`]: newBackupCode[platform],
        }));

        // Update email history
        fetchEmailHistory(); // Refresh email history after update

        handleHideNewEditBackupCode(platform);
        fetchUserData();
        setNewEditBackupCode((prev) => ({
          ...prev,
          [platform]: "", // Clear the input field
        }));
      })
      .catch((error) => {
        console.error("Error updating backup code:", error);
      });
  };
  const handleDeleteBackupCode = (backupcode_id) => {
    axios
      .delete(`http://localhost:5000/api/delete-backupcode/${backupcode_id}`)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Backup code deleted successfully.",
          duration: 3, // Optional: Adjust the display duration
        });
        fetchUserData(); // Refresh the user data after deletion
      })
      .catch((error) => {
        console.error("Error deleting backup code:", error);
      });
  };

  const handleDeletePlatform = (socialId) => {
    axios
      .delete(`http://localhost:5000/api/delete-social-media/${socialId}`)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Social media record deleted successfully.",
          duration: 3,
        });
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error deleting social media record:", error);
      });
  };
  
  
  const handleSubmitNewUsername = (platform, social_id) => {
    const userID = id;
    axios
      .put("http://localhost:5000/api/update-social-media-username", {
        user_id: userID,
        id: social_id,
        platform: platform.toLowerCase(),
        new_username: newUsername[platform],
      })
      .then((response) => {
        // Refresh the main user data and username history so that the table updates automatically
        fetchUserData();
        fetchUsernameHistory();  // <-- This line updates the Gmail/Hotmail History table
        handleHideNewUsername(platform);
        setNewUsername((prev) => ({ ...prev, [platform]: "" }));
      })
      .catch((error) => {
        console.error("Error updating username:", error);
      });
  };
  
  
  const handleSubmitCreditCard = (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    const formattedExpirationDate = `${expirationYear}-${expirationMonth}-01`;
    setError("");
    setSuccess("");

    const data = {
      card_holder_name: cardHolderName,
      card_number: cardNumber,
      expiration_date: formattedExpirationDate,
      cvv: cvv,
      billing_address: billingAddress,
      user_id: id,
      card_type: cardType === "Other" ? cardTypeOther : cardType,
    };

    try {
      axios
        .post("http://localhost:5000/post-credit-cards", data)
        .then((response) => {
          setSuccess("Card details submitted successfully!");
          fetchUserData();
          setIsAddingCard(false);
        });
    } catch (error) {
      console.error("Error submitting card details:", error);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCreditCard = (c_id) => {
    // Construct the expiration date string in 'YYYY-MM-DD' format
    const formattedExpirationDate = `${expirationYear}-${expirationMonth}-01`;

    const creditCardData = {
      card_holder_name: cardHolderName,
      card_number: cardNumber,
      expiration_date: formattedExpirationDate, // Use the formatted expiration date
      cvv: cvv,
      billing_address: billingAddress,
      card_type: cardType === "Other" ? cardTypeOther : cardType,
      user_id: id, // Ensure this is available in your component
    };
    console.log("card data", creditCardData);

    axios
      .put(`http://localhost:5000/put-credit-cards/${c_id}`, creditCardData)
      .then((response) => {
        setIsEditing(false); // Exit editing mode

        // Fetch user data after successful update
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error updating card:", error);
        // Handle errors appropriately, e.g., show a message to the user
      });
  };

  const handleHideNewEmail = (platform) => {
    setNewEmailVisible((prev) => ({
      ...prev,
      [platform]: false,
    }));
  };
  const handleHideNewBackupCode = (platform) => {
    setNewBackupCodeVisible((prev) => ({
      ...prev,
      [platform]: false,
    }));
  };
  const handleHideNewEditBackupCode = (platform) => {
    setNewEditBackupCodeVisible((prev) => ({
      ...prev,
      [platform]: false,
    }));
  };
  const handleHideNewUsername = (platform) => {
    setNewUsernameVisible((prev) => ({
      ...prev,
      [platform]: false,
    }));
  };

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setFieldValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFieldValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
  };

  const handleSave = (field) => {
    const value =
      field === "phonenumber"
        ? parseInt(fieldValues[field], 10)
        : fieldValues[field];

    axios
      .put("http://localhost:5000/api/update-user-field", {
        user_id: id,
        field: field,
        value: value,
      })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          [field]: value,
        }));
        setEditingField(null);
      })
      .catch((error) => {
        console.error(
          "Error updating field:",
          error.response ? error.response.data : error.message
        );
      });
  };
  const togglePasswordOldVisibility = (key) => {
    setVisiblePasswordIndexes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  const handleEditProfile = () => {
    setProfileFieldValues({
      username: user?.username || "",
      nationality: user?.nationality || "",
      date_of_birth: user?.date_of_birth || "",
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileFieldValues({
      username: user?.username || "",
      nationality: user?.nationality || "",
    });
  };

  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileFieldValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const formatNumber = (num) => {
    if (num) {
      const numStr = num.toString();
      // Create an array to hold the split parts
      const parts = [];

      // Loop through the string and slice it into 4-digit chunks
      for (let i = 0; i < numStr.length; i += 4) {
        parts.push(numStr.slice(i, i + 4));
      }

      // Join the parts with a space and return
      return parts.join(" ");
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
    }
  };
  const handleSaveProfile = () => {
    axios
      .put("http://localhost:5000/api/update-user-field", {
        user_id: id,
        field: "username",
        value: profileFieldValues.username,
      })
      .then(() => {
        return axios.put("http://localhost:5000/api/update-user-field", {
          user_id: id,
          field: "nationality",
          value: selectedNationality,
        });
      })
      .then(() => {
        return axios.put("http://localhost:5000/api/update-user-field", {
          user_id: id,
          field: "date_of_birth",
          value: profileFieldValues.date_of_birth,
        });
      })
      .then(() => {
        if (newProfileImage) {
          const formData = new FormData();
          formData.append("profile_image", newProfileImage);
          formData.append("user_id", id);

          return axios.put(
            "http://localhost:5000/api/update-profile-image",
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
        // Update the user state with the new image URL
        setUser((prevUser) => ({
          ...prevUser,
          profile_image: response.data.updatedProfileImage,
          profile_image_content_type:
            response.data.updatedProfileImageContentType,
        }));
        setIsEditingProfile(false);

        // Call fetchUserData after successful profile update
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const emailColumns = [
    {
      title: "Account ID#",
      dataIndex: "account_id",
      key: "account_id",
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "Old Email",
      dataIndex: "old_email",
      key: "old_email",
      width: 200,
    },
    {
      title: "Changed At",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) =>
        new Date(text).toLocaleString("en-US", { hour12: true }),
    },
  ];

  const usernameHistoryColumns = [
    {
      title: "Account ID#",
      dataIndex: "account_id",
      key: "account_id",
    },
    {
      title: "Old Username",
      dataIndex: "old_username",
      key: "old_username",
    },
    {
      title: "Changed At",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) =>
        new Date(text).toLocaleString("en-US", { hour12: true }),
    },
  ];
  

  const formatDateCard = (inputDate) => {
    const parts = inputDate.split("-"); // Split the date into parts (YYYY-MM-DD)

    // Check if the date has exactly three parts
    if (parts.length !== 3) {
      throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
    }

    const [year, month] = parts; // Get year and month

    // Convert month to a number and adjust for one-indexing
    const adjustedMonth = parseInt(month, 10) + 1; // Convert month string to a number
    const yearShort = year.slice(-2); // Get last 2 digits of the year

    // Format the month and return with spaces around the "/"
    if (adjustedMonth >= 10) {
      return `${adjustedMonth} / ${yearShort}`;
    } else {
      return `0${adjustedMonth} / ${yearShort}`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} `;
  };
  const groupedData = passwordHistory.reduce((acc, entry) => {
    const platform = entry.platform;

    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(entry);

    return acc;
  }, {});

  const tableData = [];
  Object.entries(groupedData).forEach(([platform, entries]) => {
    // Add a group header
    tableData.push({ key: platform, platform, isGroup: true });

    // Sort entries by changed_at date (newest first)
    entries
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
      .forEach((entry) => {
        tableData.push({
          key: entry.key || entry.platform + entry.changed_at, // Unique key for each entry
          changed_at: entry.changed_at,
          platform: entry.platform,
          old_password: entry.old_password,
        });
      });
  });

  const columns = [
    {
      title: "Account ID#",
      dataIndex: "account_id",
      key: "account_id",
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (text, record) =>
        record.isGroup ? <strong>{text}</strong> : <span>{text}</span>,
    },
    {
      title: "Old Password",
      dataIndex: "old_password",
      key: "old_password",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>
            {visiblePasswordIndexes[record.key]
              ? text
              : "*".repeat(text.length)}
          </span>
          <Button
            type="link"
            icon={
              visiblePasswordIndexes[record.key] ? (
                <EyeInvisibleOutlined />
              ) : (
                <EyeOutlined />
              )
            }
            onClick={() => togglePasswordOldVisibility(record.key)}
            style={{ marginLeft: "8px" }}
          />
        </div>
      ),
    },
    {
      title: "Date Changed",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) => (
        <span>{new Date(text).toLocaleString("en-US", { hour12: true })}</span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          marginLeft: 300,
          padding: "20px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#333",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="fade-in" style={{ width: "80%", maxWidth: "1200px" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Personal Info
          </Title>
          {isEditingProfile ? (
            ""
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
                marginTop: "20px",
                marginLeft: "270px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                paddingTop: 50,
              }}
            >
              {" "}
              {user.total_invoices >= 1000 ? (
                <span
                  style={{
                    height: "70px",
                    fontSize: "16px",
                    textAlign: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(46, 49, 146, 255)",
                    paddingTop: 10,
                    paddingBottom: 35,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 10,
                    color: "white",
                    marginTop: 350,
                  }}
                >
                  Total Payment Amount: <br />
                  <p align="center">
                    {isVisible
                      ? user.total_invoices
                        ? `$${user.total_invoices}`
                        : "$0"
                      : "*****"}

                    <Button
                      icon={
                        isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                      }
                      onClick={handleVisible}
                      style={{
                        zIndex: 1,
                        backgroundColor: "rgba(46, 49, 146, 255)",
                        borderColor: "rgba(46, 49, 146, 255)",
                        color: "white",
                      }}
                    />
                  </p>
                </span>
              ) : (
                ""
              )}
            </div>
          )}

          <Card
            className="transparent-card"
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
              ) : user.gender === "male" ? (
                <img
                  alt="Default Male"
                  src={maleImage}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : user.gender === "female" ? (
                <img
                  alt="Default Female"
                  src={femaleImage}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : user.gender === "other" ? (
                <img
                  alt="Default Other"
                  src={other}
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
            style={{
              textAlign: "left",
              marginBottom: "20px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Meta
              title={
                isEditingProfile ? (
                  <>
                    <Input
                      name="username"
                      value={profileFieldValues.username}
                      onChange={handleProfileFieldChange}
                      style={{ marginBottom: "8px" }}
                    />
                  </>
                ) : (
                  <>
                    {user.username + " "}
                    {user.image_count > 0 && (
                      <img
                        src={verification} // Path to your badge image
                        alt="Verified Badge"
                        style={{
                          width: "29px", // Adjust the width as needed
                          height: "29px", // Adjust the height as needed
                          marginLeft: "2px", // Spacing from the text
                        }}
                      />
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
                        handleProfileFieldChange(e);
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
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={
                        profileFieldValues.date_of_birth
                          ? new Date(
                              profileFieldValues.date_of_birth
                            ).toLocaleDateString("en-CA") // 'en-CA' gives 'YYYY-MM-DD' format
                          : ""
                      }
                      onChange={handleProfileFieldChange}
                      style={{ marginBottom: "8px" }}
                    />
                  </>
                ) : (
                  <>
                    Country: {user.nationality} | Date Of Birth:
                    {formatDate(user.date_of_birth)}
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
            {isEditingProfile ? (
              ""
            ) : user.total_invoices >= 1000 ? (
              <div
                style={{
                  position: "absolute",
                  bottom: "-90px",
                  right: "-90px",
                  width: "200px",
                  height: "200px",
                }}
              >
                <img
                  alt="Icon"
                  src={vipbadge}
                  style={{
                    width: "200px",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </Card>
          <Divider />
          <div style={{ marginBottom: "20px" }}>
            <Title level={3}>User Information</Title>
            {editingField === "business_name" ? (
              <div>
                <Input
                  name="business_name"
                  value={
                    fieldValues.business_name === "undefined"
                      ? ""
                      : fieldValues.business_name
                  }
                  onChange={handleFieldChange}
                  style={{ width: "300px", marginBottom: "8px" }}
                />
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave("business_name")}
                >
                  Submit
                </Button>
                <Button
                  type="link"
                  icon={<MinusOutlined />}
                  onClick={() => setEditingField(null)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </div>
            ) : (
              <Paragraph>
                <strong>Business Name:</strong>{" "}
                {user.business_name === "undefined" || user.business_name === ""
                  ? "No Business Name"
                  : user.business_name}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() =>
                    handleEditClick("business_name", user.business_name)
                  }
                  style={{ marginLeft: "8px" }}
                ></Button>
              </Paragraph>
            )}
            {editingField === "address" ? (
              <div>
                <Input
                  name="address"
                  value={fieldValues.address}
                  onChange={handleFieldChange}
                  style={{ width: "300px", marginBottom: "8px" }}
                />
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave("address")}
                >
                  Submit
                </Button>
                <Button
                  type="link"
                  icon={<MinusOutlined />}
                  onClick={() => setEditingField(null)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </div>
            ) : (
              <Paragraph>
                <strong>Address:</strong> {user.address}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick("address", user.address)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </Paragraph>
            )}

            {editingField === "phonenumber" ? (
              <div>
                <Input
                  name="phonenumber"
                  value={fieldValues.phonenumber}
                  onChange={handleFieldChange}
                  style={{ width: "300px", marginBottom: "8px" }}
                />
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave("phonenumber")}
                >
                  Submit
                </Button>
                <Button
                  type="link"
                  icon={<MinusOutlined />}
                  onClick={() => setEditingField(null)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </div>
            ) : (
              <Paragraph>
                <strong>Phone Number:</strong> +{user.countrycode}
                {user.phonenumber}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() =>
                    handleEditClick("phonenumber", user.phonenumber)
                  }
                  style={{ marginLeft: "8px" }}
                ></Button>
              </Paragraph>
            )}
            {editingField === "gender" ? (
              <div>
                <Select
                  id="gender"
                  placeholder="Select Gender"
                  value={fieldValues.gender}
                  onChange={(value) =>
                    handleFieldChange({ target: { name: "gender", value } })
                  }
                  style={{ width: 100 }}
                >
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave("gender")}
                >
                  Submit
                </Button>
                <Button
                  type="link"
                  icon={<MinusOutlined />}
                  onClick={() => setEditingField(null)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </div>
            ) : (
              <Paragraph>
                <strong>Gender:</strong> {user.gender}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick("gender", user.gender)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </Paragraph>
            )}
            {editingField === "email" ? (
              <div>
                <Input
                  name="email"
                  value={fieldValues.email}
                  onChange={handleFieldChange}
                  style={{ width: "300px", marginBottom: "8px" }}
                />
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave("email")}
                >
                  Submit
                </Button>
                <Button
                  type="link"
                  icon={<MinusOutlined />}
                  onClick={() => setEditingField(null)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </div>
            ) : (
              <Paragraph>
                <strong>Email:</strong> {user.email}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick("email", user.email)}
                  style={{ marginLeft: "8px" }}
                ></Button>
              </Paragraph>
            )}
          </div>

          <Divider />
          <div className="row">
            {/* Social Media Accounts Section */}
            <div className="col-6" style={{ marginBottom: "20px" }}>
              <Title level={3}>
                Social Media Accounts{" "}
                <Button
                  type="link"
                  style={{ marginLeft: "8px" }}
                  icon={<PlusCircleOutlined />}
                  onClick={() => setIsNewPlatformVisible(true)}
                >
                  Add New Platform
                </Button>
                {isNewPlatformVisible ? (
                  <div style={{ marginTop: "8px" }}>
                    <Select
                      id="platform"
                      placeholder="Select Platform"
                      value={newPlatform}
                      onChange={(value) => setNewPlatform(value)}
                      style={{ width: 300, height: 50 }}
                    >
                      <Select.Option value="Gmail">Gmail</Select.Option>
                      <Select.Option value="Hotmail">Hotmail</Select.Option>
                      <Select.Option value="Facebook">Facebook</Select.Option>
                      <Select.Option value="Instagram">Instagram</Select.Option>
                      <Select.Option value="Twitter">Twitter</Select.Option>
                      <Select.Option value="Tiktok">Tiktok</Select.Option>
                      <Select.Option value="Snapchat">Snapchat</Select.Option>
                      <Select.Option value="LinkedIn">LinkedIn</Select.Option>
                    </Select>
                    <br />
                    <Input
                      placeholder="Username"
                      Value={newAddUsername}
                      style={{ marginBottom: "8px", width: "300px" }}
                      onChange={(e) => setNewAddUsername(e.target.value)}
                    />
                    {newPlatform === "Gmail" || newPlatform === "Hotmail" ? (
                      <></>
                    ) : (
                      <Input
                        placeholder="Email"
                        Value={newAddEmail}
                        style={{ marginBottom: "8px", width: "300px" }}
                        onChange={(e) => setNewAddEmail(e.target.value)}
                      />
                    )}

                    <Input
                      placeholder="Password"
                      value={newAddPassword}
                      style={{ marginBottom: "8px", width: "300px" }}
                      onChange={(e) => setNewAddPassword(e.target.value)}
                    />
                    <Input
                      placeholder="Backup Code"
                      value={newBCode}
                      style={{ marginBottom: "8px", width: "300px" }}
                      onChange={(e) => setNewBCode(e.target.value)}
                    />

                    <div>
                      <Button
                        type="link"
                        icon={<CheckOutlined />}
                        onClick={handleSubmitNewPlatform}
                      />
                      <Button
                        type="link"
                        icon={<MinusOutlined />}
                        style={{ marginLeft: "8px" }}
                        onClick={() => setIsNewPlatformVisible(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Title>
              {socialMediaLinks.map(
                (
                  {
                    id,
                    platform,
                    username,
                    url,
                    icon,
                    password,
                    email,
                    backupcode,
                    backupcodes,
                  },
                  index
                ) => {
                  // Only render the platform if username is not null
                  if (socialMediaLinks.length > 0) {
                    if (platform) {
                      return (
                        <div key={index} style={{ marginBottom: "10px" }}>
                          <Button
                            style={{ float: "right", color: "red", fontWeight: "bold" }}
                            type="link"
                            icon={<MinusCircleOutlined />}
                            onClick={() => handleDeletePlatform(id)} // ensure "id" is the primary key of the record
                          >
                            Delete
                          </Button>
                        <Paragraph
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <i
                              className={icon}
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>
                              {platform} ID#: {id}
                            </strong>
                          </Paragraph>
                          <Paragraph
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <strong>{platform} :</strong>

                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginRight: "10px" }}
                            >
                              {username}
                            </a>
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => handleAddNewUsername(platform, id)}
                              style={{ marginLeft: "8px" }}
                            />
                          </Paragraph>

                          {newUsernameVisible[platform] === id && (
                            <div style={{ marginTop: "8px" }}>
                              <Input
                                placeholder="New Username"
                                value={newUsername[platform] || ""}
                                onChange={(e) => handleNewUsernameChange(platform, e)}
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <div>
                                <Button
                                  type="link"
                                  icon={<CheckOutlined />}
                                  onClick={() => handleSubmitNewUsername(platform, id)}
                                />
                                <Button
                                  type="link"
                                  icon={<MinusOutlined />}
                                  onClick={() => handleHideNewUsername(platform)}
                                  style={{ marginLeft: "8px" }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Password Section */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <Paragraph
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <strong>{platform} New Password:&nbsp; </strong>
                              <span>
                                {passwordVisibility[platform]
                                  ? password
                                  : "*".repeat(password?.length || 0)}
                              </span>
                            </Paragraph>
                            <Button
                              type="link"
                              icon={
                                passwordVisibility[platform] ? (
                                  <EyeInvisibleOutlined />
                                ) : (
                                  <EyeOutlined />
                                )
                              }
                              onClick={() => togglePasswordVisibility(platform)}
                              style={{ marginLeft: "8px" }}
                            />
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => handleAddNewPassword(platform, id)}
                              style={{ marginLeft: "8px" }}
                            />
                          </div>

                          {newPasswordVisible[platform] === id && (
                            <div style={{ marginTop: "8px" }}>
                              <Input.Password
                                placeholder="New Password"
                                value={newPassword[platform] || ""}
                                onChange={(e) =>
                                  handleNewPasswordChange(platform, e)
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <div>
                                <Button
                                  type="link"
                                  icon={<CheckOutlined />}
                                  onClick={() =>
                                    handleSubmitNewPassword(platform, id)
                                  }
                                />
                                <Button
                                  type="link"
                                  icon={<MinusOutlined />}
                                  onClick={() =>
                                    handleHideNewPassword(platform)
                                  }
                                  style={{ marginLeft: "8px" }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Email Section */}
                          {platform !== "Gmail" && platform !== "Hotmail" && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                              }}
                            >
                              <Paragraph
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <strong>Email:&nbsp;</strong>
                                <span>{email || "No Email"}</span>
                              </Paragraph>
                              <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => handleAddNewEmail(platform, id)}
                                style={{ marginLeft: "8px" }}
                              />
                            </div>
                          )}

                          {newEmailVisible[platform] === id && (
                            <div style={{ marginTop: "8px" }}>
                              <Input
                                placeholder="New Email"
                                value={newEmail[platform] || ""}
                                onChange={(e) =>
                                  handleNewEmailChange(platform, e)
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <div>
                                <Button
                                  type="link"
                                  icon={<CheckOutlined />}
                                  onClick={() =>
                                    handleSubmitNewEmail(platform, id)
                                  }
                                />
                                <Button
                                  type="link"
                                  icon={<MinusOutlined />}
                                  onClick={() => handleHideNewEmail(platform)}
                                  style={{ marginLeft: "8px" }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Backup Code Section */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <Paragraph style={{ marginBottom: "10px" }}>
                              <strong>Backup Code:&nbsp;</strong>
                              <span>{backupcode}</span>
                              {newBackupCodeVisible[platform] === id && (
                                <div style={{ marginTop: "8px" }}>
                                  <Input
                                    placeholder="New Backup Code"
                                    value={newBackupCode[platform] || ""}
                                    onChange={(e) =>
                                      handleNewBackupCodeChange(platform, e)
                                    }
                                    style={{
                                      marginBottom: "8px",
                                      width: "300px",
                                    }}
                                  />
                                  <div>
                                    <Button
                                      type="link"
                                      icon={<CheckOutlined />}
                                      onClick={() =>
                                        handleSubmitNewBackupCode(platform, id)
                                      }
                                    />
                                    <Button
                                      type="link"
                                      icon={<MinusOutlined />}
                                      onClick={() =>
                                        handleHideNewBackupCode(platform)
                                      }
                                      style={{ marginLeft: "8px" }}
                                    />
                                  </div>
                                </div>
                              )}
                              <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() =>
                                  handleAddBackupCode(platform, id)
                                }
                                style={{ marginLeft: "8px" }}
                              />

                              <Button
                                type="link"
                                icon={<PlusCircleOutlined />}
                                onClick={() =>
                                  toggleBackupCodeVisible(platform, id)
                                }
                              >
                                Add New Backup Code
                              </Button>
                              <br />
                              <br />
                              {Array.isArray(backupcodes) &&
                                backupcodes.length > 0 &&
                                backupcodes.map((code, index) => (
                                  <div key={index}>
                                    <strong>Backup Code:&nbsp;</strong>
                                    <span>
                                      {code.backup_code || "No Backup Code"}
                                    </span>{" "}
                                    <Tooltip title="Edit Backup Code">
                                      <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() =>
                                          handleEditNewBackupCode(
                                            platform,
                                            code.id
                                          )
                                        }
                                        style={{ marginLeft: "8px" }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Delete Backup Code">
                                      <Button
                                        type="link"
                                        icon={<MinusCircleOutlined />}
                                        style={{
                                          color: "red",
                                          fontWeight: "bold",
                                        }}
                                        onClick={() =>
                                          handleDeleteBackupCode(code.id)
                                        }
                                      />
                                    </Tooltip>
                                    {newEditBackupCodeVisible[platform] ===
                                      code.id && (
                                      <div
                                        style={{ marginTop: "8px" }}
                                        key={index}
                                      >
                                        <Input
                                          placeholder="Edit Backup Code"
                                          value={
                                            newEditBackupCode[platform] || ""
                                          }
                                          onChange={(e) =>
                                            handleNewEditBackupCodeChange(
                                              platform,
                                              e
                                            )
                                          }
                                          style={{
                                            marginBottom: "8px",
                                            width: "300px",
                                          }}
                                        />
                                        <div>
                                          <Button
                                            type="link"
                                            icon={<CheckOutlined />}
                                            onClick={() =>
                                              handleEditBackupCode(
                                                platform,
                                                code.id,
                                                id
                                              )
                                            }
                                          />
                                          <Button
                                            type="link"
                                            icon={<MinusOutlined />}
                                            onClick={() =>
                                              handleHideNewEditBackupCode(
                                                platform
                                              )
                                            }
                                            style={{ marginLeft: "8px" }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <br />
                                    <br />
                                  </div>
                                ))}
                            </Paragraph>
                          </div>

                          {backupCodeVisible[platform] === id && (
                            <>
                              {" "}
                              <Input
                                placeholder="New Backup Code"
                                value={newAddBackupCode}
                                onChange={(e) =>
                                  handleAddNewBackupCode(e.target.value)
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <Button
                                type="link"
                                icon={<CheckOutlined />}
                                onClick={() =>
                                  handleSubmitAddNewBackupCode(platform, id)
                                }
                              />
                              <Button
                                type="link"
                                icon={<MinusOutlined />}
                                onClick={() => setBackupCodeVisible(false)}
                              />
                            </>
                          )}

                          <Button
                            type="link"
                            icon={<PlusCircleOutlined />}
                            onClick={() => handleAddAccount(platform, id)}
                            style={{ marginLeft: "8px" }}
                          >
                            Add New Account
                          </Button>

                          {newAccountVisible[platform] === id && (
                            <div style={{ marginTop: "8px" }}>
                              <Input
                                placeholder="Username"
                                onChange={(e) =>
                                  handleNewAccountChange(
                                    platform,
                                    "username",
                                    e.target.value
                                  )
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              {platform !== "Gmail" &&
                                platform !== "Hotmail" && (
                                  <Input
                                    placeholder="Email"
                                    onChange={(e) =>
                                      handleNewAccountChange(
                                        platform,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      marginBottom: "8px",
                                      width: "300px",
                                    }}
                                  />
                                )}
                              <Input.Password
                                placeholder="Password"
                                onChange={(e) =>
                                  handleNewAccountChange(
                                    platform,
                                    "password",
                                    e.target.value
                                  )
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <Input
                                placeholder="Backup Code"
                                onChange={(e) =>
                                  handleNewAccountChange(
                                    platform,
                                    "backupcode",
                                    e.target.value
                                  )
                                }
                                style={{ marginBottom: "8px", width: "300px" }}
                              />
                              <div>
                                <Button
                                  type="link"
                                  icon={<CheckOutlined />}
                                  onClick={() =>
                                    handleSubmitNewAccount(platform)
                                  }
                                />
                                <Button
                                  type="link"
                                  icon={<MinusOutlined />}
                                  onClick={() =>
                                    setNewAccountVisible((prev) => ({
                                      ...prev,
                                      [platform]: false,
                                    }))
                                  }
                                  style={{ marginLeft: "8px" }}
                                />
                              </div>
                            </div>
                          )}
                          <hr />
                        </div>
                      );
                    }
                  } else {
                    return "No Data";
                  }
                }
              )}
            </div>

            {/* Password and Email History Section */}
            <div className="col-6" style={{ marginTop: "20px" }}>
              <div className="col-12">
                <Title level={4}>
                  <span className="d-flex justify-content-center">
                    Password History
                  </span>
                </Title>
                <Input
                  placeholder="Search by platform, password, or account ID"
                  value={searchTextPassword}
                  onChange={(e) => handleSearchPassword(e.target.value)}
                  style={{ marginBottom: "10px", width: "300px" }}
                />
                <Table
                  columns={columns}
                  dataSource={filteredDataPassword.map((entry, index) => ({
                    key: index,
                    changed_at: entry.changed_at,
                    platform: entry.platform,
                    old_password: entry.old_password,
                    account_id: entry.account_id,
                  }))}
                  scroll={{ y: 300 }}
                  pagination={false}
                  style={{ width: "600px", marginBottom: "20px" }}
                />
              </div>

              <div className="col-12">
                <Title level={4}>
                  <span className="d-flex justify-content-center">
                    Social Medias Email History
                  </span>
                </Title>
                <Input
                  placeholder="Search by platform, password, or account ID"
                  value={searchTextEmail}
                  onChange={(e) => handleSearchEmail(e.target.value)}
                  style={{ marginBottom: "10px", width: "300px" }}
                />
                <Table
                  columns={emailColumns}
                  dataSource={filteredDataEmail.map((entry, index) => ({
                    key: index,
                    changed_at: entry.changed_at,
                    platform: entry.platform,
                    old_email: entry.old_email,
                    account_id: entry.account_id,
                  }))}
                  scroll={{ y: 300 }}
                  pagination={false}
                  style={{ width: "600px" }}
                />
              </div>
              <div className="col-12">
              <Title level={4}>
                <span className="d-flex justify-content-center">
                  Gmail & Hotmail History
                </span>
              </Title>
              {/* Optional: Add a search input if needed */}
              <Input
                placeholder="Search by account id or username"
                style={{ marginBottom: "10px", width: "300px" }}
                // You can implement onChange to filter the displayed data if desired
              />
              <Table
                columns={usernameHistoryColumns}
                dataSource={usernameHistory.map((entry, index) => ({
                  key: index,
                  account_id: entry.account_id,
                  old_username: entry.old_username,
                  changed_at: entry.changed_at,
                }))}
                scroll={{ y: 300 }}
                pagination={false}
                style={{ width: "600px" }}
              />
            </div>
            </div>

          </div>

          <Divider />

          {/* ID / Passport Images */}
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
              onClick={() => setShowUpload(!showUpload)} // Toggle upload section visibility
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
                  onClick={handleUpload}
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
          <button
            onClick={toggleCardDetails}
            type="button"
            style={{ background: "transparent", fontSize: 40 }}
          >
            💳
          </button>
          <br />
          <br />
          {user.card_holder_name !== null ? (
            <>
              {isCardDetailsVisible ? (
                isEditing ? (
                  <>
                    <h2 align="center">Card Details</h2>
                    <br />
                    <Button
                      onClick={handleEdit}
                      style={{ backgroundColor: buttonColor, color: "white" }}
                      icon={<ArrowLeftOutlined />}
                    />
                    <div className="form-container-card" align="center">
                      <div className="form-field" align="center">
                        <label htmlFor="card_holder_name">
                          Card Holder Name:
                        </label>
                        <input
                          type="text"
                          id="card_holder_name"
                          name="card_holder_name"
                          value={cardHolderName} // Bind to local state
                          style={{ height: 40 }}
                          onChange={(e) => setCardHolderName(e.target.value)} // Update state on change
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="card_number">Card Number:</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={isCardNumberVisible ? "text" : "password"} // Toggle visibility
                            id="card_number"
                            name="card_number"
                            value={cardNumber} // Bind to local state
                            style={{ height: 40, paddingRight: "30px" }} // Padding for the icon
                            onChange={(e) => setCardNumber(e.target.value)} // Update state on change
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCardNumberVisible(!isCardNumberVisible)
                            } // Toggle visibility
                            style={{
                              position: "absolute",
                              left: "213px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <EyeTwoTone />
                          </button>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="expiration_date">
                            Expiration Date:
                          </label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <select
                              id="expiration_year"
                              value={expirationYear}
                              onChange={(e) =>
                                setExpirationYear(e.target.value)
                              }
                              style={{ width: 85 }}
                            >
                              <option value="">YY</option>
                              {/* Adjust the range of years as necessary */}
                              {Array.from({ length: 20 }, (_, i) => (
                                <option
                                  key={i}
                                  value={new Date().getFullYear() + i}
                                >
                                  {new Date().getFullYear() + i}
                                </option>
                              ))}
                            </select>
                            <select
                              id="expiration_month"
                              value={expirationMonth}
                              onChange={(e) =>
                                setExpirationMonth(e.target.value)
                              }
                              style={{ width: 70 }}
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option
                                  key={i}
                                  value={String(i + 1).padStart(2, "0")}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-field">
                          <label htmlFor="cvv">CVV:</label>
                          <div style={{ position: "relative" }}>
                            <input
                              type={isCvvVisible ? "text" : "password"} // Toggle visibility
                              id="cvv"
                              name="cvv"
                              value={cvv} // Bind to local state
                              style={{ width: 90, height: 40 }}
                              onChange={(e) => setCvv(e.target.value)} // Update state on change
                            />
                            <button
                              type="button"
                              onClick={() => setCvvVisible(!isCvvVisible)} // Toggle visibility
                              style={{
                                position: "absolute",
                                left: "42px",
                                top: "45%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <EyeTwoTone />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="form-field">
                        <label htmlFor="billing_address">
                          Billing Address:
                        </label>
                        <input
                          type="text"
                          id="billing_address"
                          name="billing_address"
                          value={billingAddress}
                          style={{ height: 40 }}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="card_type">Card Type:</label>
                        <select
                          id="card_type"
                          name="card_type"
                          value={cardType}
                          onChange={(e) => setCardType(e.target.value)}
                          style={{
                            height: 40,
                            background: "rgba(255, 255, 255, 0.2)",
                            border: "white",
                          }}
                        >
                          <option value="">Select a card type</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Master Card">Master Card</option>
                          <option value="Wish Card">Wish Card</option>
                          <option value="OMT Card">OMT Card</option>
                          <option value="American Express">
                            American Express
                          </option>
                          <option value="Visa Card">Visa Card</option>
                          <option value="Other">Other</option>
                        </select>
                        {cardType === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={cardTypeOther} // Bind to local state
                            onChange={(e) => setCardTypeOther(e.target.value)} // Update state on change
                            style={{
                              marginTop: 10,
                              height: 40,
                              width: "100%",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <br />
                    <div className="form-group row">
                      <div className="col-sm-12 text-center">
                        <Button
                          type="primary"
                          onClick={() => handleEditCreditCard(cardId)}
                          style={{ backgroundColor: "blue" }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (Array.isArray(creditCards) && creditCards.length === 0) ||
                  isAddingCard === true ? (
                  <>
                    <h2 align="center">Card Details</h2>
                    <br />

                    <div className="form-container-card" align="center">
                      <div className="form-field" align="center">
                        <label htmlFor="card_holder_name">
                          Card Holder Name:
                        </label>
                        <input
                          type="text"
                          id="card_holder_name"
                          name="card_holder_name"
                          value={cardHolderName}
                          style={{ height: 40 }}
                          onChange={(e) => setCardHolderName(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="card_number">Card Number:</label>
                        <Form.Item name="card_number">
                          <Input.Password
                            id="card_number"
                            name="card_number"
                            value={cardNumber}
                            style={{ height: 40 }}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="expiration_date">
                            Expiration Date:
                          </label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <select
                              id="expiration_year"
                              value={expirationYear}
                              onChange={(e) =>
                                setExpirationYear(e.target.value)
                              }
                              style={{ width: 80 }}
                            >
                              <option value="">YY</option>
                              {/* Adjust the range of years as necessary */}
                              {Array.from({ length: 20 }, (_, i) => (
                                <option
                                  key={i}
                                  value={new Date().getFullYear() + i}
                                >
                                  {new Date().getFullYear() + i}
                                </option>
                              ))}
                            </select>
                            <select
                              id="expiration_month"
                              value={expirationMonth}
                              onChange={(e) =>
                                setExpirationMonth(e.target.value)
                              }
                              style={{ width: 70, padding: 10 }}
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option
                                  key={i}
                                  value={String(i + 1).padStart(2, "0")}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-field">
                          <label htmlFor="cvv">CVV:</label>
                          <Form.Item name="cvv">
                            <Input.Password
                              id="cvv"
                              name="cvv"
                              value={cvv}
                              style={{ width: 60, height: 40 }}
                              onChange={(e) => setCvv(e.target.value)}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="form-field">
                        <label htmlFor="billing_address">
                          Billing Address:
                        </label>
                        <input
                          type="text"
                          id="billing_address"
                          name="billing_address"
                          value={billingAddress}
                          style={{ height: 40 }}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="card_type">Card Type:</label>
                        <select
                          id="card_type"
                          name="card_type"
                          value={cardType}
                          onChange={handleCardTypeChange}
                          style={{
                            height: 40,
                            background: "rgba(255, 255, 255, 0.2)",
                            border: "white",
                          }}
                        >
                          <option value="">Select a card type</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Master Card">Master Card</option>
                          <option value="Wish Card">Wish Card</option>
                          <option value="OMT Card">OMT Card</option>
                          <option value="American Express">
                            American Express
                          </option>
                          <option value="Visa Card">Visa Card</option>
                          <option value="Other">Other</option>
                        </select>

                        {cardType === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={cardTypeOther}
                            onChange={(e) => setCardTypeOther(e.target.value)}
                            style={{ marginTop: 10, height: 40, width: "100%" }}
                          />
                        )}
                      </div>
                    </div>
                    <br />
                    <div className="form-group row">
                      <div className="col-sm-12 text-center">
                        <Button
                          type="primary"
                          onClick={handleSubmitCreditCard}
                          style={{ backgroundColor: buttonColor }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {creditCards.map((u) => (
                      <>
                        <div
                          key={u.id}
                          className={`credit-card-container ${
                            flippedCards[u.card_id] ? "flipped" : ""
                          }`}
                        >
                          <div className="credit-card-inner">
                            {flippedCards[u.card_id] ? (
                              <div className="credit-card-back">
                                <div className="credit-card-content">
                                  <div className="credit-card-ink"> </div>
                                  <div className="credit-card-black-stripe">
                                    <div
                                      className="credit-card-ccv"
                                      align="right"
                                    ></div>
                                  </div>
                                  <div className="credit-card-white-stripe">
                                    <div
                                      className="credit-card-ccv"
                                      align="right"
                                    >
                                      {u.cvv}
                                    </div>
                                    <div className="credit-card-white-stripe-top"></div>
                                  </div>
                                  <div className="credit-card-text">
                                    AUTHORIZED <br /> SIGNATURE <br /> NOT VALID{" "}
                                    <br /> UNLESS SIGNED
                                  </div>
                                  <div className="credit-card-back-img-align">
                                    <img
                                      src={eagle}
                                      className="credit-card-back-img"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                style={styles.mainContainer}
                                className="credit-card-main-container"
                              >
                                <div
                                  style={styles.container}
                                  className="credit-card-front"
                                >
                                  <div className="credit-card-content">
                                    {" "}
                                    {/* Added class for content */}
                                    <div style={styles.header}>
                                      <div style={styles.header1}>
                                        <strong>
                                          {u.card_type.toUpperCase()}
                                        </strong>
                                      </div>
                                      <div style={styles.header2}>
                                        <img
                                          src={logo}
                                          alt="Card Logo"
                                          style={{ width: 90, height: 55 }}
                                        />
                                      </div>
                                    </div>
                                    <div style={styles.body}>
                                      <div style={styles.body1}>
                                        <img
                                          src={chip}
                                          alt="Card Chip"
                                          style={{ height: 30, width: 40 }}
                                        />
                                      </div>
                                      <div style={styles.body2} align="center">
                                        <Typography
                                          className="credit-card-number"
                                          style={{
                                            fontWeight: 300,
                                            wordSpacing: "1rem",
                                            letterSpacing: "1.5px",
                                            color: "white",
                                            textShadow: `
                                                                            -1px -1px 0 rgba(0, 0, 0, 0.5),
                                                                            -2px -2px 0 rgba(0, 0, 0, 0.4),
                                                                            3px 3px 0 rgba(0, 0, 0, 0.3),
                                                                            -4px -4px 0 rgba(0, 0, 0, 0.2)
                                                                        `,
                                          }}
                                        >
                                          {formatNumber(u.card_number)}
                                        </Typography>
                                      </div>
                                      <div style={styles.body3}>
                                        <strong>
                                          EXP: {"  "}
                                          {formatDateCard(u.expiration_date)}
                                        </strong>
                                      </div>
                                    </div>
                                    <div style={styles.footer}>
                                      <Typography
                                        style={{
                                          color: "rgb(218,165,32)",
                                          fontSize: 19,
                                          fontFamily: "Courier",
                                          paddingTop: "20px",
                                        }}
                                      >
                                        <strong>
                                          {u.card_holder_name.toUpperCase()}
                                        </strong>
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <Tooltip title="Edit">
                          <Button
                            onClick={() => handleEdit(u.card_id)}
                            icon={<EditOutlined />}
                            style={{
                              backgroundColor: buttonColor,
                              color: "white",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteCard(u.card_id)}
                            style={{
                              backgroundColor: buttonColor,
                              color: "white",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Add New Credit Card">
                          <Button
                            icon={<PlusOutlined />}
                            onClick={addCard}
                            style={{
                              backgroundColor: buttonColor,
                              color: "white",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Flip Card">
                          <Button
                            onClick={() => handleFlip(u.card_id)}
                            className={`icon-wrapper ${
                              flipped ? "flipped" : ""
                            }`}
                            icon={
                              flipped ? (
                                <ArrowLeftOutlined />
                              ) : (
                                <ArrowRightOutlined />
                              )
                            }
                            style={{
                              backgroundColor: buttonColor,
                              color: "white",
                            }}
                          />
                        </Tooltip>
                      </>
                    ))}
                  </>
                )
              ) : null}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Sm_View_User;
