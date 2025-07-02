"use client";

import React, { use } from "react";
import { Typography, Alert, Grid2, Pagination, PaginationItem, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ClubCard from "./ClubCard";
import Club from "@/models/Club";

const ClubList = ({ fetchData }: { fetchData: Promise<Club[] | string> }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const clubs = use(fetchData);

  // エラー時
  if (typeof clubs === "string") {
    return (
      <Stack
        width={"100%"}
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Alert severity="error">{clubs}</Alert>
      </Stack>
    );
  }

  // ページング処理
  const pageSize = 12;
  const pagedClubs = clubs?.slice(pageSize * (page - 1), pageSize * page) || [];
  const pageCount = clubs ? Math.ceil(clubs.length / pageSize) : 1;

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
              />
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
};

export default ClubList;
