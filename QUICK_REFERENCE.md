# Quick Bootstrap → Tailwind Reference Card

## 🚀 Quick Find & Replace

Use these in your editor's find/replace (with regex):

### Layout
```
className="d-flex"                     → className="flex"
className="d-block"                    → className="block"
className="d-none"                     → className="hidden"
className="justify-content-center"    → className="justify-center"
className="align-items-center"        → className="items-center"
```

### Typography
```
className="text-muted"      → className="text-gray-600"
className="fw-bold"         → className="font-bold"
className="text-capitalize" → className="capitalize"
```

### Spacing
```
className="mb-3"   → className="mb-3"   (same!)
className="mt-4"   → className="mt-4"   (same!)
className="me-2"   → className="mr-2"
className="ms-2"   → className="ml-2"
```

### Grid
```
className="row"         → className="flex flex-wrap -mx-2"
className="col-md-6"    → className="md:w-1/2 px-2"
className="col-lg-4"    → className="lg:w-1/3 px-2"
```

### Buttons (multi-line)
```
className="btn btn-primary"
→
className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
```

### Badges
```
className="badge bg-primary"
→
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
```

### Forms
```
className="form-control"
→
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"

className="form-label"
→
className="block text-sm font-medium text-gray-700 mb-1"
```

### Spinners
```
className="spinner-border"
→
className="animate-spin rounded-full border-b-2 border-primary-600"

className="visually-hidden"
→
className="sr-only"
```

## 💡 Pro Tips

1. **Combine classes wisely:**
   ```tsx
   // Bad
   <div className="flex">
   
   // Good
   <div className="flex">
   ```

2. **Use arbitrary values when needed:**
   ```tsx
   <div className="w-[300px] h-[calc(100vh-64px)]">
   ```

3. **Responsive design:**
   ```tsx
   <div className="w-full md:w-1/2 lg:w-1/3">
   ```

4. **Hover/Focus states:**
   ```tsx
   <button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">
   ```

5. **Group related utilities:**
   ```tsx
   // Layout
   <div className="flex items-center justify-between gap-4">
   
   // Styling
   <div className="bg-white rounded-lg shadow-md p-6">
   ```

## 📦 Color Palette

Your project uses these custom colors:

- `primary-{50-900}` - Blue
- `secondary-{50-900}` - Gray
- `success-{50-900}` - Green
- `danger-{50-900}` - Red
- `warning-{50-900}` - Amber
- `info-{50-900}` - Sky

Example usage:
```tsx
<div className="bg-primary-50 text-primary-900 border-primary-200">
```

## 🔧 Common Patterns

### Button
```tsx
<button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
  Click me
</button>
```

### Input
```tsx
<input 
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
  type="text"
/>
```

### Card
```tsx
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-xl font-semibold">Card Title</h3>
  </div>
  <div className="p-6">
    Card content
  </div>
  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
    Card footer
  </div>
</div>
```

### Badge
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
  Badge
</span>
```

### Modal Backdrop
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
    {/* Modal content */}
  </div>
</div>
```

## ⚡ VS Code Snippets

Add to your `.vscode/snippets.json`:

```json
{
  "Tailwind Button": {
    "prefix": "twbtn",
    "body": [
      "className=\"px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500\""
    ]
  },
  "Tailwind Input": {
    "prefix": "twinput",
    "body": [
      "className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500\""
    ]
  },
  "Tailwind Badge": {
    "prefix": "twbadge",
    "body": [
      "className=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${1:primary}-100 text-${1:primary}-800\""
    ]
  }
}
```

---

**Need help?** Check the full migration guide in `BOOTSTRAP_TO_TAILWIND_MIGRATION.md`
