// app/c_orders/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaHeadset,
  FaCog,
  FaStar,
  FaPlus,
  FaMinus,
  FaTrash,
  FaEdit,
  FaClock,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

export default function CustomerOrders() {
    const router = require("next/navigation").useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState({
    1: 1,
    2: 1,
    3: 1,
  });

  // Get user name from localStorage
  const [userName, setUserName] = useState("");
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("vm_user"));
    setUserName(user?.name || "");
  }, []);

  const [cartItems, setCartItems] = useState([]);
  // Get current restaurantId from localStorage (from last menu visit)
  const [restaurantId, setRestaurantId] = useState(null);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("vm_user"));
    setRestaurantId(user?.restaurantId ?? null);
  }, []);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Get random recommendations from last restaurant menu
  const [recommendedItems, setRecommendedItems] = useState([]);
  React.useEffect(() => {
    const menu = JSON.parse(localStorage.getItem("lastMenuItems")) || [];
    // Pick up to 2 random items (not in cart)
    const notInCart = menu.filter((item) => !cartItems.some((c) => c.id === item.id));
    const shuffled = notInCart.sort(() => 0.5 - Math.random());
    setRecommendedItems(shuffled.slice(0, 2));
  }, [cartItems]);

  const menuItems = [
    { name: "Home", icon: FaHome, active: false, href: "/dashboard2" },
    { name: "Orders", icon: FaBox, active: true, href: "/c_orders" },
    { name: "Favourites", icon: FaHeart, active: false, href: "/favourites" },
    { name: "Addresses", icon: FaMapMarkerAlt, active: false, href: "/addresses" },
    { name: "Offers", icon: FaTag, active: false, href: "/offers" },
    { name: "Help & Support", icon: FaHeadset, active: false, href: "/support" },
    { name: "Setting", icon: FaCog, active: false, href: "/settings" },
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setQuantity({ ...quantity, [id]: newQuantity });
    }
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const itemTotal = cartItems.reduce((total, item) => {
    return total + item.price * (quantity[item.id] || 1);
  }, 0);

  const deliveryFee = 100;
  const platformFee = 50;
  const totalAmount = itemTotal + deliveryFee + platformFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-amber-200"
        >
          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - matching dashboard size */}
        <aside
          className={`
            fixed lg:static top-0 left-0 z-40
            w-72 h-full bg-white/95 backdrop-blur-sm border-r border-amber-100 shadow-sm
            transform transition-transform duration-300 ease-in-out
            lg:transform-none lg:translate-x-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="sticky top-0 p-6 space-y-8 h-full overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13">
                <img src="/logo.jpg" alt="GoodFood Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                  GoodFood
                </h1>
                <p className="text-xs text-gray-400">delivery</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        item.active
                          ? "bg-amber-50 text-amber-800 font-semibold shadow-sm border-l-4 border-amber-500"
                          : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-700"
                      }
                    `}
                  >
                    <Icon className="text-xl" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold">
                  {userName[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - matching dashboard padding */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="relative max-w-xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type="text"
                placeholder="Search for hotels & cafe or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-base rounded-full border border-amber-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Offer Banner - matching dashboard hero style */}
              <div className="relative bg-gradient-to-r from-amber-600/10 via-orange-500/10 to-amber-600/10 rounded-2xl p-6 overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-amber-800">Get 10% OFF on your first order</h3>
                  <p className="text-amber-600 text-sm mt-1">Use code: FIRST10</p>
                </div>
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl"></div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
                <p className="text-amber-600 text-sm font-medium mt-1">Review your order and proceed to checkout</p>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{item.restaurant}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <FaStar className="text-amber-500 text-sm" />
                              <span className="text-sm text-gray-600">{item.rating} ★</span>
                              <span className="text-xs text-gray-400 ml-1">{item.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, (quantity[item.id] || 1) - 1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <FaMinus className="text-gray-600 text-xs" />
                            </button>
                            <span className="font-semibold text-gray-800 text-base">
                              {quantity[item.id] || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, (quantity[item.id] || 1) + 1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                              <FaPlus className="text-gray-600 text-xs" />
                            </button>
                          </div>
                          <p className="font-bold text-amber-700 text-lg">
                            Nu. {item.price * (quantity[item.id] || 1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Items */}
              <button
                className="w-full py-3 rounded-xl border-2 border-dashed border-amber-300 text-amber-600 font-semibold text-base hover:bg-amber-50 transition-colors"
                onClick={() => router.push("/dashboard2")}
              >
                + Add more items
              </button>

              {/* You May Also Like */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">You may also like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-3 shadow-sm border border-amber-100 flex gap-3"
                    >
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-[10px]">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.restaurant}</p>
                        <p className="text-amber-700 font-bold text-sm mt-1">Nu. {item.price}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600 text-base">
                    <span>Item Total ({cartItems.length} items)</span>
                    <span>Nu. {itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-base">
                    <span>Delivery Fee</span>
                    <span>Nu. {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-base">
                    <span>Platform Fee</span>
                    <span>Nu. {platformFee}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pb-4 border-b border-gray-100">
                  <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                  <span className="font-bold text-amber-700 text-2xl">Nu. {totalAmount}</span>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 text-base mb-2">Delivery Information</h4>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-800 font-medium">Rinchending, Chukha</p>
                    <p className="text-gray-500 text-sm">Chukha, Bhutan</p>
                    <button className="text-amber-600 text-sm font-semibold mt-2 flex items-center gap-1">
                      <FaEdit size={12} /> Edit
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 rounded-xl p-3">
                  <FaClock size={14} />
                  <span className="text-sm font-semibold">Ready in 20-30min</span>
                </div>


                <button
                  className="w-full mt-5 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-bold text-base shadow-md hover:bg-gradient-to-r hover:from-amber-700 hover:to-orange-600 transition-all"
                  onClick={async () => {
                    if (cartItems.length === 0) return;
                    let restId = restaurantId;
                    try {
                      const user = JSON.parse(localStorage.getItem("vm_user"));
                      if (user && user.restaurantId) restId = user.restaurantId;
                    } catch {}
                    if (!restId && cartItems.length > 0 && cartItems[0].restaurantId) {
                      restId = cartItems[0].restaurantId;
                    }
                    // Prepare order payload for backend
                    const payload = {
                      restaurantId: restId,
                      items: cartItems.map(i => ({
                        menuItemId: i.id,
                        quantity: i.quantity || 1
                      })),
                      type: "Delivery"
                    };
                    try {
                      const res = await fetch("/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(payload)
                      });
                      if (res.ok) {
                        setCartItems([]);
                        localStorage.setItem("cart", JSON.stringify([]));
                        alert("Order placed!");
                      } else {
                        alert("Failed to place order. Please try again.");
                      }
                    } catch {
                      alert("Failed to place order. Please try again.");
                    }
                  }}
                >
                  Place Order
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By placing this order, you agree to our{" "}
                  <Link href="/terms" className="text-amber-600">Terms</Link> &{" "}
                  <Link href="#" className="text-amber-600">Privacy</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer - matching dashboard */}
          <div className="mt-12 text-center text-gray-400 text-sm border-t border-amber-100 pt-6">
            <p>© 2025 GoodFood — Delivering happiness, one meal at a time.</p>
          </div>
        </main>
      </div>
    </div>
  );
}