import { Button, Stack, Typography } from "@mui/material"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "サインアウト - Linkle",
    description: "Linkleからサインアウトしました。",
}

export default function SignOutPage() {
    return (
        <Stack justifyContent={"center"} alignItems={"center"} spacing={2} justifyItems={"center"} height={"100vh"} textAlign={"center"} p={{ xs: 1, xl: 0 }}>
            <Typography variant="h3">Linkleからサインアウトしました。</Typography>
            <Typography variant="body1">サインアウトしました。もう一度ログインする場合は、再度ログインしてください。</Typography>
            <Button href="/signin" variant="outlined">サインインページへ進む</Button>
        </Stack>
    )
}