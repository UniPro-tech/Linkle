import React, { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import SearchResultsPage from "./Client";
import { auth } from "@/auth";
import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { headers } from "next/headers";

export default function SearchResultsPageWrappe() {
  const searchPromise = new Promise<Club[] | fetchErrorResponse>(async (resolve) => {
    try {
      const session = await auth();
      if (!session) resolve("unauthorized");
      const headersData = await headers();
      const host = headersData.get("host");
      const protocol =
        headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
      const cookie = headersData.get("cookie");
      const sessionID = cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token"));
      const apiBase = `${protocol}://${host}`;
      const res = await fetch(`${apiBase}/api/clubs/recent`, {
        headers: new Headers({
          cookie: sessionID ?? "",
        }),
      });
      if (res.status == 403) resolve("forbidden");
      const club = (await res.json()) as Club[];
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
