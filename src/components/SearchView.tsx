"use client";
import React from "react";
import { Controller } from "react-hook-form";
import {
    TextField,
    Button,
    Stack,
    List,
    ListItem,
    Typography,
    CircularProgress,
    Alert,
    ThemeProvider,
} from "@mui/material";
import useSearch from "@/hooks/useSearch";
import searchClubs, { SearchClubsResponse, SearchClubsRequest } from "@/libs/searchers/clubs";
import theme from "@/theme/primary";
import formTheme from "@/theme/form";

interface ClubSearchFormProps {
    defaultValue: SearchClubsResponse;
}

const ClubSearchForm: React.FC<ClubSearchFormProps> = (props) => {
    const { defaultValue } = props;
    const { form, search, results, isLoading, error } = useSearch<
        SearchClubsRequest,
        SearchClubsResponse
    >({ defaultValue: defaultValue, searchServerAction: searchClubs });
    const { control } = form;
    return (
        <ThemeProvider theme={theme}>
            <div>
                <form onSubmit={search}>
                    <ThemeProvider theme={formTheme}>
                        <Stack direction="row" spacing={2} justifyContent={"center"} justifyItems={"center"}>
                            <Controller
                                name="query"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        color="primary"
                                        {...field}
                                        label="同好会名"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                検索
                            </Button>
                        </Stack>
                    </ThemeProvider>
                </form>
                <ThemeProvider theme={theme}>
                    {isLoading && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <CircularProgress />
                        </div>
                    )}
                    {error && (
                        <Alert severity="error" style={{ marginTop: "20px" }}>
                            error
                        </Alert>
                    )}

                    {!isLoading && results && results.data.length > 0 && (
                        <List>
                            {results.data.map((club, index) => (
                                <ListItem key={index}>
                                    <Typography variant="h6" color={"text.primary"}>{club.name}</Typography>
                                    <Typography variant="body2" color={"text.primary"}>{club.short_description}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </ThemeProvider>
            </div>
        </ThemeProvider>
    );
};

export default ClubSearchForm;

