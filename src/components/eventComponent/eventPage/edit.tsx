import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import EventEdit from "./editComponent";
import { getEventById } from "@/lib/server/event";
import { fetchErrorResponse } from "@/lib/server/error";
import Club from "@/models/Club";
import CryptoJS from "crypto-js";

const getMyClubs = async (
  apiBase: string,
  cookie: string | undefined,
  email: string
): Promise<Club[] | fetchErrorResponse> => {
  try {
    const key =
      CryptoJS.AES.encrypt(
        (email as string) || "No Auth",
        process.env.API_ROUTE_SECRET as string
      ).toString() || "";
    const res = await fetch(`${apiBase}/api/user?email=${email}`, {
      headers: new Headers({
        Cookie: cookie || "",
        "X-Api-Key": key,
      }),
    });
    if (res.status == 403) return "forbidden";
    if (res.status == 404) return "notfound";
    if (res.status == 401) return "unauthorized";
    const club = (await res.json()).clubs;
    if (!club) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};

export default function EditEvent({
  id,
  apiBase,
  sessionID,
  email,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
  email: string;
}) {
  const event = use(getEventById(id, apiBase, sessionID));
  const ownClubs = use(getMyClubs(apiBase, sessionID, email));
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
  if (typeof ownClubs == "string") {
    switch (ownClubs) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
      case "unauthorized":
        unauthorized();
    }
  }
  return (
    <EventEdit
      event={event}
      ownClubs={ownClubs}
    />
  );
}
