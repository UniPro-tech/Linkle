import { SessionProvider } from "next-auth/react";
import RegisterComponet from "./Component";

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