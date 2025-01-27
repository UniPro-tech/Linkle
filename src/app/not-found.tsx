import { Link, Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 Not Found - Linkle",
    description: "The page you are looking for does not exist.",
}

export default async function forbidden() {
    return (
        <Stack spacing={2} alignItems="center" justifyContent="center" minHeight={"100vh"} textAlign="center">
            <Typography variant="h1">404</Typography>
            <Typography variant="h5">Not Found</Typography>
            <Typography>
                The page you are looking for does not exist.
            </Typography>
            <Link href="/">Go back to the HOME</Link>
        </Stack>
    );
}