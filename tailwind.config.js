module.exports = {
    mode: "jit",
    purge: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "#F3E9D8",
                secondary: "#EB7A77",
                tertiary: "#5457A5",
                paragraph: "#91989F",
                highlight: "#EDBA55",
                grey: {
                    light: "#FCFAF2",
                    dark: "#333333",
                },
                dark: "#262626",
            },
        },
    },
    plugins: [],
};
