import { auth } from "@/auth";
import ArticleList from "@/components/articleComponent/ArticleList";
import ClubSearchForm from "@/components/search/SearchBox"; //TODO: 見たらわかると思うけど変更が必要
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import CryptoJS from "crypto-js";
import Article from "@/models/Article";

export const metadata: Metadata = {
  title: "記事一覧 - Linkle",
  description:
    "Linkleに登録されている同好会が書いた記事一覧です。お知らせやイベント情報などを探せます。",
};

export default async function Home() {
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
  const cookie = headersData.get("cookie");
  const sessionID = cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token"));
  const apiBase = `${protocol}://${host}`;

  const fetchData = new Promise<Article[]>(async (resolve, reject) => {
    try {
      const session = await auth();
      const res = await fetch(`${apiBase}/api/articles`, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-key": CryptoJS.AES.encrypt(
            session?.user?.email ?? "No Auth",
            process.env.API_ROUTE_SECRET as string
          ).toString(),
          ...(sessionID && { Cookie: sessionID }),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data" + res.statusText);
      }
      resolve((await res.json()) as Article[]);
    } catch (error) {
      console.log(error);
      reject("Failed to fetch data" + error);
    }
  });

  return (
    <Stack
      px={{ xs: 2, lg: 0 }}
      py={10}
      justifyContent="center"
      alignItems="center"
      justifyItems={"center"}
      spacing={5}
      minHeight={"100vh"}
    >
      <Typography
        variant="h4"
        gutterBottom
        mt={5}
      >
        記事一覧
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
      >
        Linkleに登録されている記事一覧です。
      </Typography>
      <Box
        width={{ xs: "100%", lg: 2 / 5 }}
        p={5}
      >
        <ClubSearchForm />
      </Box>
      <Suspense fallback={<CircularProgress />}>
        <ArticleList fetchData={fetchData} />
      </Suspense>
    </Stack>
  );
}
