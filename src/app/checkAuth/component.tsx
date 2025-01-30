"use client";

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectPath({ redirect: path }: { redirect: string }) {
    const router = useRouter();
    useEffect(() => {
        if (path) {
            router.refresh();
            router.push(path);
        }
    }, [path, router]);
    return (
        <Stack spacing={2} justifyContent={"center"} alignItems={"center"} justifyItems={"center"} minHeight={"100vh"} textAlign={"center"} p={{ xs: 2, lg: 0 }}>
            <Typography variant={"h4"}>認証チェック中...</Typography>
            <Typography variant={"body1"}>あなたが学園生であるかどうかなどをチェックしています。少々お待ちください。</Typography>
        </Stack>
    );
}