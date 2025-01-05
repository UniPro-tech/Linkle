import { Box } from "@mui/material";

export default function Footer() {
    return (
        <Box component='footer' flexGrow={0}>
            <Box bgcolor='primary.main' p={2} textAlign='center'>
                // left
            </Box>
            <Box bgcolor='primary.main' p={2} textAlign='center'>
                // center
            </Box>
            <Box bgcolor='primary.main' p={2} textAlign='center'>
                // right
            </Box>
        </Box>
    );
}