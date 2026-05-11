// app/menu-management/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiLayout,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiSettings,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  updateMenuItem,
} from "../../lib/api";

export default function MenuManagementPage() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [userName, setUserName] = useState("Owner");
  const [hotelName, setHotelName] = useState("Your Cafe");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "Available",
    category: "",
    image: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("vm_token");
    const storedUser = localStorage.getItem("vm_user");
    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (error) {
        parsedUser = null;
      }
    }

    const storedRestaurantId = parsedUser?.restaurantId ?? null;
    const storedUserName = parsedUser?.name || "Owner";
    const storedHotelName =
      parsedUser?.businessName || parsedUser?.cafeName || "Your Cafe";
    setToken(storedToken || null);
    setRestaurantId(storedRestaurantId);
    setUserName(storedUserName);
    setHotelName(storedHotelName);

    if (!storedToken || !storedRestaurantId) {
      setErrorMessage("Missing restaurant details. Please sign in again.");
      setIsLoading(false);
      return;
    }

    const loadItems = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const items = await listMenuItems({
          restaurantId: storedRestaurantId,
          token: storedToken,
        });
        const mappedItems = items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          status: item.isAvailable ? "Available" : "Unavailable",
          category: item.description || "Uncategorized",
          image: item.image || null,
        }));
        setMenuItems(mappedItems);
      } catch (error) {
        setErrorMessage(error?.message || "Unable to load menu items.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Helper Functions
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      status: "Available",
      category: "",
      image: null,
    });
    setPreviewImage(null);
    setEditingItem(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) return;
    if (!token || !restaurantId) {
      setErrorMessage("Missing restaurant details. Please sign in again.");
      return;
    }

    setErrorMessage("");
    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.category ? formData.category.trim() : null,
        isAvailable: formData.status === "Available",
        image: formData.image || null,
      };
      console.log('Payload sent to backend:', payload);
      const created = await createMenuItem({
        restaurantId,
        token,
        payload,
      });

      const mappedItem = {
        id: created.id,
        name: created.name,
        price: Number(created.price),
        status: created.isAvailable ? "Available" : "Unavailable",
        category: created.description || "Uncategorized",
        image: created.image || formData.image || null,
      };

      setMenuItems((prev) => [mappedItem, ...prev]);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to create menu item.");
    }
  };

  const handleEditItem = async () => {
    if (!formData.name || !formData.price) return;
    if (!token || !restaurantId) {
      setErrorMessage("Missing restaurant details. Please sign in again.");
      return;
    }

    setErrorMessage("");
    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.category ? formData.category.trim() : null,
        isAvailable: formData.status === "Available",
        image: formData.image || null,
      };

      const updated = await updateMenuItem({
        restaurantId,
        itemId: editingItem.id,
        token,
        payload,
      });

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: updated.name,
                price: Number(updated.price),
                status: updated.isAvailable ? "Available" : "Unavailable",
                category: updated.description || "Uncategorized",
                image: formData.image || item.image,
              }
            : item,
        ),
      );
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to update menu item.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (!token || !restaurantId) {
        setErrorMessage("Missing restaurant details. Please sign in again.");
        return;
      }

      setErrorMessage("");
      try {
        await deleteMenuItem({ restaurantId, itemId: id, token });
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        setErrorMessage(error?.message || "Unable to delete menu item.");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    if (!token || !restaurantId) {
      setErrorMessage("Missing restaurant details. Please sign in again.");
      return;
    }

    const targetItem = menuItems.find((item) => item.id === id);
    if (!targetItem) return;

    const nextStatus =
      targetItem.status === "Available" ? "Unavailable" : "Available";
    setErrorMessage("");
    try {
      const updated = await updateMenuItem({
        restaurantId,
        itemId: id,
        token,
        payload: {
          isAvailable: nextStatus === "Available",
        },
      });

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updated.isAvailable ? "Available" : "Unavailable",
              }
            : item,
        ),
      );
    } catch (error) {
      setErrorMessage(error?.message || "Unable to update item status.");
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      status: item.status,
      category: item.category,
      image: item.image,
    });
    setPreviewImage(item.image);
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return "G";
    return trimmed
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  // Sidebar Component
  const NavItem = ({ icon, label, active = false, href }) => {
    const content = (
      <div
        className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
          active
            ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
            : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
        }`}
      >
        <span className={active ? "text-white" : "text-gray-400"}>{icon}</span>
        <span className="font-bold text-[13px]">{label}</span>
      </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col p-4 border-r border-gray-200">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
              <path d="M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">{hotelName}</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<FiLayout size={18} />}
            label="Dashboard"
            href="/dashboard"
          />
          <NavItem
            icon={<MdOutlineRestaurantMenu size={18} />}
            label="Menu Management"
            active
            href="/menu_management"
          />
          <NavItem
            icon={<FiShoppingBag size={18} />}
            label="Orders"
            href="/orders"
          />
          <NavItem
            icon={<FiUsers size={18} />}
            label="Customers"
            href="/customers"
          />
          <NavItem
            icon={<FiStar size={18} />}
            label="Reviews"
            href="/reviews"
          />
          <NavItem
            icon={<FiSettings size={18} />}
            label="Setting"
            href="/settings"
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="bg-orange-50 p-3 rounded-2xl flex items-center gap-3 border border-orange-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs">
              {getInitials(userName)}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-gray-800">
                {userName}
              </p>
              <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">
                Owner
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Menu Management
              </h1>
              <p className="text-gray-500 text-sm">
                Add, edit or organize your menu items and categories.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
            >
              <FiPlus /> Add New Item
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Menu Items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-6 text-center text-sm text-gray-500"
                      >
                        Loading menu items...
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <MdOutlineRestaurantMenu className="text-orange-500 text-xl" />
                              )}
                            </div>
                            <span className="font-medium text-gray-800">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-800">
                            Nu. {item.price}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              item.status === "Available"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {item.status}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredItems.length} of {menuItems.length} items
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? "Edit Menu Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Item Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-orange-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer font-medium text-orange-600 hover:text-orange-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Chicken Burger"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (Nu.)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., 150"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Appetizers, Main Course, Desserts"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleEditItem : handleAddItem}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${(!formData.name || !formData.price || isLoading) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                disabled={!formData.name || !formData.price || isLoading}
              >
                <FiSave /> {editingItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}