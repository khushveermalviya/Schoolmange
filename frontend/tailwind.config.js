/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'school': "url('/school.jpg')",
        'admin': "url('/admin.jpg')"
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: { // Override the default 'light' theme
          "primary": "rgb(57, 112, 255)", // Example: Replace with the actual RGB value
          "secondary": "rgb(245, 243, 255)", // Example: Replace with the actual RGB value
          "accent": "rgb(187, 222, 251)", // Example: Replace with the actual RGB value
          "neutral": "rgb(25, 30, 36)", // Example: Replace with the actual RGB value
          "base-100": "rgb(255, 255, 255)", // Example: Replace with the actual RGB value
          "info": "rgb(166, 173, 187)", // Example: Replace with the actual RGB value
          "success": "rgb(0, 169, 110)", // Example: Replace with the actual RGB value
          "warning": "rgb(234, 179, 8)", // Example: Replace with the actual RGB value
          "error": "rgb(255, 88, 97)", // Example: Replace with the actual RGB value

          // Add more colors if needed, make sure all are in RGB
        },
      },
      "dark",
      "cupcake",
      // You can add overrides for other themes as well
    ],
  },
}