"use client";

import React from "react";
import {
    List,
    ListItem,
    Typography,
    CircularProgress,
    Alert,
    ThemeProvider,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import searchClubs, { SearchClubsResponse } from "@/libs/searchers/clubs";
import theme from "@/theme/primary";

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
        <ThemeProvider theme={theme}>
            <div>
                {loading && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <CircularProgress />
                    </div>
                )}
                {searchError && (
                    <Alert severity="error" style={{ marginTop: "20px" }}>
                        {searchError}
                    </Alert>
                )}

                {searchResult && searchResult.data.length > 0 && (
                    <List>
                        {searchResult.data.map((club, index) => (
                            <ListItem key={index}>
                                <Typography variant="h6" color={"text.primary"}>
                                    {club.name}
                                </Typography>
                                <Typography variant="body2" color={"text.primary"}>
                                    {club.short_description}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                )}

                {searchResult && searchResult.data.length === 0 && (
                    <Typography style={{ marginTop: "20px", textAlign: "center" }} color="text.primary">
                        検索結果が見つかりませんでした。
                    </Typography>
                )}
            </div>
        </ThemeProvider>
    );
};

export default SearchResultsPage;