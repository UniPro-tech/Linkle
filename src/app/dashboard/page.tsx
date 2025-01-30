import { SessionProvider } from "next-auth/react";
import Dashboard from "./Component";
import { Metadata } from "next";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
    title: "ダッシュボード - Linkle",
    description: "Linkleのダッシュボードです。",
}

export default async function Page() {
    const session = await auth();
    if (!session) unauthorized();
    return (
        <SessionProvider session={session}>
            <Dashboard />
        </SessionProvider>
    )
}