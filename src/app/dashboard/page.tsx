import Dashboard from "./Component";
import { Metadata } from "next";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Typography, CircularProgress, Stack } from "@mui/material";
import Club from "@/models/Club";
import { fetchErrorResponse } from "@/lib/server/club";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "ダッシュボード - Linkle",
  description: "Linkleのダッシュボードです。",
};

export default async function Page() {
  const getMyClubs = new Promise<Club[] | fetchErrorResponse>(async (resolve) => {
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
      const res = await fetch(`${apiBase}/api/user?email=${session?.user?.email}`, {
        headers: new Headers({
          cookie: sessionID ?? "",
        }),
      });
      if (res.status == 403) resolve("forbidden");
      const club = (await res.json()).clubs as Club[];
      if (!club) resolve("notfound");
      resolve(club);
    } catch (e) {
      throw new Error(e as string);
    }
  });
  return (
    <Suspense
      fallback={
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          minHeight={"100vh"}
          spacing={2}
        >
          <Typography>Loading...</Typography>
          <CircularProgress />
        </Stack>
      }
    >
      <Dashboard clubsPromise={getMyClubs} />
    </Suspense>
  );
}
