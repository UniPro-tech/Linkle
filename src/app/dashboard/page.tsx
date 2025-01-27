import { SessionProvider } from "next-auth/react";
import Dashboard from "./Component";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ダッシュボード - Linkle",
    description: "Linkleのダッシュボードです。",
}

export default function Page() {
    return (
        <SessionProvider>
            <Dashboard />
        </SessionProvider>
    )
}