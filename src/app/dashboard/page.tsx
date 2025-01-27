import { SessionProvider } from "next-auth/react";
import Dashboard from "./Component";

export default function Page() {
    return (
        <SessionProvider>
            <Dashboard />
        </SessionProvider>
    )
}