import { Box, Stack, ThemeProvider, Typography } from "@mui/material";
import theme from "@/theme/primary";
import Link from "next/link";
import PoweredByVercel from 'powered-by-vercel'

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
            <Stack width={"100%"} justifyContent={"center"} justifyItems={"center"}>
                <Stack display={"flex"} direction={{ xs: "column", lg: "row" }} width={"100%"} bgcolor='secondary.main' flexGrow={0} justifyContent={"center"} justifyItems={"center"}>
                    <Box p={2} textAlign='left' width={{ xs: "100%", lg: (1 / 3) }} margin={{ xs: 0, lg: 5 }} justifyContent={"center"} justifyItems={"center"}>
                        <Typography variant='h2' color='text.secondary'>
                            Linkle
                        </Typography>
                        <Box padding={2}>
                            <Typography variant='h5' color='text.secondary'>
                                運営元
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                デジタル創作サークルUniProject
                                N/S Branch
                            </Typography>
                            <Typography variant='h5' color='text.secondary'>
                                連絡先
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                <a href='mailto:linkle@uniproject.jp'>
                                    linkle@uniproject.jp
                                </a>
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                Slackチャンネル: #times_unipro<br />
                                {"　　　　　　　　"}#times_linkle
                            </Typography>
                        </Box>
                    </Box>
                    <Box p={2} textAlign='left' width={{ xs: "100%", lg: (1 / 3) }} margin={{ xs: 0, lg: 5 }} justifyContent={"center"} justifyItems={"center"}>
                        <Typography variant='h5' color='text.secondary' maxWidth={"275px"}>
                            免責事項
                        </Typography>
                        <Typography variant='body1' color='text.secondary' maxWidth={"450px"}>
                            このサイトは学園非公式です。<br />
                            このサイトに掲載されている情報は、誰でも編集できるため、その内容を保証するものではありません。<br />
                            このサイトを利用することで生じたいかなる損害についても、UniProject N/S Branchは一切の責任を負いません。<br />
                            また当団体は学外の団体の関連団体ですが、学外への情報提供は行っておりません。
                        </Typography>
                    </Box>
                    <Box p={2} textAlign='left' width={{ xs: "100%", lg: (1 / 3) }} margin={{ xs: 0, lg: 5 }} justifyContent={"center"} justifyItems={"center"}>
                        <iframe
                            src="https://uniproject.instatus.com/embed-status/3559d5ef/light-lg"
                            width="245"
                            height="61"
                        />
                        <PoweredByVercel
                            utmSource="my-source"
                            target="_blank"
                            rel="noopener noreferrer"
                            svgProps={{
                                width: 245,
                            }}
                        />
                    </Box>
                </Stack>
                <Stack bgcolor='primary.light' p={2} direction={{ xs: "column", lg: "row" }} textAlign='center' maxWidth={"100%"}>
                    <Typography variant='body1' color='text.secondary'>
                        (c) 2025 UniProject All Rights Reserved.
                    </Typography>
                    <Stack direction={{ xs: "column", lg: "row" }} justifyContent={"right"} justifyItems={"center"} spacing={{ xs: 0, lg: 2 }} maxWidth={"100%"}>
                        <Stack direction={"row"} spacing={2} justifyContent={"center"} m={0} p={0} justifyItems={"center"}>
                            <Typography variant='body1' color='text.secondary'>
                                <Link href='/tos'>
                                    &gt; 利用規約
                                </Link>
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                <Link href='/privacy'>
                                    &gt; プライバシーポリシー
                                </Link>
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} spacing={2} justifyContent={"center"} m={0} p={0} justifyItems={"center"}>
                            <Typography variant='body1' color='text.secondary'>
                                <Link href='/cookie'>
                                    &gt; Cookieポリシー
                                </Link>
                            </Typography>
                            <Typography variant='body1' color='text.secondary'>
                                <Link href='/about'>
                                    &gt; このサイトについて
                                </Link>
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </ThemeProvider>
    );
}