import { auth } from "@/auth";
import Club from "@/models/Club";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clubRes = await fetch(`${endpoint}/clubs/${id}`);
  if (clubRes.status !== 200)
    return NextResponse.json(
      { status: clubRes.status, message: clubRes.statusText },
      { status: clubRes.status }
    );
  const clubData = (await clubRes.json()) as Club;
  const session = await auth();
  const apiKey = request.headers.get("X-Api-Key");
  const sessionEmail = apiKey
    ? CryptoJS.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
        CryptoJS.enc.Utf8
      )
    : "";
  const checkEmail =
    sessionEmail &&
    (sessionEmail.endsWith("@nnn.ed.jp") ||
      sessionEmail.endsWith("@nnn.ac.jp") ||
      sessionEmail.endsWith("@n-jr.jp"));
  if (!(session || checkEmail) && !((clubData.visible & 0x2) == 0x2))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const user_clubRes = await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`, {
    next: { revalidate: 120 }, // Cache for 2 minutes
  });
  const user_clubData = (
    (await user_clubRes.json()) as { records: [{ user: string }] }
  ).records.map((record) => record.user);
  if (
    (session || checkEmail) &&
    !user_clubData.includes(session?.user?.email || sessionEmail || "") &&
    !((clubData.visible & 0x1) == 0x1)
  )
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (user_clubData.includes(session?.user?.email || sessionEmail || "")) {
    clubData.owner = user_clubData;
  }
  return Response.json(clubData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (
      await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`, {
        cache: "no-store",
      })
    ).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  return Response.json({ status: apiRes.status });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return Response.json({}, { status: apiRes.status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return Response.json({ status: apiRes.status });
}
