import Club from "@/models/Club";

export type fetchErrorResponse = "notfound" | "forbidden" | "unauthorized";

export const getClubById = async (
  id: string,
  apiBase: string,
  sessionID: string | undefined
): Promise<Club | fetchErrorResponse> => {
  try {
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
