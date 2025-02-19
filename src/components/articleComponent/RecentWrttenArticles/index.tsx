import crypto from "crypto-js";
import React, { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import SearchResultsPage from "./Client";
import { fetchErrorResponse } from "@/lib/server/error";
import { headers } from "next/headers";
import { auth } from "@/auth";
import Article from "@/models/Article";

export default function SearchResultsPageWrappe() {
  const searchPromise = new Promise<Article[] | fetchErrorResponse>(async (resolve) => {
    try {
      const headersData = await headers();
      const host = headersData.get("host");
      const protocol =
        headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
      const cookie = headersData.get("cookie");
      const sessionID =
        cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token")) ||
        cookie?.split(";").find((c) => c.trim().startsWith("__Secure-authjs.session-token"));
      const apiBase = `${protocol}://${host}`;
      const key =
        crypto.AES.encrypt(
          ((await auth())?.user?.email as string) || "No Auth",
          process.env.API_ROUTE_SECRET as string
        ).toString() || "";
      const res = await fetch(`${apiBase}/api/articles/recent`, {
        headers: new Headers({
          Cookie: sessionID ?? "",
          "X-Api-Key": key,
        }),
      });
      if (res.status == 403) resolve("forbidden");
      const club = (await res.json()) as Article[];
      if (!club) resolve("notfound");
      resolve(club);
    } catch (e) {
      throw new Error(e as string);
    }
  });
  return (
    <Stack
      width={"100%"}
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      justifyItems={"center"}
    >
      <Typography
        variant="h4"
        style={{ marginTop: "20px" }}
      >
        新着同好会
      </Typography>
      <Suspense fallback={<CircularProgress />}>
        <SearchResultsPage searchPromise={searchPromise} />
      </Suspense>
    </Stack>
  );
}
