"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiFilter, FiSearch, FiClock, FiTruck, FiShoppingBag } from "react-icons/fi";
import { MdOutlineTableBar } from "react-icons/md";

export default function OwnerOrdersPage() {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("vm_user"));
      setRestaurantId(user?.restaurantId ?? null);
      if (user?.restaurantId) {
        fetch(`/api/orders/restaurant/${user.restaurantId}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            setOrders(data || []);
          })
          .catch(() => setOrders([]));
      }
    } catch {
      setRestaurantId(null);
      setOrders([]);
    }
  }, []);

  const statusColors = {
    New: "bg-orange-100 text-orange-600 border-orange-200",
    Preparing: "bg-blue-100 text-blue-600 border-blue-200",
    Completed: "bg-green-100 text-green-600 border-green-200",
  };

  const ownerOrders = restaurantId ? orders.filter(o => o.restaurantId === restaurantId) : orders;
  const filteredOrders = filter === "All" ? ownerOrders : ownerOrders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-all mb-2 group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-xs uppercase tracking-widest">Back to Overview</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              Live Orders <span className="bg-orange-500 text-white text-xs py-1 px-3 rounded-full animate-pulse">Live</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search order ID..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-orange-50 transition-all shadow-sm">
              <FiFilter />
            </button>
          </div>
        </div>
        {/* STATUS TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["All", "New", "Preparing", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                filter === tab 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* ORDERS TABLE/GRID */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-orange-500 mb-1">{order.id}</span>
                        <span className="font-bold text-gray-800">{order.customer?.name || "Customer"}</span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                          <FiClock size={10} /> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm text-gray-600 font-medium max-w-[200px] truncate">
                        {order.items?.map(i => i.menuItem?.name).join(", ")}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        {order.type === "Delivery" ? <FiTruck /> : <MdOutlineTableBar />}
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-gray-900">Nu. {order.total}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {/* Actions (optional: implement status update via API) */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="py-20 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingBag className="text-gray-300 w-8 h-8" />
                </div>
                <p className="text-gray-400 font-bold">No {filter} orders found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}