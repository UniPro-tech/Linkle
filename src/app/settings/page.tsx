import { SessionProvider } from "next-auth/react";
import Settings from "./component";
import { auth } from "@/auth";

export default async function Page() {
    const endpoint = process.env.DB_API_ENDPOINT;
    const session = await auth();
    const res = await fetch(`${endpoint}/users?search=${session?.user?.email}`);
    const data = await res.json();
    const name = data.records[0].slack_name;
    return (
        <SessionProvider>
            <Settings name={name} />
        </SessionProvider>
    );
}