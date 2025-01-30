"use client";

import React, { Suspense } from "react";
import {
    Typography,
    CircularProgress,
    Alert,
    Grid2,
    Stack,
    Button,
} from "@mui/material";
import Club from "@/models/Club";
import ClubCard from "./ClubCard";

const SearchResultsPage: React.FC = () => {
    const [searchResult, setSearchResult] = React.useState<Club[] | null>(null);
    const [searchError, setSearchError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setSearchError(null);
            try {
                const result = await fetch("/api/clubs/recent");
                const data = await result.json();
                setSearchResult(data);
            } catch (error: any) {
                setSearchError("検索中にエラーが発生しました。もう一度お試しください。");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const clubs = searchResult?.filter((club) => club.visible == 1);
    return (
        <Stack width={"100%"} spacing={2} justifyContent={"center"} alignItems={"center"} justifyItems={"center"}>
            <Typography variant="h4" style={{ marginTop: "20px" }}>
                最新のクラブ
            </Typography>
            <Grid2
                container
                spacing={{ xs: 2, md: 3 }}
                columns={16}
                p={3}
                justifyContent="center"
                width={"100%"}
            >
                {searchError && (
                    <Grid2 size={16}>
                        <Alert severity="error" style={{ marginTop: "20px" }}>
                            {searchError}
                        </Alert>
                    </Grid2>
                )}
                {loading && (
                    <Grid2 size={16} justifyContent={"center"} alignItems={"center"} justifyItems={"center"}>
                        <CircularProgress />
                    </Grid2>
                )}

                {clubs && clubs.length > 0 && (
                    <>
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
                    </>
                )}

                {clubs && clubs.length === 0 && (
                    <Grid2 size={16}>
                        <Typography
                            style={{ marginTop: "20px", textAlign: "center" }}
                            color="text.primary"
                        >
                            データがありません。
                        </Typography>
                    </Grid2>
                )}
            </Grid2>
            {clubs && (
                <Button href="/clubs" variant="contained" color="primary">
                    もっと見る
                </Button>
            )}
        </Stack>
    );
};

const SearchResultsPageWrapper = () => (
    <Suspense fallback={<CircularProgress />}>
        <SearchResultsPage />
    </Suspense>
);

export default SearchResultsPageWrapper;