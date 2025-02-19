import { getClubById } from "@/lib/server/club";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import ClubEdit from "./editComponent";

export default function EditClub({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const club = use(getClubById(id, apiBase, sessionID));
  if (typeof club == "string") {
    switch (club) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
      case "unauthorized":
        unauthorized();
    }
  }
  if (!club.owner) {
    forbidden();
  }
  return <ClubEdit club={club} />;
}
