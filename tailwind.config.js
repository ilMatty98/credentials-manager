/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        colors: {
            primary: "#222831",
            secondary: "#393E46",
            accent: "#00ADB5",
            background: "#EEEEEE",
        }
    },
});