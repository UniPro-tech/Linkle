"use client";
import searchClubs from "@/libs/searchers/clubs";
import { Alert, Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import 'katex/dist/katex.min.css';
import { notFound, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Club from "@/models/Club";
import { Controller, useForm } from "react-hook-form";
import formTheme from "@/theme/form";
import { LongDescription } from "./md";

export default function ClubEdit({ id }: { id: string }) {
    const [searchResult, setSearchResult] = useState<Club | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true);
                setSearchError(null);
                try {
                    const result = await searchClubs({ query: id });
                    const res = result?.data[0];
                    if (!res) notFound();
                    setSearchResult(res);
                } catch (error: any) {
                    setSearchError("検索中にエラーが発生しました。もう一度お試しください。");
                } finally {
                    setLoading(false);
                }
            } else setSearchError("idが指定されていません。");
        };
        fetchData();
    }, [id]);

    interface ClubEditFormData {
        name: string;
        short_description: string;
        long_description: string;
        slack_name: string;
        slack_link: string;
        image: string;
        chutobu: boolean;
        kotobu: boolean;
    }
    const { control, handleSubmit, watch } = useForm<ClubEditFormData>({
        defaultValues: {
            name: searchResult?.name,
            short_description: searchResult?.short_description,
            long_description: searchResult?.long_description,
            slack_name: searchResult?.slack_name,
            slack_link: searchResult?.slack_link,
            image: searchResult?.image,
            chutobu: (searchResult?.available_on ? (searchResult.available_on & 0x2) == 0x2 : false),
            kotobu: (searchResult?.available_on ? (searchResult.available_on & 0x1) == 0x1 : false),
        },
    });
    return (
        <Stack spacing={1} justifyContent={"center"} alignItems={"center"} minHeight={"100vh"} py={5}>
            {searchError && (
                <Alert severity="error" style={{ marginTop: "20px" }}>
                    {searchError}
                </Alert>
            )}
            {loading && <Typography>読み込み中...</Typography>}
            {
                searchResult && (
                    <>
                        <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
                            <Typography variant="h3">同好会編集</Typography>
                            <Typography variant="body1">ここで同好会情報の編集ができます。</Typography>
                        </Stack>
                        <Stack spacing={2} justifyContent={"left"} width={"40%"}>
                            <Typography variant="h4">基礎情報</Typography>
                            <Divider />
                            <ThemeProvider theme={formTheme}>
                                <form action={
                                    (data: FormData) => {

                                    }
                                } className="flex flex-col space-y-2 justify-center items-left">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="同好会名"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={searchResult.name}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="slack_name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Slack名"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={searchResult.slack_name}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="slack_link"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Slackリンク"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={`https://n-highschool.slack.com/archive/${searchResult.slack_link}`}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="short_description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="短い説明"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={searchResult.short_description}
                                            />
                                        )}
                                    />
                                    <FormHelperText>短い説明はクラブカードに表示されます。</FormHelperText>
                                    <Controller
                                        name="image"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="画像URL"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={searchResult.image}
                                            />
                                        )}
                                    />
                                    <FormHelperText>画像はクラブカードに表示されます。</FormHelperText>
                                    <Typography variant="h5">対象</Typography>
                                    <Controller
                                        name="chutobu"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl>
                                                <FormControlLabel
                                                    control={<Checkbox {...field} />}
                                                    label={
                                                        <>
                                                            中等部
                                                        </>
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="kotobu"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl>
                                                <FormControlLabel
                                                    control={<Checkbox {...field} />}
                                                    label={
                                                        <>
                                                            高等部
                                                        </>
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <Typography variant="h5">長い説明</Typography>
                                    <Controller
                                        name="long_description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="長い説明"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                defaultValue={searchResult.long_description}
                                                multiline
                                                minRows={10}
                                                maxRows={10}
                                            />
                                        )}
                                    />
                                    <FormHelperText>長い説明はクラブページに表示されます。</FormHelperText>
                                    <Typography variant="h6">プレビュー</Typography>
                                    <Divider />
                                    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
                                        <LongDescription description={watch("long_description") ?? searchResult?.long_description} />
                                    </Stack>
                                    <Divider />
                                    <Button variant="outlined" color="primary" type="submit">変更を保存</Button>
                                </form>
                            </ThemeProvider>
                        </Stack>
                        <Stack spacing={2} justifyContent={"left"} width={"40%"}>
                            <Typography variant="h4">重要操作</Typography>
                            <Divider />
                            <Typography variant="body1">これより下は破壊的なアクションです。<br />本当に実行してもよいか十分に検討したうえで実行してください。</Typography>
                            <Button variant="outlined" color="error" sx={{ width: "auto" }}>同好会を削除する</Button>
                        </Stack>
                    </>
                )
            }
        </Stack>
    )
}
