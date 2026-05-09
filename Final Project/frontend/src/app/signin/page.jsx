"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';
import { login } from '../../lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      if (response?.token) {
        localStorage.setItem('vm_token', response.token);
      }
      if (response?.user) {
        localStorage.setItem('vm_user', JSON.stringify(response.user));
      }

      router.push('/dashboard');
    } catch (submitError) {
      setError(submitError?.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#9fb3cc] flex items-center justify-center p-4 font-sans">
      {/* Main Container */}
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl flex overflow-hidden min-h-[700px]">
        
        {/* LEFT SIDE - The "Welcome" Brand Panel */}
        <div className="w-1/2 bg-gradient-to-br from-[#85aed3] to-[#5a7ea8] p-16 flex flex-col justify-center text-center relative overflow-hidden">
          
          {/* Decorative Background Spheres */}
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#1a3a52] opacity-90 rounded-full shadow-inner"></div>
          <div className="absolute bottom-10 -right-12 w-72 h-72 bg-[#7699bc] rounded-full shadow-lg"></div>
          
          {/* Brand Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-white text-5xl font-serif font-bold italic mb-4 tracking-tight">WELCOME</h1>
            <p className="text-white uppercase tracking-[0.2em] text-[11px] font-black mb-8 border-b border-white/20 pb-2">
              Showcase your dishes on our platform.
            </p>
            <p className="text-blue-50 text-sm leading-relaxed max-w-xs font-medium">
              Join our platform and showcase your menu online in minutes. 
              No website needed—just register, upload your dishes, and 
              let hungry customers find and order from you.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Sign In Form */}
        <div className="w-1/2 p-16 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-center text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-center text-gray-500 text-sm mb-12">
              Your menu platform is waiting for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="EMAIL ADDRESS"
                  className="w-full text-black bg-[#e6f7f9] border-none rounded-xl py-4 pl-14 pr-4 text-[10px] font-black tracking-wider focus:ring-2 focus:ring-blue-100 outline-none placeholder-gray-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="PASSWORD"
                  className="w-full text-black bg-[#e6f7f9] border-none rounded-xl py-4 pl-14 pr-16 text-[10px] font-black tracking-wider focus:ring-2 focus:ring-blue-100 outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-[10px] font-black hover:underline"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-[11px] font-bold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5f79bc] text-white font-black py-4 rounded-xl mt-8 shadow-md hover:bg-[#5068a8] transition-colors tracking-widest text-sm uppercase disabled:opacity-70"
              >
                {isSubmitting ? 'SIGNING IN...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-10">
              <div className="flex-1 h-[1.5px] bg-gray-400"></div>
              <span className="px-4 text-gray-800 font-black text-sm">OR</span>
              <div className="flex-1 h-[1.5px] bg-gray-400"></div>
            </div>

            {/* Sign Up Redirect */}
            <Link href="/signup">
              <div className="bg-[#f0f4ff] rounded-2xl py-4 px-8 flex justify-between items-center group cursor-pointer border border-transparent hover:border-blue-200 transition-all">
                <span className="text-gray-800 font-bold text-sm">Don't Have Account?</span>
                <span className="text-blue-800 font-black text-sm group-hover:underline">Sign Up</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}