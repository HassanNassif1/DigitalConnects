import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Select,
  notification,
  Checkbox,
  Card,
  Divider,
  Row,
  Col,
  Typography,
  Space,
  Tooltip,
} from "antd";
import { 
  PlusOutlined, 
  UserAddOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined, 
  StarOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CreditCardOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import countriesData from "./countries.json";
import chip from "./chip.png";
import logo from "./logo.png";

const { Text, Title } = Typography;

function Sm_Create_User() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCardDetailsVisible, setIsCardDetailsVisible] = useState(false);
  const [isBusinessProfile, setIsBusinessProfile] = useState(false);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [countries, setCountries] = useState([]);
  
  // Card flip states - each card has its own flip state
  const [flippedCards, setFlippedCards] = useState({});
  const [isCardNumberVisible, setCardNumberVisible] = useState({});
  const [isCvvVisible, setCvvVisible] = useState({});
  
  // Social Media States
  const [instagram, setInstagram] = useState("");
  const [instagramEmail, setInstagramEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [facebookEmail, setFacebookEmail] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [snapchatEmail, setSnapchatEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [linkedinEmail, setLinkedinEmail] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [tiktokEmail, setTiktokEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [twitterEmail, setTwitterEmail] = useState("");
  const [gmail, setGmail] = useState("");
  const [gmailEmail, setGmailEmail] = useState("");
  const [instagramPassword, setInstagramPassword] = useState("");
  const [facebookPassword, setFacebookPassword] = useState("");
  const [snapchatPassword, setSnapchatPassword] = useState("");
  const [linkedinPassword, setLinkedinPassword] = useState("");
  const [tiktokPassword, setTiktokPassword] = useState("");
  const [twitterPassword, setTwitterPassword] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Theme colors
  const bgColor = "#0a0a1a";
  const cardBg = "linear-gradient(145deg, #14142b, #1a1a35)";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7";
  const inputBg = "#1a1a35";
  const secondaryText = "rgba(255,255,255,0.6)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.05)";

  const navigate = useNavigate();
  
  const handleIsBusinessProfile = (e) => {
    setIsBusinessProfile(e.target.checked);
  };

  const toggleCardDetails = () => {
    setIsCardDetailsVisible((prevState) => !prevState);
    setFlippedCards({});
  };

  const handleFlip = (cardIndex) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardIndex]: !prev[cardIndex]
    }));
  };

  const handleFlipAll = () => {
    const allFlipped = cards.every((_, index) => flippedCards[index]);
    const newFlipState = {};
    cards.forEach((_, index) => {
      newFlipState[index] = !allFlipped;
    });
    setFlippedCards(newFlipState);
  };

  const toggleCardNumberVisibility = (cardIndex) => {
    setCardNumberVisible(prev => ({
      ...prev,
      [cardIndex]: !prev[cardIndex]
    }));
  };

  const toggleCvvVisibility = (cardIndex) => {
    setCvvVisible(prev => ({
      ...prev,
      [cardIndex]: !prev[cardIndex]
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setCountries(countriesData);
    
    const phoneCodeMap = countriesData.reduce((acc, country) => {
      acc[country.name] = country.phoneCode;
      return acc;
    }, {});
    
    setCountryPhoneCodes(phoneCodeMap);
  }, []);

  const [cards, setCards] = useState([
    {
      cardHolderName: "",
      cardNumber: "",
      expirationYear: "",
      expirationMonth: "",
      cvv: "",
      billingAddress: "",
      cardType: "",
      customCardType: "",
    },
  ]);

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        cardHolderName: "",
        cardNumber: "",
        expirationYear: "",
        expirationMonth: "",
        cvv: "",
        billingAddress: "",
        cardType: "",
        customCardType: "",
      },
    ]);
  };

  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    // Clean up flip states
    const newFlipState = { ...flippedCards };
    delete newFlipState[index];
    setFlippedCards(newFlipState);
  };

  const handleCountryChange = (value) => {
    setSelectedNationality(value);
    const code = countryPhoneCodes[value] || "";
    setCountryCode(code);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
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

    Promise.all(previews).then((previewUrls) => {
      setAdditionalImagePreviews(previewUrls);
    });
  };

  // Format card number with spaces
  const formatCardNumber = (num) => {
    if (!num) return "";
    const parts = [];
    const str = num.toString().replace(/\s/g, '');
    for (let i = 0; i < str.length; i += 4) {
      parts.push(str.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  // Format date for card display
  const formatDateCard = (month, year) => {
    if (!month && !year) return "MM / YY";
    return `${month || "MM"} / ${year ? year.slice(-2) : "YY"}`;
  };

  // Helper function to add credit cards after user creation
  const addCreditCards = async (userId, cardsData) => {
    const cardPromises = cardsData.map(card => {
      const cardPayload = {
        card_holder_name: card.cardHolderName || "",
        card_number: card.cardNumber || "",
        expiration_date: card.expirationYear && card.expirationMonth 
          ? `${card.expirationYear}-${card.expirationMonth}-01` 
          : "",
        cvv: card.cvv || "",
        billing_address: card.billingAddress || "",
        user_id: userId,
        card_type: card.cardType === "Other" ? card.customCardType : card.cardType,
      };
      
      if (cardPayload.card_number && cardPayload.cvv && cardPayload.user_id) {
        return axios.post("http://localhost:5000/post-credit-cards", cardPayload);
      }
      return null;
    }).filter(promise => promise !== null);

    if (cardPromises.length === 0) {
      return { success: true, message: "No valid credit cards to add" };
    }

    try {
      const results = await Promise.all(cardPromises);
      return { 
        success: true, 
        count: results.length,
        message: `${results.length} credit card(s) added successfully`
      };
    } catch (error) {
      console.error("Error adding credit cards:", error);
      return { 
        success: false, 
        message: "Failed to add credit cards" 
      };
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      formData.append("username", values.username || "");
      if (isBusinessProfile && values.businessname) {
        formData.append("business_name", values.businessname);
      }
      formData.append("nationality", selectedNationality || values.nationality || "");
      
      const dateOfBirth = selectedYear && selectedMonth && selectedDay
        ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
        : "";
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("address", values.address || "");
      formData.append("phonenumber", phoneNumber);
      formData.append("countrycode", countryCode);
      formData.append("gender", gender);
      formData.append("email", email);
      formData.append("isverified", true);

      // Social Media fields
      formData.append("instagram", instagram || "");
      formData.append("facebook", facebook || "");
      formData.append("snapchat", snapchat || "");
      formData.append("linkedin", linkedin || "");
      formData.append("tiktok", tiktok || "");
      formData.append("twitter", twitter || "");
      formData.append("gmail", gmail || "");
      
      formData.append("instagramPassword", instagramPassword || "");
      formData.append("facebookPassword", facebookPassword || "");
      formData.append("snapchatPassword", snapchatPassword || "");
      formData.append("linkedinPassword", linkedinPassword || "");
      formData.append("tiktokPassword", tiktokPassword || "");
      formData.append("twitterPassword", twitterPassword || "");
      formData.append("gmailPassword", gmailPassword || "");
      
      formData.append("instagramEmail", instagramEmail || "");
      formData.append("facebookEmail", facebookEmail || "");
      formData.append("snapchatEmail", snapchatEmail || "");
      formData.append("linkedinEmail", linkedinEmail || "");
      formData.append("tiktokEmail", tiktokEmail || "");
      formData.append("twitterEmail", twitterEmail || "");
      formData.append("gmailEmail", gmailEmail || "");

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      additionalImages.forEach((image) => {
        formData.append("additionalImages", image);
      });

      const response = await axios.post(
        "http://localhost:5000/CreateUser",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const userId = response.data.id || response.data.userId;
        
        notification.success({
          message: "Success",
          description: response.data.message || "User created successfully!",
        });
        
        if (isCardDetailsVisible && cards.length > 0 && userId) {
          const cardData = cards.filter(card => card.cardNumber && card.cvv);
          if (cardData.length > 0) {
            const cardResult = await addCreditCards(userId, cardData);
            if (cardResult.success) {
              notification.success({
                message: "Credit Cards Added",
                description: cardResult.message,
              });
            } else {
              notification.warning({
                message: "Partial Success",
                description: "User created but some credit cards could not be added.",
              });
            }
          }
        }
        
        setTimeout(() => navigate("/Users"), 1500);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      
      let errorMessage = "Failed to create user. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render a single card with 3D flip - FIXED to keep form in place
  const renderCard = (card, index) => {
    const cardNumberDisplay = formatCardNumber(card.cardNumber) || "•••• •••• •••• ••••";
    const cardHolderDisplay = card.cardHolderName.toUpperCase() || "CARD HOLDER";
    const expDisplay = formatDateCard(card.expirationMonth, card.expirationYear);
    const cardTypeDisplay = card.cardType === "Other" ? card.customCardType : card.cardType || "Standard";
    const isFlipped = flippedCards[index] || false;
    const isCardNumVisible = isCardNumberVisible[index] || false;
    const isCvvVisibleState = isCvvVisible[index] || false;

    return (
      <div key={index} style={{ marginBottom: 32 }}>
        {/* Card Preview Container - Fixed height so it doesn't move */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          height: '280px',
          margin: '0 auto',
          position: 'relative',
        }}>
          {/* 3D Flip Container - Only this flips, stays in the same position */}
          <div
            style={{
              width: '100%',
              height: '100%',
              perspective: '1000px',
              cursor: 'pointer',
            }}
            onClick={() => handleFlip(index)}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* === FRONT FACE === */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1a1a3e 0%, #0d0d24 100%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'rotateY(0deg)',
                  zIndex: 2,
                }}
              >
                {/* Glossy Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
                    transform: 'rotate(25deg)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Row: Card Type & Logo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      Digital Connects
                    </div>
                    <div style={{ color: 'gold', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>
                      {cardTypeDisplay}
                    </div>
                  </div>
                  <img
                    src={chip}
                    alt="Chip"
                    style={{ height: '40px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                </div>

                {/* Card Number */}
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      color: '#ffffff',
                      fontSize: '22px',
                      letterSpacing: '4px',
                      fontWeight: '500',
                      fontFamily: 'monospace',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{cardNumberDisplay}</span>
                    <Tooltip title="Toggle visibility">
                      <Button
                        type="text"
                        size="small"
                        icon={isCardNumVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardNumberVisibility(index);
                        }}
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      />
                    </Tooltip>
                  </div>
                </div>

                {/* Bottom Row: Name & Expiry */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingTop: '8px',
                    width: '100%',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      Card Holder
                    </div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: '#fff',
                        fontSize: '16px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {cardHolderDisplay}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      Expires
                    </div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '16px' }}>{expDisplay}</div>
                  </div>
                </div>

                {/* Flip Hint */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    color: 'rgba(255,255,255,0.15)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                  }}
                >
                  Click to flip
                </div>
              </div>

              {/* === BACK FACE === */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1a1a3e 0%, #0d0d24 100%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: 'rotateY(180deg)',
                  zIndex: 1,
                }}
              >
                {/* Magnetic Stripe */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
                    height: '45px',
                    width: '100%',
                    marginTop: '10px',
                    borderRadius: '4px',
                  }}
                />

                {/* CVV Strip */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    height: '40px',
                    width: '80%',
                    margin: '12px auto',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <span
                    style={{
                      color: '#1a1a1a',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ color: '#666', fontSize: '10px', fontWeight: 'normal' }}>CVV</span>
                    {isCvvVisibleState ? card.cvv || '•••' : '•••'}
                    <Tooltip title="Toggle visibility">
                      <Button
                        type="text"
                        size="small"
                        icon={isCvvVisibleState ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCvvVisibility(index);
                        }}
                        style={{ color: '#666' }}
                      />
                    </Tooltip>
                  </span>
                </div>

                {/* Footer */}
                <div
                  style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  AUTHORIZED SIGNATURE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Form Inputs - Completely separate, stays in place */}
        <div
          style={{
            maxWidth: '500px',
            margin: '16px auto 0',
          }}
        >
          <Card
            style={{
              background: inputBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: secondaryText, fontSize: 13 }}>Card #{index + 1}</Text>
              <Space>
                <Tooltip title={isFlipped ? 'Show Front' : 'Show Back'}>
                  <Button
                    icon={isFlipped ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
                    onClick={() => handleFlip(index)}
                    size="small"
                    style={{ borderColor: borderColor, color: textColor }}
                  />
                </Tooltip>
                {cards.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<PlusOutlined style={{ transform: 'rotate(45deg)' }} />}
                    onClick={() => removeCard(index)}
                    size="small"
                  />
                )}
              </Space>
            </div>

            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Input
                  placeholder="Card Holder Name"
                  value={card.cardHolderName}
                  onChange={(e) => handleCardChange(index, 'cardHolderName', e.target.value)}
                  style={{ background: inputBg, borderColor: borderColor, color: textColor }}
                  prefix={<UserOutlined style={{ color: secondaryText }} />}
                />
              </Col>
              <Col span={24}>
                <Input.Password
                  placeholder="Card Number"
                  value={card.cardNumber}
                  onChange={(e) => handleCardChange(index, 'cardNumber', e.target.value.replace(/\s/g, ''))}
                  style={{ background: inputBg, borderColor: borderColor, color: textColor }}
                  prefix={<CreditCardOutlined style={{ color: secondaryText }} />}
                />
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Year"
                  value={card.expirationYear}
                  onChange={(value) => handleCardChange(index, 'expirationYear', value)}
                  style={{ width: '100%' }}
                  dropdownStyle={{ background: bgColor }}
                >
                  <Select.Option value="">YY</Select.Option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <Select.Option key={i} value={String(new Date().getFullYear() + i)}>
                      {String(new Date().getFullYear() + i)}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Month"
                  value={card.expirationMonth}
                  onChange={(value) => handleCardChange(index, 'expirationMonth', value)}
                  style={{ width: '100%' }}
                  dropdownStyle={{ background: bgColor }}
                >
                  <Select.Option value="">MM</Select.Option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <Select.Option key={i} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Input.Password
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) => handleCardChange(index, 'cvv', e.target.value)}
                  style={{ background: inputBg, borderColor: borderColor, color: textColor }}
                  prefix={<LockOutlined style={{ color: secondaryText }} />}
                />
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Card Type"
                  value={card.cardType}
                  onChange={(value) => handleCardChange(index, 'cardType', value)}
                  style={{ width: '100%' }}
                  dropdownStyle={{ background: bgColor }}
                >
                  <Select.Option value="">Select</Select.Option>
                  <Select.Option value="Debit Card">Debit Card</Select.Option>
                  <Select.Option value="Credit Card">Credit Card</Select.Option>
                  <Select.Option value="Master Card">Master Card</Select.Option>
                  <Select.Option value="Wish Card">Wish Card</Select.Option>
                  <Select.Option value="OMT Card">OMT Card</Select.Option>
                  <Select.Option value="American Express">American Express</Select.Option>
                  <Select.Option value="Visa Card">Visa Card</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Col>
              {card.cardType === 'Other' && (
                <Col span={24}>
                  <Input
                    placeholder="Specify card type"
                    value={card.customCardType}
                    onChange={(e) => handleCardChange(index, 'customCardType', e.target.value)}
                    style={{ background: inputBg, borderColor: borderColor, color: textColor }}
                  />
                </Col>
              )}
              <Col span={24}>
                <Input
                  placeholder="Billing Address (Optional)"
                  value={card.billingAddress}
                  onChange={(e) => handleCardChange(index, 'billingAddress', e.target.value)}
                  style={{ background: inputBg, borderColor: borderColor, color: textColor }}
                  prefix={<GlobalOutlined style={{ color: secondaryText }} />}
                />
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  };

  // Check if all cards are flipped
  const allFlipped = cards.every((_, index) => flippedCards[index]);

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
                <UserAddOutlined style={{ color: accentColor, marginRight: 12 }} />
                Add New Client
              </Title>
              <Text style={{ color: secondaryText, fontSize: 15 }}>
                Create a new client profile with all their information
              </Text>
            </div>
            <Button
              onClick={() => navigate("/Users")}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${borderColor}`,
                color: textColor,
                borderRadius: 8,
              }}
            >
              Back to Clients
            </Button>
          </div>
          <Divider style={{ borderColor: borderColor }} />
        </div>

        {/* Main Form Card */}
        <Card style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 16,
          boxShadow: cardShadow,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '24px' }}>
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Business Profile Section */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Text strong style={{ color: textColor, fontSize: 16, display: 'block', marginBottom: 12 }}>
                  Is Business Profile?
                </Text>
                <Space size="large">
                  <Checkbox
                    checked={isBusinessProfile}
                    onChange={handleIsBusinessProfile}
                    style={{ color: textColor }}
                  >
                    Yes
                  </Checkbox>
                  <Checkbox
                    checked={!isBusinessProfile}
                    onChange={() => setIsBusinessProfile(false)}
                    style={{ color: textColor }}
                  >
                    No
                  </Checkbox>
                </Space>
              </div>

              <Divider style={{ borderColor: borderColor }} />

              <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Client Name</Text>}
                    name="username"
                    rules={[{ required: true, message: 'Please enter client name' }]}
                  >
                    <Input
                      placeholder="Client Name"
                      size="large"
                      prefix={<UserOutlined style={{ color: secondaryText }} />}
                      style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                    />
                  </Form.Item>

                  {isBusinessProfile && (
                    <Form.Item
                      label={<Text style={{ color: secondaryText }}>Business Name</Text>}
                      name="businessname"
                    >
                      <Input
                        placeholder="Business Name"
                        size="large"
                        prefix={<StarOutlined style={{ color: secondaryText }} />}
                        style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Country</Text>}
                    name="nationality"
                    rules={[{ required: true, message: 'Please select a country' }]}
                  >
                    <Select
                      placeholder="Select a country"
                      size="large"
                      style={{ width: '100%' }}
                      value={selectedNationality}
                      onChange={handleCountryChange}
                      dropdownStyle={{ background: bgColor, borderColor: borderColor }}
                    >
                      {countries.map((country) => (
                        <Select.Option key={country.code} value={country.name}>
                          <span style={{ color: textColor }}>{country.name}</span>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div style={{ marginBottom: 16 }}>
                    <Text style={{ color: secondaryText, display: 'block', marginBottom: 8 }}>
                      Date Of Birth
                    </Text>
                    <Row gutter={[8, 8]}>
                      <Col span={8}>
                        <Input
                          type="number"
                          placeholder="MM"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          min="1"
                          max="12"
                          size="large"
                          style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                        />
                      </Col>
                      <Col span={8}>
                        <Input
                          type="number"
                          placeholder="DD"
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          min="1"
                          max="31"
                          size="large"
                          style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                        />
                      </Col>
                      <Col span={8}>
                        <Input
                          type="number"
                          placeholder="YYYY"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          min="1900"
                          max="2100"
                          size="large"
                          style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                        />
                      </Col>
                    </Row>
                  </div>

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Email</Text>}
                    name="email"
                    validateStatus={emailError ? "error" : ""}
                    help={emailError}
                    rules={[{ required: true, message: 'Please enter email' }]}
                  >
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="large"
                      prefix={<MailOutlined style={{ color: secondaryText }} />}
                      style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Address</Text>}
                    name="address"
                  >
                    <Input
                      placeholder="Address"
                      size="large"
                      prefix={<GlobalOutlined style={{ color: secondaryText }} />}
                      style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Phone Number</Text>}
                    name="phonenumber"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input
                      placeholder={`Phone Number (${countryCode})`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      size="large"
                      prefix={<PhoneOutlined style={{ color: secondaryText }} />}
                      style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Gender</Text>}
                    name="gender"
                    rules={[{ required: true, message: 'Please select gender' }]}
                  >
                    <Select
                      placeholder="Select Gender"
                      value={gender}
                      onChange={(value) => setGender(value)}
                      size="large"
                      style={{ width: '100%' }}
                      dropdownStyle={{ background: bgColor, color: textColor }}
                    >
                      <Select.Option value="male">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Profile Image</Text>}
                    name="profileImage"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Input
                        type="file"
                        onChange={handleProfileImageChange}
                        size="large"
                        style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Selected preview"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                          }}
                        />
                      )}
                    </div>
                  </Form.Item>

                  <Form.Item
                    label={<Text style={{ color: secondaryText }}>Additional Images</Text>}
                    name="additionalImages"
                  >
                    <Input
                      type="file"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      size="large"
                      style={{ background: inputBg, borderColor: borderColor, color: textColor, borderRadius: 8 }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {additionalImagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Additional preview ${index}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                          }}
                        />
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              {/* Card Details Section with 3D Flip */}
              {isCardDetailsVisible && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Title level={4} style={{ color: textColor, margin: 0 }}>
                      💳 Card Details
                    </Title>
                    <Space>
                      <Tooltip title={allFlipped ? "Show Front All" : "Show Back All"}>
                        <Button 
                          icon={allFlipped ? <ArrowLeftOutlined /> : <ArrowRightOutlined />} 
                          onClick={handleFlipAll}
                          style={{ borderColor: borderColor, color: textColor }}
                        >
                          {allFlipped ? 'Show Front' : 'Show Back'}
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>

                  {cards.map((card, index) => renderCard(card, index))}

                  <Button
                    type="dashed"
                    onClick={addCard}
                    icon={<PlusOutlined />}
                    style={{
                      borderColor: borderColor,
                      color: accentColor,
                      width: '100%',
                      height: 40,
                    }}
                  >
                    Add Another Card
                  </Button>
                </div>
              )}

              <Divider style={{ borderColor: borderColor }} />

              {/* Footer Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
              }}>
                <button
                  type="button"
                  onClick={toggleCardDetails}
                  style={{
                    background: 'transparent',
                    fontSize: '28px',
                    border: 'none',
                    cursor: 'pointer',
                    color: textColor,
                  }}
                  title="Toggle Card Details"
                >
                  💳
                </button>
                <Space>
                  <Button
                    onClick={() => navigate("/Users")}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      borderRadius: 8,
                      padding: '0 30px',
                      height: 40,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #8b7cf7)`,
                      border: 'none',
                      boxShadow: `0 4px 15px ${accentColor}44`,
                      borderRadius: 8,
                      padding: '0 30px',
                      height: 40,
                      fontWeight: 600,
                    }}
                  >
                    Create Client
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        </Card>
      </div>

      <style>{`
        .ant-checkbox-wrapper {
          color: ${textColor} !important;
        }
        .ant-checkbox-inner {
          background: rgba(255,255,255,0.05) !important;
          border-color: ${borderColor} !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          background: ${accentColor} !important;
          border-color: ${accentColor} !important;
        }
        .ant-input {
          background: ${inputBg} !important;
          border-color: ${borderColor} !important;
          color: ${textColor} !important;
        }
        .ant-input::placeholder {
          color: ${secondaryText} !important;
        }
        .ant-input:focus {
          border-color: ${accentColor} !important;
          box-shadow: 0 0 0 4px rgba(108,92,231,0.1) !important;
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
          color: ${secondaryText} !important;
        }
        .ant-select-selection-item {
          color: ${textColor} !important;
        }
        .ant-select-item-option {
          background: ${bgColor} !important;
          color: ${textColor} !important;
        }
        .ant-select-item-option:hover {
          background: ${inputBg} !important;
        }
        .ant-select-item-option-selected {
          background: ${accentColor}22 !important;
        }
        .ant-form-item-label > label {
          color: ${secondaryText} !important;
        }
        .ant-divider {
          border-color: ${borderColor} !important;
        }
        .ant-btn-dashed {
          border-color: ${borderColor} !important;
          color: ${accentColor} !important;
        }
        .ant-card {
          background: transparent !important;
        }
        .ant-card-head {
          border-bottom: 1px solid ${borderColor} !important;
        }
        .ant-tooltip-inner {
          background: ${bgColor} !important;
          color: ${textColor} !important;
        }
      `}</style>
    </div>
  );
}

export default Sm_Create_User;