/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      red: {
        DEFAULT: '#f44336',
        50: '#ffebee',
        100: '#ffcdd2',
        200: '#ef9a9a',
        300: '#e57373',
        400: '#ef5350',
        500: '#f44336', // same as DEFAULT
        600: '#e53935',
        700: '#d32f2f',
        800: '#c62828',
        900: '#b71c1c',
      },
      blue: {
        DEFAULT: '#0f33e9',
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3', // same as DEFAULT
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
      },
      green: {
        DEFAULT: '#00b159',
        50: '#e8f5e9',
        100: '#c8e6c9',
        200: '#a5d6a7',
        300: '#81c784',
        400: '#66bb6a',
        500: '#4caf50', // same as DEFAULT
        600: '#43a047',
        700: '#388e3c',
        800: '#2e7d32',
        900: '#1b5e20',
      },
      black: {
        DEFAULT: "#000000",      // Default black
        50:  "#f0f0f0",        // Very light black (almost white)
        100: "#d9d9d9",        // Light black (grayish)
        200: "#b3b3b3",        // Lighter shade of black
        300: "#8c8c8c",        // Grayish black
        400: "#666666",        // Mid-tone black
        500: "#4d4d4d",        // Medium black
        600: "#333333",        // Darker black
        700: "#1a1a1a",        // Very dark black
        800: "#0d0d0d",        // Almost pure black
        900: "#000000",        // Pure black
        950: "#000000",        // Deeper black, sometimes used to emphasize darkness
      },
      gray: {
        DEFAULT: 'rgba(0, 0, 0, 0.55)',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121'
      },
      transparent: "transparent",
      current: "currentColor",
      white: {
        DEFAULT: '#ffffff',
        50: '#ffffff',  // Fully white
        100: '#f9f9f9', // Very light grey
        200: '#f3f3f3', // Slightly darker light grey
        300: '#ededed', // More noticeable grey
        400: '#e7e7e7', // Lighter grey shade
        500: '#e0e0e0', // Medium grey
        600: '#d9d9d9', // Darker grey
        700: '#cfcfcf', // Even darker grey
        800: '#c5c5c5', // Dark grey
        900: '#bcbcbc', // Very dark grey
      },
      lightgrey: {
        DEFAULT: '#444245',
        50: '#e8e8e9',
        100: '#d1d0d1',
        200: '#b3b1b3',
        300: '#969395',
        400: '#787577',
        500: '#5b575a',
        600: '#444245', // same as DEFAULT
        700: '#39373b',
        800: '#2f2d31',
        900: '#252426',
      },
      lightpink: {
        DEFAULT: '#F8F7F7',
        50: '#ffffff',  // Pure white
        100: '#fdfdfd',
        200: '#fbfbfb',
        300: '#f9f8f8',
        400: '#f8f7f7', // same as DEFAULT
        500: '#e6e5e5',
        600: '#d4d4d4',
        700: '#c2c2c2',
        800: '#b1b1b1',
        900: '#a0a0a0',
      },
      darkpink: {
        DEFAULT: '#FEEDEA',
        50: '#fffafa',
        100: '#feeceb',
        200: '#fdd5d3',
        300: '#fcbebc',
        400: '#fca7a4',
        500: '#fb908c',
        600: '#fa7974',
        700: '#f9625c',
        800: '#f84b44',
        900: '#f7342c',
      },
      lightblack: {
        DEFAULT: '#333333',
        50: '#e5e5e5',
        100: '#cccccc',
        200: '#b2b2b2',
        300: '#999999',
        400: '#7f7f7f',
        500: '#666666',
        600: '#4c4c4c',
        700: '#333333', // same as DEFAULT
        800: '#1a1a1a',
        900: '#000000', // Full black
      },
      darkgrey: {
        DEFAULT: 'rgba(44, 9, 11, 0.8)', // same as DEFAULT
        50: 'rgba(44, 9, 11, 0.05)',
        100: 'rgba(44, 9, 11, 0.1)',
        200: 'rgba(44, 9, 11, 0.2)',
        300: 'rgba(44, 9, 11, 0.3)',
        400: 'rgba(44, 9, 11, 0.4)',
        500: 'rgba(44, 9, 11, 0.5)',
        600: 'rgba(44, 9, 11, 0.6)',
        700: 'rgba(44, 9, 11, 0.7)',
        800: 'rgba(44, 9, 11, 0.8)', // same as DEFAULT
        900: 'rgba(44, 9, 11, 1)', // fully opaque
      },
      pink: {
        DEFAULT: '#df6751',
        50: '#f9ebeb',
        100: '#f2c1c0',
        200: '#eb9492',
        300: '#e66f65',
        400: '#df6751', // same as DEFAULT
        500: '#d8554d',
        600: '#d2443b',
        700: '#c93c34',
        800: '#b6322d',
        900: '#a42a26',
      },
      indigo: {
        DEFAULT: '#3f51b5',
        50: '#e8eaf6',
        100: '#c5cae9',
        200: '#9fa8da',
        300: '#7986cb',
        400: '#5c6bc0',
        500: '#3f51b5', // same as DEFAULT
        600: '#3949ab',
        700: '#303f9f',
        800: '#283593',
        900: '#1a237e',
      },
      violet: {
        50: 'rgba(238, 228, 250, 1)',
        100: 'rgba(221, 204, 255, 1)',
        200: 'rgba(196, 156, 255, 1)',
        300: 'rgba(174, 106, 255, 1)',
        400: 'rgba(149, 51, 255, 1)',
        500: 'rgba(128, 0, 238, 1)',
        600: 'rgba(107, 0, 207, 1)',
        700: 'rgba(86, 0, 176, 1)',
        800: 'rgba(66, 0, 145, 1)',
        900: 'rgba(46, 0, 115, 1)',
      },
      purple: {
        50: 'rgba(250, 245, 255, 1)',
        100: 'rgba(232, 209, 255, 1)',
        200: 'rgba(207, 166, 255, 1)',
        300: 'rgba(182, 123, 255, 1)',
        400: 'rgba(157, 80, 255, 1)',
        500: 'rgba(128, 0, 128, 1)',
        600: 'rgba(114, 0, 114, 1)',
        700: 'rgba(101, 0, 101, 1)',
        800: 'rgba(87, 0, 87, 1)',
        900: 'rgba(74, 0, 74, 1)',
      },
      sky: {
        DEFAULT: '#0ea5e9',
        50: '#e0f2fe',
        100: '#b2e3fd',
        200: '#80c4fb',
        300: '#4ab2f9',
        400: '#1ea3f7',
        500: '#0ea5e9', // same as DEFAULT
        600: '#0b92d9',
        700: '#087fb9',
        800: '#06669a',
        900: '#04547b',
      },
      cyan: {
        DEFAULT: '#22d3ee',
            50: '#e0f7fa',
            100: '#b2ebf2',
            200: '#80deea',
            300: '#4dd0e1',
            400: '#26c6da',
            500: '#22d3ee', // same as DEFAULT
            600: '#1ab2d9',
            700: '#149bc2',
            800: '#0f83ab',
            900: '#0a6c94',
      },
      lime: {
        DEFAULT: '#b3f900',
        50: '#f9fbe7',
        100: '#f0f4c3',
        200: '#e6ee9c',
        300: '#dce775',
        400: '#d4e157',
        500: '#b3f900', // same as DEFAULT
        600: '#aeea00',
        700: '#a6d600',
        800: '#9bc300',
        900: '#8bc34a',
      },
      orange: {
        DEFAULT: '#ff9800',
        50: '#fff3e0',
        100: '#ffe0b2',
        200: '#ffcc80',
        300: '#ffb74d',
        400: '#ffa726',
        500: '#ff9800', // same as DEFAULT
        600: '#fb8c00',
        700: '#f57c00',
        800: '#ef6c00',
        900: '#e65100',
      },
      yellow: {
        DEFAULT: '#ffeb3b',
        50: '#fffde7',
        100: '#fff9c4',
        200: '#fff59d',
        300: '#fff176',
        400: '#ffee58',
        500: '#ffeb3b', // same as DEFAULT
        600: '#fdd835',
        700: '#fbc02d',
        800: '#f9a825',
        900: '#f57f17',
      },
      teal: {
        DEFAULT: '#009688',
        50: '#e0f2f1',
        100: '#b2dfdb',
        200: '#80cbc4',
        300: '#4db6ac',
        400: '#26a69a',
        500: '#009688', // same as DEFAULT
        600: '#00897b',
        700: '#00796b',
        800: '#00695c',
        900: '#004d40',
      },
      bgpink: 'rgba(223, 103, 81, 0.15)',
      footerlinks: 'rgba(54, 54, 54, 0.9)',
      bordertop: 'rgba(105, 120, 131, 0.16)',
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "4.25rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "6.75rem" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      animation: {
        progress: 'progress 2s infinite linear',
        'fly-across-straight': 'flyAcrossStraight 5s linear forwards',
        'fly-irregular': 'flyIrregular 5s ease-in-out forwards',
      },
      keyframes: {
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flyAcrossStraight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flyIrregular: {
          '0%': {
            transform: 'translate(-100%, 100%) rotate(0deg)',
          },
          '10%': {
            transform: 'translate(-80%, 80%) rotate(5deg)',
          },
          '25%': {
            transform: 'translate(-60%, 40%) rotate(-5deg)'
          },
          '40%': {
            transform: 'translate(-40%, 60%) rotate(10deg)'
          },
          '60%': {
            transform: 'translate(-20%, 20%) rotate(-10deg)'
          },
          '75%': {
            transform: 'translate(0%, 40%) rotate(5deg)'
          },
          '90%': {
            transform: 'translate(60%, -5%) rotate(-45deg) scale(0.9)',
          },
          '100%': {
            transform: 'translate(110%, 0%) rotate(-180deg) scale(0.7)',
          },
        },
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'], // Enables both methods
  plugins: [],
};
