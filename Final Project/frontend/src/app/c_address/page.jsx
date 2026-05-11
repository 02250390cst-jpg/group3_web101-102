"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaHeadset,
  FaCog,
  FaPlus,
  FaTrash,
  FaMapPin,
  FaCommentDots,
  FaCheckCircle,
} from "react-icons/fa";

export default function CustomerAddress() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = "Khamsum";

  // Address State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "Rinchending, Building 4, Apt 2B",
      city: "Phuentsholing, Chukha",
      comment: "Ring the bell, the gate is usually unlocked.",
    },
  ]);

  const menuItems = [
    { name: "Home", icon: FaHome, active: false, href: "/dashboard2" },
    { name: "Orders", icon: FaBox, active: false, href: "/c_orders" },
    { name: "Favourites", icon: FaHeart, active: false, href: "/favourites" },
    { name: "Addresses", icon: FaMapMarkerAlt, active: true, href: "/c_address" },
    { name: "Offers", icon: FaTag, active: false, href: "/offers" },
    { name: "Help & Support", icon: FaHeadset, active: false, href: "/support" },
    { name: "Setting", icon: FaCog, active: false, href: "/settings" },
  ];

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-white p-2.5 rounded-xl shadow-lg border border-amber-200">
          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Consistent Sidebar */}
        <aside className={`fixed lg:static top-0 left-0 z-40 w-72 h-screen bg-white/95 backdrop-blur-sm border-r border-amber-100 shadow-sm transform transition-transform duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="sticky top-0 p-6 space-y-8 h-full overflow-y-auto flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">GF</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">GoodFood</h1>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Delivery</p>
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <Link key={item.name} href={item.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${item.active ? "bg-amber-50 text-amber-800 font-bold border-l-4 border-amber-500 shadow-sm" : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-700"}`}>
                  <item.icon className="text-xl" />
                  <span className="text-base">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-amber-100">
               <div className="flex items-center gap-3 p-2">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">{userName[0]}</div>
                 <div>
                   <p className="font-bold text-gray-800">{userName}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">My Account</p>
                 </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <header className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">My Addresses</h2>
            <p className="text-gray-500 font-medium">Manage your delivery locations and instructions.</p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            
            {/* Left: Saved Addresses List */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-amber-600" /> Saved Locations
              </h3>
              
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl">
                        <FaHome size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-gray-900">{addr.type}</h4>
                        <p className="text-gray-500 font-medium text-sm">{addr.city}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteAddress(addr.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-gray-800 font-bold mb-2">{addr.address}</p>
                    {addr.comment && (
                      <div className="flex items-start gap-2 text-gray-500 text-sm italic">
                        <FaCommentDots className="mt-1 flex-shrink-0 text-amber-500" />
                        <span>"{addr.comment}"</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-amber-100">
                  <p className="text-gray-400 font-bold">No addresses saved yet.</p>
                </div>
              )}
            </div>

            {/* Right: Add New Address Form */}
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-amber-100 h-fit sticky top-10">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FaPlus className="text-amber-500" /> Add New Address
              </h3>

              <form className="space-y-6">
                {/* Address Type Selection */}
                <div className="grid grid-cols-3 gap-4">
                  {['Home', 'Work', 'Other'].map((type) => (
                    <button 
                      key={type} 
                      type="button" 
                      className={`py-3 rounded-2xl font-bold text-sm border-2 transition-all ${type === 'Home' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-amber-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Detailed Address</label>
                  <div className="relative">
                    <FaMapPin className="absolute left-4 top-4 text-amber-500" />
                    <input 
                      type="text" 
                      placeholder="Street name, Building No, Apartment No..." 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">City / Dzongkhag</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Phuentsholing" 
                    className="w-full px-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Comment Section */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Delivery Instructions (Comment)</label>
                  <textarea 
                    rows="4" 
                    placeholder="e.g. Near the big prayer wheel, call when arrived, don't knock too loud..." 
                    className="w-full px-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none italic"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <FaCheckCircle /> Save Address
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Banner */}
          <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h4 className="text-xl font-black mb-1">Set Default Address?</h4>
              <p className="text-gray-400 text-sm">Your primary address is used for faster checkout.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-sm">NOT NOW</button>
              <button className="flex-1 md:flex-none px-8 py-3 bg-amber-500 text-white rounded-xl font-black text-sm shadow-lg shadow-amber-500/20">YES, SET DEFAULT</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}