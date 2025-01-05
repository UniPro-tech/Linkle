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
} from "@mui/material";
import useSearch from "@/hooks/useSearch";
import searchClubs, { SearchClubsResponse, SearchClubsRequest } from "@/libs/searchers/clubs";

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
        <div>
            <form onSubmit={search}>
                <Stack direction="row" spacing={2}>
                    <Controller
                        name="query"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
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
            </form>
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
                            <Typography variant="h6">{club.name}</Typography>
                            <Typography variant="body2">{club.short_description}</Typography>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default ClubSearchForm;

