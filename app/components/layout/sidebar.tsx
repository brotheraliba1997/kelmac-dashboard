"use client";
import { logout } from "@/app/redux/slices/auth";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";

import { array } from "@/app/utils/sidebarJson";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: any) => state.auth);
  const { token, user } = auth;
  const [openSubMenu, setOpenSubMenu] = useState<any>(null);

  const logoutHandler = async () => {
    router.push("/login");
    dispatch(logout());
    console.log("Logging out...");
    // if (!token && !user) {
    //   router.push("/login");
    // }
  };

  const pathName = usePathname();

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            {array
              .filter((item: any) =>
                item.role.includes(GetUserRoleName(user?.role?.id))
              )
              .map((item, index) => {
                // if (item.role.includes(user?.role)) {

                return (
                  <li key={`route-${index}`} className="submenu">
                    <Link
                      href={item?.path || "#"}
                      className={`${
                        openSubMenu === `item-${index}` ? "subdrop" : ""
                      }`}
                      onClick={() =>
                        setOpenSubMenu((prev: any) =>
                          prev == `item-${index}` ? null : `item-${index}`
                        )
                      }
                    >
                      {item.svg}
                      <span> {item.name} </span>{" "}
                      <span className="menu-arrow"></span>
                    </Link>

                    <ul
                      style={{
                        display:
                          openSubMenu === `item-${index}` ? "block" : "none",
                      }}
                    ></ul>
                  </li>
                );
              })}

            <li>
              <Link href="/login" onClick={logoutHandler}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-log-out"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>{" "}
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
