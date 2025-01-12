"use client";

import React, { Suspense } from "react";
import {
    Typography,
    CircularProgress,
    Alert,
    Grid2,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import searchClubs, { SearchClubsResponse } from "@/libs/searchers/clubs";
import theme from "@/theme/primary";
import ClubCard from "./ClubCard";

const SearchResultsPage: React.FC = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [searchResult, setSearchResult] = React.useState<SearchClubsResponse | null>(null);
    const [searchError, setSearchError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            if (query) {
                setLoading(true);
                setSearchError(null);
                try {
                    const result = await searchClubs({ query });
                    setSearchResult(result);
                } catch (error: any) {
                    setSearchError("検索中にエラーが発生しました。もう一度お試しください。");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [query]);

    return (
        <Grid2
            container
            spacing={{ xs: 2, md: 3 }}
            columns={16}
            p={3}
            justifyContent="center"
            maxWidth={320 * 4.3}
        >
            {searchError && (
                <Grid2 size={16}>
                    <Alert severity="error" style={{ marginTop: "20px" }}>
                        {searchError}
                    </Alert>
                </Grid2>
            )}

            {searchResult && searchResult.data.length > 0 && (
                searchResult.data.map((club, index) => (
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
                        />
                    </Grid2>
                ))
            )}

            {searchResult && searchResult.data.length === 0 && (
                <Grid2 size={16}>
                    <Typography
                        style={{ marginTop: "20px", textAlign: "center" }}
                        color="text.primary"
                    >
                        検索結果が見つかりませんでした。
                    </Typography>
                </Grid2>
            )}
        </Grid2>
    );
};

const SearchResultsPageWrapper = () => (
    <Suspense fallback={<CircularProgress />}>
        <SearchResultsPage />
    </Suspense>
);

export default SearchResultsPageWrapper;