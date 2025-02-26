import { notFound, unauthorized } from "next/navigation";
import EditArtucle from "@/components/eventComponent/eventPage/edit";
import { auth } from "@/auth";

import { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import EventPage from "@/components/eventComponent/eventPage/main";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
  const cookie = headersData.get("cookie");
  const sessionID = cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token"));
  const apiBase = `${protocol}://${host}`;
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
            <EditArtucle
              id={slug[0]}
              apiBase={apiBase}
              sessionID={sessionID}
            />
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
            <EventPage
              id={slug[0]}
              apiBase={apiBase}
              sessionID={sessionID}
            />
          </Suspense>
        </Stack>
      );
    default:
      notFound();
  }
}
