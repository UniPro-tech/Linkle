"use client";
import { useSession } from "next-auth/react"
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, Stack, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import theme from "@/theme/primary";
import formTheme from "@/theme/form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function RegisterComponet(
    { redirectURL }: { redirectURL: string }
) {
    if (redirectURL == "") redirectURL = "/";

    const { data: session } = useSession()

    const [slackName, setSlackName] = useState("");
    const onChangeSlackName = (event: { target: { value: any; }; }) => {
        setSlackName(event.target.value);
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <Stack spacing={2} flex={1} justifyContent="center" alignItems="center" justifyItems={"center"} minHeight={"100vh"}>
                    <Typography variant="h3">登録する</Typography>
                    <Typography variant="body1">
                        登録を完了するために、以下の項目をご入力ください。
                    </Typography>
                    <ThemeProvider theme={formTheme}>
                        <FormControl>
                            <InputLabel htmlFor="SlackName">Slack名</InputLabel>
                            <Input id="SlackName" aria-describedby="my-helper-text" onChange={onChangeSlackName} />
                            <FormControlLabel required control={<Checkbox />} label={<>
                                <Link href="/tos" className="text-blue-500" target="_blank">
                                    利用規約
                                </Link>
                                および
                                <Link href="/privacy" className="text-blue-500" target="_blank">
                                    UniProjectプライバシー・ポリシー
                                </Link>
                                に同意します。
                            </>} />
                            <Button variant="contained" color="primary" onClick={() => {
                                console.log(slackName);
                                fetch("/api/register", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        email: session?.user?.email,
                                        slackName: slackName,
                                    }),
                                }).then((response) => {
                                    if (response.ok) {
                                        redirect(redirectURL);
                                    }
                                });
                            }}>登録</Button>
                        </FormControl>
                    </ThemeProvider>
                </Stack>
            </ThemeProvider>
        </>
    )
}
