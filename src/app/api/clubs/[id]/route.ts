import { auth } from "@/auth";
import Club from "@/models/Club";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clubRes = await fetch(`${endpoint}/clubs/${id}`);
  if (clubRes.status !== 200) return NextResponse.json({ status: clubRes.status });
  const clubData = (await clubRes.json()) as Club;
  const session = await auth();
  if (!session && !((clubData.visible & 0x2) == 0x2)) return NextResponse.json({ status: 403 });
  const user_clubRes = await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`);
  const user_clubData = (
    (await user_clubRes.json()) as { records: [{ user: string }] }
  ).records.map((record) => record.user);
  clubData.owner = user_clubData;
  if (
    session &&
    !user_clubData.includes(session?.user?.email || "") &&
    !((clubData.visible & 0x1) == 0x1)
  )
    return NextResponse.json({ status: 403 });
  return Response.json(clubData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email)) return NextResponse.json({ status: 403 });
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "DELETE",
  });
  return Response.json({ status: apiRes.status });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email)) return NextResponse.json({ status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return Response.json({ status: apiRes.status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email)) return NextResponse.json({ status: 403 });
  const body = await request.json();
  const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return Response.json({ status: apiRes.status });
}
