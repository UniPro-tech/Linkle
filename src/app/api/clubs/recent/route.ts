import crypto from "crypto-js";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async () => {
  const session = await auth();
  const apiKey = (await headers()).get("X-Api-Key") as string;
  console.log(`RT: ${apiKey}`);
  const email = crypto.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
    crypto.enc.Utf8
  );
  console.log(`RT: ${email}`);
  const apiCheck =
    email &&
    (email.endsWith("@nnn.ed.jp") || email.endsWith("@nnn.ac.jp") || email.endsWith("@n-jr.jp"));
  const apiRes = await fetch(
    `${endpoint}/clubs?size=8&order=created_at,desc&filter1=visible,ge,${
      session || apiCheck ? 0x1 : 0x2
    }`
  );
  if (apiRes.ok) {
    const data = await apiRes.json();
    return NextResponse.json(data.records);
  } else {
    return NextResponse.error();
  }
};
