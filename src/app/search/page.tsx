import SearchBox from "@/components/SearchBox";
import SearchResultsPage from "@/components/SearchView";
import { SearchClubsResponse } from "@/libs/searchers/clubs";
import { Box } from "@mui/material";

export default function Home() {
  const res: SearchClubsResponse = { status: "200", data: [] };
  return (
    <>
      <Box sx={{ p: 2 }} >
        <SearchBox />
        <SearchResultsPage />
      </Box>
    </>);
}
