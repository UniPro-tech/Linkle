import CryptoJS from "crypto-js";
import { auth } from "@/auth";
import Club from "@/models/Club";

export type fetchErrorResponse = "notfound" | "forbidden" | "unauthorized";

export const getClubById = async (
  id: string,
  apiBase: string,
  sessionID: string | undefined
): Promise<Club | fetchErrorResponse> => {
  try {
    const email = (await auth())?.user?.email;
    const apiKey = CryptoJS.AES.encrypt(
      email ?? "No Auth",
      process.env.API_ROUTE_SECRET as string
    ).toString();
    const res = await fetch(`${apiBase}/api/clubs/${id}`, {
      headers: new Headers({
        Cookie: sessionID ?? "",
        "X-Api-Key": apiKey,
      }),
    });
    if (res.status == 403) return "forbidden";
    const club = (await res.json()) as Club;
    if (res.status == 401) return "unauthorized";
    if (!club || res.status == 404) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};
