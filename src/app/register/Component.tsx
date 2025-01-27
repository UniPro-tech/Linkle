"use client";
import { useSession } from "next-auth/react"
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import theme from "@/theme/primary";
import formTheme from "@/theme/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm, Controller } from 'react-hook-form';

interface SignUpFormData {
    name: string;
    tos: boolean;
}

export default function RegisterComponet(
    { redirectURL }: { redirectURL: string }
) {
    if (redirectURL == "") redirectURL = "/";

    const { data: session } = useSession()

    const { control, handleSubmit, watch } = useForm<SignUpFormData>({
        defaultValues: {
            name: '',
            tos: false,
        },
    });

    const tos = watch('tos');
    const name = watch('name');

    return (
        <>
            <ThemeProvider theme={theme}>
                <Stack spacing={2} flex={1} justifyContent="center" alignItems="center" justifyItems={"center"} minHeight={"100vh"}>
                    <Typography variant="h3">登録する</Typography>
                    <Typography variant="body1">
                        登録を完了するために、以下の項目をご入力ください。
                    </Typography>
                    <ThemeProvider theme={formTheme}>
                        <form action={
                            (data: FormData) => {
                                fetch("/api/user", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        email: session?.user?.email,
                                        slackName: data.get("name"),
                                    }),
                                }).then((response) => {
                                    if (response.ok) {
                                        redirect(redirectURL);
                                    }
                                });
                            }
                        } className="flex flex-col space-y-2 justify-center items-center">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Slack名"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            />
                            <Controller
                                name="tos"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={Boolean(field.value) === false}>
                                        <FormControlLabel
                                            control={<Checkbox {...field} />}
                                            label={
                                                <>
                                                    <Link href="/tos" className="text-blue-500" target="_blank">
                                                        利用規約
                                                    </Link>
                                                    および
                                                    <Link href="/privacy" className="text-blue-500" target="_blank">
                                                        UniProjectプライバシー・ポリシー
                                                    </Link>
                                                    に同意します。
                                                </>
                                            }
                                        />
                                        {Boolean(field.value) === false && (
                                            <FormHelperText>利用規約とプライバシーポリシーに同意してください。</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                            <Button variant="contained" color="primary" disabled={!tos || !name} fullWidth type="submit">登録</Button>
                        </form>
                    </ThemeProvider>
                </Stack>
            </ThemeProvider>
        </>
    )
}