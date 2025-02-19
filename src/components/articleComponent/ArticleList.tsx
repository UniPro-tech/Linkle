"use client";

import React, { use } from "react";
import { Typography, Alert, Grid2, Pagination, PaginationItem, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import Article from "@/models/Article";

const ArticleList = ({ fetchData }: { fetchData: Promise<Article[] | string> }) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const articles = use(fetchData);

  if (typeof articles === "string") {
    return (
      <Stack
        width={"100%"}
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Alert severity="error">{articles}</Alert>
      </Stack>
    );
  }

  return (
    <Stack
      width={"100%"}
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      justifyItems={"center"}
    >
      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={16}
        p={3}
        justifyContent="center"
        width={"100%"}
      >
        {articles && articles.length > 0 && (
          <>
            {articles.map((article, index) => {
              if (
                index < 12 * (page ? parseInt(page) : 1) &&
                index >= 12 * (page ? parseInt(page) - 1 : 0)
              ) {
                return (
                  <Grid2
                    key={index}
                    size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <ArticleCard article={article} />
                  </Grid2>
                );
              }
            })}
          </>
        )}

        {articles && articles.length === 0 && (
          <Grid2 size={16}>
            <Typography
              style={{ marginTop: "20px", textAlign: "center" }}
              color="text.primary"
            >
              データがありません。
            </Typography>
          </Grid2>
        )}
      </Grid2>
      {articles && articles.length > 0 && (
        <Pagination
          page={page ? parseInt(page) : 1}
          count={Math.ceil(articles.length / 12)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/articles?${item.page === 1 ? "" : `&page=${item.page}`}`}
              {...item}
              color="primary"
              variant="outlined"
            />
          )}
        />
      )}
    </Stack>
  );
};

export default ArticleList;
