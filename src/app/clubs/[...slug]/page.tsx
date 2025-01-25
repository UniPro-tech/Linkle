import { notFound } from "next/navigation";

import Club from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";
import { SessionProvider } from "next-auth/react";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    switch (slug[1]) {
        case 'edit':
            return <SessionProvider>
                <EditClub id={slug[0]} />
            </SessionProvider>
        case undefined:
            return <Club id={slug[0]} />

        default:
            notFound()
    }
}
