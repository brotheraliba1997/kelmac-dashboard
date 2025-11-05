# Dynamic Course Form Component

A comprehensive, multi-step form component for creating and editing courses using the DynamicForm component. This component handles the complete course lifecycle with a user-friendly interface.

## Features

- ✅ **Multi-step Creation Process**: 5-step wizard for course creation
- ✅ **Single-page Edit Mode**: Streamlined editing experience
- ✅ **Progress Tracking**: Visual progress indicator for creation
- ✅ **Form Validation**: Comprehensive field validation
- ✅ **Error Handling**: Robust error handling with user feedback
- ✅ **Loading States**: Loading indicators for better UX
- ✅ **API Integration**: Seamless integration with course APIs

## Usage

### Creating a Course

```tsx
import DynamicCourseForm from "../components/courses-components/dynamic-course-form";

export default function CreateCoursePage() {
  return <DynamicCourseForm mode="create" />;
}
```

### Editing a Course

```tsx
import DynamicCourseForm from "../components/courses-components/dynamic-course-form";

export default function EditCoursePage() {
  const { id } = useParams();
  
  return <DynamicCourseForm mode="edit" courseId={id as string} />;
}
```

## Form Steps (Create Mode)

### Step 1: Basic Information
- Course Title (required)
- Course Slug (auto-generated if empty)
- Subtitle
- Instructor Selection (required)
- Category Selection (required)
- Course Description (required)

### Step 2: Content & Media
- Course Overview
- Thumbnail URL
- Preview Video URL
- Subcategories (comma-separated)
- Topics (comma-separated)

### Step 3: Course Metadata
- Skill Level (Beginner, Intermediate, Advanced, All Levels)
- Course Language
- Captions Language
- Certificate Available (checkbox)
- Lifetime Access (checkbox)
- Mobile Access (checkbox)

### Step 4: Pricing & Publication
- Course Price (required)
- Currency (USD, EUR, GBP, INR)
- Discounted Price
- Discount Percentage
- Publishing Settings:
  - Publish Course
  - Featured Course
  - Bestseller
  - New Course

### Step 5: Course Details
- What You Will Learn (required, line-separated)
- Requirements (line-separated)
- Target Audience (line-separated)
- Course Features (line-separated)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"create" \| "edit"` | `"create"` | Form mode |
| `courseId` | `string` | `undefined` | Course ID for edit mode |

## API Dependencies

The component requires the following API endpoints:

### Course API (`courseApi.ts`)
- `useCreateCourseMutation()` - Create new course
- `useUpdateCourseMutation()` - Update existing course
- `useGetCourseByIdQuery(id)` - Fetch course data for editing

### User API (`userApi.ts`)
- `useGetUsersQuery({ role: 3 })` - Fetch instructors

## Data Processing

### Form Data to API Format

The component automatically processes form data into the correct API format:

```typescript
const processedData = {
  // Basic Information
  title: data.title,
  slug: data.slug || generateSlugFromTitle(data.title),
  subtitle: data.subtitle,
  description: data.description,
  instructor: data.instructor,
  
  // Arrays from comma-separated strings
  subcategories: data.subcategories.split(",").map(s => s.trim()),
  topics: data.topics.split(",").map(s => s.trim()),
  
  // Nested objects
  snapshot: {
    skillLevel: data.skillLevel,
    language: data.language,
    // ...
  },
  
  details: {
    whatYouWillLearn: data.whatYouWillLearn.split("\n").filter(s => s.trim()),
    // ...
  }
};
```

### API Response to Form Format

For edit mode, the component processes API responses:

```typescript
const processedData = {
  // Flatten nested objects
  skillLevel: course?.snapshot?.skillLevel,
  language: course?.snapshot?.language,
  
  // Convert arrays to strings
  subcategories: course?.subcategories?.join(","),
  whatYouWillLearn: course?.details?.whatYouWillLearn?.join("\n"),
  // ...
};
```

## Schema Matching

The form fields map directly to the Mongoose schema:

| Form Field | Schema Path | Type | Notes |
|------------|-------------|------|-------|
| `title` | `title` | String | Required |
| `slug` | `slug` | String | Auto-generated |
| `instructor` | `instructor` | ObjectId | User reference |
| `category` | `category` | String | Required |
| `subcategories` | `subcategories` | [String] | From comma-separated |
| `skillLevel` | `snapshot.skillLevel` | Enum | SkillLevelEnum |
| `price` | `price` | Number | Min: 0 |
| `currency` | `currency` | Enum | CurrencyEnum |
| `whatYouWillLearn` | `details.whatYouWillLearn` | [String] | From line-separated |

## Error Handling

The component handles various error scenarios:

1. **API Errors**: Shows user-friendly error messages
2. **Loading States**: Displays loading indicators
3. **Validation Errors**: Real-time field validation
4. **Network Errors**: Graceful error handling with retry options

## Styling

The component uses Bootstrap classes and follows the existing design system:

- Cards for form containers
- Progress bars for step indication
- Form controls for inputs
- Button groups for actions
- Alert components for errors

## Extended Features

### Course Sessions Manager

A separate component (`CourseSessionsManager`) is available for managing course sessions:

```tsx
import CourseSessionsManager from "../components/courses-components/course-sessions-manager";

const [sessions, setSessions] = useState([]);

<CourseSessionsManager
  sessions={sessions}
  onSessionsChange={setSessions}
  disabled={isLoading}
/>
```

### Session Features:
- Add/Edit/Delete sessions
- Session types (lecture, break, lunch, etc.)
- Duration and timing
- Video URLs and resources
- Day grouping and ordering
- Free preview settings

## Future Enhancements

1. **Drag & Drop**: For session reordering
2. **Bulk Operations**: For session management
3. **Templates**: Course templates for quick creation
4. **Auto-save**: Automatic form saving
5. **Rich Text Editor**: For course descriptions
6. **File Upload**: For thumbnails and videos
7. **Session Topics**: Detailed topic management per session

## Example Complete Implementation

```tsx
"use client";
import React, { useState } from "react";
import DynamicCourseForm from "../components/courses-components/dynamic-course-form";
import CourseSessionsManager from "../components/courses-components/course-sessions-manager";

export default function CompleteCourseForm() {
  const [showSessions, setShowSessions] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);

  const handleCourseCreated = (id: string) => {
    setCourseId(id);
    setShowSessions(true);
  };

  if (showSessions && courseId) {
    return (
      <div>
        <CourseSessionsManager
          courseId={courseId}
          onComplete={() => router.push("/dashboard/courses")}
        />
      </div>
    );
  }

  return (
    <DynamicCourseForm
      mode="create"
      onSuccess={handleCourseCreated}
    />
  );
}
```

This comprehensive form component provides a complete solution for course management in your dashboard application.