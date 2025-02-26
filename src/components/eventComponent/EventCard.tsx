import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@mui/material";
import formTheme from "@/theme/form";
import Event from "@/models/Event";

type EventCardProps = {
  event: Event;
  isDashboard?: boolean;
};

export default function ArticleCard({ event, isDashboard }: EventCardProps) {
  const { id, title, description, image } = event;
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
            src={image == "" || image == undefined ? "/img/noClubImage.jpg" : image}
            alt={title}
            width={"320"}
            height={0}
            className="w-[320px] h-[180px]"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
            >
              {title}
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
