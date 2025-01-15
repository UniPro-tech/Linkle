import { auth } from "@/auth";
import SidebarMain from "./Sidebar/main";
import { getCurrentUser } from "@/libs/users";

export default async function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();
    const user = await getCurrentUser(session?.user?.email ?? '');
    return (
        <SidebarMain slack_name={user.slack_name}>
            {children}
        </SidebarMain>
    )
}