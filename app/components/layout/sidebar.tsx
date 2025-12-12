"use client";
import { logout } from "@/app/redux/slices/auth";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";
import { array } from "@/app/utils/sidebarJson";
import { hasAnyPermission } from "@/app/utils/permissionChecker";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: any) => state.auth);
  const { token, user } = auth;
  const [openSubMenu, setOpenSubMenu] = useState<any>(null);

  const logoutHandler = async () => {
    router.push("/login");
    dispatch(logout());
  };

  const pathName = usePathname();

  return (
    <aside className="w-64 bg-linear-to-b from-gray-900 to-gray-800 h-screen fixed left-0 top-0 z-30 flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-gray-700 px-4">
        <div className="text-white font-bold text-xl tracking-wide">
          Kelmac Dashboard
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {array
            .filter((item: any) => {
              const userRoleName = GetUserRoleName(
                user?.role?._id || user?.role?.id || user?.role
              );
              const hasRole = item.role.includes(userRoleName);

              // If item has specific permissions, check those
              if (item.permissions && item.permissions.length > 0) {
                const hasPermissions = hasAnyPermission(user, item.permissions);
                return hasRole && hasPermissions;
              }

              // Otherwise just check role
              return hasRole;
            })
            .map((item, index) => {
              const isActive = pathName.startsWith(item?.path);
              return (
                <li key={`route-${index}`}>
                  <Link
                    href={item?.path || "#"}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-[1.02]"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-[1.01]"
                    }`}
                  >
                    {/* Active indicator line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                    )}
                    <div
                      className={`w-5 h-5 flex items-center justify-center ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      } transition-transform duration-200`}
                    >
                      {item.svg}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                    {/* Active pulse effect */}
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
