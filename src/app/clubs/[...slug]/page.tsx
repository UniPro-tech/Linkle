import { notFound, unauthorized } from "next/navigation";

import ClubPage from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  switch (slug[1]) {
    case "edit":
      const session = await auth();
      if (!session) return unauthorized();
      return (
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          minHeight={"100vh"}
        >
          <Suspense
            fallback={
              <>
                <Typography>Loading...</Typography>
                <CircularProgress />
              </>
            }
          >
            <EditClub id={slug[0]} />
          </Suspense>
        </Stack>
      );
    case undefined:
      return (
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          minHeight={"100vh"}
        >
          <Suspense
            fallback={
              <>
                <Typography>Loading...</Typography>
                <CircularProgress />
              </>
            }
          >
            <ClubPage id={slug[0]} />
          </Suspense>
        </Stack>
      );
    default:
      notFound();
  }
}
