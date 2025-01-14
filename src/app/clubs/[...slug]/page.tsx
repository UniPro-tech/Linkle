import { notFound } from "next/navigation";

import Club from "@/components/clubPage/main";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    switch (slug[1]) {
        case 'edit':
            return <EditClub />
        case undefined:
            return <Club id={slug[0]} />

        default:
            notFound()
    }
}
