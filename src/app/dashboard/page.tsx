import Dashboard from "./Component";
import { Metadata } from "next";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Typography, CircularProgress, Stack } from "@mui/material";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "ダッシュボード - Linkle",
  description: "Linkleのダッシュボードです。",
};

export default async function Page() {
  const session = await auth();
  if (!session) unauthorized();
  const headersData = await headers();
  const host = headersData.get("host") || "";
  // protocol判定を分かりやすく
  const protoHeader = headersData.get("x-forwarded-proto");
  const protocol = protoHeader ? protoHeader : host.startsWith("localhost") ? "http" : "https";
  // cookie取得もスッキリ
  const cookieHeader = headersData.get("cookie") || "";
  const cookie =
    cookieHeader.split(";").find((c) => c.trim().startsWith("authjs.session-token=")) ||
    cookieHeader.split(";").find((c) => c.trim().startsWith("__Secure-authjs.session-token="));
  if (!cookie) unauthorized();
  const apiBase = `${protocol}://${host}`;
  return (
    <Suspense
      fallback={
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          minHeight={"100vh"}
          spacing={2}
        >
          <Typography>Loading...</Typography>
          <CircularProgress />
        </Stack>
      }
    >
      <Dashboard
        apiBase={apiBase}
        cookie={cookie}
        email={session?.user?.email as string}
      />
    </Suspense>
  );
}
