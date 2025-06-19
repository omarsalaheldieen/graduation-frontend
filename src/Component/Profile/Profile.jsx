import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import {
  faUser,
  faBirthdayCake,
  faEnvelope,
  faPhone,
  faTrash,
  faCamera
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    userage: '',
    useremail: '',
    userphone: '',
    userphoto: null,
  });
const navigate = useNavigate()
  useEffect(() => {
    setUserDetails({
      username: localStorage.getItem('userName') || '',
      userage: localStorage.getItem('userAge') || '',
      useremail: localStorage.getItem('userEmail') || '',
      userphone: localStorage.getItem('userPhone') || '',
      userphoto: localStorage.getItem('userPhoto') || null,
    });
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem('userPhoto', reader.result);
      setUserDetails((prev) => ({ ...prev, userphoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    localStorage.removeItem('userPhoto');
    setUserDetails((prev) => ({ ...prev, userphoto: null }));
  };

  return (
<div className="w-full min-h-screen bg-cream backdrop-blur-md shadow-inner rounded-none overflow-auto transition-all duration-500">
  {/* Header */}
  <div className="p-6 sm:p-8 text-center border-b border-peach">
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto">
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-oranges shadow-lg group">
        {userDetails.userphoto ? (
          <img
            src={userDetails.userphoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-cream text-5xl sm:text-6xl font-bold text-oranges">
            {userDetails.username ? userDetails.username[0] : 'U'}
          </div>
        )}
        <label
          htmlFor="photo-upload"
          className="absolute inset-0 bg-peach/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <FontAwesomeIcon icon={faCamera} className="text-2xl text-oranges animate-bounce" />
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>
      {userDetails.userphoto && (
        <button
          onClick={handleDeletePhoto}
          className="absolute -top-1 -right-1 text-lg text-oranges p-2 hover:scale-110 transition-transform z-20"
          title="Delete Photo"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>

    <h3 className="text-2xl sm:text-3xl font-bold text-oranges font-marker mt-4">{userDetails.username || 'John Doe'}</h3>
    <p className="text-sm sm:text-lg text-oranges">{userDetails.useremail || 'example@example.com'}</p>
  </div>

  {/* Details Section */}
  <div className="px-4 sm:px-8 md:px-16 lg:px-32 py-8 space-y-5">
    {[
      { icon: faUser, label: 'First Name', value: userDetails.username?.split(' ')[0] || '-' },
      { icon: faUser, label: 'Second Name', value: userDetails.username?.split(' ')[1] || '-' },
      { icon: faBirthdayCake, label: 'Age', value: userDetails.userage || '-' },
      { icon: faEnvelope, label: 'Email', value: userDetails.useremail || '-' },
      { icon: faPhone, label: 'Phone', value: userDetails.userphone || '-' },
    ].map(({ icon, label, value }, idx) => (
      <div
        key={idx}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-peach capitalize bg-gradient-to-r from-primary/10 via-peach/10 to-oranges/10 p-4 rounded-xl shadow hover:scale-[1.02] transition-all duration-300"
      >
        <div className="flex items-center gap-3 text-primary font-medium text-lg mb-2 sm:mb-0">
          <FontAwesomeIcon icon={icon} />
          {label}
        </div>
        <div className="text-peach text-lg break-all">{value}</div>
      </div>
    ))}

    {/* Go to Shop Button */}
    <div className="text-center pt-6">
      <button
        onClick={() => navigate('/')}
        className="w-full sm:w-auto bg-oranges text-white text-lg font-semibold px-6 sm:px-12 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        Go to Shop
      </button>
    </div>
  </div>
</div>



  );
}
