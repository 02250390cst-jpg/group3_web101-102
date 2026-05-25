
// Sidebar component for navigation and profile image
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";


export default function Sidebar({ menuItems, userName, mobileMenuOpen }) {
  // State for the profile image (base64 or null)
  const [profileImage, setProfileImage] = useState(null);
  // Ref for the hidden file input (for image upload)
  const fileInputRef = useRef(null);

  // Load profile image from localStorage (from vm_user) whenever userName changes
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("vm_user")); // Get user from localStorage
      if (user?.profileImage) setProfileImage(user.profileImage); // If image exists, set it
      else setProfileImage(null); // Otherwise, clear
    } catch {
      setProfileImage(null);
    }
  }, [userName]);

  // Handle image upload and save to localStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Update sidebar image
        // Save to localStorage (update vm_user)
        try {
          const user = JSON.parse(localStorage.getItem("vm_user")) || {};
          user.profileImage = reader.result;
          localStorage.setItem("vm_user", JSON.stringify(user));
        } catch {}
      };
      reader.readAsDataURL(file); // Read file as base64
    }
  };

  // Get initials for fallback avatar (first two letters of name)
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 z-40
        w-64 sm:w-72 h-full bg-white/95 backdrop-blur-sm border-r border-amber-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-label="Sidebar"
    >
      <div className="sticky top-0 p-4 sm:p-6 space-y-8 h-full overflow-y-auto">
        {/* Logo and app name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12">
            <img src="/logo.jpg" alt="GoodFood Logo" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              GoodFood
            </h1>
            <p className="text-xs text-gray-400">delivery</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`
                  flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200
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

        {/* Profile section at the bottom */}
        <div className="pt-6 border-t border-amber-100">
          <div className="flex items-center gap-3">
            {/* Profile image or initials avatar */}
            <div className="relative w-10 h-10">
              {profileImage ? (
                // Show uploaded/saved profile image
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                // Fallback: show initials in colored circle
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                  {getInitials(userName)}
                </div>
              )}
              {/* Camera icon button to upload/change image */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-orange-500 transition-all shadow"
                title="Change profile picture"
              >
                <FiCamera size={14} />
              </button>
              {/* Hidden file input for image upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            {/* User name */}
            <div>
              <p className="font-medium text-gray-800">{userName}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
