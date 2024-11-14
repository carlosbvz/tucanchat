import { createTheme } from '@mui/material/styles'
import { Plus_Jakarta_Sans } from 'next/font/google'

export const plus = Plus_Jakarta_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

const defaultTheme = createTheme({
    direction: 'ltr',
    palette: {
        primary: {
            main: '#66B032',
            light: '#8ED75F',
            dark: '#4B8024',
        },
        secondary: {
            main: '#FF4F00',
            light: '#FF7F3F',
            dark: '#CC3F00',
        },
        success: {
            main: '#66B032',
            light: '#E8FFE0',
            dark: '#4B8024',
            contrastText: '#ffffff',
        },
        info: {
            main: '#1DACD6',
            light: '#E3F6FD',
            dark: '#0077B6',
            contrastText: '#ffffff',
        },
        error: {
            main: '#FF2E2E',
            light: '#FFE5E5',
            dark: '#CC2424',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#FFDE00',
            light: '#FFF5CC',
            dark: '#CCB200',
            contrastText: '#2A3547',
        },
        grey: {
            100: '#F8F9FA',
            200: '#E9ECEF',
            300: '#DEE2E6',
            400: '#212529',
            500: '#1A1E21',
            600: '#141719',
        },
        text: {
            primary: '#212529',
            secondary: '#495057',
        },
        action: {
            disabledBackground: 'rgba(73,82,88,0.12)',
            hoverOpacity: 0.04,
            hover: '#f0f7ed',
        },
        divider: '#D1DDCD',
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
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.5rem',
        },
        body2: {
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
            fontWeight: 400,
            lineHeight: '1.25rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '.MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation': {
                    boxShadow:
                        'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
            },
        },
    },
})

export { defaultTheme }
