import { auth } from "@/auth";
import SidebarMain from "./Sidebar/main";
import { getCurrentUser } from "@/libs/users";

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