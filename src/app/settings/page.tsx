import { SessionProvider } from "next-auth/react";
import Settings from "./component";
import { auth } from "@/auth";
import { Metadata } from "next";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
    title: "設定 - Linkle",
    description: "Linkleの設定ページです。",
}

export default async function Page() {
    const endpoint = process.env.DB_API_ENDPOINT;
    const session = await auth();
    if (!session) unauthorized();
    const res = await fetch(`${endpoint}/users?search=${session?.user?.email}`);
    const data = await res.json();
    const name = data.records[0].slack_name;
    return (
        <SessionProvider session={session}>
            <Settings name={name} />
        </SessionProvider>
    );
}