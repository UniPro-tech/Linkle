import { auth } from "@/auth";
import CreateClub from "./createClubComponent";
import { Metadata } from "next";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "同好会を登録 - Linkle",
  description: "同好会を登録します。",
};

export default async function Page() {
  const session = await auth();
  if (!session) unauthorized();
  return <CreateClub />;
}
