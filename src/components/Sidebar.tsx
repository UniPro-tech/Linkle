import { auth } from "@/auth";
import SidebarMain from "./Sidebar/main";
import { getCurrentUser } from "@/libs/users";

export default async function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();
    const user = await getCurrentUser(session?.user?.email ?? '');
    console.log('user', user);
    return (
        <SidebarMain slack_name={user?.slack_name ?? (session?.user?.name ?? session?.user?.email)} notUser={!user && !(session == null || session == undefined)}>
            {children}
        </SidebarMain>
    )
}