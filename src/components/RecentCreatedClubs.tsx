import Club from "@/models/Club";
import { Button, Grid2, Stack, ThemeProvider, Typography } from "@mui/material";
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
                <Stack width="100%" justifyContent="center" alignItems="center" spacing={5} >
                    <Typography variant="h4" color="text.primary">最近作成された同好会</Typography>
                    <Grid2
                        size={{ xs: 16, sm: 8, md: 4, lg: 4 }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        {clubs.map((club, index) => {
                            return (
                                <>
                                    <ClubCard
                                        name={club.name}
                                        description={club.short_description}
                                        imageUrl={club.image}
                                        availableOn={club.available_on}
                                        id={club.id}
                                    />
                                </>
                            );
                        })}
                    </Grid2>
                    <Button href="/clubs" variant="contained" color="primary">もっと見る</Button>
                    {clubs.length === 0 ? (
                        <Typography variant="h6" color="text.primary">データがありません。</Typography>
                    ) : null}
                </Stack>
            </ThemeProvider>
        </>
    );
}