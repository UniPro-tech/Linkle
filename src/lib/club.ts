import { auth } from "@/auth";
import Club from "@/models/Club";
import { headers } from "next/headers";

const apiBase = process.env.DB_API_ENDPOINT;

export type fetchErrorResponse = "notfound" | "forbidden";

export const getClubById = async (id: string): Promise<Club | fetchErrorResponse> => {
  try {
    const res = await fetch(`${apiBase}/clubs/${id}`);
    if (res.status == 403) return "forbidden";
    const club = (await res.json()) as Club;
    if (!club) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};
