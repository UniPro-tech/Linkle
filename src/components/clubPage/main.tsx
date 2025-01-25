import searchClubs from "@/libs/searchers/clubs";
import ClubType from "@/models/Club";
import { Box, Stack, Typography } from "@mui/material";
import Image from 'next/image';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Club({ id }: { id: string }) {
    const res = await searchClubs({ query: id });
    const club = res.data[0];
    if (!club) notFound();
    return (
        <>
            <KeyVisual club={club} />
            <LongDescription description={club.long_description} />
        </>
    )
}

async function LongDescription({ description }: { description: string }) {
    return (
        <Stack flex={1} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} justifyItems={"center"} p={2}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} className={"markdown"}>{description}</ReactMarkdown>
        </Stack>
    );
}

async function KeyVisual({ club }: { club: ClubType }) {
    return (
        <Box position={"relative"} width={"100%"} height={0} paddingBottom={"56.25%"} overflow={"hidden"}>
            <Image src={club.image || "/img/noClubImage.jpg"} alt={club.name} width={"5000"} height={0} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            <Stack spacing={1} position={"absolute"} bottom={"15%"} left={0}>
                <Typography variant="h1" bgcolor={"black"} color="white" p={3} sx={{ opacity: 0.8, fontWeight: 'bold' }}>{club.name}</Typography>
                {club.available_on == 0 ? null : (
                    <Stack direction={"row"} spacing={1} pl={1}>
                        {availableContents(club.available_on, club.slack_link)}
                    </Stack>
                )}
                <Typography variant="body1" bgcolor={"black"} color="white" p={3} sx={{ opacity: 0.8 }}>{club.short_description}</Typography>
            </Stack>
        </Box>
    );
}

/**
 * Returns a JSX element containing images based on the `availableOn` bitmask.
 *
 * @param availableOn - A bitmask indicating which images to display.
 *                      - If both the first and second bits are set (0x1 and 0x2), both images are displayed.
 *                      - If only the first bit is set (0x1), the "kotobu.png" image is displayed.
 *                      - If only the second bit is set (0x2), the "jhs.png" image is displayed.
 *                      - If neither bit is set, `undefined` is returned.
 *
 * @returns A JSX element containing the appropriate images or `undefined` if no images should be displayed.
 */
export const availableContents = (availableOn: number, slack_link: string): undefined | React.JSX.Element => {
    if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
        return (
            <>
                <Link href={`https://n-jr.slack.com/archives/${slack_link}`}>
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
                </Link>
                <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
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
                </Link>
            </>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
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
            </Link >
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Link href={`https://n-jr.slack.com/archives/${slack_link}`}>
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
            </Link>
        );
    }
    return undefined;
}
