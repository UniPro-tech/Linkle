import primary from "@/theme/primary";
import { Stack, ThemeProvider, Typography } from "@mui/material";

export default function TitleLogo() {
    return (
        <ThemeProvider theme={primary}>
            <Stack direction="column" spacing={1} alignItems="center">
                <Typography color="text.primary" sx={{ fontWeight: 'bold' }} variant="h1" align="center" >
                    Linkle
                </Typography>
                <Typography color="text.primary" variant="h6" align="center">
                    N/S高等学校・N中等部<br />
                    同好会ポータルサイト
                </Typography>
                <Typography color="text.primary" variant="body1" align="center">
                    (※このサイトは学園公認ではありません)
                </Typography>
            </Stack>
        </ThemeProvider>
    );
}
