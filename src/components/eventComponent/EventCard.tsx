"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { Chip, ThemeProvider } from "@mui/material";
import formTheme from "@/theme/form";
import Event from "@/models/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { timeFormat } from "@/lib/time";

type EventCardProps = {
  event: Event;
  isDashboard?: boolean;
};

export default function EventCard({ event, isDashboard }: EventCardProps) {
  const { id, title, description, image, clubs } = event;
  const [imgSrc, setImgSrc] = React.useState(
    image == "" || image == undefined ? "/img/NoImage.webp" : image
  );
  return (
    <ThemeProvider theme={formTheme}>
      <Card
        sx={{
          width: 320,
          position: "relative",
          boxShadow: 0,
          border: 1,
          borderColor: "grey.300",
          borderRadius: 2,
        }}
      >
        <Link href={`/events/${id}`}>
          <Image
            src={imgSrc}
            alt={title}
            width={320}
            height={180}
            className="w-[320px] h-[180px]"
            style={{ objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            onError={() => setImgSrc("/img/NoImage.webp")}
            placeholder="blur"
            blurDataURL="/img/NoImage.webp"
            priority
          />
          <CardContent>
            {new Date(event.end_at) < new Date() && (
              <Chip
                label="終了"
                color="error"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                }}
              />
            )}
            {new Date(event.start_at) > new Date() && (
              <Chip
                label="開催予定"
                color="primary"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                }}
              />
            )}
            {new Date(event.start_at) < new Date() && new Date(event.end_at) > new Date() && (
              <Chip
                label="開催中"
                color="success"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                }}
              />
            )}
            <Typography variant="body2">{clubs == undefined ? "" : clubs[0]?.name}</Typography>
            <Typography variant="h5">{title}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              display="flex"
              alignItems="center"
              justifyContent={"flex-start"}
              justifyItems={"center"}
              mx={-0.3}
              my={0.5}
              p={0}
            >
              <CalendarMonthIcon />
              <span>
                {timeFormat(event.start_at, "YYYY/MM/DD hh:mm")}〜
                {timeFormat(event.end_at, "YYYY/MM/DD hh:mm")}
              </span>
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              {description}
            </Typography>
          </CardContent>
        </Link>
        <CardActions>
          <Button
            size="small"
            href={`/events/${id}`}
          >
            もっと見る
          </Button>
          {isDashboard && (
            <Button
              size="small"
              href={`/events/${id}/edit`}
            >
              編集する
            </Button>
          )}
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}
