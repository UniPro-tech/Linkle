"use client";

import React, { use } from "react";
import { Typography, Alert, Grid2, Pagination, PaginationItem, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ClubCard from "../clubComponent/ClubCard";
import Club from "@/models/Club";
import Event from "@/models/Event";
import EventCard from "../eventComponent/EventCard";

const SearchResultsPage = ({
  promise,
  query,
}: {
  promise: Promise<Club[] | Event[] | string>;
  query: string;
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const result = use(promise);

  if (result instanceof Error) {
    return (
      <Alert
        severity="error"
        style={{ marginTop: "20px" }}
      >
        {result.message}
      </Alert>
    );
  }

  if (typeof result === "string") {
    return (
      <Typography
        style={{ marginTop: "20px" }}
        color="text.primary"
      >
        {result}
      </Typography>
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
        {result &&
          result.length > 0 &&
          ("start_at" in result[0] ? (
            <>
              {(result as Event[]).map((event, index) => {
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
                      <EventCard event={event} />
                    </Grid2>
                  );
                }
              })}
            </>
          ) : (
            <>
              {(result as Club[]).map((club, index) => {
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
                      />
                    </Grid2>
                  );
                }
              })}
            </>
          ))}

        {result && result.length === 0 && (
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
      {result && result.length > 0 && (
        <Pagination
          page={page ? parseInt(page) : 1}
          count={Math.ceil(result.length / 12)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/search?query=${query}${item.page === 1 ? "" : `&page=${item.page}`}`}
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

export default SearchResultsPage;
