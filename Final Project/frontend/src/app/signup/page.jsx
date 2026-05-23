"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock } from 'react-icons/fi';
import { register } from '../../lib/api';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  location: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.acceptTerms) {
      setError('Please accept the terms to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'CUSTOMER',
      };

      const response = await register(payload);
      if (response?.token) {
        localStorage.setItem('vm_token', response.token);
      }
      if (response?.user) {
        localStorage.setItem('vm_user', JSON.stringify(response.user));
      }
      router.push('/dashboard2');
    } catch (submitError) {
      setError(submitError?.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#9fb3cc] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl flex overflow-hidden min-h-[700px]">
        
        {/* LEFT SIDE - Gradient & Info */}
        <div className="w-1/2 bg-gradient-to-br from-[#85aed3] to-[#5a7ea8] p-16 flex flex-col justify-center text-center relative overflow-hidden">
          
          {/* Floating Decorative Circles */}
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#1a3a52] opacity-80 rounded-full"></div>
          <div className="absolute bottom-10 -right-10 w-64 h-64 bg-[#7699bc] rounded-full"></div>
          
          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-white text-5xl font-serif font-bold italic mb-4">WELCOME</h1>
            <p className="text-white uppercase tracking-[0.2em] text-xs font-black mb-8 border-b border-white/30 pb-2">
              Showcase your dishes on our platform.
            </p>
            <p className="text-blue-50 text-sm leading-relaxed max-w-sm">
              Join our platform and showcase your menu online in minutes. 
              No website needed—just register, upload your dishes, and 
              let hungry customers find and order from you.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-1/2 p-16 flex flex-col items-center">
          <div className="w-full max-w-md">
            <h2 className="text-center text-4xl font-bold text-gray-900 mb-2">Sign up</h2>
            <p className="text-center text-gray-500 text-sm mb-10">
              Create your account and start managing your menu.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username */}
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ENTER USERNAME"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="PHONE NUMBER"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="LOCATION"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="PASSWORD"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="CONFIRM PASSWORD"
                  className="w-full bg-[#e6f7f9] border-none rounded-xl py-4 pl-12 pr-4 text-[10px] text-black font-black tracking-wider focus:ring-2 focus:ring-blue-200 outline-none placeholder-gray-500"
                />
              </div>
            
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-[11px] font-bold text-red-600">
                {error}
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3 mt-6 px-1">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 accent-blue-600"
                id="terms"
              />
              <label htmlFor="terms" className="text-[10px] text-gray-500 font-bold">
                I agree to the <Link href="/terms-signup" className="text-blue-600 cursor-pointer hover:underline">Terms of Service</Link> and <Link href="/privacy-policy-signup" className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-[#5f79bc] hover:bg-[#5068a8] text-white font-black py-4 rounded-xl tracking-widest text-sm uppercase shadow-md transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-[1.5px] bg-gray-400"></div>
              <span className="px-4 text-gray-800 font-black text-sm">OR</span>
              <div className="flex-1 h-[1.5px] bg-gray-400"></div>
            </div>

            {/* Sign In Redirect */}
            <Link href="/signin">
              <div className="bg-[#f0f4ff] rounded-2xl py-4 px-8 flex justify-between items-center group cursor-pointer border border-transparent hover:border-blue-200 transition-all">
                <span className="text-gray-800 font-bold text-sm">Already Have an Account?</span>
                <span className="text-blue-800 font-black text-sm group-hover:underline">Sign In</span>
              </div>
            </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}