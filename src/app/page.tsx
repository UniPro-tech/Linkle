import RecentCreatedClubs from "@/components/RecentCreatedClubs";
import ClubSearchForm from "@/components/search/SearchBox";
import TitleLogo from "@/components/TitleLogo";
import { Box, Stack } from "@mui/material";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "ホーム - Linkle",
  description: "N/S高等学校同好会ポータルサイト「Linkle」です。自分の同好会のページをつくって宣伝したり、同好会を検索したりできます！",
};

export default function Home() {
  return (
    <>
      <Stack p={2} py={5} justifyContent="center" minHeight="100vh" justifyItems="center" alignItems="center" spacing={20}>
        <Stack justifyContent={"center"} alignItems={"center"} width="100%">
          <TitleLogo />
          <Box width={{ xs: "100%", xl: (2 / 5) }} sx={{ p: 5 }}>
            <ClubSearchForm />
          </Box>
        </Stack>
        <RecentCreatedClubs />
      </Stack>
    </>);
}
