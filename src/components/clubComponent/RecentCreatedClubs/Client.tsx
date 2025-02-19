import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { Stack, Typography, Grid2, Alert, Button } from "@mui/material";
import { use } from "react";
import ClubCard from "../ClubCard";

export default function SearchResultsPage({
  searchPromise,
}: {
  searchPromise: Promise<Club[] | fetchErrorResponse>;
}) {
  const clubs = use(searchPromise);
  if (typeof clubs === "string") {
    return (
      <Stack>
        <Alert severity="error">
          エラーが発生しました。
          <br />
          {clubs}
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
        {clubs && clubs.length > 0 && (
          <>
            {clubs.map((club, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ClubCard
                    name={club.name}
                    description={club.short_description}
                    imageUrl={club.image}
                    availableOn={club.available_on}
                    id={club.id}
                  />
                </Grid2>
              );
            })}
          </>
        )}

        {clubs && clubs.length === 0 && (
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
      {clubs && (
        <Button
          href="/clubs"
          variant="contained"
          color="primary"
        >
          もっと見る
        </Button>
      )}
    </>
  );
}
