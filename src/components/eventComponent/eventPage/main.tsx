import { Alert, Box, Stack, Typography } from "@mui/material";
import * as React from "react";
import Image from "next/image";
import "katex/dist/katex.min.css";
import { LongDescription } from "@/components/md";
import { use } from "react";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { getEventById } from "@/lib/server/event";
import Event from "@/models/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { timeFormat } from "@/lib/time";

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
  // 画像エラー時NoImageにフォールバック
  const [imgSrc, setImgSrc] = React.useState(imageUrl || "/img/NoImage.webp");
  return (
    <Box
      position={"relative"}
      width={"100%"}
      height={0}
      paddingBottom={"56.25%"}
      overflow={"hidden"}
    >
      <Image
        src={imgSrc}
        alt={event.title}
        width={1200}
        height={675}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImgSrc("/img/NoImage.webp")}
        placeholder="blur"
        blurDataURL="/img/NoImage.webp"
        priority
      />
      <Stack
        spacing={1}
        position={"absolute"}
        bottom={{ xs: "6%", lg: "15%" }}
        left={0}
      >
        <Stack
          bgcolor={"black"}
          p={{ xs: 1, lg: 3 }}
          sx={{ opacity: 0.8 }}
        >
          <Typography
            variant="h2"
            color="white"
            sx={{ fontWeight: "bold", fontSize: { xs: "15px", lg: "28px" } }}
          >
            {event.clubs ? event.clubs[0].name : ""}
          </Typography>
          <Typography
            variant="h1"
            color="white"
            sx={{ fontWeight: "bold", fontSize: { xs: "34px", lg: "94px" } }}
          >
            {event.title}
          </Typography>
          <Typography
            variant="h2"
            color="white"
            sx={{ fontWeight: "bold", fontSize: { xs: "15px", lg: "28px" } }}
            flex={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            justifyItems={"center"}
            gap={1}
            textAlign={"left"}
          >
            <CalendarMonthIcon />
            {event.start_at ? timeFormat(new Date(event.start_at), "YYYY/MM/DD hh:mm") : ""}
            {event.end_at ? ` ~ ${timeFormat(new Date(event.end_at), "YYYY/MM/DD hh:mm")}` : ""}
          </Typography>
        </Stack>
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
