# Bootstrap to Tailwind CSS Migration Guide

## Migration Status: In Progress

### ✅ Completed

1. **Configuration & Setup**
   - ✅ Created `tailwind.config.ts` with custom theme
   - ✅ Removed Bootstrap from `package.json`
   - ✅ Removed Bootstrap imports from `layout.tsx`
   - ✅ Removed Bootstrap type declarations from `global.d.ts`

2. **Core Components Converted**
   - ✅ `app/components/login-component/login.tsx`
   - ✅ `app/components/shared/DynamicForm.tsx`
   - ✅ `app/components/shared/Modal.tsx`
   - ✅ `app/components/shared/ProtectedRoute.tsx`
   - ✅ `app/components/shared/Spinner.tsx`

### 🔄 In Progress / Remaining

#### High Priority Files (Need Manual Conversion)

1. **Layout Components**
   - `app/components/layout/header.tsx` - Complex dropdown navigation
   - `app/components/layout/sidebar.tsx` - Sidebar navigation
   - `app/components/layout/index.tsx` - Main layout wrapper

2. **Table Components**
   - `app/components/table/DynamicTable.tsx` - Already uses Tailwind (DynamicTableTailwind)
   - `app/components/table/DynamicTableTailwind.tsx` - Already done
   - `app/components/table/index.jsx` - Legacy, needs conversion
   - `app/components/table/tableHead.jsx`
   - `app/components/table/tablePagination.jsx`
   - `app/components/table/tableRow.jsx`

3. **Dashboard Pages**
   - `app/dashboard/users/page.tsx`
   - `app/dashboard/users/create/CreateUserForm.tsx`
   - `app/dashboard/users/edit/[id]/UpdateUserForm.tsx`
   - `app/dashboard/courses/page.tsx`
   - `app/dashboard/courses/create/page.tsx`
   - `app/dashboard/courses/edit/[id]/page.tsx`
   - `app/dashboard/payments/page.tsx`
   - `app/dashboard/attendance/page.tsx`
   - `app/dashboard/attendance/[id]/page.tsx`
   - `app/dashboard/class-schedule/page.tsx`
   - `app/dashboard/class-schedule/create/page.tsx`

4. **Course Components**
   - `app/components/courses-components/dynamic-course-form.tsx` - Large file
   - `app/components/courses-components/create-components.tsx`
   - `app/components/courses-components/edit-components.tsx`
   - `app/components/courses-components/course-sessions-manager.tsx`
   - `app/components/courses-components/category-manager.tsx`

5. **Card Components**
   - `app/components/cards/BlogCard.tsx`
   - `app/components/cards/CertificateCard.tsx`
   - `app/components/cards/CompanyCard.tsx`
   - `app/components/cards/CourseCard.tsx`
   - `app/components/cards/OfferCard.tsx`

6. **Other Components**
   - `app/components/enrollment-components/dynamic-enrollment-form.tsx`
   - `app/components/payments/PurchaseOrdersTab.tsx`
   - `app/components/payments/StripePaymentsTab.tsx`
   - `app/components/attendance-component/attendance-component.tsx`
   - `app/components/dashboard--component/MainDashboard-component.tsx`
   - `app/components/dashboard--component/add-Client-component .tsx`

## Bootstrap to Tailwind Class Mapping

### Layout & Grid
| Bootstrap | Tailwind |
|-----------|----------|
| `.container` | `.container mx-auto px-4` |
| `.row` | `.flex flex-wrap -mx-2` |
| `.col` | `.px-2` |
| `.col-md-6` | `.md:w-1/2 px-2` |
| `.col-lg-4` | `.lg:w-1/3 px-2` |
| `.col-lg-3` | `.lg:w-1/4 px-2` |
| `.d-flex` | `.flex` |
| `.d-block` | `.block` |
| `.d-none` | `.hidden` |
| `.d-inline` | `.inline` |
| `.justify-content-center` | `.justify-center` |
| `.justify-content-between` | `.justify-between` |
| `.justify-content-end` | `.justify-end` |
| `.align-items-center` | `.items-center` |
| `.align-items-end` | `.items-end` |
| `.flex-wrap` | `.flex-wrap` |
| `.gap-3` | `.gap-3` |

### Spacing
| Bootstrap | Tailwind |
|-----------|----------|
| `.m-0` to `.m-5` | `.m-0` to `.m-5` (4px increments) |
| `.p-0` to `.p-5` | `.p-0` to `.p-5` (4px increments) |
| `.mt-3` | `.mt-3` (12px) |
| `.mb-3` | `.mb-3` (12px) |
| `.me-2` | `.mr-2` (8px) |
| `.ms-1` | `.ml-1` (4px) |

### Typography
| Bootstrap | Tailwind |
|-----------|----------|
| `.text-center` | `.text-center` |
| `.text-left` | `.text-left` |
| `.text-right` | `.text-right` |
| `.fw-bold` | `.font-bold` |
| `.fw-semibold` | `.font-semibold` |
| `.fw-normal` | `.font-normal` |
| `.text-muted` | `.text-gray-600` |
| `.text-primary` | `.text-primary-600` |
| `.text-danger` | `.text-danger-600` |
| `.text-success` | `.text-success-600` |
| `.text-warning` | `.text-warning-600` |
| `.text-capitalize` | `.capitalize` |
| `.text-lowercase` | `.lowercase` |
| `.text-uppercase` | `.uppercase` |

