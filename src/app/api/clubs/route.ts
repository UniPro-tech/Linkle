import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";
import { Session } from "next-auth";
import crypto from "crypto-js";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    unauthorized();
  }
  const body = await req.json();
  const payload = {
    name: body.name,
    slack_name: body.slack_name,
    slack_link: body.slack_link,
    available_on: body.available_on,
    visible: 0,
    short_description: body.short_description,
  };
  const apiRes = await fetch(`${endpoint}/clubs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (apiRes.ok) {
    const id = await apiRes.text();
    const api2Res = await fetch(`${endpoint}/user_club`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session?.user?.email,
        club: id,
        role: 1,
      }),
    });
    if (!api2Res.ok) {
      console.error(api2Res.statusText);
      console.error(api2Res.status);
      console.error(await api2Res.text());
      return NextResponse.error();
    }
    return NextResponse.json({ status: 200, id: id });
  } else {
    console.error(apiRes.statusText);
    console.error(apiRes.status);
    console.error(await apiRes.text());
    return NextResponse.error();
  }
}

export const GET = async (req: NextRequest) => {
  let session: boolean | Session | null = await auth();
  if (!session) {
    const headers = req.headers;
    const apiKey = headers.get("X-Api-Key");
    const email = crypto.AES.decrypt(
      apiKey as string,
      process.env.API_ROUTE_SECRET as string
    ).toString(crypto.enc.Utf8);
    if (email.endsWith("@nnn.ed.jp") || email.endsWith("@nnn.ac.jp") || email.endsWith("@n-jr.jp"))
      session = true;
  }
  const apiRes = await fetch(
    `${endpoint}/clubs?order=created_at,desc&filter1=visible,ge,${session ? 0x1 : 0x2}`
  );
  if (apiRes.ok) {
    const data = await apiRes.json();
    return NextResponse.json(data.records);
  } else {
    return NextResponse.error();
  }
};
