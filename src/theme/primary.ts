'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-noto-sans-jp)',
    },
    palette: {
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        secondary: {
            main: '#6c757d',
        },
        text: {
            primary: '#6c757d',
            secondary: '#ffffff',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 768,
            lg: 1025,
            xl: 1536,
        },
    },
});

export default theme;