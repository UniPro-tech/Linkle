import { Link, Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 Forbidden - Linkle",
  description: "You do not have permission to access this page.",
};

export default async function forbidden() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}
      textAlign="center"
    >
      <Typography variant="h1">403</Typography>
      <Typography variant="h5">Forbidden</Typography>
      <Typography>You do not have permission to access this page.</Typography>
      <Link href="/">Go back to the HOME</Link>
    </Stack>
  );
}
