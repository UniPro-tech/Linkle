import { getClubById } from "@/lib/server/club";
import { forbidden, notFound } from "next/navigation";
import { use } from "react";
import ClubEdit from "./editComponent";

export default function EditClub({ id }: { id: string }) {
  const club = use(getClubById(id));
  if (typeof club == "string") {
    switch (club) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
    }
  }
  return <ClubEdit club={club} />;
}
