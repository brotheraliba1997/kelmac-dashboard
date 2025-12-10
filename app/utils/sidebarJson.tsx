export const array = [
  {
    name: "Dashboard",
    path: "/dashboard",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    role: ["student", "admin", "instructor"],
  },
  {
    name: "Users",
    path: "/dashboard/users",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    role: ["student", "admin", "instructor"],
  },
  {
    name: "Payments",
    path: "/dashboard/payments",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
    role: ["student", "admin", "finance"],
  },
  {
    name: "Courses",
    path: "/dashboard/courses",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    role: ["student", "admin", "instructor"],
  },

  {
    name: "Class Schedule",
    path: "/dashboard/class-schedule",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    role: ["student", "admin", "instructor"],
  },
  {
    name: "Attendance",
    path: "/dashboard/attendance",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    ),
    role: ["admin", "instructor"],
  },
  // {
  //   name: "Offers",
  //   path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-user-plus"
  //     >
  //       <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
  //       <circle cx="8.5" cy="7" r="4"></circle>
  //       <line x1="20" y1="8" x2="20" y2="14"></line>
  //       <line x1="23" y1="11" x2="17" y2="11"></line>
  //     </svg>
  //   ),
  //    role: ["student", "admin", "instructor"],
  // },
  // {
  //   name: "Lessons",
  // path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-user-plus"
  //     >
  //       <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
  //       <circle cx="8.5" cy="7" r="4"></circle>
  //       <line x1="20" y1="8" x2="20" y2="14"></line>
  //       <line x1="23" y1="11" x2="17" y2="11"></line>
  //     </svg>
  //   ),
  //    role: ["student", "admin", "instructor"],
  // },
  // {
  //   name: "Certificates",
  //   path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-briefcase"
  //     >
  //       <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
  //       <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  //     </svg>
  //   ),
  //   role: ["student", "admin", "instructor"],
  // //   subItems: [
  // //     {
  // //       name: "Add",
  // //       path: "/dashboard/jobs/add",
  // //       role: ["client"],
  // //     },
  // //     {
  // //       name: "New",
  // //       path: "/dashboard/jobs",
  // //       role: ["client", "admin"],
  // //     },

  // //     {
  // //       name: "Find Work",
  // //       path: "/dashboard/jobs/find-work",
  // //       role: ["interpreter"],
  // //     },
  // //     {
  // //       name: "In Progress",
  // //       path: "/dashboard/jobs/in-progress",
  // //       role: ["client", "admin", "interpreter"],
  // //     },
  // //     {
  // //       name: "Completed",
  // //       path: "/dashboard/jobs/completed",
  // //       role: ["client", "admin", "interpreter"],
  // //     },
  // //   ],
  // },
  // {
  //   name: "Payment",
  //    path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-wallet"
  //     >
  //       <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
  //       <path d="M1 12h22"></path>
  //       <text x="6" y="18" fontSize="14" fontWeight="bold">
  //         $
  //       </text>
  //     </svg>
  //   ),
  //    role: ["student", "admin", "instructor"],
  // },
  // {
  //   name: "Corporate",
  //    path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-wallet"
  //     >
  //       <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
  //       <path d="M1 12h22"></path>
  //       <text x="6" y="18" fontSize="14" fontWeight="bold">
  //         $
  //       </text>
  //     </svg>
  //   ),
  //     role: ["student", "admin", "instructor"],
  // //   subItems: [
  // //     {
  // //       name: "List",
  // //       path: "/dashboard/wallets",
  // //       role: ["admin"],
  // //     },
  // //     {
  // //       name: "Requests",
  // //       path: "/dashboard/wallets/requests",
  // //       role: ["admin"],
  // //     },
  // //   ],
  // },
  {
    name: "Enrollments",
    path: "/dashboard/courses/enrollments",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    role: ["student", "admin", "instructor"],
  },
  // {
  //   name: "Modules",
  //   path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-book"
  //     >
  //       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
  //       <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  //     </svg>
  //   ),
  //    role: ["student", "admin", "instructor"],
  // },

  // {
  //   name: "Settings",
  //    path: "#",
  //   svg: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       className="feather feather-settings"
  //     >
  //       <circle cx="12" cy="12" r="3"></circle>
  //       <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  //     </svg>
  //   ),
  //   role: ["student", "admin", "instructor"],
  // },
];
