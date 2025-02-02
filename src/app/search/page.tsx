import ClubSearchForm from "@/components/search/SearchBox";
import SearchResultsPage from "@/components/search/SearchView";
import SearchTitle from "@/components/search/SerachTitle";
import { Box, Stack } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "クラブ検索 - Linkle",
  description: "Linkleのクラブ検索ページです。",
};

export default function Home() {
  return (
    <>
      <Stack
        px={{ xs: 2, lg: 0 }}
        py={10}
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <SearchTitle />
        <Box
          width={{ xs: "100%", lg: 2 / 5 }}
          sx={{ p: 5 }}
        >
          <ClubSearchForm />
        </Box>
        <SearchResultsPage />
      </Stack>
    </>
  );
}
