"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { name: "Margherita Pizza", price: "$12.99", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop" },
  { name: "Grilled Chicken",  price: "$14.99", img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=80&h=80&fit=crop" },
  { name: "Pasta Alfredo",    price: "$11.99", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=80&h=80&fit=crop" },
  { name: "Iced Coffee",      price: "$4.99",  img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=80&h=80&fit=crop" },
];

const PhoneMockup = () => (
  <div className="relative w-[220px] mx-auto animate-float">
    <div
      className="bg-white rounded-[36px] overflow-hidden border border-gray-200"
      style={{ width: 220, boxShadow: "0 30px 80px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="bg-white px-5 pt-4 pb-1 flex justify-between items-center text-[9px] text-gray-500 relative">
        <span>9:41</span>
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bg-black rounded-full" style={{ width: 52, height: 14 }} />
        <span>▲▲▲</span>
      </div>

      <div className="px-4 pt-3 pb-2">
        <p className="font-playfair font-bold text-base text-gray-800">Our Menu</p>
        <p className="text-[10px] text-gray-400">Delicious food, delivered</p>
        <div className="flex gap-2 mt-2">
          {["All", "Breakfast", "Main", "Drinks"].map((t, i) => (
            <span
              key={t}
              className={`text-[9px] px-2 py-0.5 rounded-full ${
                i === 0 ? "bg-[#2d5a27] text-white" : "text-gray-400"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="px-3 space-y-2 pb-2">
        {menuItems.map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">{item.name}</p>
              <p className="text-[10px] text-gray-500">{item.price}</p>
            </div>
            <button className="w-5 h-5 bg-[#2d5a27] text-white rounded-full text-xs flex items-center justify-center font-bold">
              +
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#2d5a27] mx-3 mb-3 rounded-xl px-3 py-2 flex justify-between items-center">
        <span className="text-white text-[9px]">🛒 View Cart (2)</span>
        <span className="text-white text-[9px] font-bold">$27.98</span>
      </div>
    </div>
  </div>
);

const tickerText = [
  "🍕 Easy Menu Management",
  "📦 Online Ordering",
  "📍 Track Orders Easily",
  "⭐ No Website Needed",
  "🚀 Register in Minutes",
];

export default function OwnerPage() {
  const [activeNav, setActiveNav] = useState("Home");
  const navLinks = ["Home", "Features", "How it Works", "Contact"];

  return (
    <div className="min-h-screen font-dm bg-[#f0f4f0]">

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-11 h-11 rounded-full border-2 border-[#e85d04] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2" strokeLinecap="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                <path d="M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[3px] text-[#e85d04] uppercase leading-none">Virtual</p>
              <p className="text-[10px] font-bold tracking-[3px] text-[#e85d04] uppercase leading-none">Menu</p>
            </div>
          </Link>

          <ul className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <li key={link}>
                <button
                  onClick={() => setActiveNav(link)}
                  className={`text-sm font-medium transition-colors ${
                    activeNav === link
                      ? "text-[#2d5a27] border-b-2 border-[#2d5a27] pb-0.5"
                      : "text-gray-600 hover:text-[#2d5a27]"
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          <Link href="/">
            <p className="text-xs font-bold tracking-widest text-[#2d5a27] uppercase cursor-pointer hover:text-[#1e3d1a]">
              Back to Home
            </p>
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d5a27" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span className="text-xs font-medium text-gray-600">
              Business Owner Portal - Manage Your Restaurant
            </span>
          </div>

          <div>
            <h1 className="font-playfair font-black text-5xl text-gray-900 leading-tight tracking-tight">
              OWNER
            </h1>
            <p className="font-dm font-semibold text-sm tracking-[3px] text-gray-700 uppercase mt-1">
              Manage Your Dishes & Orders
            </p>
            <div className="w-24 h-[3px] bg-[#e85d04] rounded mt-3" />
          </div>

          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Welcome to your business dashboard. Manage your menu, track orders, 
            and grow your restaurant business all from one place.
          </p>

         <div className="flex flex-wrap gap-4">
  <Link href="/register">
    <button className="flex items-center gap-3 bg-[#2d5a27] hover:bg-[#1e3d1a] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      Register Your Business
    </button>
  </Link>
  
  <Link href="/already">
    <button className="flex items-center gap-2 bg-[#3d7a35] hover:bg-[#2d5a27] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg">
      Already have an account? 
    </button>
  </Link>
</div>

          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { icon: "✓", label: "Easy Menu Management" },
              { icon: "🛒", label: "Online Ordering" },
              { icon: "📍", label: "Track Orders Easily" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#2d5a27] text-xs shadow-sm">
                  {f.icon}
                </span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center h-[480px]">
          <div
            className="absolute right-0 top-0 w-[68%] h-[88%] rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=420&fit=crop"
              alt="Food spread"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="absolute left-0 bottom-8 w-[38%] h-[44%] rounded-2xl overflow-hidden border-4 border-[#f0f4f0]"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=260&fit=crop"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute left-[18%] bottom-0 z-10">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <div className="border-t border-b border-gray-200 bg-white overflow-hidden py-3">
        <div
          className="flex whitespace-nowrap"
          style={{
            width: "200%",
            animation: "ticker 18s linear infinite",
          }}
        >
          {[...tickerText, ...tickerText].map((t, i) => (
            <span key={i} className="inline-block text-xs font-semibold text-[#2d5a27] uppercase tracking-widest px-10">
              {t} <span className="text-[#e85d04] mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-8 py-10 flex items-center gap-6">
        <div className="flex-1 h-px bg-gray-300" />
        <div className="text-center">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">Owner Dashboard</p>
          <h2 className="font-playfair font-bold text-2xl text-gray-800">
            Everything You Need to Run Your Food Business
          </h2>
        </div>
        <div className="flex-1 h-px bg-gray-300" />
      </section>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}