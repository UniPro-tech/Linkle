import { auth } from "@/auth";
import SidebarMain from "@/components/sidebar/main";
import { SessionProvider } from "next-auth/react";

export default async function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <SidebarMain email={session?.user?.email as string}>
                {children}
            </SidebarMain>
        </SessionProvider>
    )
}