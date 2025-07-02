"use client";

import EventCard from "@/components/eventComponent/EventCard";
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
        管理イベント一覧
      </Typography>
      <EventDashboard
        events={events}
        page={eventPageNum}
      />
    </Stack>
  );
}

function ClubDashboard({ clubs, page }: { clubs: Club[]; page: string | null }) {
  const pageNum = Number(page) || 1;
  const pageSize = 12;
  const pagedClubs = clubs?.slice(pageSize * (pageNum - 1), pageSize * pageNum) || [];
  const pageCount = clubs ? Math.ceil(clubs.length / pageSize) : 1;
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
        {pagedClubs.length > 0 ? (
          pagedClubs.map((club) => (
            <Grid2
              key={club.id}
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
          ))
        ) : (
          <Grid2 size={16}>
            <Alert severity="info">クラブが見つかりませんでした。</Alert>
          </Grid2>
        )}
      </Grid2>
      {pageCount > 1 && (
        <Pagination
          page={pageNum}
          count={pageCount}
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
  const pageNum = Number(page) || 1;
  const pageSize = 12;
  const pagedEvents = events?.slice(pageSize * (pageNum - 1), pageSize * pageNum) || [];
  const pageCount = events ? Math.ceil(events.length / pageSize) : 1;
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
        ここでは、あなたが管理しているイベントを確認できます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/events/create"
      >
        新しいイベントを登録する
      </Button>
      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={16}
        justifyContent="left"
        width="100%"
      >
        {pagedEvents.length > 0 ? (
          pagedEvents.map((event) => (
            <Grid2
              key={event.id}
              size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <EventCard
                event={event}
                isDashboard={true}
              />
            </Grid2>
          ))
        ) : (
          <Grid2 size={16}>
            <Alert severity="info">イベントが見つかりませんでした。</Alert>
          </Grid2>
        )}
      </Grid2>
      {pageCount > 1 && (
        <Pagination
          page={pageNum}
          count={pageCount}
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
