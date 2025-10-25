# Design Guidelines: Observability & Security Microservice Dashboard

## Design Approach

**Selected Approach:** Design System (Data-Heavy Enterprise Application)

**Inspiration:** Grafana, Datadog, Linear - Modern monitoring dashboards that prioritize information clarity, real-time data visualization, and professional presentation.

**Core Principles:**
- Information First: Clear data hierarchy and scannable layouts
- Trust & Reliability: Professional aesthetic that inspires confidence
- Efficiency: Quick access to critical metrics and alerts
- Real-time Focus: Designs that accommodate live updating data

---

## Typography System

**Font Families:**
- Primary: Inter (400, 500, 600, 700) - clean, highly legible for data
- Monospace: JetBrains Mono (400, 500) - for metrics, timestamps, and technical values

**Type Scale:**
- Page Titles: text-2xl font-semibold (Dashboard, Metrics, Alerts)
- Section Headers: text-lg font-semibold (System Metrics, Recent Alerts)
- Card Titles: text-base font-medium
- Body Text: text-sm font-normal
- Metric Values: text-3xl font-bold (for large KPI displays)
- Metric Labels: text-xs font-medium uppercase tracking-wide
- Timestamps/Technical: text-xs font-mono

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Card spacing: space-y-4
- Tight groupings: space-y-2

**Grid Structure:**
- Dashboard Overview: 3-column grid (lg:grid-cols-3) for metric cards
- Alert List: Single column with clear separation
- Login/Register: Centered single-column max-w-md
- Navigation: Fixed sidebar (w-64) + main content area

---

## Component Library

### Navigation & Layout

**Sidebar Navigation:**
- Fixed left sidebar, full height
- Width: w-64
- Logo/brand at top (h-16)
- Navigation items with icon + label
- Active state: distinctive treatment with subtle indicator
- Bottom section for user profile/logout

**Top Bar (Dashboard Pages):**
- Page title (left-aligned)
- Real-time status indicator ("Live" badge with pulse animation)
- User session info (right-aligned)
- Height: h-16

### Data Display Components

**Metric Cards (Dashboard Overview):**
- Rounded corners (rounded-lg)
- Border treatment for definition
- Structure:
  - Small label/icon at top
  - Large metric value (text-3xl font-bold)
  - Metric label below value
  - Trend indicator (↑↓ with percentage change)
  - Small sparkline chart (optional, subtle)
- Height: h-32 to h-40
- Grid: 3 columns on desktop, 1 on mobile

**Alert Cards:**
- Full-width cards in vertical list
- Left border accent indicating severity (4px wide):
  - Critical alerts: distinctive left border
  - Warning alerts: different border treatment
  - Info alerts: subtle border
- Structure:
  - Alert title + severity badge (top)
  - Timestamp (text-xs font-mono)
  - Metric details (e.g., "CPU: 87%")
  - Dismiss/acknowledge action (right-aligned)
- Padding: p-4
- Gap between cards: space-y-3

**Metric Visualization Panel:**
- Full-width chart container
- Rounded container (rounded-lg)
- Border for definition
- Height: h-64 to h-80
- Chart library: Chart.js or Recharts
- Time range selector (tabs: 1H, 6H, 24H, 7D)
- Legend positioned at top-right

**Summary Stats Table:**
- Clean table with header row
- Alternating row treatment for readability
- Columns: Alert Type | Count | Last Triggered | Avg Value
- Monospace font for numerical data
- Sticky header on scroll

### Forms & Authentication

**Login/Register Forms:**
- Centered card on blank page
- Max width: max-w-md
- Card structure:
  - App logo/title at top (text-center)
  - Form fields with labels
  - Primary action button (full-width)
  - Link to alternate action ("Don't have an account? Register")
- Field spacing: space-y-4
- Input fields:
  - Height: h-10
  - Rounded: rounded-md
  - Border treatment
  - Focus state: ring effect

**Threshold Configuration Panel:**
- Two-column layout (metric name | threshold input)
- Slider + numeric input combination
- Real-time preview of threshold line on chart
- Save/Cancel actions at bottom

### Interactive Elements

**Buttons:**
- Primary: rounded-md, px-4, py-2, font-medium
- Secondary: outlined variant
- Danger: for critical actions
- Icon buttons: for compact actions (refresh, settings)

**Status Badges:**
- Rounded pill shape (rounded-full)
- Small size: px-2 py-1 text-xs
- Variants: Success, Warning, Error, Info
- Used for: alert severity, system status, live indicator

**Session Indicator:**
- Small badge in top-right
- Shows: username + "Active" status
- Dropdown for logout action

---

## Page Layouts

### Dashboard Page (Main)
- Sidebar navigation (left)
- Top bar with page title + live indicator
- 3-column metric card grid (CPU, Memory, Alerts)
- Full-width chart section below (CPU & Memory trends)
- Recent alerts list (scrollable, max 10 visible)

### Alerts Page
- Sidebar navigation
- Top bar with "Alerts" title + filter options (All, Critical, Warning, Info)
- Full-width alert cards list
- Pagination at bottom

### Metrics Detail Page
- Sidebar navigation
- Large chart visualization (h-96)
- Time range controls
- Stats summary panel below chart
- Configuration panel (threshold settings)

### Login/Register Pages
- No sidebar
- Centered card on minimal page
- Subtle background treatment
- Logo at top
- Form within card
- Footer with help link

---

## Images

**No hero images required.** This is a utility application where data takes precedence.

**Icon Usage:**
- Navigation icons: Heroicons (outline style)
- Dashboard icons: small icons next to metric labels
- Alert icons: severity indicators
- Status icons: check, warning, error glyphs

---

## Animations

**Minimal, Purposeful Animations:**
- Live status pulse: subtle 2s pulse on "Live" badge
- Chart updates: smooth 300ms transitions
- Alert arrivals: gentle slide-in from top
- Hover states: subtle scale (1.02) on metric cards
- Loading states: spinner for data fetching

**Avoid:** Excessive micro-interactions, distracting effects

---

## Accessibility & Consistency

- Consistent focus states across all interactive elements
- Clear visual hierarchy with heading levels
- Sufficient contrast for all text on backgrounds
- Keyboard navigation support
- ARIA labels for icon-only buttons
- Responsive breakpoints: mobile (base), tablet (md), desktop (lg)

---

## Technical Notes

- All timestamps in monospace font for alignment
- Real-time data updates without jarring layout shifts
- Empty states for "No alerts" with helpful messaging
- Error states for failed metric collection
- Loading skeletons for async data

This design creates a professional, trustworthy monitoring dashboard that prioritizes clarity, efficiency, and real-time data presentation.