"use client";

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function TermsAndConditions() {
  const lastUpdated = "May 11, 2026";
  const websiteName = "[Website Name]";

  return (
    <div className="min-h-screen bg-[#9fb3cc] flex items-center justify-center p-4 md:p-10">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#85aed3] to-[#5a7ea8] p-8 text-white relative">
          <Link href="/signup" className="absolute left-8 top-8 hover:scale-110 transition-transform">
            <FiArrowLeft size={24} />
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold italic mb-2 uppercase tracking-wide">Terms and Conditions</h1>
            <p className="text-blue-100 text-sm font-bold tracking-widest opacity-80">
              LAST UPDATED: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 text-gray-700 leading-relaxed custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <p className="mb-8 text-lg font-medium text-gray-600 border-b pb-6">
              Welcome to <span className="text-[#5a7ea8] font-bold">Virtual Menu</span>. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these terms.
            </p>

            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">1. Acceptance of Terms</h2>
                <p>By accessing this website, you confirm that you are at least 18 years old or have parental/guardian consent to use this platform. If you do not agree to these terms, please do not use our services.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">2. Account Registration</h2>
                <p className="mb-2">To place an order, users may need to create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information.</li>
                  <li>Keep your login credentials secure.</li>
                  <li>Notify us immediately of unauthorized access to your account.</li>
                </ul>
                <p className="mt-2 italic text-sm text-gray-500">We reserve the right to suspend or terminate accounts that provide false information or violate these terms.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">3. Ordering Process</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders placed through the website are subject to product availability and confirmation.</li>
                  <li>We reserve the right to cancel or refuse any order for any reason, including pricing errors or suspected fraud.</li>
                  <li>Once an order is confirmed, changes or cancellations may not be possible.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">4. Pricing and Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All prices displayed are in [Currency] unless otherwise stated.</li>
                  <li>Prices may change without prior notice.</li>
                  <li>Payment must be completed before order processing.</li>
                  <li>We accept payment through approved payment methods listed on the website.</li>
                </ul>
                <p className="mt-2">We are not responsible for payment processing delays caused by third-party payment providers.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">5. Delivery and Shipping</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times are estimates and may vary due to circumstances beyond our control.</li>
                  <li>Customers are responsible for providing accurate delivery information.</li>
                  <li>Additional delivery charges may apply depending on location.</li>
                </ul>
                <p className="mt-2">We are not liable for delays caused by weather, courier issues, or incorrect customer information.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">6. Returns and Refunds</h2>
                <p className="mb-2">Refund and return requests are subject to our Refund Policy. Refunds may be granted if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The product is defective or damaged upon delivery.</li>
                  <li>The wrong product was delivered.</li>
                </ul>
                <p className="mt-2">Refund requests must be made within [X days] of receiving the order.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">7. Product Information</h2>
                <p>We strive to ensure all product descriptions, images, and prices are accurate. However, we do not guarantee that all information is error-free. We reserve the right to correct errors and update product information without notice.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">8. User Conduct</h2>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the website for unlawful purposes.</li>
                  <li>Attempt to gain unauthorized access to the website.</li>
                  <li>Upload harmful software, viruses, or malicious content.</li>
                  <li>Interfere with website functionality.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">9. Intellectual Property</h2>
                <p>All content on this website, including logos, text, images, and design, is the property of [Website Name] and protected by copyright laws. You may not copy, reproduce, or distribute website content without written permission.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">10. Privacy Policy</h2>
                <p>Your use of the website is also governed by our Privacy Policy, which explains how we collect and protect your information.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">11. Limitation of Liability</h2>
                <p>Our maximum liability is limited to the amount paid for your order. We are not liable for indirect or incidental damages, service interruptions, or losses caused by unauthorized access.</p>
              </div>

              <div className="bg-[#f0f4ff] p-6 rounded-2xl border border-blue-100">
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">15. Contact Information</h2>
                <div className="text-sm space-y-1 text-gray-600">
                  <p className="font-bold text-gray-800">[Business Name]</p>
                  <p>Email: [Your Email Address]</p>
                  <p>Phone: [Your Contact Number]</p>
                  <p>Address: [Business Address]</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t bg-gray-50 flex justify-center">
          <Link href="/signup">
            <button className="bg-[#5f79bc] hover:bg-[#5068a8] text-white px-10 py-3 rounded-full font-black tracking-widest text-xs transition-all shadow-md">
              BACK TO SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}