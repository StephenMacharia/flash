# Request Assistance Form Component

## Overview

The **Request Assistance Form Component** is a highly interactive, accessible, and modern ICT Help Desk ticket submission form designed for the Treasury Help Desk Dashboard. It provides an intuitive user experience with intelligent category selection, impact-based urgency assessment, file upload capabilities, and real-time feedback.

## Key Features

### 1. **Smart Category Selectors (Visual Grid)**

Four visually distinct, clickable cards for IT issue categorization:

- **💻 Software & Apps** - Email, Office Suite, Collaboration Tools, Browser issues
- **📡 Network & Internet** - Wi-Fi, VPN, Slow Connection, DNS issues
- **🖥️ Hardware & Devices** - Monitor, Printer, Keyboard/Mouse, Laptop/Desktop issues
- **🔒 Security & Access** - Login, Permission, Password, Two-Factor Auth issues

**Interaction Model:**
- Cards display an active border and background highlight when selected
- Visual icon with emoji for instant recognition
- Responsive grid (2 columns on mobile, 4 columns on desktop)
- Selecting a category dynamically updates the "Specific Issue" subcategory dropdown

### 2. **Dynamic Subcategory Selector**

An intelligent dropdown that updates based on the selected main category:

```
Software & Apps:
├── Email Client
├── Office Suite
├── Collaboration Tools
├── Browser
└── Other

Network & Internet:
├── Wi-Fi Connection
├── VPN
├── Slow Connection
├── DNS Issues
└── Other

Hardware & Devices:
├── Monitor
├── Printer
├── Keyboard/Mouse
├── Laptop/Desktop
└── Other

Security & Access:
├── Login Issues
├── Permission Access
├── Password Reset
├── Two-Factor Auth
└── Other
```

### 3. **Impact-Based Urgency Matrix**

Three-step selector with color-coded urgency levels and contextual descriptions:

**Just Me** (Green)
- Color: `bg-green-50 border-green-300`
- Description: "It's affecting only my workflow, I have a workaround."
- Use Case: Personal productivity issues with alternatives available

**My Team** (Yellow)
- Color: `bg-amber-50 border-amber-300`
- Description: "It's blocking a group or department from completing tasks."
- Use Case: Team-wide impact affecting multiple users

**System-Wide / Critical** (Red)
- Color: `bg-red-50 border-red-300`
- Description: "Core campus/office network or vital system is completely down."
- Use Case: Enterprise-level outages requiring immediate attention

**Visual Design:**
- Custom radio buttons with animated check marks
- Full-width buttons with clear typography hierarchy
- Selected state shows radio button filled with brand color
- Hover states for better affordance

### 4. **Form Fields**

#### Issue Title / Subject
- Required field with clear validation
- Placeholder: "e.g., Cannot connect to Wi-Fi, Printer not responding"
- Character limit: Practical user guidance
- Active error display with red border and message

#### Detailed Description
- 4-row textarea with guided placeholder text
- Helpful prompts:
  - "When did it start?"
  - "What have you already tried?"
  - "Any error messages?"
  - "Impact on your work?"
- Full validation feedback

#### Priority Level (Reference)
- Dropdown selector for user guidance
- Options: Low, Medium (Recommended), High
- Separate from Impact Level for proper ticket triage

### 5. **Smart Attachments & File Upload**

#### Drag-and-Drop Zone
- **Visual Feedback:**
  - Inactive state: Dashed border, subtle background
  - Hover state: Border changes to brand color, background highlights
  - Drag-over state: Active border and background color change
  - Icon: Cloud upload icon for clarity

- **Supported File Types:**
  - Images: PNG, JPEG, GIF, WebP
  - Documents: PDF, TXT, ZIP
  - Max file size: 50MB per file

- **Upload Methods:**
  - Drag and drop multiple files
  - Click to browse file picker
  - Direct paste with keyboard shortcut (Ctrl+V)

#### File Preview List
- Shows uploaded files with:
  - File icon (💾)
  - Filename (truncated for long names)
  - File size (formatted: KB, MB)
  - Remove button (hover to delete)
- File counter: "Attached Files (n)"
- Helpful note about supported formats

#### File Validation
- Real-time error messages for:
  - Unsupported file types
  - Files exceeding size limit
  - Invalid file formats

### 6. **Form Validation**

**Client-Side Validation:**
- Required fields: Title, Description, Category, Impact Level
- Real-time error clearing when user corrects input
- Error messages display below each field in red
- Required field indicators (*)

**Error States:**
- Title: "Issue title is required"
- Description: "Detailed description is required"
- Category: "Please select a category"
- Impact Level: "Please select an impact level"
- Attachments: File-specific validation messages

### 7. **Loading State**

**Submit Button States:**
- **Idle:** Shows "Submit Ticket" with send icon
- **Loading:** 
  - Animated spinner
  - Button text: "Submitting..."
  - Button disabled to prevent double-submission
  - Close button disabled

**Animation:**
- 4-point spinner animation using CSS keyframes
- 1500ms simulated API call

### 8. **Success Modal**

Beautiful success feedback modal displayed after submission:

**Visual Elements:**
- Gradient top border (Teal gradient)
- Success checkmark in green circle
- Ticket number display in distinctive monospace font
- Success messaging
- Auto-close after 4 seconds or manual dismiss

**Content:**
- "Ticket Submitted Successfully!" heading
- Ticket number (e.g., "IT-2847")
- Reference to "Pending Tickets" tab
- "Got it" button for manual dismissal

