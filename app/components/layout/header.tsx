"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import logo from "@/app/assets/img/logo.png";
import { FaBell, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { logout } from "@/app/redux/slices/auth";
import { getUserRole } from "@/app/utils/permissionChecker";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";

function Header() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "SA";
    const name = user.name || user.email || "User";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "Super Admin";
    if (user.firstName) return user.firstName + " " + (user.lastName || "");
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "admin@kelmac.com";
    return user.email || "No email provided";
  };
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left Section - Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center shrink-0">
            <Image
              src={logo}
              alt="Kelmac Logo"
              width={140}
              height={36}
              priority
              className="h-9 w-auto"
            />
          </a>
          <button
            id="toggle_btn"
            className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Toggle Sidebar"
          >
            <i className="fas fa-bars text-lg" />
          </button>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form className="w-full flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
            <input
              type="text"
              className="flex-1 px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="Search here..."
            />
            <button
              className="px-4 py-2.5 bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
              type="submit"
              title="Search"
            >
              <i className="fas fa-search" />
            </button>
          </form>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications Dropdown */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setUserMenuOpen(false);
              }}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group"
              title="Notifications"
            >
              <FaBell className="text-lg group-hover:text-primary-600" />
              <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                5
              </span>
            </button>

            {/* Notifications Dropdown Menu */}
            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {[
                      {
                        icon: null,
                        name: "Brian Johnson",
                        action: "paid the invoice",
                        id: "#DF65485",
                        time: "4 mins ago",
                        type: "payment",
                      },
                      {
                        icon: null,
                        name: "Marie Canales",
                        action: "has accepted your estimate",
                        id: "#GTR458789",
                        time: "6 mins ago",
                        type: "estimate",
                      },
                      {
                        icon: "user",
                        name: "New user registered",
                        action: "",
                        id: "",
                        time: "8 mins ago",
                        type: "user",
                      },
                      {
                        icon: null,
                        name: "Barbara Moore",
                        action: "declined the invoice",
                        id: "#RDW026896",
                        time: "12 mins ago",
                        type: "decline",
                      },
                      {
                        icon: "comment",
                        name: "You have received a new message",
                        action: "",
                        id: "",
                        time: "2 days ago",
                        type: "message",
                      },
                    ].map((notif, idx) => (
                      <li
                        key={idx}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              notif.icon === "user"
                                ? "bg-blue-100"
                                : notif.icon === "comment"
                                ? "bg-sky-100"
                                : "bg-gray-200"
                            }`}
                          >
                            {notif.icon === "user" ? (
                              <i className="far fa-user text-blue-600 text-sm" />
                            ) : notif.icon === "comment" ? (
                              <i className="far fa-comment text-sky-600 text-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-300 to-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium">
                              <span className="font-semibold">
                                {notif.name}
                              </span>
                              {notif.action && (
                                <>
                                  <span className="text-gray-600">
                                    {" "}
                                    {notif.action}{" "}
                                  </span>
                                  {notif.id && (
                                    <span className="font-semibold">
                                      {notif.id}
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                  <a
                    href="#"
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    View all Notifications →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors group"
              title="User Menu"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-primary-600 text-xs font-bold">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm capitalize font-medium text-white hidden sm:inline">
                  {getDisplayName()}
                </span>
                <span className="text-sm capitalize font-medium text-white hidden sm:inline">
                  {GetUserRoleName(user?.role?.id)}
                </span>
              </div>
              <FaChevronDown
                className={`w-3 h-3 text-white transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-600">{getUserEmail()}</p>
                </div>
                <div className="py-2">
                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-900 text-sm group/item"
                  >
                    <FaCog className="text-gray-600 group-hover/item:text-primary-600" />
                    <span>Settings</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 text-sm group/item border-t border-gray-100"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile_btn"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Mobile Menu"
          >
            <i className="fas fa-bars text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
