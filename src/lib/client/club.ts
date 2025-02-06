import Club from "@/models/Club";
import { fetchErrorResponse } from "../server/club";

export const getClubByIdClient = async (id: string): Promise<Club | fetchErrorResponse> => {
  try {
    const res = await fetch(`/api/clubs/${id}`);
    if (res.status == 403) return "forbidden";
    const club = (await res.json()) as Club;
    if (!club) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};
