// Role definitions
export enum UserRole {
  ADMIN = 1,
  INSTRUCTOR = 3,
  CORPORATE = 4,
  FINANCE = 5,
  OPERATOR = 6,
}

// Permission actions
export enum Permission {
  // User Management
  VIEW_USERS = "view_users",
  CREATE_USER = "create_user",
  EDIT_USER = "edit_user",
  DELETE_USER = "delete_user",

  // Course Management
  VIEW_COURSES = "view_courses",
  CREATE_COURSE = "create_course",
  EDIT_COURSE = "edit_course",
  DELETE_COURSE = "delete_course",
  MANAGE_COURSE_SESSIONS = "manage_course_sessions",

  // Class Schedule
  VIEW_CLASS_SCHEDULE = "view_class_schedule",
  CREATE_CLASS_SCHEDULE = "create_class_schedule",
  EDIT_CLASS_SCHEDULE = "edit_class_schedule",
  DELETE_CLASS_SCHEDULE = "delete_class_schedule",

  // Attendance
  VIEW_ATTENDANCE = "view_attendance",
  MARK_ATTENDANCE = "mark_attendance",
  EDIT_ATTENDANCE = "edit_attendance",

  // Assessment
  VIEW_ASSESSMENT = "view_assessment",
  APPROVE_CERTIFICATE = "approve_certificate",
  REJECT_CERTIFICATE = "reject_certificate",

  // Enrollment
  VIEW_ENROLLMENTS = "view_enrollments",
  CREATE_ENROLLMENT = "create_enrollment",
  EDIT_ENROLLMENT = "edit_enrollment",
  DELETE_ENROLLMENT = "delete_enrollment",

  // Companies
  VIEW_COMPANIES = "view_companies",
  MANAGE_COMPANIES = "manage_companies",

  // Offers
  VIEW_OFFERS = "view_offers",
  CREATE_OFFER = "create_offer",
  EDIT_OFFER = "edit_offer",
  DELETE_OFFER = "delete_offer",

  // Payments
  VIEW_PAYMENTS = "view_payments",
  PROCESS_PAYMENTS = "process_payments",
  MANAGE_PURCHASE_ORDERS = "manage_purchase_orders",

  // Blogs
  VIEW_BLOGS = "view_blogs",
  CREATE_BLOG = "create_blog",
  EDIT_BLOG = "edit_blog",
  DELETE_BLOG = "delete_blog",

  // Certificates
  VIEW_CERTIFICATES = "view_certificates",
  ISSUE_CERTIFICATE = "issue_certificate",

  // Clients
  VIEW_CLIENTS = "view_clients",
  ADD_CLIENT = "add_client",
  EDIT_CLIENT = "edit_client",
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.DELETE_COURSE,
    Permission.MANAGE_COURSE_SESSIONS,
    Permission.VIEW_CLASS_SCHEDULE,
    Permission.CREATE_CLASS_SCHEDULE,
    Permission.EDIT_CLASS_SCHEDULE,
    Permission.DELETE_CLASS_SCHEDULE,
    Permission.VIEW_ATTENDANCE,
    Permission.MARK_ATTENDANCE,
    Permission.EDIT_ATTENDANCE,
    Permission.VIEW_ASSESSMENT,
    Permission.APPROVE_CERTIFICATE,
    Permission.REJECT_CERTIFICATE,
    Permission.VIEW_ENROLLMENTS,
    Permission.CREATE_ENROLLMENT,
    Permission.EDIT_ENROLLMENT,
    Permission.DELETE_ENROLLMENT,
    Permission.VIEW_COMPANIES,
    Permission.MANAGE_COMPANIES,
    Permission.VIEW_OFFERS,
    Permission.CREATE_OFFER,
    Permission.EDIT_OFFER,
    Permission.DELETE_OFFER,
    Permission.VIEW_PAYMENTS,
    Permission.PROCESS_PAYMENTS,
    Permission.MANAGE_PURCHASE_ORDERS,
    Permission.VIEW_BLOGS,
    Permission.CREATE_BLOG,
    Permission.EDIT_BLOG,
    Permission.DELETE_BLOG,
    Permission.VIEW_CERTIFICATES,
    Permission.ISSUE_CERTIFICATE,
    Permission.VIEW_CLIENTS,
    Permission.ADD_CLIENT,
    Permission.EDIT_CLIENT,
  ],

  [UserRole.INSTRUCTOR]: [
    // Instructors manage courses and schedules, take attendance, and view assessments
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.MANAGE_COURSE_SESSIONS,
    Permission.VIEW_CLASS_SCHEDULE,
    Permission.CREATE_CLASS_SCHEDULE,
    Permission.EDIT_CLASS_SCHEDULE,
    Permission.VIEW_ATTENDANCE,
    Permission.MARK_ATTENDANCE,
    Permission.VIEW_ASSESSMENT,
  ],

  [UserRole.CORPORATE]: [
    // Corporate users can only view schedules and assessments
    Permission.VIEW_CLASS_SCHEDULE,
    Permission.VIEW_ASSESSMENT,
  ],

  [UserRole.FINANCE]: [
    // Finance handles payments only
    Permission.VIEW_PAYMENTS,
    Permission.PROCESS_PAYMENTS,
    Permission.MANAGE_PURCHASE_ORDERS,
  ],

  [UserRole.OPERATOR]: [
    // Operators handle assessment operations
    Permission.VIEW_CLASS_SCHEDULE,
    Permission.VIEW_ASSESSMENT,
    Permission.APPROVE_CERTIFICATE,
    Permission.REJECT_CERTIFICATE,
  ],
};

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/dashboard/users": [Permission.VIEW_USERS],
  "/dashboard/users/create": [Permission.CREATE_USER],
  "/dashboard/users/edit": [Permission.EDIT_USER],

  "/dashboard/courses": [Permission.VIEW_COURSES],
  "/dashboard/courses/create": [Permission.CREATE_COURSE],
  "/dashboard/courses/edit": [Permission.EDIT_COURSE],
  "/dashboard/courses/enrollments": [Permission.VIEW_ENROLLMENTS],
  "/dashboard/courses/enrollments/create": [Permission.CREATE_ENROLLMENT],

  "/dashboard/class-schedule": [Permission.VIEW_CLASS_SCHEDULE],
  "/dashboard/class-schedule/create": [Permission.CREATE_CLASS_SCHEDULE],

  "/dashboard/attendance": [Permission.VIEW_ATTENDANCE],
  "/dashboard/classes": [
    Permission.VIEW_CLASS_SCHEDULE,
    Permission.VIEW_ATTENDANCE,
  ],

  "/dashboard/assessment": [Permission.VIEW_ASSESSMENT],

  "/dashboard/companies": [Permission.VIEW_COMPANIES],
  "/dashboard/companies/manage": [Permission.MANAGE_COMPANIES],

  "/dashboard/offers": [Permission.VIEW_OFFERS],

  "/dashboard/payments": [Permission.VIEW_PAYMENTS],

  "/dashboard/blogs": [Permission.VIEW_BLOGS],
  "/dashboard/blogs/create": [Permission.CREATE_BLOG],

  "/dashboard/certificates": [Permission.VIEW_CERTIFICATES],

  "/dashboard/client": [Permission.VIEW_CLIENTS],
};
