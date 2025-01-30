import { SessionProvider } from "next-auth/react";
import RegisterComponet from "./Component";
import { Metadata } from "next";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
    title: "登録 - Linkle",
    description: "Linkleに登録します。",
}

export default async function Register(
    props: {
        searchParams: Promise<{ redirect?: string }>;
    }
) {
    const { redirect } = await props.searchParams;
    const session = await auth();
    if (!session) unauthorized();

    return (
        <SessionProvider session={session}>
            <RegisterComponet redirectURL={redirect ?? "/"} />
        </SessionProvider>
    )
}