import { fetchErrorResponse } from "@/lib/server/error";
import { Stack, Typography, Grid2, Alert, Button } from "@mui/material";
import { use } from "react";
import ArticleCard from "../ArticleCard";
import Article from "@/models/Article";

export default function SearchResultsPage({
  searchPromise,
}: {
  searchPromise: Promise<Article[] | fetchErrorResponse>;
}) {
  const articles = use(searchPromise);
  if (typeof articles === "string") {
    return (
      <Stack>
        <Alert severity="error">
          エラーが発生しました。
          <br />
          {articles}
        </Alert>
      </Stack>
    );
  }
  return (
    <>
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
              return (
                <Grid2
                  key={index}
                  size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ArticleCard article={article} />
                </Grid2>
              );
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
      {articles && (
        <Button
          href="/articles"
          variant="contained"
          color="primary"
        >
          もっと見る
        </Button>
      )}
    </>
  );
}
