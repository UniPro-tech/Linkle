import ClubSearchForm from "@/components/search/SearchBox";
import SearchResultsPage from "@/components/search/SearchView";
import { SearchClubsResponse } from "@/libs/searchers/clubs";
import { Box, Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "クラブ検索 - Linkle",
  description: "Linkleのクラブ検索ページです。",
}

export default function Home() {
  const res: SearchClubsResponse = { status: "200", data: [] };
  return (
    <>
      <Stack sx={{ p: 2 }} flex={1} justifyContent="center" alignItems="center">

        <Box width={{ xs: "100%", xl: (2 / 5) }} sx={{ p: 5 }}>
          <ClubSearchForm />
        </Box>
        <SearchResultsPage />
      </Stack>
    </>);
}
