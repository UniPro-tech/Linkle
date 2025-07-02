"use client";

import React, { use } from "react";
import { Typography, Alert, Grid2, Pagination, PaginationItem, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EventCard from "./EventCard";
import Event from "@/models/Event";

const EventList = ({ fetchData }: { fetchData: Promise<Event[] | string> }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const events = use(fetchData);

  if (typeof events === "string") {
    return (
      <Stack
        width={"100%"}
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Alert severity="error">{events}</Alert>
      </Stack>
    );
  }

  const pageSize = 12;
  const pagedEvents = events?.slice(pageSize * (page - 1), pageSize * page) || [];
  const pageCount = events ? Math.ceil(events.length / pageSize) : 1;

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
        {pagedEvents.length > 0 ? (
          pagedEvents.map((event) => (
            <Grid2
              key={event.id}
              size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <EventCard event={event} />
            </Grid2>
          ))
        ) : (
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
      {pageCount > 1 && (
        <Pagination
          page={page}
          count={pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/events?${item.page === 1 ? "" : `&page=${item.page}`}`}
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

export default EventList;
