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
});

export default theme;