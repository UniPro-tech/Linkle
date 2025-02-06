import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import DashboardContent from "./Client";

export default function Dashboard({
  apiBase,
  sessionID,
  email,
}: {
  apiBase: string;
  sessionID: string;
  email: string;
}) {
  const getMyClubs = async (
    apiBase: string,
    sessionID: string,
    email: string
  ): Promise<Club[] | fetchErrorResponse> => {
    try {
      const res = await fetch(`${apiBase}/api/user?email=${email}`, {
        headers: new Headers({
          cookie: sessionID ?? "",
        }),
      });
      if (res.status == 403) return "forbidden";
      const club = (await res.json()).clubs as Club[];
      if (!club) return "notfound";
      return club;
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const clubs = use(getMyClubs(apiBase, sessionID, email));
  switch (clubs) {
    case "forbidden":
      forbidden();
    case "notfound":
      notFound();
    case "unauthorized":
      unauthorized();
    default:
      break;
  }
  return <DashboardContent clubs={clubs} />;
}
