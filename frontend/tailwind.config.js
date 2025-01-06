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
        "admin" : "url('/admin.jpg')"
      },

    },
  },
  plugins: [require("daisyui")],
}

