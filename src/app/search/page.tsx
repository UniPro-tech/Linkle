import { auth } from "@/auth";
import ClubSearchForm from "@/components/search/SearchBox";
import SearchResultsPage from "@/components/search/SearchView";
import SearchTitle from "@/components/search/SerachTitle";
import Club from "@/models/Club";
import { Box, CircularProgress, Stack } from "@mui/material";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import CryptoJS from "crypto-js";

export const metadata: Metadata = {
  title: "クラブ検索 - Linkle",
  description: "Linkleのクラブ検索ページです。",
};

export default async function Home({ searchParams }: { searchParams: Promise<{ query: string }> }) {
  const { query } = await searchParams;
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
  const cookie = headersData.get("cookie");
  const sessionID = cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token"));
  const apiBase = `${protocol}://${host}`;
  const fetchData = new Promise<Club[] | string>(async (resolve, reject) => {
    if (query) {
      const session = await auth();
      const res = await fetch(`${apiBase}/api/clubs/search?query=${query}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-key": CryptoJS.AES.encrypt(
            session?.user?.email ?? "No Auth",
            process.env.API_ROUTE_SECRET as string
          ).toString(),
          ...(sessionID && { Cookie: sessionID }),
        },
      });
      if (res.ok) {
        const data = await res.json();
        resolve(data);
      } else {
        const error = await res.text();
        reject(error);
      }
    } else resolve("queryが指定されていません。");
  });
  return (
    <>
      <Stack
        px={{ xs: 2, lg: 0 }}
        py={10}
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <SearchTitle />
        <Box
          width={{ xs: "100%", lg: 2 / 5 }}
          sx={{ p: 5 }}
        >
          <ClubSearchForm query={query} />
        </Box>
        <Suspense fallback={<CircularProgress />}>
          <SearchResultsPage
            promise={fetchData}
            query={query}
          />
        </Suspense>
      </Stack>
    </>
  );
}
