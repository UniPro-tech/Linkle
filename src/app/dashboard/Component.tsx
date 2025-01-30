"use client";
import ClubCard from "@/components/ClubCard";
import { getMyClub, SearchClubsResponse } from "@/libs/searchers/userClubData";
import { Alert, Button, CircularProgress, Grid2, Link, Pagination, PaginationItem, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const { data: session } = useSession();
    const [searchResult, setSearchResult] = useState<SearchClubsResponse | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!loading) return;
        setSearchError(null);
        const fetchData = async () => {
            try {
                const result = await getMyClub(session?.user?.email as string);
                setSearchResult(result);
            } catch (error: any) {
                setSearchError("検索中にエラーが発生しました。もう一度お試しください。");
            } finally {
                setLoading(false);
            }
        }
        if (session) {
            fetchData();
        }
    }, [session]);
    const clubs = searchResult?.data;
    return (
        <Stack spacing={2} pt={10} p={{xs: 2, xl: 10}} justifyContent={"center"} alignItems={"center"} width={"100%"}>
            <Typography variant="h3">ダッシュボード</Typography>
            <Typography variant="body1">あなたが管理しているクラブの一覧です。</Typography>
            <Button variant="contained" color="primary" href="/clubs/create">新しいクラブを作成</Button>
            <Grid2
                container
                spacing={{ xs: 2, md: 3 }}
                columns={16}
                p={3}
                justifyContent="center"
                width="100%"
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
                                            isDashboard={true}
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
                            href={`/dashbord${item.page === 1 ? '' : `&page=${item.page}`}`}
                            {...item}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                />
            )}
        </Stack>
    )
}