import ClubList from "@/components/ClubList";
import ClubSearchForm from "@/components/SearchBox";
import { Box, Stack, Typography } from "@mui/material";

export default function Home() {
    return (
        <Stack sx={{ p: 2 }} justifyContent="center" alignItems="center" justifyItems={"center"} spacing={5} minHeight={"100vh"}>
            <Typography variant="h4" gutterBottom mt={5}>
                同好会一覧
            </Typography>
            <Typography variant="body1" gutterBottom>
                Linkleに登録されている同公開一覧です。
            </Typography>
            <Box width={{ xs: "100%", xl: (2 / 5) }} p={5}>
                <ClubSearchForm />
            </Box>
            <ClubList />
        </Stack>
    );
}
