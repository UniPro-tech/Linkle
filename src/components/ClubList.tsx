"use client";
import React, { use } from "react";
import { Typography, Alert, Grid2, Pagination, PaginationItem, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ClubCard from "./ClubCard";
import Club from "@/models/Club";
import { fetchErrorResponse } from "@/lib/server/club";

export default function SearchResultsPage({
  apiBase,
  sessionID,
}: {
  apiBase: string;
  sessionID: string | undefined;
}) {
  const getClubs = async (
    apiBase: string,
    sessionID: string | undefined
  ): Promise<Club[] | fetchErrorResponse> => {
    try {
      const res = await fetch(`${apiBase}/api/clubs`, {
        headers: new Headers({
          cookie: sessionID ?? "",
        }),
      });
      if (res.status == 403) return "forbidden";
      const club = (await res.json()) as Club[];
      if (!club) return "notfound";
      return club;
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const params = useSearchParams();
  const page = params.get("page");
  const clubs = use(getClubs(apiBase, sessionID));
  if (typeof clubs === "string") {
    return (
      <Stack
        flex={1}
        justifyContent="center"
        alignItems="center"
        minHeight={"30vh"}
        spacing={2}
      >
        <Alert severity="error">
          <Typography>
            エラーが発生しました。
            <br />
            {clubs}
          </Typography>
        </Alert>
      </Stack>
    );
  }
  return (
    <Stack
      width={{ xs: "100%", xl: "80%" }}
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
                    />
                  </Grid2>
                );
              }
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
      {clubs && clubs.length > 0 && (
        <Pagination
          page={page ? parseInt(page) : 1}
          count={Math.ceil(clubs.length / 12)}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/clubs?${item.page === 1 ? "" : `&page=${item.page}`}`}
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
