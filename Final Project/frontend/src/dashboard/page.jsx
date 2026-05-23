"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
import { listRestaurants } from '../lib/api';
import { fetchCurrentUser } from '../lib/user';

export default function DashboardPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [weeklyData, setWeeklyData] = useState({ days: [], dailyRevenue: [], points: '', weekTotal: 0 });

  // ── Single function that updates ALL state from localStorage ────────────────
  const updateAll = useCallback(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    let restId = null;
    try {
      const user = JSON.parse(localStorage.getItem("vm_user"));
      restId = user?.restaurantId ?? null;
    } catch {}
    const myOrders = restId ? orders.filter(o => o.restaurantId === restId) : orders;

    // ── Today's stats ────────────────────────────────────────────────────────
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = myOrders.filter(o => {
      const orderDate = o.date || o.createdAt || "";
      return orderDate.slice(0, 10) === todayStr;
    });
    setTotalOrders(todayOrders.length);
    const revenue = todayOrders.reduce((sum, order) => {
      if (order.status === "Completed") {
        let val = 0;
        if (typeof order.total === "number") val = order.total;
        else if (typeof order.total === "string") {
          const num = Number(order.total);
          if (!isNaN(num)) val = num;
        }
        return sum + val;
      }
      return sum;
    }, 0);
    setTotalRevenue(revenue);

    // ── Recent orders ────────────────────────────────────────────────────────
    setRecentOrders(myOrders.slice(0, 3));

    // ── Weekly graph data ────────────────────────────────────────────────────
    // i=0 → 6 days ago, i=6 → today
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const dailyRevenue = days.map(day => {
      const dayStr = day.toISOString().slice(0, 10);
      return myOrders.reduce((sum, order) => {
        if (order.status === "Completed") {
          const orderDate = (order.date || order.createdAt || "").slice(0, 10);
          if (orderDate === dayStr) {
            let val = 0;
            if (typeof order.total === "number") val = order.total;
            else if (typeof order.total === "string") {
              const num = Number(order.total);
              if (!isNaN(num)) val = num;
            }
            return sum + val;
          }
        }
        return sum;
      }, 0);
    });
    const maxY = Math.max(...dailyRevenue, 1);
    const points = dailyRevenue.map((rev, i) => {
      const x = (i / 6) * 100;
      const y = 35 - (rev / maxY) * 30;
      return `${x},${y}`;
    }).join(' ');
    const weekTotal = dailyRevenue.reduce((a, b) => a + b, 0);
    setWeeklyData({ days, dailyRevenue, points, weekTotal });
  }, []);

  // ── On mount: run once, then every 5 seconds, then reset at midnight ────────
  useEffect(() => {
    updateAll();
    window.addEventListener("storage", updateAll);

    // Live polling every 5 seconds — updates everything including graph
    const liveInterval = setInterval(updateAll, 5000);

    // Midnight reset
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight - now;

    let dailyInterval = null;
    const midnightTimeout = setTimeout(() => {
      updateAll();
      dailyInterval = setInterval(updateAll, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      window.removeEventListener("storage", updateAll);
      clearInterval(liveInterval);
      clearTimeout(midnightTimeout);
      if (dailyInterval) clearInterval(dailyInterval);
    };
  }, [updateAll]);

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vm_token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    async function fetchUserAndRestaurant() {
      try {
        const userData = await fetchCurrentUser(token);
        setUser(userData);
        localStorage.setItem('vm_user', JSON.stringify(userData));
        if (userData?.restaurantId) {
          const restaurants = await listRestaurants();
          const found = restaurants.find(r => String(r.id) === String(userData.restaurantId));
          setRestaurant(found || null);
        }
      } catch {
        setUser(null);
        setRestaurant(null);
      } finally {
        setIsReady(true);
      }
    }
    fetchUserAndRestaurant();
  }, [router]);

  if (!isReady) return null;

  // Day labels for x-axis: e.g. SAT SUN MON TUE WED THU FRI
  const dayLabels = weeklyData.days.map(d =>
    d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3)
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white flex flex-col p-4 border-r border-gray-200">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
              <path d="M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">{restaurant?.name || user?.businessName || user?.cafeName || 'Your Cafe'}</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<FiLayout size={18}/>} label="Dashboard" active />
          <NavItem icon={<MdOutlineRestaurantMenu size={18}/>} label="Menu Management" href="/menu_management" />
          <NavItem icon={<FiShoppingBag size={18}/>} label="Orders" href="/o_orders" />
          <NavItem icon={<FiUsers size={18}/>} label="Customers" />
          <NavItem icon={<FiStar size={18}/>} label="Reviews" />
          <NavItem icon={<FiSettings size={18}/>} label="Setting" />
        </nav>

        {/* PROFILE SECTION */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link href="/profile">
            <div className="bg-orange-50 p-3 rounded-2xl flex items-center gap-3 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs overflow-hidden bg-gradient-to-tr from-orange-400 to-red-400">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'OW'
                )}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-gray-800">{user?.name || 'Owner'}</p>
                <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">Owner</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back to your cafe</h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your hotel/cafe today.</p>
          </div>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
            onClick={() => router.push('/menu_management')}
          >
            <FiPlus /> Add New Item
          </button>
        </header>

        {/* HERO BANNER */}
        <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-10 bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center px-12 shadow-2xl shadow-orange-100">
          <div className="z-10 max-w-sm">
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Good food brings <span className="text-yellow-300 underline decoration-2 underline-offset-4">happiness</span> to life!
            </h2>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Manage your menu, receive more orders, and grow your business today.
            </p>
          </div>
          <div
            className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000')",
              clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'
            }}
          />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Orders" value={totalOrders} sub="Today" />
          <StatCard title="Total Revenue" value={`Nu. ${totalRevenue.toLocaleString()}`} sub="earned" />
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
                {recentOrders.length === 0
                  ? <div className="text-gray-400 text-sm">No recent orders.</div>
                  : recentOrders.map(order => (
                    <OrderRow
                      key={order.id}
                      id={order.id}
                      status={order.status}
                      sColor={order.status === "Completed" ? "bg-green-100 text-green-600" : order.status === "Preparing" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}
                      name={order.customer}
                      qty={order.items}
                      price={`Nu. ${order.total}`}
                      time={order.time}
                    />
                  ))
                }
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

          {/* SALES CHART */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm">Sales Overview</h3>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Live</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Revenue (Today)</p>
            <div className="flex items-baseline gap-2 mb-8">
              <p className="text-3xl font-black">Nu. {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="relative h-32 w-full">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible drop-shadow-lg">
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={weeklyData.points}
                />
                <polygon
                  fill="url(#gradient)"
                  points={`0,40 ${weeklyData.points} 100,40`}
                />
                {weeklyData.points.split(' ').map((pt, i) => {
                  const [cx, cy] = pt.split(',');
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={i === 6 ? "3.5" : "2.5"}
                      fill={i === 6 ? "#f97316" : "white"}
                      stroke="#f97316"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>
            {/* X axis: correct days, today highlighted in orange */}
            <div className="flex justify-between mt-6 text-[10px] text-gray-400 font-bold uppercase">
              {dayLabels.map((label, i) => (
                <span key={i} className={i === 6 ? "text-orange-500" : ""}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sidebar Navigation Item Component
function NavItem({ icon, label, active = false, href }) {
  const content = (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
      <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
      <span className="font-bold text-[13px]">{label}</span>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
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