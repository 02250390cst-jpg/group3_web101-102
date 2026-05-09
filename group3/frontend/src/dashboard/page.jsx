"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiLayout, FiShoppingBag, FiUsers, FiStar, 
  FiSettings, FiChevronLeft, FiPlus 
} from 'react-icons/fi';
import { 
  MdOutlineRestaurantMenu, 
  MdLightbulbOutline,
  MdOutlineTableBar 
} from 'react-icons/md';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vm_token');
    if (!token) {
      router.replace('/signin');
      return;
    }

    const storedUser = localStorage.getItem('vm_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        setUser(null);
      }
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR - Updated to match your brand */}
      <aside className="w-64 bg-white flex flex-col p-4 border-r border-gray-200">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
              <path d="M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">VirtualMenu</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<FiLayout size={18}/>} label="Dashboard" active />
          <NavItem icon={<MdOutlineRestaurantMenu size={18}/>} label="Menu Management" />
          <NavItem icon={<FiShoppingBag size={18}/>} label="Orders" />
          <NavItem icon={<FiUsers size={18}/>} label="Customers" />
          <NavItem icon={<FiStar size={18}/>} label="Reviews" />
          <NavItem icon={<FiSettings size={18}/>} label="Setting" />
        </nav>

        {/* PROFILE SECTION */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="bg-orange-50 p-3 rounded-2xl flex items-center gap-3 border border-orange-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 border-2 border-white flex items-center justify-center text-white font-bold text-xs">
              {(user?.name || 'JD').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-gray-800">{user?.name || 'John Doe'}</p>
              <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">{user?.role || 'Owner'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, D'Cafe!</h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your store today.</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100">
            <FiPlus /> Add New Item
          </button>
        </header>

        {/* HERO BANNER - Updated with Orange Gradient */}
        <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-10 bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center px-12 shadow-2xl shadow-orange-100">
          <div className="z-10 max-w-sm">
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Good food brings <span className="text-yellow-300 underline decoration-2 underline-offset-4">happiness</span> to life!
            </h2>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Manage your menu, receive more orders, and grow your business today.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000')] bg-cover bg-center" 
               style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Orders" value="128" sub="Today" />
          <StatCard title="Total Revenue" value="Nu. 14,650" sub="earned" />
          <StatCard title="Review Rating" value="4.8" sub="from 240 reviews" isRating />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* RECENT ORDERS */}
          <div className="xl:col-span-2">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdOutlineTableBar className="text-orange-500" /> Recent Orders
              </h3>
              <div className="space-y-4">
                <OrderRow id="#ORD03" status="New" sColor="bg-orange-100 text-orange-600" name="Karma Wangchuk" qty="2 Items" price="Nu. 650" time="10:40 AM" />
                <OrderRow id="#ORD02" status="Preparing" sColor="bg-blue-100 text-blue-600" name="Kencho Dorji" qty="1 Items" price="Nu. 200" time="09:56 AM" />
                <OrderRow id="#ORD01" status="On the way" sColor="bg-green-100 text-green-600" name="Dechen Yangzom" qty="4 Items" price="Nu. 950" time="09:20 AM" />
              </div>

              {/* BUSINESS TIP BOX */}
              <div className="mt-10 bg-slate-900 p-6 rounded-3xl text-white flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="bg-orange-500 p-3 rounded-2xl h-fit">
                    <MdLightbulbOutline className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Business Tip</h4>
                    <p className="text-xs text-gray-400 mt-1">Keep your menu updated with seasonal items to attract 20% more customers.</p>
                  </div>
                </div>
                <button className="bg-white text-gray-900 px-5 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 hover:text-white transition-all">
                  View Insights
                </button>
              </div>
            </div>
          </div>

          {/* SALES CHART AREA */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm">Sales Overview</h3>
              <select className="text-[10px] border-none bg-gray-50 rounded-lg px-2 py-1 font-bold text-gray-500 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Revenue Growth</p>
            <div className="flex items-baseline gap-2 mb-8">
               <p className="text-3xl font-black">Nu. 24,560</p>
               <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-md">↑ 8.3%</span>
            </div>
            
            {/* SVG Wave Chart */}
            <div className="relative h-32 w-full">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible drop-shadow-lg">
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 C10,30 20,5 30,15 C40,25 50,35 60,25 C70,15 85,20 100,5" 
                      fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                <path d="M0,35 C10,30 20,5 30,15 C40,25 50,35 60,25 C70,15 85,20 100,5 L100,40 L0,40 Z" 
                      fill="url(#gradient)" />
                <circle cx="30" cy="15" r="3" fill="#f97316" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between mt-6 text-[10px] text-gray-400 font-bold uppercase">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sidebar Navigation Item Component
function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
      <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
      <span className="font-bold text-[13px]">{label}</span>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, sub, isRating }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-orange-500 transition-colors">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-black text-gray-800">{value}</p>
        {isRating && <FiStar className="text-yellow-400 fill-yellow-400" />}
      </div>
      <p className="text-[10px] text-gray-400 font-semibold mt-1 italic">{sub}</p>
    </div>
  );
}

// Order Row Component
function OrderRow({ id, status, sColor, name, qty, price, time }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 rounded-xl px-2 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <span className="text-[11px] font-bold text-gray-300 w-12">{id}</span>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-gray-800">{name}</span>
          <span className="text-[10px] text-gray-400 font-medium">{time}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <span className="text-xs font-bold text-gray-500 w-16">{qty}</span>
        <span className="text-sm font-black text-gray-900 w-20">{price}</span>
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter w-24 text-center ${sColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}