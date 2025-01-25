import Club from "@/models/Club";
import { Grid2, Stack, ThemeProvider, Typography } from "@mui/material";
import ClubCard from "./ClubCard";
import primary from "@/theme/primary";

const endpoint = process.env.DB_API_ENDPOINT;

export default async function RecentCreatedClubs() {
    const response = await fetch(`${endpoint}/clubs?size=8&order=created_at&filter1=visible,eq,1`);
    const resultRaw = await response.json();
    const result = resultRaw.records as Club[];
    const clubs = await result.filter((club) => club.visible == 1);
    return (
        <>
            <ThemeProvider theme={primary}>
                <Stack width="100%" justifyContent="center" alignItems="center" spacing={2}>
                    <Typography variant="h4" color="text.primary" m={2}>最近作成された同好会</Typography>
                    {clubs.map((club, index) => {
                        return (
                            <Grid2
                                key={index}
                                size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                                style={{ display: 'flex', justifyContent: 'center' }}
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
                    })}
                    {clubs.length === 0 ? (
                        <Typography variant="h6" color="text.primary">データがありません。</Typography>
                    ) : null}
                </Stack>
            </ThemeProvider>
        </>
    );
}