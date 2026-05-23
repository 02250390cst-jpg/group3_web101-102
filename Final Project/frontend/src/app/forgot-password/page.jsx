"use client";

import Link from "next/link";
import React, { useState } from 'react';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
            <h1 className="text-white text-5xl font-serif font-bold italic mb-4 tracking-tight">Reset</h1>
            <p className="text-white uppercase tracking-[0.2em] text-[11px] font-black mb-8 border-b border-white/20 pb-2">
              Recover your account
            </p>
            <p className="text-blue-50 text-sm leading-relaxed max-w-xs font-medium">
              Don't worry! Enter your registered email address and we'll send you a link to reset your password securely.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Forgot Password Form */}
        <div className="w-1/2 p-16 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            
            {/* Back to Login Link */}
            <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5f79bc] text-sm font-medium mb-8 transition-colors group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>

            {!isSubmitted ? (
              <>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mb-8">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
                    <FiAlertCircle className="text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative">
                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full text-black bg-[#e6f7f9] border-none rounded-xl py-4 pl-14 pr-4 text-[10px] font-black tracking-wider focus:ring-2 focus:ring-blue-100 outline-none placeholder-gray-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#5f79bc] text-white font-black py-4 rounded-xl mt-6 shadow-md hover:bg-[#5068a8] transition-colors tracking-widest text-sm uppercase disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      'SEND RESET LINK'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
                <p className="text-gray-600 text-sm mb-6">
                  We've sent a password reset link to <br />
                  <span className="font-bold text-[#5f79bc]">{email}</span>
                </p>
                <div className="bg-blue-50 rounded-xl p-4 mb-8">
                  <p className="text-xs text-gray-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="w-full bg-[#5f79bc] text-white font-black py-3 rounded-xl shadow-md hover:bg-[#5068a8] transition-colors text-sm uppercase"
                  >
                    TRY ANOTHER EMAIL
                  </button>
                  
                  <Link href="/login">
                    <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                      Back to Sign In
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Help Text */}
            {!isSubmitted && (
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                  Need help? Contact our support team at <br />
                  <a href="mailto:support@dishplatform.com" className="text-[#5f79bc] hover:underline">support@dishplatform.com</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}