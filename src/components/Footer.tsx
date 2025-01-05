import { Box, ThemeProvider } from "@mui/material";
import theme from "@/theme";

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
            <Box component='footer' bgcolor='secondary.main' flexGrow={0}>
                <Box p={2} textAlign='center'>
                // left
                </Box>
                <Box p={2} textAlign='center'>
                // center
                </Box>
                <Box p={2} textAlign='center'>
                // right
                </Box>
            </Box>
        </ThemeProvider>
    );
}