"use client";

import ArticleCard from "@/components/eventComponent/EventCard";
import ClubCard from "@/components/clubComponent/ClubCard";
import Event from "@/models/Event";
import Club from "@/models/Club";
import { Stack, Typography, Button, Grid2, Pagination, PaginationItem, Alert } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DashboardContent({ clubs, events }: { clubs: Club[]; events: Event[] }) {
  const searchParams = useSearchParams();
  const clubPageNum = searchParams.get("clubpage");
  const eventPageNum = searchParams.get("eventpage");
  return (
    <Stack
      spacing={2}
      py={10}
      px={{ xs: 2, lg: 10 }}
      justifyContent={"center"}
      justifyItems={"left"}
      alignItems={"start"}
      width={"100%"}
    >
      <Typography
        variant="h3"
        width={"100%"}
      >
        ダッシュボード
      </Typography>
      <Typography
        variant="h4"
        width={"100%"}
        px={2}
      >
        管理クラブ一覧
      </Typography>
      <ClubDashboard
        clubs={clubs}
        page={clubPageNum}
      />
      <Typography
        variant="h4"
        width={"100%"}
        px={2}
      >
        管理記事一覧
      </Typography>
      <EventDashboard
        events={events}
        page={eventPageNum}
      />
    </Stack>
  );
}

function ClubDashboard({ clubs, page }: { clubs: Club[]; page: string | null }) {
  return (
    <Stack
      spacing={2}
      py={2}
      px={4}
      justifyContent={"center"}
      justifyItems={"left"}
      alignItems={"start"}
      width={"100%"}
    >
      <Typography
        variant="body1"
        width={"100%"}
      >
        ここでは、あなたが管理しているクラブを確認できます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/clubs/create"
      >
        新しいクラブを作成
      </Button>
      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={16}
        justifyContent="left"
        width="100%"
      >
        {clubs && clubs.length > 0 && (
          <>
            {clubs.map((club, index) => {
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
                    <ClubCard
                      name={club.name}
                      description={club.short_description}
                      imageUrl={club.image}
                      availableOn={club.available_on}
                      id={club.id}
                      isDashboard={true}
                    />
                  </Grid2>
                );
              }
            })}
          </>
        )}

        {clubs && clubs.length === 0 && (
          <Grid2 size={16}>
            <Alert severity="info">クラブが見つかりませんでした。</Alert>
          </Grid2>
        )}
      </Grid2>
      {clubs && clubs.length > 0 && (
        <Pagination
          page={page ? parseInt(page) : 1}
          count={Math.ceil(clubs.length / 12)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/dashboard${item.page === 1 ? "" : `&clubpage=${item.page}`}`}
              {...item}
              color="primary"
              variant="outlined"
            />
          )}
        />
      )}
    </Stack>
  );
}

function EventDashboard({ events, page }: { events: Event[]; page: string | null }) {
  return (
    <Stack
      spacing={2}
      py={2}
      px={4}
      justifyContent={"center"}
      justifyItems={"left"}
      alignItems={"start"}
      width={"100%"}
    >
      <Typography
        variant="body1"
        width={"100%"}
      >
        ここでは、あなたが管理している記事を確認できます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/clubs/create"
      >
        新しい記事を書く
      </Button>
      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={16}
        justifyContent="left"
        width="100%"
      >
        {events && events.length > 0 && (
          <>
            {events.map((event, index) => {
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
                    <ArticleCard
                      event={event}
                      isDashboard={true}
                    />
                  </Grid2>
                );
              }
            })}
          </>
        )}

        {events && events.length === 0 && (
          <Grid2 size={16}>
            <Alert severity="info">クラブが見つかりませんでした。</Alert>
          </Grid2>
        )}
      </Grid2>
      {events && events.length > 0 && (
        <Pagination
          page={page ? parseInt(page) : 1}
          count={Math.ceil(events.length / 12)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/dashboard${item.page === 1 ? "" : `&page=${item.page}`}`}
              {...item}
              color="primary"
              variant="outlined"
            />
          )}
        />
      )}
    </Stack>
  );
}
