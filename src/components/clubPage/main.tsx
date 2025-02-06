import ClubType from "@/models/Club";
import { Alert, Avatar, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";

import "katex/dist/katex.min.css";
import Link from "next/link";
import { LongDescription } from "./md";
import { use } from "react";
import { getClubById } from "@/lib/club";
import { forbidden, notFound } from "next/navigation";
import UpdateMetadata from "@/components/TitleChange";
import { Metadata } from "next";

export default function Club({ id }: { id: string }) {
  const club = use(getClubById(id));
  if (club == "forbidden") forbidden();
  if (club == "notfound") notFound();
  return (
    <>
      <UpdateMetadata
        metadata={
          {
            title: `${club.name}`,
            description: `${club.short_description}`,
            openGraph: {
              title: `${club.name}`,
              description: `${club.short_description}`,
              type: "website",
              url: `${process.env.DB_API_ENDPOINT}/clubs/${id}`,
              images: club.image ?? undefined,
              siteName: "同好会ポータル Linkle",
            },
            twitter: {
              card: "summary_large_image",
              site: "@UniPro_digital",
              title: `${club.name}`,
              description: `${club.short_description}`,
              images: club.image ?? undefined,
            },
          } as Metadata
        }
      />
      {typeof club == "string" && (
        <Typography>
          {
            <Alert
              severity="error"
              style={{ marginTop: "20px" }}
            >
              {club == "forbidden"
                ? "権限がありません。"
                : club == "notfound"
                ? "クラブが見つかりませんでした。"
                : `エラーが発生しました。\n${club}`}
            </Alert>
          }
        </Typography>
      )}
      {!(typeof club == "string") && (
        <>
          <KeyVisual
            club={club}
            imageUrl={club.image}
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
              description={
                club.long_description == "" ? "# 説明はありません。" : club.long_description
              }
            />
            <LongDescription
              description={
                `# Slack` +
                ((club.available_on & 0x1) == 0x1
                  ? `\n- [${club.slack_name} - 高等部](https://n-highschool.slack.com/archives/${club.slack_link})`
                  : null) +
                ((club.available_on & 0x2) == 0x2
                  ? `\n- [${club.slack_name} - 中等部](https://n-jr.slack.com/archives/${club.slack_link})`
                  : null)
              }
            />
          </Stack>
        </>
      )}
    </>
  );
}

function KeyVisual({ club, imageUrl }: { club: ClubType; imageUrl: string | undefined | null }) {
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
        alt={club.name}
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
          {club.name}
        </Typography>
        {club.available_on == 0 ? null : (
          <Stack
            direction={"row"}
            spacing={1}
            pl={1}
          >
            {availableContents(club.available_on, club.slack_link)}
          </Stack>
        )}
        <Typography
          variant="body1"
          bgcolor={"black"}
          color="white"
          p={{ xs: 1, lg: 3 }}
          sx={{ opacity: 0.8 }}
        >
          {club.short_description}
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * Returns a JSX element containing images based on the `availableOn` bitmask.
 *
 * @param availableOn - A bitmask indicating which images to display.
 *                      - If both the first and second bits are set (0x1 and 0x2), both images are displayed.
 *                      - If only the first bit is set (0x1), the "kotobu.png" image is displayed.
 *                      - If only the second bit is set (0x2), the "jhs.png" image is displayed.
 *                      - If neither bit is set, `undefined` is returned.
 *
 * @returns A JSX element containing the appropriate images or `undefined` if no images should be displayed.
 */
export const availableContents = (
  availableOn: number,
  slack_link: string
): undefined | React.JSX.Element => {
  if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
    return (
      <>
        <Link href={`https://n-jr.slack.com/archives/${slack_link}`}>
          <Avatar
            sx={{
              height: 35,
              width: 35,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: 2,
              backgroundColor: "#0ae",
            }}
            alt="中等部"
          >
            中
          </Avatar>
        </Link>
        <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
          <Avatar
            sx={{
              height: 35,
              width: 35,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: 2,
              color: "white",
              backgroundColor: "#006",
              outline: "transparent",
              outlineColor: "navy",
            }}
            alt="高等部"
          >
            高
          </Avatar>
        </Link>
      </>
    );
  }
  if ((availableOn & 0x1) == 0x1) {
    return (
      <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
        <Avatar
          sx={{
            height: 35,
            width: 35,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: 2,
            color: "white",
            backgroundColor: "#006",
            outline: "transparent",
            outlineColor: "navy",
          }}
          alt="高等部"
        >
          高
        </Avatar>
      </Link>
    );
  }
  if ((availableOn & 0x2) == 0x2) {
    return (
      <Link href={`https://n-jr.slack.com/archives/${slack_link}`}>
        <Avatar
          sx={{
            height: 35,
            width: 35,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: 2,
            backgroundColor: "#0ae",
          }}
          alt="中等部"
        >
          中
        </Avatar>
      </Link>
    );
  }
  return undefined;
};
