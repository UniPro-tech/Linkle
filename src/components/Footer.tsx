import { Box, Stack, ThemeProvider, Typography } from "@mui/material";
import theme from "@/theme";
import Link from "next/link";

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
            <Stack>
                <Stack component='footer' direction={"row"} bgcolor='secondary.main' flexGrow={0}>
                    <Box p={2} textAlign='center' width={1 / 3} sx={{ textAlign: 'left' }} margin={5}>
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
                                Slackチャンネル: #times_unipro-digital<br />
                                {"　　　　　　　　"}#times_linkle
                            </Typography>
                        </Box>
                    </Box>
                    <Box p={2} py={10} textAlign='left' width={1 / 3}>
                        <Typography variant='h5' color='text.secondary'>
                            免責事項
                        </Typography>
                        <Typography variant='body1' color='text.secondary'>
                            このサイトは学園非公式です。<br />
                            このサイトに掲載されている情報は、誰でも編集できるため、その内容を保証するものではありません。<br />
                            このサイトを利用することで生じたいかなる損害についても、UniProject N/S Branchは一切の責任を負いません。<br />
                            また当団体は学外の団体の関連団体ですが、学外への情報提供は行っておりません。
                        </Typography>
                    </Box>
                    <Stack p={2} textAlign='left' width={1 / 3} justifyContent={"center"} alignItems={"center"} justifyItems={"center"}>
                        <iframe
                            src="https://uniproject.instatus.com/embed-status/3559d5ef/light-lg"
                            width="245"
                            height="61"
                        >
                        </iframe>
                    </Stack>
                </Stack>
                <Stack bgcolor='primary.light' p={2} direction={"row"} textAlign='center'>
                    <Typography variant='body1' color='text.secondary'>
                        (c) 2025 UniProject All Rights Reserved.
                    </Typography>
                    <Stack direction={"row"} flexGrow={1} justifyContent={"right"} justifyItems={"center"} spacing={2}>
                        <Typography variant='body1' color='text.secondary'>
                            <Link href='/tos'>
                                &gt; 利用規約
                            </Link>
                        </Typography>
                        <Typography variant='body1' color='text.secondary'>
                            <Link href='https://wiki.uniproject.jp/share/6777b30da69c94671306a70c'>
                                &gt; プライバシーポリシー
                            </Link>
                        </Typography>
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
        </ThemeProvider>
    );
}