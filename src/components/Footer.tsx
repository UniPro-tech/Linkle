import { Box, Divider, Stack, ThemeProvider, Typography } from "@mui/material";
import theme from "@/theme/primary";
import Link from "next/link";

export default function Footer() {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        width={"100%"}
        justifyContent={"center"}
        justifyItems={"center"}
      >
        <Stack
          display={"flex"}
          direction={{ xs: "column", lg: "row" }}
          width={"100%"}
          bgcolor="secondary.main"
          flexGrow={0}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Stack
            p={2}
            flexDirection={"column"}
            textAlign="left"
            width={{ xs: "100%", lg: 1 / 3 }}
            margin={{ xs: 0, lg: 5 }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h2"
              color="text.secondary"
            >
              Linkle
            </Typography>
            <Box padding={2}>
              <Typography
                variant="h5"
                color="text.secondary"
              >
                運営元
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                pl={1}
              >
                デジタル創作サークルUniProject N/S Branch
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
              >
                連絡先
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                pl={1}
              >
                <a href="mailto:linkle@uniproject.jp">linkle@uniproject.jp</a>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
              >
                Slackチャンネル
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                pl={1}
              >
                #times_linkle
                <br />
                #times_unipro
              </Typography>
            </Box>
          </Stack>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 5, bgcolor: "#F1F1F1FF" }}
          />
          <Stack
            p={2}
            textAlign="left"
            width={{ xs: "100%", lg: 1 / 3 }}
            margin={{ xs: 0, lg: 5 }}
            spacing={2}
            justifyContent={"center"}
            justifyItems={"center"}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              maxWidth={"275px"}
            >
              免責事項
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth={"450px"}
            >
              このサイトは学園非公式です。
              <br />
              このサイトに掲載されている情報は、誰でも編集できるため、その内容を保証するものではありません。
              <br />
              このサイトを利用することで生じたいかなる損害についても、運営元は一切の責任を負いません。
              <br />
              また当団体は学外の団体の関連団体ですが、学外への情報提供は行っておりません。
            </Typography>
          </Stack>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 5, bgcolor: "#F1F1F1FF" }}
          />
          <Stack
            flexDirection={"column"}
            p={2}
            width={{ xs: "100%", lg: 1 / 3 }}
            margin={{ xs: 0, lg: 5 }}
            alignItems={"center"}
            spacing={2}
            justifyContent={"center"}
            justifyItems={"center"}
          >
            <iframe
              src="https://uniproject.instatus.com/embed-status/3559d5ef/light-lg"
              width="245"
              height="61"
            />
          </Stack>
        </Stack>
        <Stack
          bgcolor="primary.light"
          p={2}
          direction={{ xs: "column", xl: "row" }}
          textAlign="center"
          maxWidth={"100%"}
          justifyContent={{ xl: "space-between" }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
          >
            (c) 2025 UniProject All Rights Reserved.
          </Typography>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent={"right"}
            justifyItems={"center"}
            spacing={{ xs: 0, lg: 2 }}
            maxWidth={"100%"}
          >
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"center"}
              m={0}
              p={0}
              justifyItems={"center"}
            >
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <Link href="/tos">&gt; 利用規約</Link>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <Link href="/privacy">&gt; プライバシーポリシー</Link>
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"center"}
              m={0}
              p={0}
              justifyItems={"center"}
            >
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <Link href="/cookie">&gt; Cookieポリシー</Link>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                <Link href="/about">&gt; このサイトについて</Link>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
