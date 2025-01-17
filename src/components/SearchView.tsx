"use client";

import React, { Suspense } from "react";
import {
    Typography,
    CircularProgress,
    Alert,
    Grid2,
    Pagination,
    PaginationItem,
    Stack,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import searchClubs, { SearchClubsResponse } from "@/libs/searchers/clubs";
import ClubCard from "./ClubCard";

const SearchResultsPage: React.FC = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || null;
    const page = searchParams.get("page");

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
            } else setSearchError("queryが指定されていません。");
        };
        fetchData();
    }, [query]);
    const clubs = searchResult?.data.filter((club) => club.visible == true);
    return (
        <Stack spacing={2} justifyContent={"center"} alignItems={"center"} justifyItems={"center"}>
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
                {loading && (
                    <Grid2 size={16}>
                        <CircularProgress />
                    </Grid2>
                )}

                {clubs && clubs.length > 0 && (
                    <>
                        {clubs.map((club, index) => {
                            if (index < 12 * (page ? parseInt(page) : 1) && index >= 12 * (page ? parseInt(page) - 1 : 0)) {
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
                            }
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
            {clubs && clubs.length > 0 && (
                <Pagination
                    page={page ? parseInt(page) : 1}
                    count={Math.ceil(clubs.length / 12)}
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            href={`/search?query=${query}${item.page === 1 ? '' : `&page=${item.page}`}`}
                            {...item}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                />
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