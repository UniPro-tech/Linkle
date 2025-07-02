import crypto from "crypto-js";
import React, { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import SearchResultsPage from "./Client";
import { fetchErrorResponse } from "@/lib/server/error";
import Club from "@/models/Club";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default function SearchResultsPageWrappe() {
  const searchPromise = (async (): Promise<Club[] | fetchErrorResponse> => {
    const headersData = await headers();
    const host = headersData.get("host") || "";
    // プロトコル判定を修正
    const protoHeader = headersData.get("x-forwarded-proto");
    const protocol = protoHeader ? protoHeader : host.startsWith("localhost") ? "http" : "https";
    const cookie = headersData.get("cookie") || "";
    const sessionID =
      cookie.split(";").find((c) => c.trim().startsWith("authjs.session-token")) ||
      cookie.split(";").find((c) => c.trim().startsWith("__Secure-authjs.session-token")) ||
      "";
    const apiBase = `${protocol}://${host}`;
    const userEmail = (await auth())?.user?.email as string | undefined;
    const key = crypto.AES.encrypt(
      userEmail || "No Auth",
      process.env.API_ROUTE_SECRET as string
    ).toString();
    const res = await fetch(`${apiBase}/api/clubs/recent`, {
      headers: new Headers({
        Cookie: sessionID,
        "X-Api-Key": key,
      }),
    });
    if (res.status === 403) return "forbidden";
    const club = (await res.json()) as Club[];
    if (!club) return "notfound";
    return club;
  })();
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