**Auto-Closing Behavior:**
- Automatically dismisses after 4 seconds
- Closes the modal and entire form
- User returns to dashboard to view new ticket

## Design System

### Color Palette

| Usage | Color | Hex Code |
|-------|-------|----------|
| Primary Brand | Teal | `#0D98BA` |
| Primary Hover | Dark Teal | `#0B7E9A` |
| Primary Deep | Deep Teal | `#086A82` |
| Body Text | Ink | `#1F2937` |
| Secondary Text | Muted | `#64748B` |
| Borders | Border | `#E2E8F0` |
| Background | Off-white | `#F9FAFB` |
| Light Background | Light Gray | `#F1F5F9` |

### Typography

- **Headings:** Font-bold, text-lg (`text-[#1F2937]`)
- **Labels:** Font-semibold, text-sm
- **Body:** Regular weight, text-sm
- **Captions:** Font-medium or semibold, text-xs

### Spacing & Sizing

- Modal max-width: 768px (`max-w-2xl`)
- Padding sections: 24px (`px-6 py-6`)
- Gap between sections: 24px (`space-y-6`)
- Card gap: 12px (`gap-3`)
- Border radius: 8px rounded-lg, 12px rounded-xl

### Responsive Design

- **Mobile:** Single column layout, grid-cols-2 for category cards
- **Tablet/Desktop:** Grid-cols-4 for category cards, 2-column form sections
- Scrollable on small screens with `overflow-y-auto`
- Proper padding on all screen sizes

## Component API

### Props

```typescript
interface RaiseTicketModalProps {
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    priority: TicketPriority;
    impactLevel: ImpactLevel;
    attachments: Attachment[];
  }) => void;
}
```

### Usage Example

```tsx
import RaiseTicketModal from "./components/RaiseTicketModal";
import { useTickets } from "./context/TicketContext";
import { useAuth } from "./context/AuthContext";

function Dashboard() {
  const { currentUser } = useAuth();
  const { addTicket } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);

  const handleRaiseTicket = (input) => {
    addTicket({
      userEmail: currentUser!.email,
      title: input.title,
      description: input.description,
      category: input.category,
      subcategory: input.subcategory,
      priority: input.priority,
      impactLevel: input.impactLevel,
      attachments: input.attachments,
    });
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Raise a Ticket</button>
      {modalOpen && (
        <RaiseTicketModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleRaiseTicket}
        />
      )}
    </>
  );
}
```

## State Management Integration

### Type Definitions

```typescript
export interface Attachment {
  name: string;
  size: number;
  type: string;
  data?: string; // Base64 or file data
}

export interface Ticket {
  id: string;
  userEmail: string;
  dateTime: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: TicketPriority;
  impactLevel: ImpactLevel;
  attachments?: Attachment[];
  status: TicketStatus;
}

export type ImpactLevel = "Just Me" | "My Team" | "System-Wide";
```

### Context Usage

The form integrates with `TicketContext` which provides:
- `addTicket()` - Create new ticket with full details
- `getTicketsForUser()` - Retrieve user's tickets
- `tickets` - All tickets in system

## Accessibility Features

- ✅ Semantic HTML with proper form elements
- ✅ ARIA labels for icon buttons (`aria-label="Close"`)
- ✅ Color not the only indicator (impact levels use radio buttons)
- ✅ Proper focus management and tab order
- ✅ Error messages associated with fields
- ✅ Required field indicators
- ✅ Disabled states clearly indicated
- ✅ High contrast text and buttons
- ✅ Keyboard navigation support

## Performance Optimizations

- Component is self-contained with no external side effects
- File validation happens client-side before processing
- Form state properly scoped to component
- Event handlers use `useCallback` for drag/drop efficiency
- Smooth animations using CSS transforms

## Browser Support

- Modern browsers with ES6+ support
- React 18.3.1+
- Tailwind CSS 3.4.6+
- File API support required for attachments

## Usage Tips

1. **Always validate on the backend** - This component provides client-side validation
2. **Handle attachments appropriately** - Consider file size limits on server
3. **Customize categories** - Update `CATEGORY_DATA` object for different use cases
4. **Translate strings** - All text can be easily internationalized
5. **Customize colors** - Update hex values to match your brand
6. **API integration** - Replace the 1500ms timeout with actual API call

## Future Enhancements

- [ ] Add Ctrl+V screenshot paste functionality
- [ ] Add image preview thumbnails
- [ ] Support for bulk file uploads
- [ ] Multi-language support
- [ ] Customizable impact level colors
- [ ] Template suggestions based on category
- [ ] Auto-save draft capability
- [ ] Attachment compression
- [ ] API integration for real ticket creation

## Component Testing Checklist

- [ ] Category selection works and updates subcategory
- [ ] Impact level selection works with all three options
- [ ] Form validation triggers on empty fields
- [ ] File upload accepts valid files
- [ ] File upload rejects oversized files
- [ ] Drag-and-drop zone responds to drag events
- [ ] Success modal appears after submission
- [ ] Modal auto-closes after 4 seconds
- [ ] Cancel button works on all states
- [ ] Loading state prevents multiple submissions
- [ ] Error messages clear when corrected

---

**Component Version:** 1.0.0  
**Last Updated:** July 11, 2026  
**Built with:** React 18, TypeScript, Tailwind CSS
