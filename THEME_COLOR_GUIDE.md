# Theme Color Usage Guide

## Color Palette

Your Tailwind configuration defines the following theme colors:

### Primary (Blue)
- **Use for**: Main actions, primary buttons, links, active states, highlights
- **Classes**: `bg-primary-{50-900}`, `text-primary-{50-900}`, `border-primary-{50-900}`
- **Example**: Submit buttons, navigation active state, primary CTAs

### Secondary (Gray/Slate)
- **Use for**: Secondary actions, neutral elements, text colors
- **Classes**: `bg-secondary-{50-900}`, `text-secondary-{50-900}`, `border-secondary-{50-900}`
- **Example**: Cancel buttons, card backgrounds, secondary text

### Success (Green)
- **Use for**: Success messages, completed states, positive actions
- **Classes**: `bg-success-{50-900}`, `text-success-{50-900}`, `border-success-{50-900}`
- **Example**: Success toasts, approve buttons, completed badges

### Danger (Red)
- **Use for**: Error messages, delete actions, warnings, failed states
- **Classes**: `bg-danger-{50-900}`, `text-danger-{50-900}`, `border-danger-{50-900}`
- **Example**: Error alerts, delete buttons, reject actions, error badges

### Warning (Yellow/Amber)
- **Use for**: Warning messages, pending states, caution indicators
- **Classes**: `bg-warning-{50-900}`, `text-warning-{50-900}`, `border-warning-{50-900}`
- **Example**: Pending status, warning notifications, draft states

### Info (Blue/Cyan)
- **Use for**: Informational messages, neutral notifications, help text
- **Classes**: `bg-info-{50-900}`, `text-info-{50-900}`, `border-info-{50-900}`
- **Example**: Info notifications, tooltips, help sections

## Color Mapping (Hardcoded → Theme)

### Replace These:
```
blue-{shade}    → primary-{shade}   (for main actions)
blue-{shade}    → info-{shade}      (for informational elements)
green-{shade}   → success-{shade}
red-{shade}     → danger-{shade}
yellow-{shade}  → warning-{shade}
teal-{shade}    → primary-{shade}
purple-{shade}  → info-{shade}
indigo-{shade}  → primary-{shade}
gray-{shade}    → secondary-{shade}
```

## Component Guidelines

### Buttons
- **Primary Action**: `bg-primary-600 hover:bg-primary-700 text-white`
- **Secondary Action**: `bg-secondary-100 hover:bg-secondary-200 text-secondary-700`
- **Success**: `bg-success-600 hover:bg-success-700 text-white`
- **Danger**: `bg-danger-600 hover:bg-danger-700 text-white`
- **Cancel**: `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`

### Status Badges
- **Success**: `bg-success-100 text-success-800`
- **Pending**: `bg-warning-100 text-warning-800`
- **Failed**: `bg-danger-100 text-danger-800`
- **Info**: `bg-info-100 text-info-800`

### Alerts/Notifications
- **Success**: `bg-success-50 border border-success-200 text-success-700`
- **Error**: `bg-danger-50 border border-danger-200 text-danger-700`
- **Warning**: `bg-warning-50 border border-warning-200 text-warning-700`
- **Info**: `bg-info-50 border border-info-200 text-info-700`

### Forms
- **Focus Ring**: `focus:ring-2 focus:ring-primary-500`
- **Error State**: `border-danger-500 focus:ring-danger-500`
- **Success State**: `border-success-500 focus:ring-success-500`

### Tables
- **Header**: `bg-secondary-50`
- **Row Hover**: `hover:bg-secondary-50`
- **Selected Row**: `bg-primary-50`
- **Border**: `border-secondary-200`

## Implementation Status

### ✅ Updated Components
- Login component
- DynamicForm component

### 🔄 Needs Update
- Header component (notification badge, dropdown)
- Sidebar component (logout button)
- Payment tables (status badges, action buttons)
- Course form (all blue buttons)
- DynamicTable/DynamicTableTailwind (buttons, badges)
- MainDashboard (stat cards, activity badges)
- SearchableSelect (hover states)

## Best Practices

1. **Always use theme colors** - Never hardcode colors like `blue-600`, `red-500`, etc.
2. **Be semantic** - Use `success` for success, `danger` for errors, `primary` for main actions
3. **Maintain contrast** - Use `-50` to `-300` for backgrounds, `-700` to `-900` for text
4. **Consistent hover states** - Primary buttons: `-600` normal, `-700` hover
5. **Use opacity** for disabled states - `disabled:opacity-50`
