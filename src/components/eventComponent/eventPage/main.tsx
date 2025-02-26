import { Alert, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import "katex/dist/katex.min.css";
import { LongDescription } from "@/components/md";
import { use } from "react";
import { forbidden, notFound, unauthorized } from "next/navigation";
import UpdateMetadata from "@/components/TitleChange";
import { Metadata } from "next";
import { getEventById } from "@/lib/server/event";
import Event from "@/models/Event";

export default function EventPage({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const event = use(getEventById(id, apiBase, sessionID));
  if (event == "forbidden") forbidden();
  if (event == "notfound") notFound();
  if (event == "unauthorized") unauthorized();
  return (
    <>
      <UpdateMetadata
        metadata={
          {
            title: `${event.title}`,
            description: `${event.description}`,
            openGraph: {
              title: `${event.title}`,
              description: `${event.description}`,
              type: "website",
              url: `${process.env.DB_API_ENDPOINT}/events/${id}`,
              images: event.image ?? undefined,
              siteName: "同好会ポータル Linkle",
            },
            twitter: {
              card: "summary_large_image",
              site: "@UniPro_digital",
              title: `${event.title}`,
              description: `${event.description}`,
              images: event.image ?? undefined,
            },
          } as Metadata
        }
      />
      {typeof event == "string" && (
        <Typography>
          {
            <Alert
              severity="error"
              style={{ marginTop: "20px" }}
            >
              {event == "forbidden"
                ? "権限がありません。"
                : event == "notfound"
                ? "記事が見つかりませんでした。"
                : `エラーが発生しました。\n${event}`}
            </Alert>
          }
        </Typography>
      )}
      {!(typeof event == "string") && (
        <>
          <KeyVisual
            event={event}
            imageUrl={event.image}
          />
          <Stack
            spacing={2}
            py={5}
            px={{ xs: 2, lg: 10 }}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
          >
            <LongDescription
              description={event.main_text == "" ? "# 説明はありません。" : event.main_text}
            />
          </Stack>
        </>
      )}
    </>
  );
}

function KeyVisual({ event, imageUrl }: { event: Event; imageUrl: string | undefined | null }) {
  return (
    <Box
      position={"relative"}
      width={"100%"}
      height={0}
      paddingBottom={"56.25%"}
      overflow={"hidden"}
    >
      <Image
        src={imageUrl || "/img/noClubImage.jpg"}
        alt={event.title}
        width={"5000"}
        height={0}
        style={{ width: "100%", height: "auto", objectFit: "contain" }}
      />
      <Stack
        spacing={1}
        position={"absolute"}
        bottom={{ xs: "6%", lg: "15%" }}
        left={0}
      >
        <Typography
          variant="h1"
          bgcolor={"black"}
          color="white"
          p={{ xs: 1, lg: 3 }}
          sx={{ opacity: 0.8, fontWeight: "bold", fontSize: { xs: "34px", lg: "94px" } }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body1"
          bgcolor={"black"}
          color="white"
          p={{ xs: 1, lg: 3 }}
          sx={{ opacity: 0.8 }}
        >
          {event.description}
        </Typography>
      </Stack>
    </Box>
  );
}
