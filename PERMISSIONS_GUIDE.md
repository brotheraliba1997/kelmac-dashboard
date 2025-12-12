# Role-Based Permission System

## Overview
This application uses a comprehensive role-based access control (RBAC) system to manage user permissions across different features and routes.

## User Roles

The system supports 5 user roles:

1. **Admin (ID: 1)** - Full system access
2. **Student (ID: 2)** - Limited access to their own data
3. **Instructor (ID: 3)** - Manage classes and students
4. **Corporate (ID: 4)** - Manage company users and enrollments
5. **Finance (ID: 5)** - Financial operations and reporting

## Permission System

### Files Structure

```
app/
├── utils/
│   ├── permissions.ts          # Permission definitions and role mappings
│   ├── permissionChecker.ts    # Permission checking utilities
│   └── getUserRoleName.tsx     # Role ID to name conversion
├── components/
│   └── shared/
│       ├── ProtectedRoute.tsx  # Route-level protection
│       └── PermissionGate.tsx  # Component-level protection
└── hooks/
    └── usePermissions.ts       # Permission checking hook
```

### Core Permissions

The system defines permissions for:
- **User Management**: view, create, edit, delete users
- **Course Management**: view, create, edit, delete courses
- **Class Schedule**: view, create, edit, delete schedules
- **Attendance**: view, mark, edit attendance
- **Assessment**: view, approve/reject certificates
- **Enrollment**: view, create, edit, delete enrollments
- **Companies**: view, manage companies
- **Offers**: view, create, edit, delete offers
- **Payments**: view, process payments, manage purchase orders
- **Blogs**: view, create, edit, delete blogs
- **Certificates**: view, issue certificates
- **Clients**: view, add, edit clients

## Usage

### 1. Protecting Routes

Wrap your page component with `ProtectedRoute`:

```tsx
import ProtectedRoute from "@/app/components/shared/ProtectedRoute";
import { Permission } from "@/app/utils/permissions";

export default function UsersPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_USERS]}>
      {/* Your page content */}
    </ProtectedRoute>
  );
}
```

### 2. Conditional UI Rendering

Use `PermissionGate` to show/hide UI elements:

```tsx
import PermissionGate from "@/app/components/shared/PermissionGate";
import { Permission } from "@/app/utils/permissions";

function MyComponent() {
  return (
    <div>
      <PermissionGate permission={Permission.CREATE_USER}>
        <button>Add User</button>
      </PermissionGate>
      
      <PermissionGate 
        permissions={[Permission.EDIT_USER, Permission.DELETE_USER]}
        requireAll={false} // User needs any of these permissions
      >
        <button>Manage User</button>
      </PermissionGate>
    </div>
  );
}
```

### 3. Using the Permission Hook

Check permissions programmatically:

```tsx
import { usePermissions } from "@/app/hooks/usePermissions";
import { Permission } from "@/app/utils/permissions";

function MyComponent() {
  const { hasPermission, isAdmin, isInstructor } = usePermissions();
  
  const canCreateCourse = hasPermission(Permission.CREATE_COURSE);
  
  return (
    <div>
      {canCreateCourse && <button>Create Course</button>}
      {isAdmin && <button>Admin Panel</button>}
    </div>
  );
}
```

### 4. Sidebar Navigation

The sidebar automatically filters menu items based on user permissions. Each menu item in `sidebarJson.tsx` includes:

```tsx
{
  name: "Users",
  path: "/dashboard/users",
  role: ["admin", "instructor"],
  permissions: [Permission.VIEW_USERS],
}
```

### 5. Data Filtering

Filter data based on user role:

```tsx
import { filterDataByRole } from "@/app/utils/permissionChecker";

const filteredEnrollments = filterDataByRole(
  user,
  allEnrollments,
  "enrollments"
);
```

## Role Permission Matrix

| Feature | Admin | Student | Instructor | Corporate | Finance |
|---------|-------|---------|------------|-----------|---------|
| View Users | ✓ | ✗ | ✓ | ✓ | ✓ |
| Create Users | ✓ | ✗ | ✗ | ✓ | ✗ |
| View Courses | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Courses | ✓ | ✗ | ✗ | ✗ | ✗ |
| Mark Attendance | ✓ | ✗ | ✓ | ✗ | ✗ |
| Approve Certificates | ✓ | ✗ | ✓ | ✗ | ✗ |
| View Payments | ✓ | ✗ | ✗ | ✓ | ✓ |
| Process Payments | ✓ | ✗ | ✗ | ✗ | ✓ |
| Manage Companies | ✓ | ✗ | ✗ | ✓ | ✗ |

## Adding New Permissions

1. **Define the permission** in `app/utils/permissions.ts`:
```typescript
export enum Permission {
  // ... existing permissions
  NEW_PERMISSION = "new_permission",
}
```

2. **Add to role mappings**:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // ... existing permissions
    Permission.NEW_PERMISSION,
  ],
  // ... other roles
};
```

3. **Add route protection** (if needed):
```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // ... existing routes
  "/dashboard/new-route": [Permission.NEW_PERMISSION],
};
```

4. **Use in components**:
```tsx
<PermissionGate permission={Permission.NEW_PERMISSION}>
  <YourComponent />
</PermissionGate>
```

## Best Practices

1. **Always protect sensitive routes** with `ProtectedRoute`
2. **Use `PermissionGate`** for conditional UI rendering
3. **Check permissions server-side** for API calls
4. **Default to least privilege** - only grant necessary permissions
5. **Test with different roles** to ensure proper access control
6. **Log permission denials** for security auditing

## Testing Permissions

To test different role permissions:

1. Login with different user roles
2. Verify sidebar menu items visibility
3. Try accessing protected routes directly
4. Check UI elements appear/hide correctly
5. Attempt actions that should be restricted

## Security Considerations

- Permissions are checked both client-side (UI) and should be enforced server-side (API)
- Never rely solely on client-side permission checks
- Sensitive data should be filtered server-side
- API endpoints must verify user permissions before executing operations
- Token expiration and refresh should be properly handled
