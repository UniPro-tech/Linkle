import { auth } from "@/auth";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventRes = await fetch(`${endpoint}/events/${id}`);
  if (eventRes.status !== 200) return NextResponse.json({ status: eventRes.status });
  const eventData = (await eventRes.json()) as Event;
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
  if (!(session || checkEmail) && !((eventData.visible & 0x2) == 0x2))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const event_managerRes = await fetch(`${endpoint}/event_managers/?filter1=event,eq,${id}`);
  const jsonData = (await event_managerRes.json()) as {
    records: [{ author: string; club: number }];
  };
  const authorData = jsonData.records.map((record) => record.author);
  const clubData = jsonData.records.map((record) => record.club);
  if (
    (session || checkEmail) &&
    !authorData.includes(session?.user?.email || sessionEmail || "") &&
    !((eventData.visible & 0x1) == 0x1)
  )
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (authorData.includes(session?.user?.email || sessionEmail || "No Email")) {
    eventData.authors = authorData;
  }
  eventData.clubs = clubData;
  return Response.json(eventData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/event_managers/?filter1=event,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const apiRes = await fetch(`${endpoint}/events/${id}`, {
    method: "DELETE",
  });
  return Response.json({ status: apiRes.status });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/event_managers/?filter1=event,eq,${id}`)).json()
  ).records.map((record: { author: string }) => record.author);
  const session = await auth();
  const apiKey = request.headers.get("X-Api-Key");
  const sessionEmail = apiKey
    ? CryptoJS.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
        CryptoJS.enc.Utf8
      )
    : "";
  if (!owners.includes(session?.user?.email || sessionEmail || ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return Response.json({}, { status: apiRes.status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/event_managers/?filter1=event,eq,${id}`)).json()
  ).records.map((record: { author: string }) => record.author);
  const session = await auth();
  const apiKey = request.headers.get("X-Api-Key");
  const sessionEmail = apiKey
    ? CryptoJS.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
        CryptoJS.enc.Utf8
      )
    : "";
  if (!owners.includes(sessionEmail || session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return Response.json({ status: apiRes.status });
}
