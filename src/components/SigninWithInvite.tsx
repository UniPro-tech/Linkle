import { signIn } from "@/auth"
import formTheme from "@/theme/form";
import { Button, Stack, TextField, ThemeProvider, Typography } from "@mui/material";

export default function SignInWithInvite() {
    return (
        <Stack justifyContent="center" alignItems="center" spacing={2} flexDirection={"column"}>
            <Typography variant="h5">招待を使用する</Typography>
            <form
                action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData)
                }}
                className="flex flex-col space-y-4"
            >
                <ThemeProvider theme={formTheme}>
                    <TextField name="email" label="Email" />
                    <TextField name="password" label="InviteCode" type="password" />
                    <Button type="submit" variant="outlined">Sign in with invite</Button>
                </ThemeProvider>
            </form>
        </Stack>
    )
}