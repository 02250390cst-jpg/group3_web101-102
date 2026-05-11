"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCamera, FiCheck, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@dcafe.com",
    phone: "+975 17123456",
    location: "Phuentsholing, Bhutan",
    description: "Passionate about serving the best organic coffee and homemade pastries in town. D'Cafe has been a local favorite since 2018.",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors">
            <FiArrowLeft />
            <span className="font-bold text-sm">Back to Dashboard</span>
          </Link>
          <button 
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
          >
            <FiCheck /> Save Changes
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {/* COVER PHOTO GRADIENT */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500" />

          <div className="px-8 pb-10">
            {/* AVATAR UPLOAD */}
            <div className="relative -mt-16 mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-xl">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[1.8rem]" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-[1.8rem] bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-3xl">
                      JD
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-xl border-4 border-white hover:bg-orange-500 transition-all shadow-lg"
                >
                  <FiCamera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            {/* FORM */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Full Name" 
                  value={profile.name} 
                  onChange={(v) => setProfile({...profile, name: v})} 
                />
                <InputGroup 
                  label="Phone Number" 
                  icon={<FiPhone className="text-gray-400" />}
                  value={profile.phone} 
                  onChange={(v) => setProfile({...profile, phone: v})} 
                />
                <InputGroup 
                  label="Email Address" 
                  icon={<FiMail className="text-gray-400" />}
                  value={profile.email} 
                  onChange={(v) => setProfile({...profile, email: v})} 
                />
                <InputGroup 
                  label="Location" 
                  icon={<FiMapPin className="text-gray-400" />}
                  value={profile.location} 
                  onChange={(v) => setProfile({...profile, location: v})} 
                />
              </div>

              {/* DESCRIPTION TEXTAREA */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                  Owner Description
                </label>
                <textarea 
                  rows="4"
                  className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  placeholder="Tell your customers about yourself..."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${icon ? 'pl-12' : ''}`}
        />
      </div>
    </div>
  );
}