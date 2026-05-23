"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaStar, FaShoppingBasket, FaInfoCircle } from "react-icons/fa";
import { listMenuItems, listRestaurants } from "../../lib/api";

function MenuContent() {
    // Add item to cart in localStorage
    const handleAddToCart = (item) => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      // If item already in cart, increase quantity
      const existing = cart.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all restaurants and find the one with the matching id
        const restaurants = await listRestaurants();
        const found = restaurants.find((r) => String(r.id) === String(id));
        setRestaurant(found || null);

        // Fetch menu items for this restaurant
        if (found) {
          const items = await listMenuItems({ restaurantId: found.id });
          setMenuItems(items);
          // Store menu in localStorage for recommendations
          localStorage.setItem("lastMenuItems", JSON.stringify(items));
          // Extract unique categories from menu items
          const uniqueCategories = [...new Set(items.map((item) => item.category || item.description || "Uncategorized"))];
          setCategories(uniqueCategories);
        } else {
          setMenuItems([]);
          setCategories([]);
        }
      } catch (e) {
        setRestaurant(null);
        setMenuItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!restaurant) return <div className="p-8 text-center text-red-500">Restaurant not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="relative h-64 w-full">
        {/* Restaurant profile image as background, fallback to initials */}
        {restaurant.profileImage ? (
          <img src={restaurant.profileImage} alt="Profile" className="absolute inset-0 w-full h-full object-cover z-0" />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 bg-orange-100">
            <span className="text-orange-500 font-bold text-6xl">
              {restaurant.name ? restaurant.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'H'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
        <div className="absolute top-6 left-6 z-20">
          <button onClick={() => router.push('/dashboard2')} className="bg-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
            <FaArrowLeft className="text-amber-700" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-500 font-medium mt-1">{restaurant.location || restaurant.cuisine || ''}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaStar className="text-amber-500" /> <span className="text-gray-800 font-bold">{restaurant.rating || '-'}</span>
                </span>
                <span>• 25-35 min</span>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl hidden sm:block"><FaInfoCircle className="text-amber-600 text-xl" /></div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full bg-white border border-amber-100 text-gray-600 font-semibold hover:bg-amber-600 hover:text-white transition-all shadow-sm">{cat}</button>
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">{category}<span className="h-1 w-12 bg-amber-400 rounded-full"></span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter(item => (item.category || item.description || "Uncategorized") === category).map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`border-2 p-0.5 rounded-sm ${item.isAvailable ? 'border-green-600' : 'border-red-600'}`}><div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-600' : 'bg-red-600'}`} /></div>
                          {item.isPopular && <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase">Popular</span>}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mt-2">{item.name}</h3>
                        <p className="text-amber-700 font-bold">Nu. {Number(item.price) % 1 === 0 ? Number(item.price) : Number(item.price).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        {/* FIXED: Check if item image exists before rendering Image tag */}
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <span className="text-gray-300 text-[10px]">No Image</span>
                        )}
                        <button
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-amber-600 px-4 py-1.5 rounded-lg font-bold shadow-lg border border-amber-100 hover:bg-amber-600 hover:text-white transition-all"
                          onClick={() => handleAddToCart(item)}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 inset-x-0 mx-auto max-w-lg px-4 z-50">
        <Link href="/c_orders">
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg"><FaShoppingBasket className="text-xl" /></div>
              <div><p className="text-xs text-amber-100">Ready to order?</p><p className="font-bold">Nu. 0.00</p></div>
            </div>
            <div className="flex items-center gap-2 font-bold">View Cart <FaArrowLeft className="rotate-180 text-sm" /></div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function RestaurantMenu() {
  return (
    <Suspense fallback={<div className="p-10 flex justify-center items-center h-screen text-amber-600 font-bold">Loading Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}