import searchClubs from "@/libs/searchers/clubs";
import { notFound } from "next/navigation";

import Image from 'next/image';
import { Box, Stack, Typography } from "@mui/material";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    switch (slug[1]) {
        case 'edit':
            return <EditClub />
        case undefined:
            return <Club id={slug[0]} />

        default:
            notFound()
    }
}

async function Club({ id }: { id: string }) {
    const res = await searchClubs({ query: id });
    const club = res.data[0];
    return (
        <>
            <Box position={"relative"} width={"100%"} height={0} paddingBottom={"56.25%"}>
                <Image src={club.image} alt={club.name} width={"5000"} height={0} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                <Stack spacing={1} position={"absolute"} bottom={"15%"} left={0}>
                    <Typography variant="h1" bgcolor={"black"} color="white" p={3} sx={{ opacity: 0.8, fontWeight: 'bold' }}>{club.name}</Typography>
                    {club.available_on == 0 ? null : (
                        <Stack direction={"row"} spacing={1} pl={1}>
                            {availableContents(club.available_on)}
                        </Stack>
                    )}
                    <Typography variant="body1" bgcolor={"black"} color="white" p={3} sx={{ opacity: 0.8 }}>{club.short_description}</Typography>
                </Stack>
            </Box>
        </>
    )
}

const availableContents = (availableOn: number): undefined | React.JSX.Element => {
    if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
        return (
            <>
                <Box
                    component="img"
                    src="/img/jhs.png"
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
                <Box
                    component="img"
                    src="/img/kotobu.png"
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
            </>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Box
                component="img"
                src="/img/kotobu.png"
                sx={{
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Box
                component="img"
                src="/img/jhs.png"
                sx={{
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    return undefined;
}
