import React, { useState, useEffect } from "react";
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
  Tooltip,
  Space,
  Badge,
  Tag,
  Modal,
  Spin,
  Descriptions,
  Tabs,
  Empty,
  Avatar,
  Statistic,
  Alert,
  Popover,
  Drawer,
  Switch,
  Steps,
  Result,
} from "antd";
import countriesData from "./countries.json";
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
  UserOutlined,
  GlobalOutlined,
  CalendarOutlined,
  WalletOutlined,
  SafetyOutlined,
  IdcardOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  MailOutlined,
  KeyOutlined,
  LockOutlined,
  CloseOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  LinkOutlined,
  CrownOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faYoutube,
  faXTwitter,
  faSnapchat,
  faLinkedin,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./app.css";
import verification from "./verification.png";
import "./BankCard.css";
import maleImage from "./male.jpg";
import other from "./other.jpg";
import femaleImage from "./female.jpg";
import logo from "./logo.png";
import chip from "./chip.png";
import eagle from "./eagle.png";
import vipbadge from "./vipbadge.png";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const Sm_View_User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [images, setImages] = useState([]);
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
  const [expirationYear, setExpirationYear] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [emailHistory, setEmailHistory] = useState([]);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [usernameHistory, setUsernameHistory] = useState([]);
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
  const [visiblePasswordIndexes, setVisiblePasswordIndexes] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileFieldValues, setProfileFieldValues] = useState({});
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editPlatformData, setEditPlatformData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  // Modal states
  const [addPlatformModalVisible, setAddPlatformModalVisible] = useState(false);
  const [addAccountModalVisible, setAddAccountModalVisible] = useState(false);
  const [selectedPlatformForAccount, setSelectedPlatformForAccount] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // === CREATIVE THEME ===
  const accentColor = "#6c5ce7";
  const accentColorLight = "#a29bfe";
  const bgColor = "#0a0a12"; // Darker background like users page
  const cardBg = "rgba(18, 18, 36, 0.8)";
  const textColor = "#f0f2f5";
  const borderColor = "rgba(255, 255, 255, 0.06)";
  const inputBg = "#121224";
  const modalBg = "#121224";
  const glowGreen = "#00d2d3";
  const glowPink = "#fd79a8";

  const platformIcons = {
    Gmail: <FontAwesomeIcon icon={faGoogle} style={{ color: "#ea4335" }} />,
    Hotmail: <FontAwesomeIcon icon={faMicrosoft} style={{ color: "#00a4ef" }} />,
    Facebook: <FontAwesomeIcon icon={faFacebook} style={{ color: "#1877f2" }} />,
    Instagram: <FontAwesomeIcon icon={faInstagram} style={{ color: "#e4405f" }} />,
    Twitter: <FontAwesomeIcon icon={faXTwitter} style={{ color: "#000000" }} />,
    Tiktok: <FontAwesomeIcon icon={faTiktok} style={{ color: "#000000" }} />,
    Snapchat: <FontAwesomeIcon icon={faSnapchat} style={{ color: "#fffc00" }} />,
    LinkedIn: <FontAwesomeIcon icon={faLinkedin} style={{ color: "#0a66c2" }} />,
  };

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
      setAddAccountModalVisible(false);
      setSelectedPlatformForAccount(null);
      setCurrentStep(0);
      fetchUserData();
      event?.preventDefault();
    } catch (error) {
      console.error(`Error adding new ${platform} account:`, error.response?.data || error.message);
      notification.error({
        message: "Error",
        description: `Failed to add ${platform} account.`,
      });
    }
  };

  const handleSubmitNewPlatform = async () => {
    if (newPlatform !== "Select Platform") {
      try {
        await axios.post(`http://localhost:5000/api/add-social-media-account`, {
          user_id: id,
          platform: newPlatform.toLowerCase(),
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
        setAddPlatformModalVisible(false);
        setCurrentStep(0);
      } catch (error) {
        console.error(`Error adding new account:`, error.response?.data || error.message);
        notification.error({
          message: "Error",
          description: `Failed to add ${newPlatform} account.`,
        });
      }
    } else {
      notification.error({
        message: "Error",
        description: `Select a Platform.`,
      });
    }
  };

  const handleSubmitAddNewBackupCode = async (platform, social_id) => {
    platform = platform.toLowerCase();
    try {
      await axios.post(`http://localhost:5000/api/add-backup-code`, {
        id: social_id,
        platform: platform,
        backupcode: newAddBackupCode,
      });
      notification.success({
        message: "Success",
        description: `Backup code added successfully.`,
      });
      fetchUserData();
      setBackupCodeVisible((prev) => ({ ...prev, [platform]: false }));
      setNewAddBackupCode("");
    } catch (error) {
      console.error(`Error adding backup code:`, error.response?.data || error.message);
      notification.error({
        message: "Error",
        description: `Failed to add backup code.`,
      });
    }
  };

  const handleVisible = () => {
    setIsVisible(!isVisible);
  };

  const handleAddAccount = (platform, social_id) => {
    setSelectedPlatformForAccount(platform);
    setAddAccountModalVisible(true);
  };

  const handleNewAccountChange = (platform, field, value) => {
    setNewAccountData((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const addCard = () => {
    setIsAddingCard(!isAddingCard);
  };

  const handleEdit = (creditCardId) => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      axios
        .get(`http://localhost:5000/getid-credit-cards/${creditCardId}`)
        .then((response) => {
          setCardId(response.data.id);
          setCardHolderName(response.data.card_holder_name);
          setCardNumber(response.data.card_number);
          setExpirationYear(new Date(response.data.expiration_date).getFullYear());
          setExpirationMonth(String(new Date(response.data.expiration_date).getMonth() + 1).padStart(2, "0"));
          setCvv(response.data.cvv);
          setBillingAddress(response.data.billing_address);
          setCardType(response.data.card_type);
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
    if (value !== "Other") {
      setCardTypeOther("");
    }
  };

  const handleFlip = (cardId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
    setFlipped(!flipped);
  };

  const fetchEmailHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/get-email-history/${id}`);
      setEmailHistory(res.data.history || []);
    } catch (error) {
      console.error("Error fetching email history:", error);
      setEmailHistory([]);
    }
  };

  const fetchUsernameHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/get-username-history/${id}`);
      setUsernameHistory(res.data.history || []);
    } catch (error) {
      console.error("Error fetching username history:", error);
      setUsernameHistory([]);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/user-view/${id}`);
      
      console.log("User data response:", response.data);
      
      const userData = response.data.user;
      setUser(userData);
      setImages(response.data.images || []);
      setCreditCards(response.data.credit_cards || []);

      const socialMediaData = userData?.social_media?.[0] || {};
      const socialMediaArray = [];

      Object.keys(socialMediaData).forEach((platform) => {
        const platformData = socialMediaData[platform];
        if (platformData?.platformInfo) {
          platformData.platformInfo.forEach((account) => {
            const isEmailPlatform = platform === "gmail" || platform === "hotmail";
            
            socialMediaArray.push({
              id: account.id,
              platform: platform.charAt(0).toUpperCase() + platform.slice(1),
              username: account.username || (isEmailPlatform ? account.email : platform),
              url: isEmailPlatform
                ? `mailto:${account.email}`
                : `https://www.${platform}.com/${account.username}`,
              icon: platform === "gmail" ? "fab fa-google" :
                    platform === "hotmail" ? "fa fa-inbox" : `fab fa-${platform}`,
              password: account.password,
              email: account.email || account.username || "N/A",
              backupcode: account.backupcode || null,
              backupcodes: account.backupcodes || [],
            });
          });
        }
      });

      socialMediaArray.sort((a, b) => a.platform?.localeCompare(b.platform) || 0);
      setSocialMediaLinks(socialMediaArray);

      const passwordResponse = await axios.get(`http://localhost:5000/api/get-password-history/${id}`);
      setPasswordHistory(passwordResponse.data.history || []);
      await fetchEmailHistory();
      await fetchUsernameHistory();

    } catch (error) {
      console.error("Error fetching user details:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch user details.");
      notification.error({ message: "Error", description: "Failed to fetch user details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    setCountries(countriesData);
    const phoneCodeMap = countriesData.reduce((acc, country) => {
      acc[country.name] = country.phoneCode;
      return acc;
    }, {});
    setCountryPhoneCodes(phoneCodeMap);
  }, []);

  const togglePasswordVisibility = (platform) => {
    setPasswordVisibility((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const togglePasswordOldVisibility = (key) => {
    setVisiblePasswordIndexes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openEditDrawer = (platformData, field) => {
    setEditPlatformData(platformData);
    setEditField(field);
    const fieldValue = field === 'username' ? platformData.username : 
                      field === 'password' ? platformData.password :
                      field === 'email' ? platformData.email : '';
    setEditValue(fieldValue || '');
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerVisible(false);
    setEditPlatformData(null);
    setEditField(null);
    setEditValue('');
  };

  const saveEditField = async () => {
    if (!editPlatformData || !editField) return;
    
    const platform = editPlatformData.platform.toLowerCase();
    const social_id = editPlatformData.id;
    
    try {
      if (editField === 'username') {
        await axios.put("http://localhost:5000/api/update-social-media-username", {
          user_id: id,
          id: social_id,
          platform: platform,
          new_username: editValue,
        });
      } else if (editField === 'password') {
        await axios.put("http://localhost:5000/api/update-social-media-password", {
          user_id: id,
          id: social_id,
          platform: platform,
          new_password: editValue,
        });
      } else if (editField === 'email') {
        await axios.put("http://localhost:5000/api/update-social-media-email", {
          user_id: id,
          id: social_id,
          platform: platform,
          new_email: editValue,
        });
      }
      
      notification.success({ 
        message: "Success", 
        description: `${editField} updated successfully.` 
      });
      closeEditDrawer();
      fetchUserData();
    } catch (error) {
      notification.error({ 
        message: "Error", 
        description: `Failed to update ${editField}.` 
      });
    }
  };

  const handleAddNewPassword = (platform, social_id) => {
    setNewPasswordVisible((prev) => ({ ...prev, [platform]: social_id }));
  };

  const handleHideNewPassword = (platform) => {
    setNewPasswordVisible((prev) => ({ ...prev, [platform]: false }));
  };

  const handleNewPasswordChange = (platform, event) => {
    setNewPassword((prev) => ({ ...prev, [platform]: event.target.value }));
  };

  const handleSubmitNewPassword = (platform, social_id) => {
    axios
      .put("http://localhost:5000/api/update-social-media-password", {
        user_id: id,
        id: social_id,
        platform: platform.toLowerCase(),
        new_password: newPassword[platform],
      })
      .then(() => {
        handleHideNewPassword(platform);
        fetchUserData();
        setNewPassword((prev) => ({ ...prev, [platform]: "" }));
        notification.success({ message: "Success", description: "Password updated successfully." });
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Failed to update password." });
      });
  };

  const handleAddNewUsername = (platform, social_id) => {
    setNewUsernameVisible((prev) => ({ ...prev, [platform]: social_id }));
  };

  const handleHideNewUsername = (platform) => {
    setNewUsernameVisible((prev) => ({ ...prev, [platform]: false }));
  };

  const handleNewUsernameChange = (platform, e) => {
    setNewUsername((prev) => ({ ...prev, [platform]: e.target.value }));
  };

  const handleSubmitNewUsername = (platform, social_id) => {
    axios
      .put("http://localhost:5000/api/update-social-media-username", {
        user_id: id,
        id: social_id,
        platform: platform.toLowerCase(),
        new_username: newUsername[platform],
      })
      .then(() => {
        fetchUserData();
        fetchUsernameHistory();
        handleHideNewUsername(platform);
        setNewUsername((prev) => ({ ...prev, [platform]: "" }));
        notification.success({ message: "Success", description: "Username updated successfully." });
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Failed to update username." });
      });
  };

  const handleAddNewEmail = (platform, social_id) => {
    setNewEmailVisible((prev) => ({ ...prev, [platform]: social_id }));
  };

  const handleHideNewEmail = (platform) => {
    setNewEmailVisible((prev) => ({ ...prev, [platform]: false }));
  };

  const handleNewEmailChange = (platform, e) => {
    setNewEmail((prev) => ({ ...prev, [platform]: e.target.value }));
  };

  const handleSubmitNewEmail = (platform, social_id) => {
    axios
      .put("http://localhost:5000/api/update-social-media-email", {
        user_id: id,
        id: social_id,
        platform: platform.toLowerCase(),
        new_email: newEmail[platform],
      })
      .then(() => {
        fetchEmailHistory();
        handleHideNewEmail(platform);
        fetchUserData();
        setNewEmail((prev) => ({ ...prev, [platform]: "" }));
        notification.success({ message: "Success", description: "Email updated successfully." });
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Failed to update email." });
      });
  };

  const handleAddBackupCode = (platform, social_id) => {
    setNewBackupCodeVisible((prev) => ({ ...prev, [platform]: social_id }));
  };

  const handleHideNewBackupCode = (platform) => {
    setNewBackupCodeVisible((prev) => ({ ...prev, [platform]: false }));
  };

  const handleNewBackupCodeChange = (platform, e) => {
    setNewBackupCode((prev) => ({ ...prev, [platform]: e.target.value }));
  };

  const handleSubmitNewBackupCode = (platform, social_id) => {
    axios
      .put("http://localhost:5000/api/update-social-media-backupcode", {
        user_id: id,
        platform: platform.toLowerCase(),
        id: social_id,
        new_email: newBackupCode[platform],
      })
      .then(() => {
        fetchEmailHistory();
        handleHideNewBackupCode(platform);
        fetchUserData();
        setNewBackupCode((prev) => ({ ...prev, [platform]: "" }));
        notification.success({ message: "Success", description: "Backup code updated successfully." });
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Failed to update backup code." });
      });
  };

  const handleEditNewBackupCode = (platform, codeId) => {
    setNewEditBackupCodeVisible((prev) => ({ ...prev, [platform]: codeId }));
  };

  const handleHideNewEditBackupCode = (platform) => {
    setNewEditBackupCodeVisible((prev) => ({ ...prev, [platform]: false }));
  };

  const handleNewEditBackupCodeChange = (platform, e) => {
    setNewEditBackupCode((prev) => ({ ...prev, [platform]: e.target.value }));
  };

  const handleEditBackupCode = (platform, backupcode_id, social_id) => {
    axios
      .put("http://localhost:5000/api/update-backupcode", {
        user_id: id,
        platform: platform.toLowerCase(),
        id: social_id,
        backupcode_id: backupcode_id,
        new_email: newEditBackupCode[platform],
      })
      .then(() => {
        fetchEmailHistory();
        handleHideNewEditBackupCode(platform);
        fetchUserData();
        setNewEditBackupCode((prev) => ({ ...prev, [platform]: "" }));
        notification.success({ message: "Success", description: "Backup code updated successfully." });
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Failed to update backup code." });
      });
  };

  const handleDeleteBackupCode = (backupcode_id) => {
    Modal.confirm({
      title: "Delete Backup Code",
      content: "Are you sure you want to delete this backup code?",
      onOk: async () => {
        await axios.delete(`http://localhost:5000/api/delete-backupcode/${backupcode_id}`);
        fetchUserData();
        notification.success({ message: "Success", description: "Backup code deleted." });
      }
    });
  };

  const handleDeletePlatform = (socialId) => {
    Modal.confirm({
      title: "Delete Account",
      content: "Are you sure you want to delete this social media account?",
      onOk: async () => {
        await axios.delete(`http://localhost:5000/api/delete-social-media/${socialId}`);
        fetchUserData();
        notification.success({ message: "Success", description: "Account deleted successfully." });
      }
    });
  };

  const handleSubmitCreditCard = (e) => {
    e?.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      card_holder_name: cardHolderName,
      card_number: cardNumber,
      expiration_date: `${expirationYear}-${expirationMonth}-01`,
      cvv: cvv,
      billing_address: billingAddress,
      user_id: id,
      card_type: cardType === "Other" ? cardTypeOther : cardType,
    };
    axios
      .post("http://localhost:5000/post-credit-cards", data)
      .then(() => {
        fetchUserData();
        setIsAddingCard(false);
        setCardHolderName("");
        setCardNumber("");
        setExpirationYear("");
        setExpirationMonth("");
        setCvv("");
        setBillingAddress("");
        setCardType("");
        notification.success({ message: "Success", description: "Card added successfully." });
      })
      .catch(() => notification.error({ message: "Error", description: "Failed to add card." }))
      .finally(() => setIsSubmitting(false));
  };

  const handleEditCreditCard = (c_id) => {
    const data = {
      card_holder_name: cardHolderName,
      card_number: cardNumber,
      expiration_date: `${expirationYear}-${expirationMonth}-01`,
      cvv: cvv,
      billing_address: billingAddress,
      card_type: cardType === "Other" ? cardTypeOther : cardType,
      user_id: id,
    };
    axios
      .put(`http://localhost:5000/put-credit-cards/${c_id}`, data)
      .then(() => {
        setIsEditing(false);
        fetchUserData();
        notification.success({ message: "Success", description: "Card updated successfully." });
      })
      .catch(() => notification.error({ message: "Error", description: "Failed to update card." }));
  };

  const handleDeleteCard = async (creditId) => {
    Modal.confirm({
      title: "Delete Card",
      content: "Are you sure you want to delete this card?",
      onOk: async () => {
        await axios.delete(`http://localhost:5000/delete-credit-cards/${creditId}`);
        fetchUserData();
        notification.success({ message: "Success", description: "Card deleted successfully." });
      }
    });
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("userId", id);
    additionalImages.forEach((image) => formData.append("additionalImages", image));
    try {
      await axios.post("http://localhost:5000/api/post-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUserData();
      setAdditionalImages([]);
      setShowUpload(false);
      notification.success({ message: "Success", description: "Images uploaded successfully." });
    } catch (error) {
      notification.error({ message: "Error", description: "Failed to upload images." });
    }
  };

  const handleRemoveImages = async (index) => {
    const imageId = images[index]?.image_id;
    if (!imageId) return;
    try {
      await axios.delete(`http://localhost:5000/api/delete-image/${imageId}`);
      setImages((prev) => prev.filter((_, i) => i !== index));
      fetchUserData();
      notification.success({ message: "Success", description: "Image deleted successfully." });
    } catch (error) {
      notification.error({ message: "Error", description: "Failed to delete image." });
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
          const imageId = images[index]?.image_id;
          if (!imageId) return;
          try {
            await axios.put(`http://localhost:5000/api/put-images/${imageId}`, {
              user_id: id,
              image: imageData,
              image_type: newFile.type,
            });
            setImages((prev) => {
              const updated = [...prev];
              updated[index] = { ...updated[index], image: newFile };
              return updated;
            });
            fetchUserData();
            notification.success({ message: "Success", description: "Image updated successfully." });
          } catch (error) {
            notification.error({ message: "Error", description: "Failed to update image." });
          }
        };
        reader.readAsDataURL(newFile);
      }
    };
    fileInput.click();
  };

  // Helper to convert ISO date string to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditProfile = () => {
    const currentNationality = user?.nationality || "";
    const formattedDate = formatDateForInput(user?.date_of_birth);
    
    setProfileFieldValues({
      username: user?.username || "",
      nationality: currentNationality,
      business_name: user?.business_name || "",
      address: user?.address || "",
      countrycode: user?.countrycode || "",
      phonenumber: user?.phonenumber || "",
      date_of_birth: formattedDate,
    });
    setSelectedNationality(currentNationality);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setNewProfileImage(file);
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);

    // Gather all fields
    const payload = {
      user_id: id,
      username: profileFieldValues.username,
      nationality: profileFieldValues.nationality,
      business_name: profileFieldValues.business_name,
      address: profileFieldValues.address,
      countrycode: profileFieldValues.countrycode,
      phonenumber: profileFieldValues.phonenumber,
      date_of_birth: profileFieldValues.date_of_birth && profileFieldValues.date_of_birth.trim() !== "" 
        ? profileFieldValues.date_of_birth 
        : null,
    };

    try {
      // 1. Send ONE single request for all profile fields
      await axios.put("http://localhost:5000/api/update-client-profile", payload);

      // 2. Update Profile Image separately if a new one was chosen
      if (newProfileImage) {
        const formData = new FormData();
        formData.append("profile_image", newProfileImage);
        formData.append("user_id", id);
        await axios.put("http://localhost:5000/api/update-profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3. Success!
      setIsEditingProfile(false);
      await fetchUserData();
      notification.success({ 
        message: "Success", 
        description: "Profile updated successfully." 
      });

    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      notification.error({ 
        message: "Error", 
        description: error.response?.data?.error || "Failed to update profile." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(Array.from(e.target.files));
  };

  const formatNumber = (num) => {
    if (!num) return "";
    const parts = [];
    const str = num.toString();
    for (let i = 0; i < str.length; i += 4) parts.push(str.slice(i, i + 4));
    return parts.join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatDateCard = (inputDate) => {
    if (!inputDate) return "N/A";
    const parts = inputDate.split("-");
    if (parts.length !== 3) return inputDate;
    const month = parseInt(parts[1], 10) + 1;
    return `${month >= 10 ? month : "0" + month} / ${parts[0].slice(-2)}`;
  };

  const profileImageSrc = user?.profile_image
    ? `data:${user.profile_image_content_type};base64,${user.profile_image}`
    : null;

  const getAvatar = () => {
    if (profileImageSrc) return <Avatar size={120} src={profileImageSrc} className="profile-avatar" />;
    if (user?.gender === "male") return <Avatar size={120} icon={<UserOutlined />} src={maleImage} className="profile-avatar" />;
    if (user?.gender === "female") return <Avatar size={120} icon={<UserOutlined />} src={femaleImage} className="profile-avatar" />;
    return <Avatar size={120} icon={<UserOutlined />} src={other} className="profile-avatar" />;
  };

  const columns = [
    { title: "Account ID#", dataIndex: "account_id", key: "account_id" },
    { title: "Platform", dataIndex: "platform", key: "platform" },
    {
      title: "Old Password",
      dataIndex: "old_password",
      key: "old_password",
      render: (text, record) => (
        <Space>
          <span>{visiblePasswordIndexes[record.key] ? text : "*".repeat(text?.length || 0)}</span>
          <Button type="link" icon={visiblePasswordIndexes[record.key] ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => togglePasswordOldVisibility(record.key)} size="small" />
        </Space>
      ),
    },
    {
      title: "Date Changed",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) => text ? new Date(text).toLocaleString("en-US", { hour12: true }) : "N/A",
    },
  ];

  const emailColumns = [
    { title: "Account ID#", dataIndex: "account_id", key: "account_id" },
    { title: "Platform", dataIndex: "platform", key: "platform" },
    { title: "Old Email", dataIndex: "old_email", key: "old_email" },
    {
      title: "Changed At",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) => text ? new Date(text).toLocaleString("en-US", { hour12: true }) : "N/A",
    },
  ];

  const usernameHistoryColumns = [
    { title: "Account ID#", dataIndex: "account_id", key: "account_id" },
    { title: "Old Username", dataIndex: "old_username", key: "old_username" },
    {
      title: "Changed At",
      dataIndex: "changed_at",
      key: "changed_at",
      render: (text) => text ? new Date(text).toLocaleString("en-US", { hour12: true }) : "N/A",
    },
  ];

  const filteredDataPassword = passwordHistory.filter(
    (entry) =>
      entry.platform?.toLowerCase().includes(searchTextPassword.toLowerCase()) ||
      entry.old_password?.toLowerCase().includes(searchTextPassword.toLowerCase()) ||
      entry.account_id?.toString().includes(searchTextPassword)
  );

  const filteredDataEmail = emailHistory.filter(
    (entry) =>
      entry.platform?.toLowerCase().includes(searchTextEmail.toLowerCase()) ||
      entry.old_email?.toLowerCase().includes(searchTextEmail.toLowerCase()) ||
      entry.account_id?.toString().includes(searchTextEmail)
  );

  // ====== CREATIVE MODALS ======
  const renderAddPlatformModal = () => (
    <Modal
      open={addPlatformModalVisible}
      onCancel={() => {
        setAddPlatformModalVisible(false);
        setCurrentStep(0);
        setNewPlatform("Select Platform");
        setNewAddUsername("");
        setNewAddEmail("");
        setNewAddPassword("");
        setNewBCode("");
      }}
      footer={null}
      width={600}
      style={{ 
        maxWidth: "90vw",
        background: "transparent"
      }}
      modalRender={(modal) => (
        <div style={{ 
          background: "#141426",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(108,92,231,0.1)",
        }}>
          {modal}
        </div>
      )}
    >
      <div style={{ padding: "8px 0" }}>
        {/* Header */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: 24,
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
            border: `2px solid ${accentColor}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: accentColor,
          }}>
            <RocketOutlined />
          </div>
          <Title level={3} style={{ color: textColor, marginTop: 60, marginBottom: 4 }}>
            Add New Platform
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Connect a new social media account to this user
          </Text>
        </div>

        {/* Steps Indicator */}
        <div style={{ marginBottom: 24 }}>
          <Steps
            current={currentStep}
            size="small"
            onChange={setCurrentStep}
            style={{ 
              maxWidth: 400, 
              margin: "0 auto",
            }}
            items={[
              { title: 'Platform', icon: <GlobalOutlined /> },
              { title: 'Credentials', icon: <KeyOutlined /> },
              { title: 'Confirm', icon: <CheckOutlined /> },
            ]}
          />
        </div>

        {/* Step Content */}
        <div style={{ 
          background: "#1a1a2e",
          borderRadius: 16,
          padding: "24px",
          minHeight: 280,
          border: `1px solid ${borderColor}`,
        }}>
          {currentStep === 0 && (
            <div>
              <Text strong style={{ color: textColor, display: "block", marginBottom: 12 }}>
                Select Platform
              </Text>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
                {["Gmail", "Hotmail", "Facebook", "Instagram", "Twitter", "Tiktok", "Snapchat", "LinkedIn"].map((p) => (
                  <div
                    key={p}
                    onClick={() => setNewPlatform(p)}
                    style={{
                      padding: "16px 12px",
                      borderRadius: 12,
                      textAlign: "center",
                      cursor: "pointer",
                      border: `2px solid ${newPlatform === p ? accentColor : borderColor}`,
                      background: newPlatform === p ? `${accentColor}22` : "transparent",
                      transition: "all 0.3s ease",
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      if (newPlatform !== p) {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.background = `${accentColor}11`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newPlatform !== p) {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>
                      {platformIcons[p] || <GlobalOutlined />}
                    </div>
                    <Text style={{ fontSize: 12, color: textColor }}>{p}</Text>
                    {newPlatform === p && (
                      <div style={{ marginTop: 4, color: accentColor }}>
                        <CheckCircleOutlined />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <Text strong style={{ color: textColor, display: "block", marginBottom: 16 }}>
                Enter Credentials for {newPlatform}
              </Text>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    Username
                  </Text>
                  <Input
                    placeholder="Enter username"
                    value={newAddUsername}
                    onChange={(e) => setNewAddUsername(e.target.value)}
                    prefix={<UserOutlined style={{ color: accentColor }} />}
                    size="large"
                    style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
                  />
                </div>
                {newPlatform !== "Gmail" && newPlatform !== "Hotmail" && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                      Email
                    </Text>
                    <Input
                      placeholder="Enter email"
                      value={newAddEmail}
                      onChange={(e) => setNewAddEmail(e.target.value)}
                      prefix={<MailOutlined style={{ color: accentColor }} />}
                      size="large"
                      style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
                    />
                  </div>
                )}
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    Password
                  </Text>
                  <Input.Password
                    placeholder="Enter password"
                    value={newAddPassword}
                    onChange={(e) => setNewAddPassword(e.target.value)}
                    prefix={<LockOutlined style={{ color: accentColor }} />}
                    size="large"
                    style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
                  />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                    Backup Code <Text type="secondary" style={{ fontSize: 10 }}>(Optional)</Text>
                  </Text>
                  <Input
                    placeholder="Enter backup code"
                    value={newBCode}
                    onChange={(e) => setNewBCode(e.target.value)}
                    prefix={<SafetyOutlined style={{ color: accentColor }} />}
                    size="large"
                    style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
                  />
                </div>
              </Space>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: "50%", 
                background: `${accentColor}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 36,
                color: accentColor,
              }}>
                <ApiOutlined />
              </div>
              <Title level={4} style={{ color: textColor }}>
                Ready to Connect {newPlatform}?
              </Title>
              <div style={{ 
                background: "#0d0d20", 
                borderRadius: 12, 
                padding: 16,
                textAlign: "left",
                maxWidth: 400,
                margin: "16px auto",
                border: `1px solid ${borderColor}`,
              }}>
                <Row gutter={[8, 12]}>
                  <Col span={10}><Text type="secondary">Platform:</Text></Col>
                  <Col span={14}><Text style={{ color: textColor }}>{newPlatform}</Text></Col>
                  <Col span={10}><Text type="secondary">Username:</Text></Col>
                  <Col span={14}><Text style={{ color: textColor }}>{newAddUsername || "—"}</Text></Col>
                  {newPlatform !== "Gmail" && newPlatform !== "Hotmail" && (
                    <>
                      <Col span={10}><Text type="secondary">Email:</Text></Col>
                      <Col span={14}><Text style={{ color: textColor }}>{newAddEmail || "—"}</Text></Col>
                    </>
                  )}
                  <Col span={10}><Text type="secondary">Backup Code:</Text></Col>
                  <Col span={14}><Text style={{ color: textColor }}>{newBCode || "None"}</Text></Col>
                </Row>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Click "Connect" to add this account
              </Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid ${borderColor}`,
        }}>
          <Button 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            style={{ borderColor: borderColor, color: textColor }}
          >
            Previous
          </Button>
          <Space>
            <Button onClick={() => {
              setAddPlatformModalVisible(false);
              setCurrentStep(0);
              setNewPlatform("Select Platform");
              setNewAddUsername("");
              setNewAddEmail("");
              setNewAddPassword("");
              setNewBCode("");
            }}>
              Cancel
            </Button>
            {currentStep < 2 ? (
              <Button 
                type="primary" 
                onClick={() => setCurrentStep(prev => Math.min(2, prev + 1))}
                disabled={currentStep === 0 && newPlatform === "Select Platform"}
                style={{ background: accentColor, borderColor: accentColor }}
              >
                Next <ArrowRightOutlined />
              </Button>
            ) : (
              <Button 
                type="primary" 
                onClick={handleSubmitNewPlatform}
                icon={<CheckOutlined />}
                style={{ background: accentColor, borderColor: accentColor }}
              >
                Connect
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );

  const renderAddAccountModal = () => (
    <Modal
      open={addAccountModalVisible}
      onCancel={() => {
        setAddAccountModalVisible(false);
        setSelectedPlatformForAccount(null);
        setCurrentStep(0);
      }}
      footer={null}
      width={560}
      style={{ 
        maxWidth: "90vw",
        background: "transparent"
      }}
      modalRender={(modal) => (
        <div style={{ 
          background: "#141426",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(108,92,231,0.1)",
        }}>
          {modal}
        </div>
      )}
    >
      <div style={{ padding: "8px 0" }}>
        {/* Header */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: 24,
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
            border: `2px solid ${accentColor}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: accentColor,
          }}>
            {selectedPlatformForAccount ? platformIcons[selectedPlatformForAccount] || <UserOutlined /> : <UserOutlined />}
          </div>
          <Title level={4} style={{ color: textColor, marginTop: 60, marginBottom: 4 }}>
            Add New {selectedPlatformForAccount || ""} Account
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Add another account for this platform
          </Text>
        </div>

        <div style={{ 
          background: "#1a1a2e",
          borderRadius: 16,
          padding: "24px",
          minHeight: 250,
          border: `1px solid ${borderColor}`,
        }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                Username
              </Text>
              <Input
                placeholder="Enter username"
                onChange={(e) => handleNewAccountChange(selectedPlatformForAccount || "", "username", e.target.value)}
                prefix={<UserOutlined style={{ color: accentColor }} />}
                size="large"
                style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
              />
            </div>
            {selectedPlatformForAccount !== "Gmail" && selectedPlatformForAccount !== "Hotmail" && (
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Email
                </Text>
                <Input
                  placeholder="Enter email"
                  onChange={(e) => handleNewAccountChange(selectedPlatformForAccount || "", "email", e.target.value)}
                  prefix={<MailOutlined style={{ color: accentColor }} />}
                  size="large"
                  style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
                />
              </div>
            )}
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                Password
              </Text>
              <Input.Password
                placeholder="Enter password"
                onChange={(e) => handleNewAccountChange(selectedPlatformForAccount || "", "password", e.target.value)}
                prefix={<LockOutlined style={{ color: accentColor }} />}
                size="large"
                style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                Backup Code <Text type="secondary" style={{ fontSize: 10 }}>(Optional)</Text>
              </Text>
              <Input
                placeholder="Enter backup code"
                onChange={(e) => handleNewAccountChange(selectedPlatformForAccount || "", "backupcode", e.target.value)}
                prefix={<SafetyOutlined style={{ color: accentColor }} />}
                size="large"
                style={{ background: "#0d0d20", borderColor: borderColor, color: textColor }}
              />
            </div>
          </Space>
        </div>

        {/* Footer */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid ${borderColor}`,
          gap: 8,
        }}>
          <Button onClick={() => {
            setAddAccountModalVisible(false);
            setSelectedPlatformForAccount(null);
          }}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={() => handleSubmitNewAccount(selectedPlatformForAccount)}
            icon={<CheckOutlined />}
            style={{ background: accentColor, borderColor: accentColor }}
          >
            Add Account
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Tab items
  const tabItems = [
    {
     key: "profile",
      label: <span><UserOutlined /> Profile</span>,
      children: (
        <Card style={{ background: inputBg, border: `1px solid ${borderColor}`, borderRadius: 12, marginTop: 16 }}>
          {isEditingProfile ? (
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ marginBottom: 10 }} />
              </div>
              <Input 
                name="username" 
                value={profileFieldValues.username} 
                onChange={handleProfileFieldChange} 
                style={{ marginBottom: 8, background: inputBg, borderColor: borderColor, color: textColor }} 
                placeholder="Username" 
              />
              <Select
                showSearch
                placeholder="Select a country"
                value={profileFieldValues.nationality} 
                onChange={(value) => {
                  setSelectedNationality(value); 
                  setProfileFieldValues(prev => ({ ...prev, nationality: value }));
                }}
                style={{ width: "100%", marginBottom: 8 }}
                optionFilterProp="children"
                dropdownStyle={{ background: inputBg, color: textColor }}
              >
                {countries.map((c) => (
                  <Select.Option key={c.code} value={c.name} label={c.name}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
              <Input 
                name="business_name" 
                value={profileFieldValues.business_name} 
                onChange={handleProfileFieldChange} 
                style={{ marginBottom: 8, background: inputBg, borderColor: borderColor, color: textColor }} 
                placeholder="Business Name" 
              />
              <Input 
                name="address" 
                value={profileFieldValues.address} 
                onChange={handleProfileFieldChange} 
                style={{ marginBottom: 8, background: inputBg, borderColor: borderColor, color: textColor }} 
                placeholder="Address" 
              />
              <Space.Compact style={{ width: '100%', marginBottom: 8 }}>
                <Input 
                  name="countrycode" 
                  value={profileFieldValues.countrycode} 
                  onChange={handleProfileFieldChange} 
                  style={{ width: '25%', background: inputBg, borderColor: borderColor, color: textColor }} 
                  placeholder="+1" 
                />
                <Input 
                  name="phonenumber" 
                  value={profileFieldValues.phonenumber} 
                  onChange={handleProfileFieldChange} 
                  style={{ width: '75%', background: inputBg, borderColor: borderColor, color: textColor }} 
                  placeholder="Phone number" 
                />
              </Space.Compact>
              <input 
                name="date_of_birth" 
                type="date" 
                value={profileFieldValues.date_of_birth || ""} 
                onChange={handleProfileFieldChange} 
                style={{ 
                  width: "100%", 
                  padding: 8, 
                  marginBottom: 8, 
                  borderRadius: 6, 
                  background: "#1a1a2e", 
                  color: textColor, 
                  border: `1px solid ${borderColor}` 
                }}
              />
              <Space style={{ justifyContent: "center", width: "100%" }}>
                <Button type="primary" icon={<CheckOutlined />} onClick={handleSaveProfile}>Save</Button>
                <Button icon={<MinusOutlined />} onClick={handleCancelEdit}>Cancel</Button>
              </Space>
            </div>
          ) : (
            <Descriptions 
              column={{ xs: 1, sm: 2, md: 3 }} 
              bordered 
              styles={{ 
                label: { background: "#1a1a2e", color: textColor, fontWeight: 600 },
                content: { color: textColor }
              }}
            >
              <Descriptions.Item label="Business Name">
                <span>{user?.business_name || "No Business Name"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <span>{user?.address || "N/A"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <span>+{user?.countrycode || ""}{user?.phonenumber || "N/A"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                <span style={{ textTransform: "capitalize" }}>{user?.gender || "N/A"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <span>{user?.email || "N/A"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      )
    },
    {
      key: "social",
      label: <span><GlobalOutlined /> Social Media</span>,
      children: (
        <div style={{ padding: "16px 0" }}>
          <Button 
            type="primary" 
            icon={<PlusCircleOutlined />} 
            onClick={() => setAddPlatformModalVisible(true)} 
            style={{ 
              marginBottom: 16,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColorLight})`,
              border: "none",
              boxShadow: `0 4px 15px ${accentColor}44`,
              height: 44,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <RocketOutlined /> Add New Platform
          </Button>

          <Row gutter={[24, 24]} justify="center">
            {socialMediaLinks.map((item) => {
              const { id, platform, username, url, icon, password, email, backupcode, backupcodes } = item;
              const isEmailPlatform = platform === "Gmail" || platform === "Hotmail";
              
              return (
                <Col xs={24} md={12} lg={8} xl={6} key={id}>
                  <Card
                    style={{ 
                      background: inputBg, 
                      border: `1px solid ${borderColor}`, 
                      borderRadius: 16,
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    bodyStyle={{ padding: "16px" }}
                    hoverable
                  >
                    <div style={{ 
                      position: "absolute", 
                      top: 0, 
                      right: 0, 
                      width: "100%", 
                      height: "4px", 
                      background: `linear-gradient(90deg, ${accentColor}, ${accentColorLight})` 
                    }} />
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <Space>
                        <i className={icon} style={{ fontSize: 24, color: accentColor }} />
                        <Text strong style={{ color: textColor, fontSize: 16 }}>{platform}</Text>
                      </Space>
                      <Badge count={id} style={{ backgroundColor: accentColor }} />
                    </div>

                    <Divider style={{ margin: "8px 0", borderColor: borderColor }} />

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Username</Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: textColor }}>
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>
                            {username || "N/A"}
                          </a>
                        </Text>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined />} 
                          onClick={() => openEditDrawer(item, 'username')}
                          style={{ color: accentColor }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Password</Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: textColor }}>
                          {passwordVisibility[platform] ? password : "••••••••"}
                        </Text>
                        <Space size={4}>
                          <Button 
                            type="text" 
                            size="small" 
                            icon={passwordVisibility[platform] ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
                            onClick={() => togglePasswordVisibility(platform)}
                            style={{ color: textColor }}
                          />
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<EditOutlined />} 
                            onClick={() => openEditDrawer(item, 'password')}
                            style={{ color: accentColor }}
                          />
                        </Space>
                      </div>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Email</Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: textColor }}>
                          {isEmailPlatform ? (email || username || "N/A") : (email || "N/A")}
                        </Text>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined />} 
                          onClick={() => openEditDrawer(item, 'email')}
                          style={{ color: accentColor }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Backup Code</Text>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: textColor }}>{backupcode || "None"}</Text>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<PlusOutlined />} 
                          onClick={() => toggleBackupCodeVisible(platform, id)}
                          style={{ color: accentColor }}
                        />
                      </div>
                    </div>

                    {backupcodes && backupcodes.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {backupcodes.map((code) => (
                          <Tag key={code.id} color="purple" style={{ marginBottom: 4 }}>
                            {code.backup_code}
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<DeleteOutlined />} 
                              onClick={() => handleDeleteBackupCode(code.id)}
                              danger
                              style={{ marginLeft: 4 }}
                            />
                          </Tag>
                        ))}
                      </div>
                    )}

                    {backupCodeVisible[platform] === id && (
                      <div style={{ marginTop: 8 }}>
                        <Input 
                          placeholder="New Backup Code" 
                          value={newAddBackupCode} 
                          onChange={(e) => handleAddNewBackupCode(e.target.value)}
                          size="small"
                          style={{ marginBottom: 4 }}
                        />
                        <Button 
                          type="primary" 
                          size="small" 
                          icon={<CheckOutlined />} 
                          onClick={() => handleSubmitAddNewBackupCode(platform, id)}
                        >
                          Add
                        </Button>
                        <Button 
                          size="small" 
                          icon={<MinusOutlined />} 
                          onClick={() => setBackupCodeVisible((prev) => ({ ...prev, [platform]: false }))}
                          style={{ marginLeft: 4 }}
                        />
                      </div>
                    )}

                    <Divider style={{ margin: "12px 0", borderColor: borderColor }} />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<PlusCircleOutlined />} 
                        onClick={() => handleAddAccount(platform, id)}
                        style={{ color: accentColor }}
                      >
                        Add Account
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeletePlatform(id)}
                        danger
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
          {socialMediaLinks.length === 0 && <Empty description="No social media accounts" />}
        </div>
      )
    },
    {
      key: "cards",
      label: <span><WalletOutlined /> Cards</span>,
      children: (
        <div style={{ padding: "16px 0" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addCard} style={{ marginBottom: 16 }}>
            {isAddingCard ? "Cancel" : "Add New Card"}
          </Button>
                                {isAddingCard && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
              
              {/* ===== 3D PREVIEW CARD (MUCH BIGGER) ===== */}
              <div style={{
                width: '100%',
                maxWidth: '700px', /* <--- INCREASED WIDTH TO 700px */
                height: '360px',   /* <--- INCREASED HEIGHT PROPORTIONALLY */
                perspective: '1000px',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                }}>
                  
                  {/* === FRONT FACE === */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden !important',
                    borderRadius: '24px', /* <--- Increased border radius for larger card */
                    background: 'linear-gradient(135deg, #1e1e3f 0%, #0d0d24 100%)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'rotateY(0deg)',
                    zIndex: 2,
                  }}>
                    {/* Card Glossy Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%', left: '-50%',
                      width: '200%', height: '200%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
                      transform: 'rotate(25deg)',
                      pointerEvents: 'none'
                    }} />

                    {/* Top Row: Bank Name & Chip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '2px', fontWeight: '600', textTransform: 'uppercase' }}>Digital Connects</div>
                        <div style={{ color: 'gold', fontWeight: 'bold', fontSize: '16px', marginTop: '2px' }}>
                          {cardType || "Standard"}
                        </div>
                      </div>
                      <img src={chip} alt="Chip" style={{ height: '45px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    </div>

                    {/* Middle: Card Number */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ color: '#ffffff', fontSize: '28px', letterSpacing: '6px', fontWeight: '500', fontFamily: 'monospace', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {formatNumber(cardNumber) || "•••• •••• •••• ••••"}
                      </div>
                    </div>

                    {/* Bottom Row: Name & Expiry */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-end', 
                      color: 'rgba(255,255,255,0.9)', 
                      fontSize: '16px',
                      paddingTop: '8px',
                      width: '100%'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>Card Holder</div>
                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '18px', letterSpacing: '0.5px' }}>
                          {cardHolderName.toUpperCase() || "CARD HOLDER"}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>Expires</div>
                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '18px' }}>
                          {expirationMonth || "MM"}/{expirationYear || "YY"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === BACK FACE === */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden !important',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #1e1e3f 0%, #0d0d24 100%)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transform: 'rotateY(180deg)',
                    zIndex: 1,
                  }}>
                    {/* Magnetic Stripe */}
                    <div style={{
                      background: 'linear-gradient(180deg, #111111 0%, #222222 100%)',
                      height: '50px',
                      width: '100%',
                      marginTop: '20px',
                      borderRadius: '4px'
                    }} />

                    {/* Signature Strip */}
                    <div style={{
                      background: 'rgba(255,255,255,0.85)',
                      height: '50px',
                      width: '85%',
                      margin: '15px auto 10px auto',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '15px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <span style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>
                        {cvv || "•••"}
                      </span>
                    </div>

                    {/* Footer Text */}
                    <div style={{ marginTop: 'auto', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '1px' }}>
                      AUTHORIZED SIGNATURE
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== INPUT FORM CARD (ALIGNED WIDTH) ===== */}
              <Card style={{ 
                background: inputBg, 
                border: `1px solid ${borderColor}`, 
                borderRadius: 16,
                width: '100%',
                maxWidth: '700px', /* <--- MATCHED THE CARD WIDTH */
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
              }}>
                <Row gutter={[16, 16]} justify="center">
                  <Col span={24}><Input placeholder="Card Holder Name" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} /></Col>
                  <Col span={24}><Input.Password placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} /></Col>
                  <Col span={12}>
                    <Select placeholder="Year" value={expirationYear} onChange={setExpirationYear} style={{ width: "100%" }}>
                      <Select.Option value="">YY</Select.Option>
                      {Array.from({ length: 20 }, (_, i) => <Select.Option key={i} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</Select.Option>)}
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Select placeholder="Month" value={expirationMonth} onChange={setExpirationMonth} style={{ width: "100%" }}>
                      <Select.Option value="">MM</Select.Option>
                      {Array.from({ length: 12 }, (_, i) => <Select.Option key={i} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</Select.Option>)}
                    </Select>
                  </Col>
                  <Col span={12}><Input.Password placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} /></Col>
                  <Col span={12}>
                    <Select placeholder="Card Type" value={cardType} onChange={setCardType} style={{ width: "100%" }}>
                      <Select.Option value="">Select</Select.Option>
                      {["Debit Card", "Credit Card", "Master Card", "Wish Card", "OMT Card", "American Express", "Visa Card", "Other"].map(t => (
                        <Select.Option key={t} value={t}>{t}</Select.Option>
                      ))}
                    </Select>
                  </Col>
                  {cardType === "Other" && <Col span={24}><Input placeholder="Specify" value={cardTypeOther} onChange={(e) => setCardTypeOther(e.target.value)} /></Col>}
                  <Col span={24}><Input placeholder="Billing Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} /></Col>
                  <Col span={24} style={{ textAlign: "center" }}>
                    <Button type="primary" onClick={handleSubmitCreditCard} loading={isSubmitting} style={{ 
                      width: '100%',
                      height: '48px',
                      background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                      border: 'none',
                      boxShadow: `0 4px 15px ${accentColor}44`,
                      fontWeight: 600,
                      borderRadius: 8,
                      fontSize: '16px'
                    }}>Add Credit Card</Button>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {isEditing && (
            <Card style={{ marginTop: 16, background: inputBg, border: `1px solid ${borderColor}`, maxWidth: 600, margin: "0 auto" }}>
              <Row gutter={[16, 16]} justify="center">
                <Col span={24}><Input placeholder="Card Holder Name" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} /></Col>
                <Col span={24}><Input.Password placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} /></Col>
                <Col span={12}><Select placeholder="Year" value={expirationYear} onChange={setExpirationYear} style={{ width: "100%" }} /></Col>
                <Col span={12}><Select placeholder="Month" value={expirationMonth} onChange={setExpirationMonth} style={{ width: "100%" }} /></Col>
                <Col span={12}><Input.Password placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} /></Col>
                <Col span={12}>
                  <Select placeholder="Card Type" value={cardType} onChange={setCardType} style={{ width: "100%" }}>
                    <Select.Option value="">Select</Select.Option>
                    {["Debit Card", "Credit Card", "Master Card", "Wish Card", "OMT Card", "American Express", "Visa Card", "Other"].map(t => (
                      <Select.Option key={t} value={t}>{t}</Select.Option>
                    ))}
                  </Select>
                </Col>
                {cardType === "Other" && <Col span={24}><Input placeholder="Specify" value={cardTypeOther} onChange={(e) => setCardTypeOther(e.target.value)} /></Col>}
                <Col span={24}><Input placeholder="Billing Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} /></Col>
                <Col span={24} style={{ textAlign: "center" }}>
                  <Button type="primary" onClick={() => handleEditCreditCard(cardId)}>Update</Button>
                </Col>
              </Row>
            </Card>
          )}

          <Row gutter={[24, 24]} justify="center" style={{ marginTop: 16 }}>
            {creditCards.map((card) => (
              <Col xs={24} md={12} lg={8} xl={6} key={card.card_id}>
                <div className={`credit-card-container ${flippedCards[card.card_id] ? "flipped" : ""}`}>
                  <div className="credit-card-inner">
                    {flippedCards[card.card_id] ? (
                      <div className="credit-card-back">
                        <div className="credit-card-content">
                          <div className="credit-card-ink"></div>
                          <div className="credit-card-black-stripe"></div>
                          <div className="credit-card-white-stripe">
                            <div className="credit-card-ccv" align="right">{card.cvv}</div>
                          </div>
                          <div className="credit-card-text">AUTHORIZED<br/>SIGNATURE</div>
                          <div className="credit-card-back-img-align">
                            <img src={eagle} className="credit-card-back-img" alt="eagle" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="credit-card-main-container" style={{ height: "220px", background: "linear-gradient(145deg, #1a1a2e, #16213e)", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ color: "gold", fontWeight: "bold" }}>{card.card_type?.toUpperCase() || "CARD"}</div>
                          <img src={logo} alt="Logo" style={{ width: 60, height: 35 }} />
                        </div>
                        <div style={{ marginTop: 10 }}><img src={chip} alt="Chip" style={{ height: 30 }} /></div>
                        <div style={{ color: "white", fontSize: 20, letterSpacing: 2, marginTop: 10 }}>{formatNumber(card.card_number)}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, color: "rgba(255,255,255,0.7)" }}>
                          <span>{card.card_holder_name?.toUpperCase()}</span>
                          <span>EXP: {formatDateCard(card.expiration_date)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                  <Tooltip title="Edit">
                    <Button icon={<EditOutlined />} onClick={() => {
                      setIsEditing(true);
                      setCardId(card.card_id);
                      setCardHolderName(card.card_holder_name);
                      setCardNumber(card.card_number);
                      setExpirationYear(new Date(card.expiration_date).getFullYear());
                      setExpirationMonth(String(new Date(card.expiration_date).getMonth() + 1).padStart(2, "0"));
                      setCvv(card.cvv);
                      setCardType(card.card_type);
                    }} />
                  </Tooltip>
                  <Tooltip title="Delete"><Button icon={<DeleteOutlined />} onClick={() => handleDeleteCard(card.card_id)} danger /></Tooltip>
                  <Tooltip title="Flip">
                    <Button icon={flippedCards[card.card_id] ? <ArrowLeftOutlined /> : <ArrowRightOutlined />} onClick={() => handleFlip(card.card_id)} />
                  </Tooltip>
                </div>
              </Col>
            ))}
          </Row>
          {creditCards.length === 0 && !isAddingCard && !isEditing && <Empty description="No credit cards added" />}
        </div>
      )
    },
       {
      key: "history",
      label: <span><SafetyOutlined /> History</span>,
      children: (
        <div style={{ padding: "16px 0" }}>
          {/* Add a wrapper div around each Card with a white text override */}
          <div className="history-dark-wrapper">
            <Card style={{ marginBottom: 16, background: inputBg, border: `1px solid ${borderColor}` }}>
              <Title level={4} style={{ color: textColor }}>Password History</Title>
              <Input.Search 
                placeholder="Search..." 
                value={searchTextPassword} 
                onChange={(e) => setSearchTextPassword(e.target.value)} 
                style={{ maxWidth: 300, marginBottom: 16 }} 
              />
              <Table 
                columns={columns} 
                dataSource={filteredDataPassword.map((e, i) => ({ ...e, key: i }))} 
                pagination={{ pageSize: 5 }} 
              />
            </Card>
            <Card style={{ marginBottom: 16, background: inputBg, border: `1px solid ${borderColor}` }}>
              <Title level={4} style={{ color: textColor }}>Email History</Title>
              <Input.Search 
                placeholder="Search..." 
                value={searchTextEmail} 
                onChange={(e) => setSearchTextEmail(e.target.value)} 
                style={{ maxWidth: 300, marginBottom: 16 }} 
              />
              <Table 
                columns={emailColumns} 
                dataSource={filteredDataEmail.map((e, i) => ({ ...e, key: i }))} 
                pagination={{ pageSize: 5 }} 
              />
            </Card>
            <Card style={{ background: inputBg, border: `1px solid ${borderColor}` }}>
              <Title level={4} style={{ color: textColor }}>Gmail & Hotmail History</Title>
              <Table 
                columns={usernameHistoryColumns} 
                dataSource={usernameHistory.map((e, i) => ({ ...e, key: i }))} 
                pagination={{ pageSize: 5 }} 
              />
            </Card>
          </div>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: bgColor }}>
        <Spin size="large">
          <div style={{ padding: 50, color: textColor }}>Loading user data...</div>
        </Spin>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: bgColor }}>
        <Alert message="User Not Found" description={errorMessage} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: bgColor,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 210, 211, 0.03) 0%, transparent 50%)",
    }}>
      <div style={{ 
        flex: 1, 
        padding: "30px 30px 30px 30px",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "1400px", 
          margin: "0 auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* ====== CREATIVE HERO HEADER ====== */}
          <Card 
            style={{ 
              background: cardBg, 
              backdropFilter: "blur(12px)",
              border: `1px solid ${borderColor}`, 
              borderRadius: 24, 
              marginBottom: 24,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              flexShrink: 0,
            }}
          >
            {/* Animated Glow Border */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${accentColor}, ${glowPink}, ${accentColor}, transparent)`,
              backgroundSize: '300% 100%',
              animation: 'borderSweep 4s linear infinite'
            }} />

            <Row gutter={[24, 24]} align="middle" justify="center">
              {/* Left: Avatar with 3D Ring */}
              <Col xs={24} md={6} style={{ textAlign: "center", position: 'relative' }}>
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  {/* Glowing ring behind avatar */}
                  <div style={{
                    position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${accentColor}, ${glowPink}, ${accentColor})`,
                    animation: 'ringSpin 6s linear infinite',
                    padding: 2
                  }} />
                  <div style={{
                    position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
                    borderRadius: '50%',
                    boxShadow: `0 0 40px ${accentColor}33`,
                    filter: 'blur(8px)'
                  }} />
                  {getAvatar()}
                </div>
              </Col>

              {/* Right: Info */}
              <Col xs={24} md={18}>
                <Row justify="space-between" align="middle">
                  <Col xs={24} md={16}>
                    <Space align="center" style={{ flexWrap: 'wrap' }}>
                      <Title level={2} style={{ color: textColor, margin: 0, fontWeight: 700 }}>
                        {user?.username || "Unknown User"}
                        {user?.image_count > 0 && (
                          <Tooltip title="Verified">
                            <img src={verification} alt="Verified" style={{ width: 24, height: 24, marginLeft: 8, filter: 'drop-shadow(0 0 8px rgba(108,92,231,0.6))' }} />
                          </Tooltip>
                        )}
                      </Title>
                      {user?.total_invoices >= 1000 && (
                        <Tag color="gold" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg, #f7971e, #ffd200)', border: 'none', fontWeight: 700, padding: '4px 12px' }}>
                          <CrownOutlined /> VIP
                        </Tag>
                      )}
                    </Space>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                      <Tag icon={<GlobalOutlined />} style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44`, color: textColor, padding: '4px 12px', borderRadius: 20 }}>
                        {user?.nationality || "N/A"}
                      </Tag>
                      <Tag icon={<CalendarOutlined />} style={{ background: 'rgba(0, 210, 211, 0.15)', border: `1px solid rgba(0, 210, 211, 0.3)`, color: glowGreen, padding: '4px 12px', borderRadius: 20 }}>
                        {formatDate(user?.date_of_birth)}
                      </Tag>
                      <Tag icon={<MailOutlined />} style={{ background: 'rgba(253, 121, 168, 0.15)', border: `1px solid rgba(253, 121, 168, 0.3)`, color: glowPink, padding: '4px 12px', borderRadius: 20 }}>
                        {user?.email || "N/A"}
                      </Tag>
                    </div>
                  </Col>

                  <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    {user?.total_invoices >= 1000 ? (
                      <Card size="small" style={{ background: 'linear-gradient(135deg, rgba(247, 151, 30, 0.15), rgba(255, 210, 0, 0.05))', border: `1px solid rgba(255, 215, 0, 0.3)` }}>
                        <Statistic title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Total Invoices</span>} value={`$${user?.total_invoices}`} valueStyle={{ color: '#ffd700' }} />
                      </Card>
                    ) : (
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}` }}>
                        <Statistic title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Status</span>} value="Active" valueStyle={{ color: glowGreen }} />
                      </Card>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          {/* ====== TABS ====== */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ 
              background: cardBg, 
              borderRadius: 20, 
              padding: "0 24px 24px 24px", 
              border: `1px solid ${borderColor}`,
              backdropFilter: 'blur(8px)',
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
            tabBarStyle={{ borderBottom: `1px solid ${borderColor}`, marginBottom: 0 }}
            centered
          />

        </div>
      </div>

      {/* ====== EDIT DRAWER ====== */}
      <Drawer
        title={
          <Space>
            <EditOutlined style={{ color: accentColor }} />
            <span style={{ color: textColor }}>Edit {editField?.charAt(0).toUpperCase() + editField?.slice(1)}</span>
          </Space>
        }
        placement="right"
        onClose={closeEditDrawer}
        open={editDrawerVisible}
        width={400}
        style={{ background: bgColor }}
        headerStyle={{ borderBottom: `1px solid ${borderColor}` }}
        bodyStyle={{ padding: "24px" }}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={closeEditDrawer}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={saveEditField}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div>
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            {editField === 'password' ? 'Enter new password' : `Enter new ${editField}`}
          </Text>
          {editField === 'password' ? (
            <Input.Password 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)} 
              placeholder="Enter new password"
              prefix={<LockOutlined style={{ color: accentColor }} />}
              size="large"
              style={{ background: inputBg, borderColor: borderColor, color: textColor }}
            />
          ) : (
            <Input 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)} 
              placeholder={`Enter new ${editField}`}
              size="large"
              style={{ background: inputBg, borderColor: borderColor, color: textColor }}
              prefix={editField === 'username' ? <UserOutlined style={{ color: accentColor }} /> : <MailOutlined style={{ color: accentColor }} />}
            />
          )}
          <div style={{ marginTop: 16, padding: 12, background: "#1a1a2e", borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> Editing {editField} for {editPlatformData?.platform}
            </Text>
          </div>
        </div>
      </Drawer>

      {/* ====== MODALS ====== */}
      {renderAddPlatformModal()}
      {renderAddAccountModal()}

      {/* ====== STYLES ====== */}
      <style>{`
        .profile-avatar {
          border: 3px solid ${accentColor};
          box-shadow: 0 0 30px rgba(108, 92, 231, 0.3);
        }
        
        /* Animated rings */
        @keyframes ringSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes borderSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .credit-card-container {
          perspective: 1000px;
          width: 100%;
          max-width: 340px;
          height: 200px;
          cursor: pointer;
          margin: 0 auto;
        }
        .credit-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .credit-card-container.flipped .credit-card-inner {
          transform: rotateY(180deg);
        }
        .credit-card-main-container {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1) inset;
        }
        .credit-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          transform: rotateY(180deg);
          border-radius: 16px;
          background: linear-gradient(145deg, #1a1a2e, #0f1a2e);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .credit-card-content {
          padding: 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .credit-card-black-stripe {
          background: linear-gradient(180deg, #1a1a1a, #2a2a2a);
          height: 36px;
          width: 100%;
          margin-top: 8px;
        }
        .credit-card-white-stripe {
          background: rgba(255,255,255,0.08);
          height: 28px;
          width: 85%;
          margin: 8px auto;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .credit-card-ccv {
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 700;
          background: rgba(255,255,255,0.9);
          padding: 2px 10px;
          border-radius: 3px;
        }
        .credit-card-text {
          font-size: 7px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1px;
          margin-top: auto;
        }
        .credit-card-back-img-align {
          position: absolute;
          bottom: 15px;
          right: 20px;
          opacity: 0.15;
        }
        .credit-card-back-img {
          width: 40px;
        }
        .credit-card-ink {
          position: absolute;
          top: 0;
          right: 0;
          width: 40%;
          height: 100%;
          background: radial-gradient(ellipse at top right, rgba(255,215,0,0.03), transparent 70%);
          pointer-events: none;
        }
        .ant-tabs-tab {
          color: ${textColor} !important;
        }
        .history-dark-wrapper .ant-table {
          background: transparent !important;
          color: #ffffff !important;
        }
        .history-dark-wrapper .ant-table-thead > tr > th {
          background: #1a1a2e !important;
          color: #f0f2f5 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .history-dark-wrapper .ant-table-tbody > tr > td {
          color: #f0f2f5 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
        }
        .history-dark-wrapper .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.15) !important;
        }
        .history-dark-wrapper .ant-table-placeholder {
          background: #1a1a2e !important;
        }
        .history-dark-wrapper .ant-table-placeholder .ant-empty-description {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .history-dark-wrapper .ant-pagination-item a {
          color: #f0f2f5 !important;
        }
        .history-dark-wrapper .ant-pagination-item-active {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }
        .history-dark-wrapper .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${accentColor} !important;
        }
        .ant-tabs-ink-bar {
          background: ${accentColor} !important;
        }
        .ant-table-thead > tr > th {
          background: #1a1a2e !important;
          color: ${textColor} !important;
        }
        .ant-table-tbody > tr > td {
          color: ${textColor} !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(108, 92, 231, 0.15) !important;
        }
        .ant-pagination-item a {
          color: ${textColor} !important;
        }
        .ant-pagination-item-active {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-pagination-item-active a {
          color: #fff !important;
        }
        .ant-descriptions-item-label {
          background: #1a1a2e !important;
          color: ${textColor} !important;
        }
        .ant-descriptions-item-content {
          color: ${textColor} !important;
        }
        .ant-empty-description {
          color: ${textColor} !important;
        }
        .ant-tabs {
          color: ${textColor} !important;
        }
        .ant-tabs-tab-btn {
          color: ${textColor} !important;
        }
        .ant-spin-text {
          color: ${textColor} !important;
        }
        .ant-spin-dot-item {
          background-color: ${accentColor} !important;
        }
        .ant-drawer-title {
          color: ${textColor} !important;
        }
        .ant-drawer-close {
          color: ${textColor} !important;
        }
        .ant-drawer-header {
          background: ${cardBg} !important;
          border-bottom: 1px solid ${borderColor} !important;
        }
        .ant-drawer-body {
          background: ${bgColor} !important;
        }
        .ant-drawer-footer {
          background: ${cardBg} !important;
          border-top: 1px solid ${borderColor} !important;
        }
        .ant-input {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input-password {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
        }
        .ant-input-password input {
          background: transparent !important;
          color: ${textColor} !important;
        }
        .ant-select-selector {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-select-arrow {
          color: ${textColor} !important;
        }
        .ant-select-selection-item {
          color: ${textColor} !important;
        }
        .ant-tag {
          background: #1a1a2e !important;
          color: ${textColor} !important;
          border-color: ${borderColor} !important;
        }
        .ant-badge-count {
          background: ${accentColor} !important;
        }
        .ant-divider {
          border-color: ${borderColor} !important;
        }
        .ant-statistic-title {
          color: ${textColor} !important;
        }
        .ant-statistic-content {
          color: ${textColor} !important;
        }
        .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }
        .ant-modal-header {
          display: none !important;
        }
        .ant-modal-body {
          padding: 0 !important;
        }
        .ant-steps-item-icon {
          background: #1a1a2e !important;
          border-color: ${borderColor} !important;
        }
        .ant-steps-item-process .ant-steps-item-icon {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-steps-item-finish .ant-steps-item-icon {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
          color: #fff !important;
        }
        .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon {
          color: #fff !important;
        }
        .ant-steps-item-title {
          color: ${textColor} !important;
        }
        .ant-steps-item-process .ant-steps-item-title {
          color: ${accentColor} !important;
        }

        /* Full height tabs content */
        .ant-tabs-content-holder {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .ant-tabs-tabpane {
          flex: 1 !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default Sm_View_User;