import { auth } from "@/auth";
import { NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user_clubRes = await fetch(`${endpoint}/event_managers/?filter1=club,eq,${id}`, {
    next: { revalidate: 300 },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = (await user_clubRes.json()) as { records: [{ author: string }] };
  const user_clubData = res.records.map((record) => record.author);
  return Response.json(user_clubData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { club: prevClubId } = await request.json();
  const managersData = await (
    await fetch(`${endpoint}/event_managers/?filter1=event,eq,${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
  const owners = managersData.records.map((record: { author: string }) => record.author);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const recordId = managersData.records.filter(
    (record: { club: number }) => record.club.toString() === prevClubId
  )[0];
  const apiRes = await fetch(`${endpoint}/event_managers/${recordId.id}`, {
    method: "DELETE",
  });
  return Response.json({ status: apiRes.status });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/event_managers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      event: id,
      author: session.user?.email,
      club: body.club,
    }),
  });
  return Response.json({}, { status: apiRes.status });
}
