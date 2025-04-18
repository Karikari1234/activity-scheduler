/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand Color
        primary: "#E44332", // Todoist Red
        
        // Light Theme (Default)
        background: "#FFFFFF",
        surface: "#FAFAFA",
        "text-primary": "#202020",
        "text-secondary": "#808080",
        divider: "#EEEEEE",
        hover: "#F5F5F5",
        
        // Priority Colors
        "priority-1": "#FF5722", // Orange-red
        "priority-2": "#FF9800", // Orange
        "priority-3": "#4F9DA6", // Teal
        "priority-4": "#808080", // Gray
      },
      fontFamily: {
        primary: ["Circular", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "sans-serif"],
        secondary: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        'xs': '12px',    // Extra Small
        'sm': '14px',    // Small
        'base': '16px',  // Body
        'subtitle': '18px',
        'title': '20px',
        'heading': '24px',
        'large-heading': '32px',
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      width: {
        'narrow': '640px',
        'default': '960px',
        'wide': '1280px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1)',
        'dropdown': '0 4px 12px rgba(0,0,0,0.1)',
      },
      transitionDuration: {
        'fast': '100ms',
        'default': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'entrance': 'cubic-bezier(0, 0, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      screens: {
        'mobile': {'max': '640px'},
        'tablet': {'min': '641px', 'max': '1024px'},
        'desktop': {'min': '1025px'},
      },
    },
  },
  plugins: [],
}
