---
name: Apex Auto GTA
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#faf6fc'
  on-tertiary: '#303034'
  tertiary-container: '#dddae0'
  on-tertiary-container: '#605f64'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#e4e1e7'
  tertiary-fixed-dim: '#c8c5cb'
  on-tertiary-fixed: '#1b1b1f'
  on-tertiary-fixed-variant: '#47464b'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system establishes a premium, high-octane gaming environment specifically tailored for a sophisticated French-speaking audience. It draws inspiration from modern automotive aesthetics and futuristic HUDs, evoking a sense of immersion and precision. 

The style is a fusion of **Dark Minimalism** and **Glassmorphism**. It utilizes a deep charcoal foundation to provide a "cinematic" backdrop, allowing vibrant neon accents to command attention without cluttering the interface. The emotional response is one of exclusivity and power—positioning the platform as a high-end tool for serious gamers rather than a generic utility. Visual depth is achieved through translucent layers, subtle blurs, and localized glows that mimic the lighting of a high-performance gaming rig.

## Colors

This design system uses a palette optimized for high-contrast, low-light viewing.

- **Backgrounds:** The base layer uses a rich black (`#0a0a0c`), while secondary containers use a deep charcoal (`#1a1a1e`) to create subtle structural separation.
- **Accents:** Neon Cyan (`#00f2ff`) is the primary interactive color, used for critical CTAs and active states. Electric Violet (`#8b5cf6`) serves as a secondary accent for progression, secondary highlights, and status indicators.
- **Surface Gradients:** Use linear gradients for cards starting from `#1a1a1e` to `#121214` at a 45-degree angle to provide a tactile, metallic feel.
- **Semantic Colors:**
    - Success: Emerald Green (#10b981)
    - Alert: Crimson Red (#ef4444)
    - Warning: Amber Gold (#f59e0b)

## Typography

The typography strategy emphasizes clarity and hierarchy. **Montserrat** is used for all headings to provide a bold, geometric, and authoritative voice. **Inter** is utilized for body text and functional labels to ensure maximum legibility at smaller sizes and within dense data sets.

All French text should respect local typesetting rules, specifically including non-breaking spaces before double-punctuation marks (e.g., "Statistiques :"). Headers should typically use tight letter-spacing to feel more compact and impactful, while labels use expanded spacing for a technical, "HUD" appearance.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is built on an 8px base unit, ensuring all components and gaps are multiples of eight to maintain mathematical harmony.

- **Desktop:** Sidebar is fixed at 280px. Content occupies the remaining fluid space with 32px external margins.
- **Tablet:** Sidebar collapses into a rail (80px) or hides into a hamburger menu.
- **Gaps:** Use `24px` (md) for spacing between cards and major sections to prevent the UI from feeling claustrophobic. Use `12px` (sm) for internal padding within cards and small elements.

## Elevation & Depth

Visual hierarchy is established through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

1.  **Base Layer:** Solid `#0a0a0c`.
2.  **Middle Layer (Cards/Panels):** Semi-transparent `#1a1a1e` with a `backdrop-filter: blur(20px)`. Add a 1px border with a subtle gradient (top-left: white at 10% opacity, bottom-right: white at 2% opacity).
3.  **Top Layer (Modals/Popovers):** Higher blur (40px) and a primary-colored glow.
4.  **Interactive Glows:** When a card is hovered, apply a soft, outer shadow using the primary or secondary color at 20% opacity with a 30px blur. This "underglow" effect mimics premium gaming hardware.

## Shapes

The shape language is consistently "Soft-Geometric." A standard **12px to 16px corner radius** is applied to all primary containers and cards to balance the aggressive dark theme with a modern, approachable feel. 

Buttons and input fields should strictly follow the `rounded-md` (8px) scale to maintain a crisp, functional appearance. Profile avatars and status pips use perfect circles to contrast against the predominantly rectangular grid.

## Components

### Buttons
- **Primary:** Neon Cyan background, black text (Montserrat Bold). 0px shadow by default, 15px primary glow on hover.
- **Secondary:** Transparent background, 1px Cyan border, Cyan text.
- **Ghost:** No border, Violet text, subtle grey background hover.

### Cards
- Standard cards use the Glassmorphism effect described in the Elevation section. 
- Titles should be `headline-md` and use the secondary accent for specific keywords or data points.

### Inputs
- Background: `#121214`.
- Border: 1px `#2a2a2e`.
- Focus State: Border transitions to Neon Cyan with a subtle 4px outer glow.
- Placeholder text: 40% white opacity.

### Chips & Badges
- Used for "Statut" (En ligne, Hors ligne, En jeu).
- Small, uppercase labels with a subtle background tint of the status color.

### Additional Elements
- **Navigation Rails:** The active state in the sidebar should be marked by a vertical Neon Cyan bar (4px wide) on the left edge and a subtle gradient sweep behind the text.
- **Progress Bars:** Use a gradient from Electric Violet to Neon Cyan for active completion states.