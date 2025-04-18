# Activity Scheduler Styling Guide

This document outlines the styling system implemented in the Activity Scheduler application, based on Tailwind CSS v4 and custom CSS variables.

## Color System

### Brand Colors

- **Primary Brand Color**: `#E44332` (Todoist Red) - Used for buttons, icons, and interactive elements

### Theme Colors

#### Light Theme (Default)

- **Background**: `#FFFFFF`
- **Surface/Cards**: `#FAFAFA`
- **Primary Text**: `#202020`
- **Secondary Text**: `#808080`
- **Dividers/Borders**: `#EEEEEE`
- **Hover State**: `#F5F5F5`

#### Dark Theme (System Preference)

- **Background**: `#1F1F1F`
- **Surface/Cards**: `#2D2D2D`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#AAAAAA`
- **Dividers/Borders**: `#3D3D3D`
- **Hover State**: `rgba(255,255,255,0.05)`

> **Note**: The application currently follows system color scheme preferences. If your OS is set to dark mode, the app will display with dark theme colors by default. To disable this behavior, see the "Theme Configuration" section.

## Theme Configuration

To enforce light theme regardless of system preferences, modify the globals.css file by removing or commenting out the media query for dark mode:

```css
/* Remove or comment out this section to disable dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1F1F1F;
    --surface: #2D2D2D;
    --text-primary: #FFFFFF;
    --text-secondary: #AAAAAA;
    --divider: #3D3D3D;
    --hover: rgba(255,255,255,0.05);
  }
}
```

## Typography

### Font Family

- **Primary Font**: Circular, Inter, system-default sans-serif fallbacks
- **Secondary Font**: Inter, system-default sans-serif fallbacks

### Font Sizes

- **Extra Small**: 12px
- **Small**: 14px
- **Body**: 16px
- **Subtitle**: 18px
- **Title**: 20px
- **Heading**: 24px
- **Large Heading**: 32px

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semi-Bold**: 600
- **Bold**: 700

### Line Heights

- **Tight**: 1.2
- **Normal**: 1.5
- **Relaxed**: 1.8

## Components

### Buttons

#### Primary Button (`.btn-primary`)

- Background: Primary brand color
- Text color: White
- Border radius: 8px
- Padding: 8px 16px

#### Secondary Button (`.btn-secondary`)

- Background: Transparent
- Border: 1px solid primary brand color
- Text color: Primary brand color
- Border radius: 8px

#### Text Button (`.btn-text`)

- Background: Transparent
- Text color: Primary brand color
- Border radius: 4px
- Padding: 4px 8px

### Input Fields

#### Text Input (`.input-text`)

- Background: White
- Border: 1px solid #DDDDDD
- Border radius: 6px
- Padding: 8px 12px
- Focus state: Border color changes to primary brand color

## Usage with Tailwind CSS

The styling system is built on Tailwind CSS v4 with custom configuration to match the design guidelines.

```jsx
// Example button with Tailwind classes
<button className="bg-primary text-white rounded-md py-sm px-md font-semibold">
  Submit
</button>
```

## Responsive Design

The application uses these breakpoints:

- **Mobile**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1024px
