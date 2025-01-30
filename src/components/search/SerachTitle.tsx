"use client";
import { Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function SearchTitle() {
    const params = useSearchParams();
    const query = params.get("query");
    return (
        <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
            {query ? (
                <Typography variant={"h4"}>「{query}」の検索結果</Typography>
            ) : (
                <Typography variant={"h4"}>同好会検索</Typography>
            )}
        </Stack>
    );
}