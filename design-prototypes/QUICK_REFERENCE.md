# Pockets Design System - Quick Reference Card

## Colors

```css
Primary:   #10b981  /* Emerald Green */
Secondary: #6b7280  /* Gray */
Accent:    #ef4444  /* Red */
Background:#f9fafb  /* Light Gray */
```

## Typography

```css
Font-Sans: 'Inter', sans-serif
Font-Mono: 'Roboto Mono', monospace

H1: 3rem (48px)
H2: 2rem (32px)
H3: 1.5rem (24px)
Body: 1rem (16px)
```

## Spacing (8px grid)

```css
xs:  4px   (var(--spacing-xs))
sm:  8px   (var(--spacing-sm))
md:  16px  (var(--spacing-md))
lg:  24px  (var(--spacing-lg))
xl:  32px  (var(--spacing-xl))
2xl: 48px  (var(--spacing-2xl))
3xl: 64px  (var(--spacing-3xl))
```

## Components

### Button
```html
<button class="btn btn-primary">Text</button>
<button class="btn btn-secondary">Text</button>
```

### Card
```html
<div class="card">
  <img src="icon.svg" class="card-icon">
  <h3>Title</h3>
  <p>Description</p>
</div>
```

### Info Card
```html
<div class="info-card info-card-green">
  <h4>Label</h4>
  <div class="value">€550</div>
</div>
```

### Form Input
```html
<div class="form-group">
  <label class="required">Label</label>
  <input type="text" placeholder="Value">
</div>
```

### Grids
```html
<div class="grid-3">  <!-- 3 columns -->
<div class="grid-4">  <!-- 4 columns -->
<div class="grid-2">  <!-- 2 columns -->
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow:    0 1px 3px rgba(0,0,0,0.1)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```

## Border Radius

```css
--radius: 8px  /* All elements */
```

## Icons (24x24px)

**Feature Icons:**
- icon-calculator.svg
- icon-goals.svg
- icon-expenses.svg
- icon-debts.svg

**Value Icons:**
- icon-chart.svg
- icon-money.svg
- icon-trending-down.svg

**Category Icons:**
- icon-housing.svg
- icon-food.svg
- icon-transport.svg
- icon-entertainment.svg
- icon-health.svg
- icon-utilities.svg

## Responsive Breakpoints

```css
Mobile:  < 480px
Tablet:  481px - 768px
Desktop: 769px - 1439px
Wide:    1440px+
```

## File Locations

```
assets/              → All SVG icons
css/styles.css       → Main stylesheet
index.html           → Home page
calculator.html      → Calculator page
icon-showcase.html   → Design system demo
```

## Quick Copy-Paste

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap" rel="stylesheet">
```

**Stylesheet Link:**
```html
<link rel="stylesheet" href="css/styles.css">
```

**Logo:**
```html
<img src="assets/logo.svg" alt="Pockets" class="logo">
```

**Container:**
```html
<div class="container">
  <!-- Content -->
</div>
```

## Color Usage

- **Primary Green**: CTAs, positive amounts, success
- **Secondary Gray**: Body text, icons, borders
- **Accent Red**: Negative amounts, warnings, errors
- **Background**: Page background
- **White**: Cards, modals, header

## Typography Usage

- **Inter**: All UI text, headings, body
- **Roboto Mono**: Currency amounts, numbers only

## Common Patterns

**Hero Section:**
```html
<section class="hero">
  <h1>Headline</h1>
  <p>Subtitle</p>
  <a href="#" class="btn btn-primary">CTA</a>
</section>
```

**Two-Column Layout:**
```html
<div class="grid-2">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

**Results List:**
```html
<ul class="results-list">
  <li>
    <span>Label</span>
    <span class="amount">€2,000</span>
  </li>
</ul>
```

---

**Total Package**: 21 files, 136KB, 2,618 lines of code

**Open Files**:
- `index.html` - Home page
- `calculator.html` - Calculator
- `icon-showcase.html` - Design system
