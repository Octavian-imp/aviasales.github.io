module.exports = {
  content: [
    "./dist/**/*.{html,js,tsx,ts,scss}",
    "./src/**/*.{html,js,tsx,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2196F3",
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
}
