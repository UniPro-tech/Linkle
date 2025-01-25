import { notFound } from "next/navigation";

import Club from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    switch (slug[1]) {
        case 'edit':
            return <EditClub id={slug[0]} />
        case undefined:
            return <Club id={slug[0]} />

        default:
            notFound()
    }
}
