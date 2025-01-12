import ClubSearchForm from "@/components/SearchBox";
import TitleLogo from "@/components/TitleLogo";
import { Box, Stack } from "@mui/material";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ホーム - Linkle",
  description: "N/S高等学校同好会ポータルサイト「Linkle」です。自分の同好会のページをつくって宣伝したり、同好会を検索したりできます！",
};

export default function Home() {
  return (
    <>
      <Stack sx={{ p: 2 }} justifyContent="center" minHeight="100vh" justifyItems="center" alignItems="center">
        <TitleLogo />
        <Box width={2 / 5} sx={{ p: 5 }}>
          <ClubSearchForm />
        </Box>
      </Stack>
    </>);
}
