/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./admin/src/**/*.{js,ts,jsx,tsx}",
        "./packages/*/src/**/*.{js,ts,jsx,tsx}",
        "./resources/views/**/*.php",
    ],
    theme: {
        extend: {
            colors: {
                niyi: {
                    primary: '#3858e9',
                }
            }
        },
    },
    plugins: [],
    corePlugins: {
        // Preflight provides the basic reset to prevent theme style bleed
        preflight: true,
    }
}