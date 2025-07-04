import crypto from "crypto-js";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async () => {
  const session = await auth();
  const apiKey = (await headers()).get("X-Api-Key") as string;
  const email = (
    apiKey
      ? crypto.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(crypto.enc.Utf8)
      : session?.user?.email
  ) as string;
  const apiCheck =
    email &&
    (email.endsWith("@nnn.ed.jp") || email.endsWith("@nnn.ac.jp") || email.endsWith("@n-jr.jp"));
  const nowDate = new Date();
  const apiRes = await fetch(
    `${endpoint}/events?size=8&filter=start_at,le,${nowDate.toISOString()}&filter=end_at,ge,${nowDate.toISOString()}&filter=visible,ge,${
      session || apiCheck ? 0x1 : 0x2
    }&join=clubs,clubs`,
    { next: { revalidate: 300 } }
  );
  if (apiRes.ok) {
    const data = await apiRes.json();
    return NextResponse.json(data.records);
  } else {
    return NextResponse.error();
  }
};
