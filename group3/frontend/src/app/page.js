"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FaStore,
  FaUser,
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingBag,
  FaCheckCircle,
  FaClipboardList,
  FaTag,
} from "react-icons/fa";

import { FaLocationCrosshairs } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="bg-[#dbe7ea] text-gray-800">
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-16 py-4 bg-white">
        <div className="flex items-center gap-2 font-bold">
          <Image src="/logo.jpg" width={40} height={40} alt="logo" />
          VirtualMenu
        </div>

        <div className="flex gap-10 text-sm">
          <Link href="/home">
            <p className="text-blue-700 cursor-pointer">Home</p>
          </Link>
          <Link href="/owner">
            <p className="hover:text-blue-700 cursor-pointer">For Business</p>
          </Link>
          <Link href="/customer">
            <p className="hover:text-blue-700 cursor-pointer">For Customers</p>
          </Link>
          <Link href="/contact">
            <p className="hover:text-blue-700 cursor-pointer">Contact</p>
          </Link>
        </div>

        <p className="text-xs font-semibold">WELCOME TO HOME PAGE</p>
      </nav>

      {/* ================= HERO ================= */}
      <section className="flex px-16 py-14 items-center gap-10">
        <div className="w-1/2">
          <p className="text-sm bg-[#cfe0e0] inline-block px-3 py-1 rounded-lg mb-4">
            Choose Your Favourite Food & Get Ready To Serve
          </p>

          <h1 className="text-5xl font-serif font-bold leading-tight mb-4">
            Order Smarter. <br />
            Serve Better. <br />
            Grow Together.
          </h1>

          <p className="mb-6 font-bold font-serif text-gray-700">
            A simple platform where businesses register and customers order food
            online.
          </p>

          {/* ================= NAVIGATION BUTTONS ================= */}
          <div className="flex gap-4">
            <Link href="/owner">
              <button className="bg-[#3D5C35] text-white px-6 py-3 rounded-lg flex gap-2 items-center hover:bg-[#2e4224] transition">
                <FaStore /> Business Owner
              </button>
            </Link>

            <Link href="/customer">
              <button className="bg-[#3D5C35] text-white px-6 py-3 rounded-lg flex gap-2 items-center hover:bg-[#2e4224] transition">
                <FaUser /> Customer
              </button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-semibold text-gray-700">
            <FaCheckCircle /> Easy Menu Management <br />
            <FaShoppingBag /> Online Ordering <br />
            <FaLocationCrosshairs /> Track Orders Easily
          </div>
        </div>

        <div className="w-1/2 flex justify-center relative">
          {/* Added animate-float class to main image */}
          <div className="animate-float">
            <Image
              src="/home.jpg"
              width={400}
              height={400}
              alt="food"
              className="rounded-lg"
            />
          </div>
          {/* Added animate-float-delayed class to phone image for staggered animation */}
          <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-float-delayed">
            <Image
              src="/phone.jpg"
              width={150}
              height={150}
              alt="phone"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
      {/* ================= HORIZONTAL MOVING TICKER ================= */}
      <div className="border-t border-b border-gray-200 bg-white overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-ticker">
          {[
            "🚀 Easy Orders",
            "🎯 Smart Menu",
            "👥 More Customer",
            "⚡ Fast Delivery",
            "📊 Real-Time Orders",
          ].map((t, i) => (
            <span
              key={i}
              className="inline-block text-sm font-semibold text-[#3D5C35] uppercase tracking-wide px-10"
            >
              {t} <span className="text-[#e85d04] mx-4">◆</span>
            </span>
          ))}
          {[
            "🚀 Easy Orders",
            "🎯 Smart Menu",
            "👥 More Customer",
            "⚡ Fast Delivery",
            "📊 Real-Time Orders",
          ].map((t, i) => (
            <span
              key={`dup-${i}`}
              className="inline-block text-sm font-semibold text-[#3D5C35] uppercase tracking-wide px-10"
            >
              {t} <span className="text-[#e85d04] mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ================= BUSINESS SECTION ================= */}
      <section className="px-16 py-14 flex gap-10">
        <div className="w-1/2">
          <h2 className="text-3xl font-bold">Built for</h2>
          <h2 className="text-3xl font-bold text-[#4e7a9a] mb-4">
            Business Owners
          </h2>

          <p className="text-gray-600 mb-6">
            Manage your restaurant and cafe easily and get more customers
            without any hassle.
          </p>

          <Link href="/owner">
            <button className="bg-[#9fbec6] px-5 py-3 rounded-xl hover:bg-[#8aa8b0] transition">
              Register Your Business →
            </button>
          </Link>
        </div>

        <div className="w-1/2">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl flex flex-col gap-2 text-center">
              <FaClipboardList className="text-3xl mx-auto" />
              <p className="text-black font-semibold text-xl">
                Add Menu Easily
              </p>
              <p className="text-gray-600 text-sm">
                Upload your menu in a minute and make it live
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl flex flex-col gap-2 text-center">
              <FaShoppingBag className="text-3xl mx-auto" />
              <p className="text-black font-semibold text-xl">
                Receives Orders Instantly
              </p>
              <p className="text-gray-600 text-sm">
                Get real-time orders directly to your dashboard and manage them easily
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl flex flex-col gap-2 text-center">
              <FaTag className="text-3xl mx-auto" />
              <p className="text-black font-semibold text-xl">
                Promotions and Discounts
              </p>
              <p className="text-gray-600 text-sm">
                Create offers and attract more customers with special promotions and discounts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER SECTION ================= */}
      <section className="px-16 py-14 flex items-center gap-10">
        <div className="w-1/2 flex justify-center relative">
          {/* Added animate-float class to main image */}
          <div className="animate-float">
            <Image
              src="/phone.jpg"
              width={200}
              height={200}
              alt="food"
              className="rounded-lg"
            />
          </div>
          {/* Added animate-float-delayed class to phone image for staggered animation */}
          <div className="absolute top-3/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-float-delayed">
            <Image
              src="/scooter.jpg"
              width={150}
              height={150}
              alt="phone"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="w-1/2">
          <p className="text-blue-600 font-semibold">For Customers</p>

          <h2 className="text-4xl font-bold mb-4">
            <span className="text-red-500">Hungry?</span> Order in Seconds.
          </h2>

          <p className="text-gray-600 mb-6">
            Find the best restaurants and cafe near you, place your order and enjoy your favourite food.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl flex flex-col gap-2 items-center">
              <FaMapMarkerAlt /> Find Place to  Dine
            </div>
            <div className="bg-white p-4 rounded-xl flex flex-col gap-2 items-center">
              <FaSearch /> Look up for Resrtraunt
            </div>
            <div className="bg-white p-4 rounded-xl flex flex-col gap-2 items-center">
              <FaShoppingBag /> Place Your Order
            </div>
            <div className="bg-white p-4 rounded-xl flex flex-col gap-2 items-center">
              ⭐ Reviews and Ratings
            </div>
          </div>

          <Link href="/customer">
            <button className="bg-[#9fbec6] px-6 py-3 rounded-xl hover:bg-[#8aa8b0] transition">
              Order Food Now →
            </button>
          </Link>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-16 py-14 text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">How It Works</h1>
        <h2 className="text-3xl font-bold mb-10 text-left">
          For Business Owners
        </h2>

        <div className="grid grid-cols-4 gap-6 relative mb-16">
          {[
            {
              name: "Register",
              emoji: "✍️",
              desc: "Create your account in just a few minutes.",
            },
            {
              name: "Add Menu",
              emoji: "📖",
              desc: "Upload your menu and set your prices.",
            },
            {
              name: "Accept Orders",
              emoji: "🛎️",
              desc: "Recieve and manage orders in real-time.",
            },
            {
              name: "Grow Business",
              emoji: "🚀",
              desc: "Increase sales and expand your reach.",
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl relative">
              <div className="mb-3 text-xl">{step.emoji}</div>
              <h3 className="font-semibold">{step.name}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
              {i < 3 && (
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-3xl text-gray-400">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-10 text-left">For Customers</h2>

        <div className="grid grid-cols-4 gap-6 relative">
          {[
            {
              name: "Search Food",
              emoji: "📍",
              desc: "Find restaurants near you.",
            },
            {
              name: "Choose Meal",
              emoji: "🔍",
              desc: "Pick your favorite dishes.",
            },
            {
              name: "Place Order",
              emoji: "🛒",
              desc: "Place your order securely.",
            },
            {
              name: "Enjoy Meal",
              emoji: "🚚",
              desc: "Just a click and enjoy your meal.",
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl relative">
              <div className="mb-3 text-xl">{step.emoji}</div>
              <h3 className="font-semibold">{step.name}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
              {i < 3 && (
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-3xl text-gray-400">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-16 py-14">
        <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-10 rounded-3xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">Ready to Grow With Us?</h2>
            <p className="text-gray-700 mb-4">
              Join hundreds of restaurants and cafes already growing their
              business with FoodHub.
            </p>

            <div className="flex gap-4">
              <Link href="/owner">
                <button className="bg-blue-500 text-white px-5 py-3 rounded-xl">
                  Register Your Business →
                </button>
              </Link>
              <Link href="/customer">
                <button className="border px-5 py-3 rounded-xl">
                  Order Now →
                </button>
              </Link>
            </div>
          </div>

          <div className="animate-float">
            <Image
              src="/pizza.jpg"
              width={250}
              height={250}
              alt="pizza"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#a9c6cf] px-16 py-10 grid grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-bold mb-2">VirtualMenu</h3>
          <p>Helping restaurants connect with customers easily.</p>
        </div>

        <div>
          <p className="font-semibold">Company</p>
          <p>About</p>
          <p>Contact</p>
        </div>

        <div>
          <p className="font-semibold">Support</p>
          <p>Help Center</p>
          <p>Privacy Policy</p>
        </div>

        <div>
          <p className="font-semibold">For Customers</p>
          <p>Order Food</p>
          <p>Login</p>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 4s ease-in-out infinite;
        }
        .animate-ticker {
          animation: ticker 18s linear infinite;
        }
      `}</style>
    </main>
  );
}