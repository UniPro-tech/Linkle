"use client";
import { Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, Link, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import formTheme from "@/theme/form";

export default function CreateClub() {
    interface ClubData {
        name: string;
        chutobu: boolean;
        kotobu: boolean;
        slack_link: string;
        slack_name: string;
        shortDescription: string;
    }

    interface Check {
        admin: boolean;
        tos: boolean;
    }

    const { control, handleSubmit, watch } = useForm<ClubData>({
        defaultValues: {
            name: "",
            chutobu: false,
            kotobu: false,
            slack_link: "",
            slack_name: "",
            shortDescription: ""
        },
    });

    const chutobu = watch("chutobu");
    const kotobu = watch("kotobu");

    const { control: checkControl, handleSubmit: checkHandleSubmit, watch: checkWatch } = useForm<Check>({
        defaultValues: {
            admin: false,
            tos: false
        }
    });

    return (
        <Stack minHeight={"100vh"} justifyContent={"center"} alignItems={"center"} spacing={2} pt={10} pb={10}>
            <Typography variant="h3">同好会を登録</Typography>
            <Typography variant="body1">同好会を登録することで、Linkleを使用した同好会検索に掲載されるようになります。</Typography>
            <Stack spacing={2} bgcolor={"lightgray"} padding={2} borderRadius={2} minWidth={"75%"}>
                <Typography textAlign={"center"} variant="h4" width={"100%"}>注意事項</Typography>
                <ul className="list-disc p-5">
                    <li>同好会の登録は、同好会の代表者または運営者のみが行うことができます。</li>
                    <li>登録した同好会は、Linkleの同好会検索に掲載されます。</li>
                    <li>利用規約の禁止事項をもう一度よく読み、違反しないようにしてください。</li>
                </ul>
            </Stack>
            <Divider />
            <ThemeProvider theme={formTheme}>
                <Stack minWidth={"75%"} spacing={2} p={3} justifyContent={"center"} alignItems={"center"}>
                    <Typography variant="h4">基礎情報</Typography>
                    <form action={async (data: FormData) => {
                        const name = data.get("name");
                        const chutobu = data.get("chutobu");
                        const kotobu = data.get("kotobu");
                        const slack_link = data.get("slack_link");
                        const slack_name = data.get("slack_name");
                        const shortDescription = data.get("shortDescription");
                        const admin = data.get("admin");
                        const tos = data.get("tos");
                        if (!tos || !admin) {
                            alert("利用規約に同意していないか、管理者でないため登録できません。");
                            return;
                        }
                        if (!chutobu && !kotobu) {
                            alert("中等部または高等部のどちらか一方または両方を選択してください。");
                            return;
                        }
                        if (!name || !slack_link || !slack_name || !shortDescription) {
                            alert("全ての項目を入力してください。");
                            return;
                        }
                        const chutobuBit = chutobu ? 1 : 0;
                        const kotobuBit = kotobu ? 2 : 0;
                        const availableBit = chutobuBit | kotobuBit;
                        const apiBase = process.env.DB_API_ENDPOINT;
                        const res = await fetch(`/api/clubs`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: name,
                                available_on: availableBit,
                                slack_link: slack_link,
                                slack_name: slack_name,
                                short_description: shortDescription,
                                visible: 0
                            })
                        });
                    }} className="w-full flex flex-col space-y-1">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) =>
                                <TextField {...field} label="同好会名" variant="outlined" fullWidth required />
                            }
                        />
                        <FormHelperText>学園側に届け出ている名称です。(仮)や○○同好会の同好会までご記入ください。</FormHelperText>
                        <Typography variant="h6" mt={3}>同好会の活動場所</Typography>
                        <Controller
                            name="chutobu"
                            control={control}
                            render={({ field }) => (
                                <FormControl error={Boolean(kotobu || field.value) === false}>
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
                                <FormControl error={chutobu || Boolean(field.value) === false}>
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
                        {(chutobu || kotobu) ? null : <FormHelperText error>どちらか一方または両方を選択してください。</FormHelperText>}
                        <Typography variant="h6" mt={3}>Slack情報</Typography>
                        <Controller
                            name="slack_link"
                            control={control}
                            render={({ field }) =>
                                <TextField {...field} label="Slackのリンク" variant="outlined" fullWidth required />
                            }
                        />
                        <FormHelperText>高等部のリンクでも中等部のリンクでも構いません。</FormHelperText>
                        <Controller
                            name="slack_name"
                            control={control}
                            render={({ field }) =>
                                <TextField {...field} label="Slackのチャンネル名" variant="outlined" fullWidth required />
                            }
                        />

                        <Typography variant="h6" mt={3}>簡単な説明</Typography>
                        <Controller
                            name="shortDescription"
                            control={control}
                            render={({ field }) =>
                                <TextField {...field} label="簡単な説明" variant="outlined" fullWidth required />
                            }
                        />
                        <FormHelperText>20文字程度。この文はクラブカードに表示されます。</FormHelperText>
                        <Divider />
                        <Controller
                            name="tos"
                            control={checkControl}
                            render={({ field }) => (
                                <FormControl error={Boolean(field.value) === false}>
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={
                                            <>
                                                <Link href={"/tos"} target={"_blank"}>利用規約</Link>に同意する
                                            </>
                                        }
                                    />
                                </FormControl>
                            )}
                        />
                        <Controller
                            name="admin"
                            control={checkControl}
                            render={({ field }) => (
                                <FormControl error={Boolean(field.value) === false}>
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label={
                                            <>
                                                私はこの同好会の管理者または代表者です。
                                            </>
                                        }
                                    />
                                </FormControl>
                            )}
                        />
                        <FormHelperText>管理者・代表者でない場合、この登録を取り消したり、あなたのアカウントを停止する場合があります。</FormHelperText>
                        <Button type="submit" variant="contained" color="primary">登録</Button>
                    </form>
                </Stack>
            </ThemeProvider>
        </Stack>
    )
}