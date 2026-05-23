"use client";

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-serif font-bold italic mb-2 uppercase tracking-wide">Privacy Policy</h1>
            <p className="text-blue-100 text-sm font-bold tracking-widest opacity-80">
              LAST UPDATED: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 text-gray-700 leading-relaxed custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <p className="mb-8 text-lg font-medium text-gray-600 border-b pb-6">
              At <span className="text-[#5a7ea8] font-bold">{websiteName}</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>

            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">1. Information We Collect</h2>
                <p className="mb-2">When you register and use our platform, we may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Personal Information:</span> Username, email address, phone number, and location.</li>
                  <li><span className="font-semibold">Account Credentials:</span> Securely stored password and account settings.</li>
                  <li><span className="font-semibold">Business Information:</span> Restaurant/menu details you choose to showcase.</li>
                  <li><span className="font-semibold">Usage Data:</span> How you interact with our platform, including orders and page views.</li>
                  <li><span className="font-semibold">Device Information:</span> IP address, browser type, and operating system.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">2. How We Use Your Information</h2>
                <p className="mb-2">We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and manage your restaurant profile on our platform.</li>
                  <li>Display your menu to potential customers.</li>
                  <li>Process orders and facilitate payments securely.</li>
                  <li>Send important account updates and order notifications.</li>
                  <li>Improve our platform features and customer support.</li>
                  <li>Analyze usage trends to enhance user experience.</li>
                  <li>Prevent fraud and ensure platform security.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">3. Information Sharing</h2>
                <p className="mb-2">We do not sell your personal information. Your data may be shared in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">With Customers:</span> Your menu, business name, and location are visible to customers using our platform.</li>
                  <li><span className="font-semibold">Payment Processors:</span> To handle transactions securely.</li>
                  <li><span className="font-semibold">Service Providers:</span> Third-party vendors who assist with platform operations.</li>
                  <li><span className="font-semibold">Legal Requirements:</span> When required by law or to protect our rights.</li>
                </ul>
                <p className="mt-2 italic text-sm text-gray-500">We require all third-party service providers to maintain confidentiality and data security standards.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">4. Data Protection & Security</h2>
                <p className="mb-2">We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data during transmission (SSL/TLS).</li>
                  <li>Secure servers with firewall protection.</li>
                  <li>Regular security audits and vulnerability assessments.</li>
                  <li>Access controls limiting who can view personal data.</li>
                  <li>Secure password hashing (we never store plain-text passwords).</li>
                </ul>
                <p className="mt-2">While we strive to protect your data, no method of transmission over the internet is 100% secure.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">5. Your Rights & Choices</h2>
                <p className="mb-2">Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Access:</span> Request a copy of your personal data.</li>
                  <li><span className="font-semibold">Correction:</span> Update inaccurate or incomplete information.</li>
                  <li><span className="font-semibold">Deletion:</span> Request account and data deletion.</li>
                  <li><span className="font-semibold">Opt-out:</span> Unsubscribe from marketing communications.</li>
                  <li><span className="font-semibold">Data Portability:</span> Export your data in a usable format.</li>
                </ul>
                <p className="mt-2">To exercise these rights, please contact us using the information in Section 15.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">6. Cookies & Tracking Technologies</h2>
                <p className="mb-2">We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your login session and preferences.</li>
                  <li>Analyze website traffic and usage patterns.</li>
                  <li>Improve platform performance.</li>
                </ul>
                <p className="mt-2">You can control cookie settings through your browser preferences. Disabling cookies may affect platform functionality.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">7. Data Retention</h2>
                <p>We retain your personal information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal compliance, fraud prevention, or legitimate business purposes. Anonymized data may be kept indefinitely for analytics.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">8. Children's Privacy</h2>
                <p>Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If we discover that a minor has provided us with personal data, we will delete it immediately.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">9. Third-Party Links</h2>
                <p>Our platform may contain links to external websites. We are not responsible for the privacy practices or content of third-party sites. We encourage you to review their privacy policies before providing any personal information.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">10. International Data Transfers</h2>
                <p>If you access our platform from outside [Your Country], your information may be transferred to and processed in countries with different data protection laws. By using our platform, you consent to such transfers.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">11. Changes to This Policy</h2>
                <p>We may update this Privacy Policy periodically. We will notify users of material changes by posting the updated policy on this page and updating the "Last Updated" date. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
              </div>

              <div className="bg-[#f0f4ff] p-6 rounded-2xl border border-blue-100">
                <h2 className="text-xl font-black text-[#1a3a52] mb-3 uppercase tracking-wider">12. Contact Information</h2>
                <div className="text-sm space-y-1 text-gray-600">
                  <p className="font-bold text-gray-800">[Business Name]</p>
                  <p>📧 Email: <a href="mailto:privacy@website.com" className="text-[#5f79bc] hover:underline">privacy@website.com</a></p>
                  <p>📞 Phone: [Your Contact Number]</p>
                  <p>📍 Address: [Business Address]</p>
                </div>
                <p className="mt-4 text-xs text-gray-500 pt-3 border-t border-blue-200">
                  For privacy-related inquiries or to exercise your data rights, please contact our Data Protection Officer at the email above.
                </p>
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