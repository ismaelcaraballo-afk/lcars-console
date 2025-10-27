# LCARS AI Console - Design Guidelines

## Design Approach

**Reference-Based Approach:** Star Trek LCARS (Library Computer Access/Retrieval System) Interface
- Primary inspiration: Star Trek: The Next Generation computer interfaces
- Modern adaptation with enhanced visual effects and smooth animations
- Futuristic command console aesthetic with sci-fi personality

## Core Design Principles

1. **LCARS Authenticity:** Maintain Star Trek design language with curved panels, diagonal accents, and characteristic color blocking
2. **Command Center Aesthetic:** Design should feel like a spaceship bridge console - technical yet accessible
3. **Visual Hierarchy Through Color:** Use the established purple/pink gradient system to guide user attention
4. **Ambient Scanning Effects:** Subtle animations create "alive" feeling without distraction
5. **Tactical Information Display:** Dense information presentation with clear organization

## Color System

**Primary Palette:**
- Primary Purple: `#9966ff` (main UI elements, headers)
- Primary Light: `#cc99ff` (highlights, gradients)
- Secondary Pink: `#ff99cc` (accents, secondary actions)
- Secondary Light: `#ffb3d9` (soft highlights)

**Status Colors:**
- Success: `#00ff00` (bright green - system operational)
- Warning: `#ffcc00` (amber alerts)
- Danger: `#ff3366` (critical alerts)

**Background System:**
- Dark Base: `#0a0a1a` (primary background)
- Deeper Black: `#000000` (contrast areas)
- Panel Background: `rgba(255, 255, 255, 0.05)` (translucent panels)
- Panel Border: `rgba(153, 102, 255, 0.3)` (glowing edges)

**Text Hierarchy:**
- Primary Text: `#e0e0e0` (main content)
- Secondary Text: `#a0a0a0` (metadata, labels)

## Typography

**Font Stack:** `'Segoe UI', Arial, sans-serif`
- Header: 1.8em, bold (800 weight), 2px letter-spacing
- Time Display: 1.4em, `'Courier New', monospace`, bold
- Body: Standard size with clear hierarchy
- Status Text: Bold weight for prominence

## Layout Architecture

**Spacing System:** Use Tailwind-equivalent units
- Commonly use: 2, 4, 8, 12, 16, 20, 24, 30 units
- Panel padding: 20-25px standard
- Gap between sections: 25px
- Generous whitespace for technical aesthetic

**Grid Structure:**
- Main container: Flexbox with 25px gaps
- Sidebar: 280px fixed width
- Main content: Flexible grow area
- Right panels: 300px fixed width

**Curved Corner System:**
- Header: `border-radius: 0 0 60px 0` (bottom-right curve)
- Panels: `15px` standard radius
- Buttons: `10px` rounded
- Status indicators: Full circles (50% radius)

## Component Library

### Header Section
- Diagonal gradient background (purple to light purple)
- Curved bottom-right corner with secondary pink accent bar
- Time display with monospace font
- Floating shine animation overlay
- Box shadow with purple glow

### System Status Indicator
- Fixed position top-right
- Translucent purple background with blur
- Pulsing green dot with ripple effect
- "ONLINE" text with shine animation

### Side Panels
- Dark translucent backgrounds
- Purple glowing borders
- Rounded corners (15px)
- Stacked vertically with consistent gaps
- Box shadows for depth

### Chat Area
- Scrollable message container
- Message bubbles with slide-in animation
- User messages: Right-aligned with pink gradient
- System messages: Left-aligned with purple gradient
- Timestamp and avatar indicators

### Input Fields
- Dark background with purple border
- Rounded corners (10px)
- Purple glow on focus
- Placeholder text in secondary color

### Buttons
- Primary: Pink to light pink gradient
- Rounded (10px)
- Bold uppercase text
- Box shadow with pink glow
- Pulse animation on hover
- Shine overlay effect

### Task Items
- Checkbox with purple accent
- Strikethrough on completion
- Slide-in animation on creation
- Hover state with enhanced glow

### Calendar
- Grid layout for days
- Current day highlighted in purple
- Event indicators as colored dots
- Month/year navigation with arrows

### Cards (Weather, Analytics, etc.)
- Translucent dark background
- Purple border glow
- Icon + text layout
- Fade-in animations on load

## Animation System

**Primary Animations:**
- Float: Subtle 8s vertical movement for backgrounds
- Shimmer: 15s diagonal sweep for ambient effects
- Pulse: 2s breathing effect for status indicators
- Scan: 4s top-to-bottom scanning line effect
- Slide-in: Quick 0.3s entrance for messages
- Ripple: Expanding circle for active indicators

**Performance Considerations:**
- Respect `prefers-reduced-motion` setting
- Use CSS transforms (GPU-accelerated)
- Limit concurrent animations

## Visual Effects

**Glow Effects:**
- Purple glow: `0 0 10px var(--primary), 0 0 20px var(--primary)`
- Enhanced glow on hover/focus
- Pulsing glow for active states

**Gradient Overlays:**
- Radial gradients for depth (20% at center, 50% at edge)
- Linear gradients for directional flow
- Shimmer overlays for "holographic" feel

**Backdrop Effects:**
- Blur: `backdrop-filter: blur(10px)` for panels
- Combined with translucent backgrounds

**Scanning Effects:**
- Fixed scanning line across viewport
- Gradient fade (transparent-primary-transparent)
- Box shadow trail for glow effect

## Accessibility

**Motion Sensitivity:**
- Reduced motion mode: Disable decorative animations
- Keep essential feedback animations (0.2s duration)
- Auto scroll behavior disabled in reduced motion

**Contrast:**
- High contrast mode support with enhanced colors
- Sufficient color contrast ratios for text
- Status indicators use both color AND text

**Focus States:**
- Clear purple glow on focus
- Visible keyboard navigation
- Logical tab order

## Special Elements

**Notification System:**
- Slide-up from bottom
- Color-coded by type (success/warning/danger)
- Auto-dismiss with progress bar
- Stack multiple notifications

**Loading Indicators:**
- Spinning circle with purple gradient
- Appears during API calls
- Translucent overlay to prevent interaction

**Easter Eggs:**
- Star Trek sound effects (beeps/boops)
- Voice command responses in character
- Hidden commands and references

## Responsive Behavior

**Desktop (Primary):**
- Three-column layout
- Full animations and effects
- All panels visible

**Tablet:**
- Two-column layout
- Collapsible side panels
- Reduced animation complexity

**Mobile:**
- Single-column stack
- Essential animations only
- Simplified navigation

## Data Visualization

**Analytics Dashboard:**
- Bar charts with purple gradient fills
- Line graphs with glowing strokes
- Circular progress indicators
- Numeric counters with fade-in

**Maps (TomTom Integration):**
- Dark theme to match LCARS aesthetic
- Purple accent markers
- Translucent info windows
- Glowing route lines

## Images

**No hero images required** - This is a functional dashboard/console interface
**Icons:** Use monochrome icons that can be colored with CSS (purple/pink theme)
**Weather Icons:** Simple, clean SVG icons matching LCARS style
**Avatar Placeholders:** Circular with gradient backgrounds

This design system creates a cohesive, futuristic command console experience that honors Star Trek's LCARS interface while providing modern web functionality.