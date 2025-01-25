import { getClubById } from "@/libs/searchers/clubs";
import ClubType from "@/models/Club";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import Image from 'next/image';

import 'katex/dist/katex.min.css';
import Link from "next/link";
import { forbidden, notFound } from "next/navigation";
import { LongDescription } from "./md";
import { auth } from "@/auth";
import { isOwner } from "@/libs/searchers/userClubData";

export default async function Club({ id }: { id: string }) {
    const session = await auth();
    const isOwn = await isOwner(session?.user?.email ?? "", id);
    const res = await getClubById(id);
    const club = res.data[0];
    console.log(club);
    if (!club) notFound();
    if (!isOwn && !(club.visible == 1)) forbidden();
    return (
        <>
            <KeyVisual club={club} />
            <LongDescription description={club.long_description} />
        </>
    )
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
                    <Avatar
                        sx={{
                            height: 35,
                            width: 35,
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: 2,
                            backgroundColor: '#0ae',
                        }}
                        alt="中等部"
                    >
                        中
                    </Avatar>
                </Link>
                <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
                    <Avatar
                        sx={{
                            height: 35,
                            width: 35,
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: 2,
                            color: 'white',
                            backgroundColor: '#006',
                            outline: 'transparent',
                            outlineColor: 'navy',
                        }}
                        alt="高等部"
                    >
                        高
                    </Avatar>
                </Link>
            </>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Link href={`https://n-highschool.slack.com/archives/${slack_link}`}>
                <Avatar
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                        color: 'white',
                        backgroundColor: '#006',
                        outline: 'transparent',
                        outlineColor: 'navy',
                    }}
                    alt="高等部"
                >
                    高
                </Avatar>
            </Link >
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Link href={`https://n-jr.slack.com/archives/${slack_link}`}>
                <Avatar
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                        backgroundColor: '#0ae',
                    }}
                    alt="中等部"
                >
                    中
                </Avatar>
            </Link>
        );
    }
    return undefined;
}
