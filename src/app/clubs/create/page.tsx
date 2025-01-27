import CreateClub from "./createClubComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "同好会を登録 - Linkle",
    description: "同好会を登録します。",
}

export default async function Page() {
    return <CreateClub />
}