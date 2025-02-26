import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import EventEdit from "./editComponent";
import { getEventById } from "@/lib/server/event";

export default function EditArtucle({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const event = use(getEventById(id, apiBase, sessionID));
  if (typeof event == "string") {
    switch (event) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
      case "unauthorized":
        unauthorized();
    }
  }
  if (!event.authors) {
    forbidden();
  }
  return <EventEdit event={event} />;
}
