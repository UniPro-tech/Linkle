import { signOut } from "@/auth"
import { Button, Stack, Typography } from "@mui/material"

export default function SignOutPage() {
    return (
        <Stack justifyContent={"center"} alignItems={"center"} spacing={2} justifyItems={"center"} height={"100vh"}>
            <Typography variant="h3">Linkleからサインアウト</Typography>
            <Typography variant="body1">サインアウトしますか？サインアウトした場合、もう一度ログインし直さなければなりません。</Typography>
            <form
                action={async (formData) => {
                    "use server"
                    await signOut({ redirectTo: "/signouted" })
                }}
            >
                <Button type="submit" variant="outlined">サインアウト</Button>
            </form>
        </Stack>
    )
}