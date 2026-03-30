/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#00ff90",
                secondary: "#000000",
                accent: {
                    gray: "#adadad",
                    light: "#e7e8ec",
                    white: "#ffffff",
                },
            },
            fontFamily: {
                uber: ["UberMove", "sans-serif"],
                "uber-bold": ["UberMoveBold", "sans-serif"],
                "uber-medium": ["UberMoveMedium", "sans-serif"],
            },
        },
    },
    plugins: [],
};
