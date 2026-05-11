// app/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listRestaurants } from "../../lib/api"; 
import {
  FaHome,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaHeadset,
  FaCog,
  FaArrowRight,
} from "react-icons/fa";

export default function CustomerDashboard() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [popularSpots, setPopularSpots] = useState([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vm_token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    const storedUser = localStorage.getItem("vm_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          setUserName(parsedUser.name);
        }
      } catch (error) {
        // Ignore malformed user data.
      }
    }

    setIsAuthChecked(true);
  }, [router]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const restaurants = await listRestaurants();
        const mappedRestaurants = restaurants.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          rating: 4.8,
          image: "",
          alt: restaurant.name,
          cuisine: restaurant.location,
          description: restaurant.description || "Popular nearby hotel",
        }));

        setPopularSpots(mappedRestaurants);
      } catch (error) {
        setPopularSpots([
          {
            id: 1,
            name: "Kizom Cafe Pizzeria & Bakery, Phuntsholing",
            rating: 4.4,
            image: "",
            alt: "pizza",
            cuisine: "Pizza • Bakery",
            description: "Popular nearby hotel",
          },
          {
            id: 2,
            name: "D' Cafe, Phuntsholing",
            rating: 4.5,
            image: "",
            alt: "cafe",
            cuisine: "Cafe • Coffee",
            description: "Popular nearby hotel",
          },
          {
            id: 3,
            name: "Mountain Cafe, Phuntsholing",
            rating: 4.5,
            image: "",
            alt: "cafe",
            cuisine: "Mountain Brew • Snacks",
            description: "Popular nearby hotel",
          },
          {
            id: 4,
            name: "Hotel Damchen, Phuntsholing",
            rating: 4.9,
            image: "",
            alt: "hotel",
            cuisine: "Fine Dining • Hotel",
            description: "Popular nearby hotel",
          },
        ]);
      }
    };

    if (isAuthChecked) {
      loadRestaurants();
    }
  }, [isAuthChecked]);

  if (!isAuthChecked) {
    return null;
  }

  const displaySpots = popularSpots.length > 0 ? popularSpots : [];
  const menuItems = [
    { name: "Home", icon: FaHome, active: true, href: "/dashboard" },
    { name: "Orders", icon: FaBox, active: false, href: "/c_orders" },
    { name: "Favourites", icon: FaHeart, active: false },
    { name: "Addresses", icon: FaMapMarkerAlt, active: false, href: "/c_address" },
    { name: "Offers", icon: FaTag, active: false },
    { name: "Help & Support", icon: FaHeadset, active: false },
    { name: "Setting", icon: FaCog, active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
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
        {/* Sidebar */}
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
                <img src="/logo.jpg" alt="GoodFood Logo" />
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
                    href={item.href || "#"}
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

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <section className="mb-12">
            <div className="relative bg-gradient-to-r from-amber-600/10 via-orange-500/10 to-amber-600/10 rounded-3xl p-8 md:p-12 overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="text-amber-800">Good Food.</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                    Great Moments
                  </span>
                </h2>
                <p className="text-gray-600 mt-4 text-lg">
                  Delicious meals from your favourite hotels & cafes, deliver to you!
                </p>
                <Link href="/c_orders">
                  <button className="mt-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2">
                    Order Now <FaArrowRight />
                  </button>
                </Link>
              </div>
              <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl"></div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-6 flex-wrap gap-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Popular Nearby</h3>
                <p className="text-amber-600 text-sm font-medium">on your first order</p>
              </div>
              <Link href="/res_menu" className="text-amber-600 text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displaySpots.map((place) => (
                <Link 
                  key={place.id} 
                  href={`/res_menu?id=${place.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
                >
                  <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center">
                    {place.image ? (
                      <Image
                        src={place.image}
                        alt={place.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">Image Placeholder</div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow">
                      <span className="text-amber-500">★</span> {place.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 line-clamp-2">{place.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">{place.cuisine}</p>
                    <p className="text-gray-400 text-[11px] mt-1 line-clamp-2">
                      {place.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-16 text-center text-gray-400 text-sm border-t border-amber-100 pt-8">
            <p>© 2025 GoodFood — Delivering happiness, one meal at a time.</p>
          </div>
        </main>
      </div>
    </div>
  );
}