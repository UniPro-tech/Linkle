import { Button, Stack, Typography } from "@mui/material"

export default function SignOutPage() {
    return (
        <Stack justifyContent={"center"} alignItems={"center"} spacing={2} justifyItems={"center"} height={"100vh"}>
            <Typography variant="h3">学園アカウントでログインしてください</Typography>
            <Typography variant="body1" textAlign={"center"}>Googleアカウントのチェックに失敗しました。@nnn.ed.jpや@n-jr.jpでログインしてください。<br/>教職員の方の@nnn.ac.jpも使用可能です。</Typography>
            <Button href="/signin" variant="outlined">サインインページへ進む</Button>
        </Stack>
    )
}