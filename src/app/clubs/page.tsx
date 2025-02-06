import { auth } from "@/auth";
import ClubList from "@/components/ClubList";
import ClubSearchForm from "@/components/search/SearchBox";
import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "同好会一覧 - Linkle",
  description: "Linkleに登録されている同好会一覧です。",
};

export default async function Home() {
  const getClubs = new Promise<Club[] | fetchErrorResponse>(async (resolve) => {
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
      const res = await fetch(`${apiBase}/api/clubs`, {
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
        同好会一覧
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
      >
        Linkleに登録されている同好会一覧です。
      </Typography>
      <Box
        width={{ xs: "100%", lg: 2 / 5 }}
        p={5}
      >
        <ClubSearchForm />
      </Box>
      <Suspense
        fallback={
          <Stack
            flex={1}
            justifyContent="center"
            alignItems="center"
            minHeight={"30vh"}
            spacing={2}
          >
            <Typography>Loading...</Typography>
            <CircularProgress />
          </Stack>
        }
      >
        <ClubList clubsPromise={getClubs} />
      </Suspense>
    </Stack>
  );
}
