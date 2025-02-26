import CryptoJS from "crypto-js";
import { auth } from "@/auth";
import { fetchErrorResponse } from "@/lib/server/error";
import Event from "@/models/Event";

export const getEventById = async (
  id: string,
  apiBase: string,
  sessionID: string | undefined
): Promise<Event | fetchErrorResponse> => {
  try {
    const email = (await auth())?.user?.email;
    if (!email) return "unauthorized";
    const apiKey = CryptoJS.AES.encrypt(email, process.env.API_ROUTE_SECRET as string).toString();
    const res = await fetch(`${apiBase}/api/events/${id}`, {
      headers: new Headers({
        Cookie: sessionID ?? "",
        "X-Api-Key": apiKey,
      }),
    });
    if (res.status == 403) return "forbidden";
    const event = (await res.json()) as Event;
    if (!event) return "notfound";
    return event;
  } catch (e) {
    throw new Error(e as string);
  }
};
