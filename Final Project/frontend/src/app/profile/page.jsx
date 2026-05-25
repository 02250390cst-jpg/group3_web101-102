"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCamera, FiCheck, FiMail, FiPhone, FiMapPin } from "react-icons/fi";


import { apiRequest } from "../../lib/api";
import { fetchCurrentUser } from "../../lib/user";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Load user info from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("vm_token");
    if (!token) return;
    fetchCurrentUser(token)
      .then(user => {
        setProfile((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          description: user.description || "",
        }));
        if (user.profileImage) setImagePreview(user.profileImage);
        localStorage.setItem("vm_user", JSON.stringify(user));
      })
      .catch(() => {});
  }, []);

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


  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("vm_token");
      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        profileImage: imagePreview,
      };
      const updated = await apiRequest("/api/profile", {
        method: "PUT",
        body: payload,
        token,
      });
      // Update localStorage
      localStorage.setItem("vm_user", JSON.stringify(updated));
      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-2 sm:p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
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
          <div className="h-24 sm:h-32 bg-gradient-to-r from-orange-500 to-red-500" />

          <div className="px-4 sm:px-8 pb-8 sm:pb-10">
            {/* AVATAR UPLOAD */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white p-1 shadow-xl">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[1.8rem]" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-[1.8rem] bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-3xl">
                      {profile.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

              {/* DESCRIPTION TEXTAREA REMOVED */}
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