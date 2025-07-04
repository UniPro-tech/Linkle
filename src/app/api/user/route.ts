import CryptoJS from "crypto-js";
import { auth } from "@/auth";
import Club from "@/models/Club";
import User from "@/models/User";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ cookie: req.cookies.getAll() }, { status: 401 });
  }
  const body = await req.json();
  const payload = {
    email: session.user?.email,
    slack_name: body.slackName,
  };
  const apiRes = await fetch(`${endpoint}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (apiRes.ok) {
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.error();
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    unauthorized();
  }
  const body = await req.json();
  const res = await fetch(`${endpoint}/users?search=${session.user?.email}`, {
    cache: "no-store",
  });
  const data = await res.json();
  const user = data.records[0];
  const payload = {
    slack_name: body.name,
  };
  const apiRes = await fetch(`${endpoint}/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (apiRes.ok) {
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.error();
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const headers = req.headers;
  const apiKey = headers.get("X-Api-Key") ?? undefined;
  const sessionEmail = apiKey
    ? CryptoJS.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
        CryptoJS.enc.Utf8
      )
    : "";
  const emailCheck =
    sessionEmail &&
    (sessionEmail.endsWith("@nnn.ed.jp") ||
      sessionEmail.endsWith("@nnn.ac.jp") ||
      sessionEmail.endsWith("@n-jr.jp"));
  if (!(session || emailCheck)) {
    unauthorized();
  }
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");
  const userApiRes = await fetch(`${endpoint}/users?filter1=email,eq,${email}`, {
    next: { revalidate: 60 },
  });
  const userData = (await userApiRes.json()).records[0] as User;
  const ownClubApiRes = await fetch(
    `${endpoint}/user_club?filter1=user,eq,${userData.email}&join=club,clubs`,
    { next: { revalidate: 60 } }
  );
  const ownClubData = await ownClubApiRes.json();
  userData.clubs = ownClubData.records.map((record: { club: Club }) => record.club);
  return NextResponse.json(userData);
}
