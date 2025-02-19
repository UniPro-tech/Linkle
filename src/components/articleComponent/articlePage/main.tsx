import { Alert, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import "katex/dist/katex.min.css";
import { LongDescription } from "@/components/md";
import { use } from "react";
import { forbidden, notFound, unauthorized } from "next/navigation";
import UpdateMetadata from "@/components/TitleChange";
import { Metadata } from "next";
import { getArticleById } from "@/lib/server/article";
import Article from "@/models/Article";

export default function ArticlePage({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const article = use(getArticleById(id, apiBase, sessionID));
  if (article == "forbidden") forbidden();
  if (article == "notfound") notFound();
  if (article == "unauthorized") unauthorized();
  return (
    <>
      <UpdateMetadata
        metadata={
          {
            title: `${article.title}`,
            description: `${article.description}`,
            openGraph: {
              title: `${article.title}`,
              description: `${article.description}`,
              type: "website",
              url: `${process.env.DB_API_ENDPOINT}/articles/${id}`,
              images: article.image ?? undefined,
              siteName: "同好会ポータル Linkle",
            },
            twitter: {
              card: "summary_large_image",
              site: "@UniPro_digital",
              title: `${article.title}`,
              description: `${article.description}`,
              images: article.image ?? undefined,
            },
          } as Metadata
        }
      />
      {typeof article == "string" && (
        <Typography>
          {
            <Alert
              severity="error"
              style={{ marginTop: "20px" }}
            >
              {article == "forbidden"
                ? "権限がありません。"
                : article == "notfound"
                ? "記事が見つかりませんでした。"
                : `エラーが発生しました。\n${article}`}
            </Alert>
          }
        </Typography>
      )}
      {!(typeof article == "string") && (
        <>
          <KeyVisual
            article={article}
            imageUrl={article.image}
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
              description={article.main_text == "" ? "# 説明はありません。" : article.main_text}
            />
          </Stack>
        </>
      )}
    </>
  );
}

function KeyVisual({
  article,
  imageUrl,
}: {
  article: Article;
  imageUrl: string | undefined | null;
}) {
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
        alt={article.title}
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
          {article.title}
        </Typography>
        <Typography
          variant="body1"
          bgcolor={"black"}
          color="white"
          p={{ xs: 1, lg: 3 }}
          sx={{ opacity: 0.8 }}
        >
          {article.description}
        </Typography>
      </Stack>
    </Box>
  );
}
