import { SessionProvider } from "next-auth/react";
import RegisterComponet from "./Component";
import { Metadata } from "next";

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
    return (
        <SessionProvider>
            <RegisterComponet redirectURL={redirect ?? "/"} />
        </SessionProvider>
    )
}