### Buttons
| Bootstrap | Tailwind |
|-----------|----------|
| `.btn` | `.px-4 py-2 rounded-md focus:outline-none` |
| `.btn-primary` | `.bg-primary-600 text-white hover:bg-primary-700` |
| `.btn-secondary` | `.bg-secondary-600 text-white hover:bg-secondary-700` |
| `.btn-danger` | `.bg-danger-600 text-white hover:bg-danger-700` |
| `.btn-success` | `.bg-success-600 text-white hover:bg-success-700` |
| `.btn-outline-secondary` | `.border border-gray-300 text-gray-700 bg-white hover:bg-gray-50` |
| `.btn-dark` | `.bg-gray-900 text-white hover:bg-gray-800` |
| `.btn-sm` | `.px-3 py-1.5 text-sm` |
| `.btn-lg` | `.px-6 py-3 text-lg` |
| `.btn-close` | Custom close button with SVG |

### Forms
| Bootstrap | Tailwind |
|-----------|----------|
| `.form-control` | `.w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500` |
| `.form-label` | `.block text-sm font-medium text-gray-700 mb-1` |
| `.form-check` | `.flex items-center` |
| `.form-check-input` | `.w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500` |
| `.form-check-label` | `.ml-2 text-sm text-gray-700` |
| `.input-group` | `.flex` |
| `.input-group-text` | `.inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50` |
| `.is-invalid` | `.border-danger-500 focus:ring-danger-500` |
| `.invalid-feedback` | `.text-danger-600 text-sm mt-1` |
| `.form-text` | `.text-gray-500 text-sm mt-1` |

### Badges & Tags
| Bootstrap | Tailwind |
|-----------|----------|
| `.badge` | `.inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium` |
| `.badge bg-primary` | `.bg-primary-100 text-primary-800` |
| `.badge bg-success` | `.bg-success-100 text-success-800` |
| `.badge bg-danger` | `.bg-danger-100 text-danger-800` |
| `.badge bg-warning` | `.bg-warning-100 text-warning-800` |
| `.badge bg-info` | `.bg-info-100 text-info-800` |
| `.badge rounded-pill` | `.rounded-full` |

### Cards & Containers
| Bootstrap | Tailwind |
|-----------|----------|
| `.card` | `.bg-white rounded-lg shadow` |
| `.card-header` | `.px-6 py-4 border-b border-gray-200` |
| `.card-body` | `.p-6` |
| `.card-footer` | `.px-6 py-4 border-t border-gray-200` |
| `.card-title` | `.text-xl font-semibold` |

### Modals
| Bootstrap | Tailwind |
|-----------|----------|
| `.modal` | `.fixed inset-0 z-50 flex items-center justify-center` |
| `.modal-dialog` | `.relative w-full max-w-lg mx-4` |
| `.modal-content` | `.relative bg-white rounded-lg shadow-xl` |
| `.modal-header` | `.flex items-center justify-between p-4 border-b` |
| `.modal-body` | `.p-6` |
| `.modal-footer` | `.flex items-center justify-end gap-3 p-4 border-t` |

### Spinners & Loading
| Bootstrap | Tailwind |
|-----------|----------|
| `.spinner-border` | `.animate-spin rounded-full border-b-2` |
| `.spinner-border-sm` | `.h-4 w-4` |
| `.visually-hidden` | `.sr-only` |

### Progress Bars
| Bootstrap | Tailwind |
|-----------|----------|
| `.progress` | `.w-full bg-gray-200 rounded-full` |
| `.progress-bar` | `.bg-primary-600 rounded-full transition-all duration-300` |

### Alerts
| Bootstrap | Tailwind |
|-----------|----------|
| `.alert` | `.p-4 rounded-md` |
| `.alert-primary` | `.bg-primary-50 border border-primary-200 text-primary-800` |
| `.alert-danger` | `.bg-danger-50 border border-danger-200 text-danger-800` |
| `.alert-success` | `.bg-success-50 border border-success-200 text-success-800` |
| `.alert-warning` | `.bg-warning-50 border border-warning-200 text-warning-800` |

### Tables
| Bootstrap | Tailwind |
|-----------|----------|
| `.table` | `.min-w-full divide-y divide-gray-200` |
| `.table-striped` | Add `.even:bg-gray-50` to `<tr>` |
| `.table-hover` | Add `.hover:bg-gray-50` to `<tr>` |
| `.table-bordered` | `.border border-gray-200` |

## Next Steps

1. **Run npm install** to remove Bootstrap dependencies
   ```bash
   npm install
   ```

2. **Update remaining files** using the class mapping above

3. **Test all pages** to ensure no broken layouts

4. **Remove unused Bootstrap CSS** from `globals.css`

5. **Add Tailwind directives** to `globals.css` if not already present:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Automated Conversion Script

You can use the following regex patterns for bulk find/replace:

```
// Bootstrap -> Tailwind replacements
className="d-flex" -> className="flex"
className="d-block" -> className="block"
className="d-none" -> className="hidden"
className="justify-content-center" -> className="justify-center"
className="align-items-center" -> className="items-center"
className="text-muted" -> className="text-gray-600"
className="fw-bold" -> className="font-bold"
className="mb-3" -> className="mb-3"
className="mt-3" -> className="mt-3"
// ... etc
```

## Testing Checklist

- [ ] Login page works correctly
- [ ] Dashboard layout displays properly
- [ ] Tables render with correct styling
- [ ] Forms function and validate correctly
- [ ] Modals open and close properly
- [ ] Cards display correctly
- [ ] Responsive behavior on mobile/tablet
- [ ] All buttons are clickable and styled
- [ ] Dropdowns work
- [ ] Navigation works
