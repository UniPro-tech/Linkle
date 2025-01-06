import ClubSearchForm from "@/components/SearchBox";
import TitleLogo from "@/components/TitleLogo";
import { Box, Stack } from "@mui/material";

export default function Home() {
  return (
    <>
      <Stack sx={{ p: 2 }} justifyContent="center" alignItems="center">
        <TitleLogo />
        <Box width={2 / 5} sx={{ p: 5 }}>
          <ClubSearchForm />
        </Box>
      </Stack>
    </>);
}
