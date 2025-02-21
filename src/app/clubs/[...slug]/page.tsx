import { notFound, unauthorized } from "next/navigation";
import ClubPage from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";
import { auth } from "@/auth";
import { Suspense } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import Club from "@/models/Club";
import CryptoJS from "crypto-js";
import { Metadata } from "next";
import { metadata as notFoundMetadata } from "@/app/not-found";
import { metadata as forbiddenMetadata } from "@/app/forbidden";
import { metadata as unauthorizedMetadata } from "@/app/unauthorized";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const session = await auth();
  const slug = (await params).slug;
  const fetchOption = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": CryptoJS.AES.encrypt(
        session?.user?.email || "No Auth",
        process.env.API_ROUTE_SECRET as string
      ).toString(),
    },
  };
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
  const apiBase = `${protocol}://${host}`;
  const res = await fetch(`${apiBase}/api/clubs/${slug[0]}`, fetchOption);
  if (res.status == 401) return unauthorizedMetadata;
  if (res.status == 404) return notFoundMetadata;
  if (res.status == 403) return forbiddenMetadata;
  const club = (await res.json()) as Club;
  switch (slug[1]) {
    case "edit":
      if (session?.user?.email && club.owner?.includes(session?.user?.email)) {
        return {
          title: `同好会編集ページ - 同好会ポータル Linkle`,
          description: "同好会の情報を編集します。",
        } as Metadata;
      }
      return forbiddenMetadata;
    case undefined:
      return {
        title: `${club.name} - 同好会ポータル Linkle`,
        description: club.short_description,
        openGraph: {
          title: club.name,
          description: club.short_description,
          type: "website",
          url: `${apiBase}/clubs/${slug[0]}`,
          images: club.image,
          siteName: "同好会ポータル Linkle",
          locale: "ja_JP",
        },
        twitter: {
          site: "@UniPro_digital",
          cardType: "summary_large_image",
          title: club.name,
          description: club.short_description,
          images: club.image,
        },
      } as Metadata;
    default:
      return notFoundMetadata;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
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
            <EditClub
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
            <ClubPage
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
