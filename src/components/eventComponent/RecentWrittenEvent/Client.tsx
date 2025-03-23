import { fetchErrorResponse } from "@/lib/server/error";
import { Stack, Typography, Grid2, Alert, Button } from "@mui/material";
import { use } from "react";
import EventCard from "../EventCard";
import Event from "@/models/Event";

export default function SearchResultsPage({
  searchPromise,
}: {
  searchPromise: Promise<Event[] | fetchErrorResponse>;
}) {
  const events = use(searchPromise);
  if (typeof events === "string") {
    return (
      <Stack>
        <Alert severity="error">
          エラーが発生しました。
          <br />
          {events}
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
        {events && events.length > 0 && (
          <>
            {events.map((event, index) => {
              return (
                <Grid2
                  key={index}
                  size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <EventCard event={event} />
                </Grid2>
              );
            })}
          </>
        )}

        {events && events.length === 0 && (
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
      {events && (
        <Button
          href="/events"
          variant="contained"
          color="primary"
        >
          もっと見る
        </Button>
      )}
    </>
  );
}
