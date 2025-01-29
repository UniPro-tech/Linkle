"use client";

import formTheme from "@/theme/form";
import { Avatar, Button, Divider, FormHelperText, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function Settings({ name }: { name: string }) {
    const { data: session } = useSession();

    const { control, handleSubmit, watch } = useForm<{ name: string; }>({
        defaultValues: {
            name: name,
        },
    });

    return (
        <Stack spacing={2} alignItems="center" pt={10} minHeight={"100vh"}>
            <Typography variant="h3">ユーザー設定</Typography>
            <Stack spacing={1} width={{ xs: "90%", xl: "40%" }}>
                <Typography variant="h4">
                    ユーザー情報
                </Typography>
                <Divider />
                <ThemeProvider theme={formTheme}>
                    <form className="space-y-2" action={async (data: FormData) => {
                        const pairoad = {
                            name: data.get("name") as string,
                            email: session?.user?.email,
                        }
                        const res = await fetch("/api/user", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(pairoad),
                        });
                        if (res.ok) {
                            await alert("保存しました");
                            redirect("/settings");
                        }
                    }}>
                        {session ?
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography>アイコン:</Typography>
                                <Avatar src={session?.user?.image ?? undefined} />
                            </Stack>
                            : "Not signed in"}
                        <FormHelperText>アイコンはGoogleアカウントの設定から変更してください。</FormHelperText>
                        {session ? <Typography variant="body1">メールアドレス:{session?.user?.email}</Typography> : "Not signed in"}
                        <FormHelperText>メールアドレスを変更することはできません。</FormHelperText>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="名前"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={name}
                                />
                            )}
                        />
                        <Button type="submit" variant="outlined">保存</Button>
                    </form>
                </ThemeProvider>
            </Stack>
        </Stack>
    );
}