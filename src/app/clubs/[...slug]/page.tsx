import { notFound, unauthorized } from "next/navigation";

import Club from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    switch (slug[1]) {
        case 'edit':
            const session = await auth();
            if (!session) return unauthorized();
            return <SessionProvider session={session}>
                <EditClub id={slug[0]} />
            </SessionProvider>
        case undefined:
            return <Club id={slug[0]} />
        default:
            notFound()
    }
}
