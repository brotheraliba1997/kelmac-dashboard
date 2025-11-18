# DynamicTable Component

A powerful, reusable React table component with built-in search, filtering, sorting, and pagination capabilities.

## Features

✅ **Search** - Real-time search across multiple fields
✅ **Filters** - Multiple filter types (select, text, date, daterange)
✅ **Sorting** - Click column headers to sort (ascending/descending)
✅ **Pagination** - Full pagination with customizable page sizes
✅ **Loading States** - Built-in loading and error states
✅ **Customizable** - Fully customizable columns with render functions
✅ **Responsive** - Mobile-friendly design
✅ **TypeScript** - Full TypeScript support with generic types

## Usage

```tsx
import DynamicTable, { Column, FilterConfig } from "@/app/components/table/DynamicTable";

// Define your columns
const columns: Column<YourDataType>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (item) => <strong>{item.name}</strong>,
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <span className={`badge bg-${item.status === 'active' ? 'success' : 'danger'}`}>
        {item.status}
      </span>
    ),
  },
];

// Define filters (optional)
const filters: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    key: "createdAt",
    label: "Created Date",
    type: "date",
  },
];

// Use the component
<DynamicTable
  data={yourData}
  columns={columns}
  loading={isLoading}
  error={error}
  searchable={true}
  searchPlaceholder="Search..."
  searchKeys={["name", "email", "user.firstName"]} // Support nested keys
  filters={filters}
  pagination={{
    total: 100,
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
    onPageChange: (page) => setPage(page),
    onPageSizeChange: (size) => setPageSize(size),
    pageSizeOptions: [10, 20, 50, 100],
  }}
  emptyMessage="No data found"
  onRowClick={(item, index) => console.log("Clicked:", item)}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data to display |
| `columns` | `Column<T>[]` | Column configuration |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Show loading spinner |
| `error` | `string \| null` | `null` | Error message to display |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder for search input |
| `searchKeys` | `string[]` | `[]` | Keys to search in (supports nested keys) |
| `filters` | `FilterConfig[]` | `[]` | Filter configurations |
| `pagination` | `PaginationConfig` | `undefined` | Pagination configuration |
| `onRowClick` | `(item: T, index: number) => void` | `undefined` | Row click handler |
| `emptyMessage` | `string` | `"No data found"` | Message when no data |
| `className` | `string` | `""` | Additional CSS class |
| `rowClassName` | `(item: T, index: number) => string` | `undefined` | Dynamic row class |

## Column Configuration

```tsx
interface Column<T> {
  key: string;                    // Data key (supports nested: "user.email")
  label: string;                  // Column header text
  sortable?: boolean;             // Enable sorting
  render?: (item: T, index: number) => React.ReactNode; // Custom renderer
  className?: string;             // Column CSS class
}
```

## Filter Configuration

```tsx
interface FilterConfig {
  key: string;                    // Data key to filter
  label: string;                  // Filter label
  type: "select" | "date" | "daterange" | "text"; // Filter type
  options?: { value: string; label: string }[]; // For select type
  placeholder?: string;           // Input placeholder
}
```

## Examples

### Basic Table

```tsx
<DynamicTable
  data={users}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
  ]}
/>
```

### With Search

```tsx
<DynamicTable
  data={users}
  columns={columns}
  searchable={true}
  searchKeys={["name", "email", "phone"]}
  searchPlaceholder="Search users..."
/>
```

### With Filters

```tsx
<DynamicTable
  data={users}
  columns={columns}
  filters={[
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
      ],
    },
  ]}
/>
```

### With Pagination

```tsx
<DynamicTable
  data={users}
  columns={columns}
  pagination={{
    total: totalUsers,
    currentPage: currentPage,
    totalPages: Math.ceil(totalUsers / pageSize),
    pageSize: pageSize,
    onPageChange: setCurrentPage,
    onPageSizeChange: setPageSize,
    pageSizeOptions: [10, 25, 50, 100],
  }}
/>
```

### Custom Rendering

```tsx
const columns: Column<User>[] = [
  {
    key: "avatar",
    label: "User",
    render: (user) => (
      <div className="d-flex align-items-center">
        <img src={user.avatar} className="rounded-circle me-2" width="40" />
        <div>
          <div className="fw-bold">{user.name}</div>
          <small className="text-muted">{user.email}</small>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (user) => (
      <span className={`badge bg-${user.isActive ? 'success' : 'danger'}`}>
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];
```

### Nested Data Access

```tsx
// Supports dot notation for nested data
const columns: Column<Order>[] = [
  { key: "user.firstName", label: "Customer Name", sortable: true },
  { key: "user.email", label: "Email" },
  { key: "product.title", label: "Product" },
  { key: "product.price", label: "Price", sortable: true },
];

// Works with search too
<DynamicTable
  searchKeys={["user.firstName", "user.email", "product.title"]}
/>
```

## Styling

The component uses Bootstrap classes by default. You can customize by:

1. Adding custom `className` prop
2. Using `rowClassName` for dynamic row styling
3. Adding custom CSS classes to columns
4. Importing the optional CSS file:

```tsx
import "@/app/components/table/DynamicTable.css";
```

## TypeScript

The component is fully typed with TypeScript generics:

```tsx
// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// TypeScript will infer and validate
const columns: Column<User>[] = [...];
<DynamicTable<User> data={users} columns={columns} />
```

## Best Practices

1. **Search Keys**: Only include searchable fields to improve performance
2. **Custom Renderers**: Use `render` for complex cell content
3. **Pagination**: For large datasets, always use server-side pagination
4. **Loading States**: Always handle loading and error states
5. **Memoization**: Wrap expensive render functions with `useMemo`

## License

MIT
