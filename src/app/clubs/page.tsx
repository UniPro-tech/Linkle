import ClubList from "@/components/ClubList";
import ClubSearchForm from "@/components/search/SearchBox";
import { Box, Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "同好会一覧 - Linkle",
    description: "Linkleに登録されている同好会一覧です。",
};

export default async function Home() {
    return (
        <Stack px={{ xs: 2, lg: 0 }} py={10} justifyContent="center" alignItems="center" justifyItems={"center"} spacing={5} minHeight={"100vh"}>
            <Typography variant="h4" gutterBottom mt={5}>
                同好会一覧
            </Typography>
            <Typography variant="body1" gutterBottom>
                Linkleに登録されている同好会一覧です。
            </Typography>
            <Box width={{ xs: "100%", lg: (2 / 5) }} p={5}>
                <ClubSearchForm />
            </Box>
            <ClubList />
        </Stack>
    );
}
