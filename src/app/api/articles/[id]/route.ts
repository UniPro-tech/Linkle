import { auth } from "@/auth";
import Article from "@/models/Article";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export const dynamic = "force-dynamic";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleRes = await fetch(`${endpoint}/articles/${id}`);
  if (articleRes.status !== 200) return NextResponse.json({ status: articleRes.status });
  const articleData = (await articleRes.json()) as Article;
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
  if (!(session || checkEmail) && !((articleData.visible & 0x2) == 0x2))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const article_managerRes = await fetch(`${endpoint}/article_managers/?filter1=article,eq,${id}`);
  const jsonData = (await article_managerRes.json()) as {
    records: [{ author: string; club: number }];
  };
  const authorData = jsonData.records.map((record) => record.author);
  const clubData = jsonData.records.map((record) => record.club);
  if (
    (session || checkEmail) &&
    !authorData.includes(session?.user?.email || sessionEmail || "") &&
    !((articleData.visible & 0x1) == 0x1)
  )
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (authorData.includes(session?.user?.email || sessionEmail || "No Email")) {
    articleData.authors = authorData;
  }
  articleData.clubs = clubData;
  return Response.json(articleData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/article_managers/?filter1=article,eq,${id}`)).json()
  ).records.map((record: { user: string }) => record.user);
  const session = await auth();
  if (!session || !owners.includes(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const apiRes = await fetch(`${endpoint}/articles/${id}`, {
    method: "DELETE",
  });
  return Response.json({ status: apiRes.status });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owners = (
    await (await fetch(`${endpoint}/article_managers/?filter1=article,eq,${id}`)).json()
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
  const apiRes = await fetch(`${endpoint}/articles/${id}`, {
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
    await (await fetch(`${endpoint}/article_managers/?filter1=article,eq,${id}`)).json()
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
  const apiRes = await fetch(`${endpoint}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return Response.json({ status: apiRes.status });
}
