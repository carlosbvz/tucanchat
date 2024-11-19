import { createTheme } from '@mui/material/styles'
import { Plus_Jakarta_Sans } from 'next/font/google'

export const plus = Plus_Jakarta_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

const dxaTheme = createTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: '#2B6CB0', // Medical blue
            light: '#4299E1',
            dark: '#2C5282',
        },
        secondary: {
            main: '#38B2AC', // Teal
            light: '#4FD1C5',
            dark: '#285E61',
        },
        success: {
            main: '#48BB78', // Green
            light: '#9AE6B4',
            dark: '#276749',
            contrastText: '#ffffff',
        },
        info: {
            main: '#4299E1', // Light blue
            light: '#BEE3F8',
            dark: '#2B6CB0',
            contrastText: '#ffffff',
        },
        error: {
            main: '#E53E3E', // Red
            light: '#FEB2B2',
            dark: '#C53030',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ECC94B', // Yellow
            light: '#FAF089',
            dark: '#B7791F',
            contrastText: '#2A3547',
        },
        grey: {
            100: '#F7FAFC',
            200: '#EDF2F7',
            300: '#E2E8F0',
            400: '#2D3748',
            500: '#1A202C',
            600: '#171923',
        },
        text: {
            primary: '#2D3748',
            secondary: '#4A5568',
        },
        background: {
            default: '#F7FAFC',
            paper: '#FFFFFF',
        },
        action: {
            disabledBackground: 'rgba(45, 55, 72, 0.12)',
            hoverOpacity: 0.04,
            hover: '#EBF8FF',
        },
        divider: '#E2E8F0',
    },
    typography: {
        fontFamily: plus.style.fontFamily,
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: '3rem',
            fontFamily: plus.style.fontFamily,
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: '2.5rem',
            fontFamily: plus.style.fontFamily,
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: '2.25rem',
            fontFamily: plus.style.fontFamily,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: '2rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: '1.5rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F7FAFC',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
})

export default dxaTheme
