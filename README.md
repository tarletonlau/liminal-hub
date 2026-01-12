# Liminal Hub

**Central hub for all Liminal internal tools.**

---

## Overview

Liminal Hub is the unified entry point for all internal applications at Liminal. It provides:

- A centralized dashboard of all internal tools
- Single Sign-On (SSO) via Clerk
- Role-based access control (user vs admin views)
- Token passthrough to all connected internal tools

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         LIMINAL HUB                             │
│                    (Central Auth Gateway)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│   │    Login    │────▶│    Clerk    │────▶│   Hub App   │      │
│   │    Page     │     │    Auth     │     │  Dashboard  │      │
│   └─────────────┘     └─────────────┘     └─────────────┘      │
│                              │                    │             │
│                              │                    │             │
│                        Clerk Token          Pass Token          │
│                              │                    │             │
│                              ▼                    ▼             │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                  INTERNAL TOOLS                         │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│  │
│   │  │ Tool A   │  │ Tool B   │  │ Tool C   │  │ Tool D   ││  │
│   │  │ (Clerk)  │  │ (Clerk)  │  │ (Clerk)  │  │ (Clerk)  ││  │
│   │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Views

### User View (Default)

The standard dashboard view for all authenticated users. Features:

- Tool cards organized by category (DEV_TOOLS, HR_ADMIN, PRODUCTIVITY, ANALYTICS)
- Search and filter functionality
- Grid/List view toggle
- Status indicators for each tool (ONLINE, MAINTENANCE, OFFLINE)
- Real-time marquee with system alerts and announcements

Users only see tools they have access to based on their role.

### Admin View

Administrative console for managing the hub. Features:

- CRUD operations for internal tools (add, edit, delete)
- Manage marquee/alert broadcasts
- Configure tool metadata (name, description, URL, category, status, access levels)

**Admin view is only accessible to users with the `ADMIN` role.**

---

## Authentication

### Provider: Clerk

All authentication is handled by [Clerk](https://clerk.com). The Hub and all internal tools share the same Clerk application, enabling seamless SSO across the entire internal tooling ecosystem.

### Authentication Flow

```
1. User navigates to Liminal Hub
2. If not authenticated → Redirect to Clerk login
3. Clerk authenticates user (SSO, email, etc.)
4. Clerk returns JWT token with user claims
5. Hub stores token and displays appropriate view based on user role
6. When user clicks on a tool → Token is passed to that tool
7. Tool validates token with Clerk → User is already authenticated
```

### Token Passthrough Strategy

When a user launches an internal tool from the Hub, the Clerk auth token is passed using one of these methods:

#### Method 1: URL Parameter (for initial navigation)
```
https://tool.internal.liminal.com/?clerk_token={token}
```

#### Method 2: Shared Clerk Session (Recommended)
Since all tools use the same Clerk application, the session is automatically shared if tools are on the same domain/subdomain structure:

```
hub.liminal.com      → Clerk session established
tool-a.liminal.com   → Same Clerk session (automatic)
tool-b.liminal.com   → Same Clerk session (automatic)
```

#### Method 3: postMessage (for embedded iframes)
```javascript
// Hub sends token to embedded tool
iframe.contentWindow.postMessage({ 
  type: 'CLERK_AUTH_TOKEN',
  token: clerkToken 
}, 'https://tool.internal.liminal.com');
```

---

## User Roles

| Role       | Hub Access | Admin Panel | Description                        |
|------------|------------|-------------|------------------------------------|
| `ADMIN`    | ✅         | ✅          | Full access to all tools + admin   |
| `ENGINEER` | ✅         | ❌          | Access to dev/engineering tools    |
| `PRODUCT`  | ✅         | ❌          | Access to product/analytics tools  |
| `DESIGN`   | ✅         | ❌          | Access to design/productivity tools|

Roles are stored in Clerk user metadata and determine:
1. Which view the user sees (User vs Admin)
2. Which tools are visible/accessible to the user

---

## Tool Configuration

Each internal tool has the following properties:

```typescript
interface InternalTool {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Tool description
  url: string;                   // Target URL
  icon: LucideIcon;              // Icon component
  category: AppCategory;         // DEV_TOOLS | HR_ADMIN | PRODUCTIVITY | ANALYTICS
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  accessLevel: UserRole[];       // Which roles can access this tool
}
```

---

## Integration Guide for Internal Tools

### Prerequisites

Each internal tool must:
1. Use Clerk as its authentication provider
2. Share the same Clerk application as the Hub
3. Validate incoming auth tokens

### Setting Up a New Internal Tool

#### 1. Install Clerk SDK

```bash
npm install @clerk/clerk-react
```

#### 2. Configure Clerk Provider

```tsx
// main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
```

#### 3. Protect Routes

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

function App() {
  return (
    <>
      <SignedIn>
        <YourToolContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

#### 4. Access User Data

```tsx
import { useUser, useAuth } from '@clerk/clerk-react';

function ToolComponent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  
  // Get user role from metadata
  const userRole = user?.publicMetadata?.role;
  
  // Get token for API calls
  const token = await getToken();
}
```

### API Authentication

When making API calls from internal tools, include the Clerk token:

```typescript
import { useAuth } from '@clerk/clerk-react';

async function fetchData() {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('https://api.internal.liminal.com/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## Environment Variables

### Hub

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Internal Tools

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  # Same key as Hub
```

### Backend Services

```env
CLERK_SECRET_KEY=sk_live_xxxxx
```

---

## Clerk Configuration

### Required Settings in Clerk Dashboard

1. **Allowed Origins**: Add all internal tool domains
   ```
   https://hub.liminal.com
   https://tool-a.liminal.com
   https://tool-b.liminal.com
   ```

2. **Session Token Lifetime**: Configure based on security requirements

3. **User Metadata Schema**: Define the `role` field
   ```json
   {
     "role": "ADMIN" | "ENGINEER" | "PRODUCT" | "DESIGN"
   }
   ```

4. **Multi-session Mode**: Enable if users need multiple tools open simultaneously

---

## Security Considerations

1. **Token Validation**: All tools must validate tokens server-side, not just client-side
2. **Role Verification**: Check user roles on both frontend (for UI) and backend (for API protection)
3. **Token Refresh**: Clerk handles token refresh automatically
4. **Audit Logging**: All tool access should be logged for compliance

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_xxxxx
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

---

## File Structure

```
liminal-hub/
├── App.tsx                 # Main app with auth routing
├── index.tsx               # Entry point
├── types.ts                # TypeScript interfaces
├── constants.ts            # Tool definitions, mock data
├── components/
│   ├── Dashboard.tsx       # User view
│   ├── AdminDashboard.tsx  # Admin view
│   ├── Login.tsx           # Login page (will use Clerk)
│   └── ui/
│       ├── BrutalButton.tsx
│       ├── BrutalInput.tsx
│       ├── BrutalSelect.tsx
│       └── StatusBadge.tsx
└── README.md
```

---

## Implementation Checklist

- [ ] Install `@clerk/clerk-react`
- [ ] Replace mock auth with Clerk provider
- [ ] Update `Login.tsx` to use Clerk's `<SignIn />` component
- [ ] Update `App.tsx` to use `<SignedIn>` / `<SignedOut>` guards
- [ ] Fetch user role from Clerk metadata to determine admin vs user view
- [ ] Update tool launch to pass/share Clerk session
- [ ] Configure Clerk dashboard with all internal tool domains
