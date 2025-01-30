import { auth } from "@/auth";
import SidebarMain from "./sidebar/main";
import { getCurrentUser } from "@/libs/users";

export default async function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();
    const user = await getCurrentUser(session?.user?.email ?? '');
    return (
        <SidebarMain email={session?.user?.email as string}>
            {children}
        </SidebarMain>
    )
}