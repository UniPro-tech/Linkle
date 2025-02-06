import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import DashboardContent from "./Client";

export default function Dashboard({
  clubsPromise,
}: {
  clubsPromise: Promise<Club[] | fetchErrorResponse>;
}) {
  const clubs = use(clubsPromise);
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
