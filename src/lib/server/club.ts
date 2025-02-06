import { auth } from "@/auth";
import Club from "@/models/Club";
import { headers } from "next/headers";

export type fetchErrorResponse = "notfound" | "forbidden" | "unauthorized";

export const getClubById = async (id: string): Promise<Club | fetchErrorResponse> => {
  try {
    const session = await auth();
    if (!session) return "unauthorized";
    const headersData = await headers();
    const host = headersData.get("host");
    const protocol =
      headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
    const cookie = headersData.get("cookie");
    const sessionID = cookie?.split(";").find((c) => c.trim().startsWith("authjs.session-token"));
    const apiBase = `${protocol}://${host}`;
    const res = await fetch(`${apiBase}/api/clubs/${id}`, {
      headers: new Headers({
        cookie: sessionID ?? "",
      }),
    });
    if (res.status == 403) return "forbidden";
    const club = (await res.json()) as Club;
    if (!club) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};
