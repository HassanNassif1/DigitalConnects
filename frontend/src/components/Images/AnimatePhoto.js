import React from 'react';
import './ImageGallery.css'; // Import your CSS file
import InstagramImage from '../Images/instagram.png';
import FacebookImage from '../Images/facebook.png';
import XImage from '../Images/x.jpg';
import YoutubeImage from '../Images/youtube.png';
import TiktokImage from '../Images/tiktok.png';
import SnapImage from '../Images/snap.png';
const AnimatePhoto = () => {
  const images = {
    Instagram: InstagramImage,
    Facebook: FacebookImage,
    X: XImage,
    Youtube: YoutubeImage,
    Tiktok: TiktokImage,
    Snap:SnapImage,
  };

  return (
    <div className="image-gallery">
      {Object.entries(images).map(([name, imageUrl]) => (
        <div key={name} className="image-container">
          <img src={imageUrl} alt={name} className="image"  style={{ width: '80px', height: '80px' }} />
      
        </div>
      ))}
    </div>
  );
};

export default AnimatePhoto;
