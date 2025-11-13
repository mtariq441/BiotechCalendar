# Biotech Calendar Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from professional data platforms:
- **Linear**: Clean information architecture, subtle depth, efficient data density
- **Bloomberg Terminal**: Multi-panel layouts, information hierarchy in complex data
- **Robinhood/Trading Platforms**: Chart presentation, scenario visualization
- **Notion**: Organized content blocks, nested information structures

**Core Principle**: Maximize information density while maintaining clarity - professional users need comprehensive data at a glance without visual clutter.

---

## Typography System

**Font Families** (Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text, data labels
- Monospace: JetBrains Mono (400, 500) - stock tickers, prices, NCT IDs, timestamps

**Hierarchy**:
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body/Data: text-base font-normal (16px)
- Labels/Meta: text-sm font-medium (14px)
- Micro/Captions: text-xs font-normal (12px)
- Tickers/Codes: font-mono text-sm font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16** for consistent rhythm

**Application Layout**:
- Top Navigation Bar: h-16 with px-6 horizontal padding
- Main Content Area: max-w-7xl mx-auto with px-6 for comfortable reading width
- Sidebar (filters): w-80 fixed left panel with p-6
- Content Grid Gap: gap-6 for card layouts, gap-4 for compact lists

**Calendar Grid**:
- Month View: 7-column grid with square cells (aspect-square)
- Each date cell: p-3 with gap-2 stack for multiple events
- Week View: Full-width rows with time column (w-20) + event area
- List View: Full-width cards with p-4, gap-3 between items

**Information Density Zones**:
- Dense: Calendar grid, data tables, metrics dashboard (compact spacing, p-2 to p-4)
- Balanced: Event detail pages, company profiles (p-6 to p-8)
- Spacious: Landing page hero only (p-12 to p-16)

---

## Component Library

### Navigation
**Top Bar** (h-16, border-b):
- Logo + App Name (left, font-semibold text-xl)
- Search Bar (center, w-96 with rounded-lg)
- User Menu + Watchlist Icon + Alert Bell (right, gap-4)
- All items vertically centered with px-6

### Calendar Components

**Month View Grid**:
- 7×5 grid of date cells
- Header row with day names (text-xs uppercase tracking-wide font-medium)
- Date number (top-left, text-sm font-medium)
- Event chips stacked vertically (h-6, px-2, rounded text-xs truncate)
- Up to 3 visible events per cell, "+X more" indicator

**Event Chip** (within calendar):
- h-6 px-2 rounded text-xs font-medium
- Truncated title with event type icon (w-3 h-3)
- Hover reveals full title in tooltip

**Event Card** (list/detail view):
- Border-l-4 accent stripe for event type
- p-4 rounded-lg border
- Header: Event title (text-lg font-semibold) + Date badge (text-sm font-mono)
- Meta row: Type badge, NCT ID (font-mono), Sponsor name (gap-3)
- Ticker chips (px-2 py-1 rounded font-mono text-xs font-medium, gap-2)
- Quick actions row: "Add to Watchlist" + "Set Alert" buttons (h-8, gap-2)

### Filter Sidebar (w-80)
- Section Headers: text-sm font-semibold uppercase tracking-wide mb-3
- Filter groups with gap-6 between sections
- Checkbox/Radio options: gap-2 stacked
- Date range picker: two input fields side-by-side (gap-2)
- "Apply Filters" button at bottom (w-full h-10)

### AI Analysis Panel

**Layout Structure**:
- Full-width container with max-w-4xl mx-auto
- Three-column scenario comparison for Bull/Base/Bear
- Each scenario card: p-6 rounded-lg border

**Summary Section** (top):
- Heading: text-xl font-semibold mb-4
- Body: text-base leading-relaxed max-w-prose
- Key factors list: space-y-2 with bullet points (text-sm)

**Scenario Cards** (grid-cols-3 gap-4):
- Header: Scenario name (text-lg font-semibold) + Probability badge (text-2xl font-bold)
- Narrative: text-sm leading-relaxed mb-4
- Price target: text-3xl font-bold font-mono
- Mini chart placeholder (h-32 w-full)

**Confidence Indicator**:
- Progress bar showing confidence score (h-2 rounded-full)
- Label: text-xs with model version (font-mono)

### Charts & Visualizations

**Price Path Chart**:
- h-80 w-full container
- Three overlaid line paths (one per scenario)
- Legend at top-right with scenario labels
- X-axis: dates (font-mono text-xs)
- Y-axis: prices (font-mono text-sm)
- Shaded confidence bands (10/90 percentile)

**Metrics Dashboard** (company pages):
- Grid layout: grid-cols-4 gap-4
- Metric card: p-4 rounded-lg border
- Label: text-xs uppercase tracking-wide
- Value: text-2xl font-bold font-mono
- Change indicator: text-sm with ↑/↓ symbols

### Forms & Inputs

**Search Bar**:
- h-10 px-4 rounded-lg border
- Icon left (w-5 h-5), clear button right
- Placeholder: text-sm
- Dropdown results: absolute top-full mt-2 w-full border rounded-lg shadow-lg

**Filter Controls**:
- Checkboxes/Radio: w-4 h-4 with gap-2 from label
- Select dropdowns: h-9 px-3 rounded border
- Date inputs: h-9 px-3 rounded border font-mono

**Buttons**:
- Primary: h-10 px-6 rounded-lg font-medium
- Secondary: h-10 px-6 rounded-lg border font-medium
- Icon button: h-9 w-9 rounded-lg
- Watchlist/Alert toggle: h-8 px-4 rounded-md text-sm

### Data Tables

**Trial/Event Table**:
- Full-width with border rounded-lg
- Header row: bg-subtle, h-12 px-4, text-sm font-semibold uppercase
- Data rows: h-14 px-4, text-sm, border-b
- Columns: Date (w-32 font-mono), Title (flex-1), Type (w-28), Sponsor (w-40), Status (w-24)
- Hover state for row interaction

### Modals & Overlays

**Event Detail Modal**:
- Fixed overlay with backdrop blur
- Container: max-w-4xl mx-auto my-8 rounded-xl
- Header: p-6 border-b with title + close button
- Content: p-6 space-y-6 max-h-[80vh] overflow-y-auto
- Tabs for Summary/Analysis/Documents (h-10 border-b)

**Alert Configuration Panel**:
- Slide-in from right: w-96
- Header: p-4 border-b
- Form sections: p-4 space-y-4
- Action bar: p-4 border-t with Cancel/Save buttons

---

## Page-Specific Layouts

### Landing Page
**Hero Section** (h-screen):
- Centered content: max-w-4xl mx-auto text-center
- Headline: text-5xl font-bold mb-6
- Subheadline: text-xl mb-8 max-w-2xl mx-auto
- CTA buttons: h-12 px-8 text-lg (gap-4)
- Background: Subtle gradient with floating event cards animation (minimal)

**Features Grid** (py-20):
- Container: max-w-6xl mx-auto px-6
- Grid: grid-cols-3 gap-8
- Feature card: p-6 rounded-xl border
- Icon: w-12 h-12 mb-4
- Title: text-lg font-semibold mb-2
- Description: text-sm leading-relaxed

**Live Preview Section** (py-16):
- Full-width calendar preview (interactive)
- max-w-7xl mx-auto
- Shows current month with sample events

### Calendar Page (Main App)
**Three-Column Layout**:
- Filters sidebar: w-80 fixed left (hidden on mobile, toggle button)
- Calendar main: flex-1 central panel with p-6
- View toggles: flex gap-2 mb-4 (Month/Week/List buttons)
- Calendar grid fills remaining space
- "Today" jump button: fixed bottom-right

### Event Detail Page
**Split Layout**:
- Left panel (w-2/5): Event metadata, trial details, source links (sticky top-8)
- Right panel (w-3/5): AI Analysis, scenarios, charts (scrollable)
- Mobile: stacks vertically

### Company Profile
**Header Section**: 
- p-8 border-b
- Company name (text-3xl font-bold) + tickers (font-mono)
- Metrics row: Market cap, Sector, # of trials (grid-cols-3 gap-6)

**Upcoming Events**: 
- Timeline view with vertical line connecting events
- Each event: pl-8 pb-6 with dot indicator

### Watchlist Dashboard
**Card Grid**: grid-cols-1 gap-4
- Each watched item: p-4 rounded-lg border
- Left: Event summary
- Right: Days until event (text-2xl font-bold font-mono) + Remove button

---

## Icons
**Library**: Heroicons (via CDN)
- Event types: Calendar, Beaker, DocumentText, CheckCircle
- Actions: Bell, Star, ChevronDown, XMark, MagnifyingGlass
- Status: Clock, CheckBadge, ExclamationTriangle
- Navigation: Home, ChartBar, Cog, UserCircle

---

## Images

**Hero Section**:
- Large background image showing microscope/laboratory/DNA visualization (h-screen, object-cover)
- Dark gradient overlay (opacity-60) for text contrast
- Buttons with backdrop-blur-md and semi-transparent background

**Company Profile Headers**:
- Company logo (w-16 h-16 rounded-lg)

**Empty States**:
- Illustration for "No events found" - medical/biotech themed SVG (h-48 w-48 mx-auto)

---

## Accessibility
- All interactive elements: min-h-10 tap targets
- Form labels: font-medium mb-1 text-sm
- Focus states: ring-2 ring-offset-2 on all inputs/buttons
- Semantic HTML: proper heading hierarchy, aria-labels on icons
- Keyboard navigation: full calendar grid traversal with arrow keys

---

## Responsive Breakpoints
- **Mobile** (< 768px): Single column, sidebar becomes drawer, calendar switches to list view
- **Tablet** (768-1024px): Two-column layout, compact calendar grid
- **Desktop** (> 1024px): Full three-column layout with all features visible