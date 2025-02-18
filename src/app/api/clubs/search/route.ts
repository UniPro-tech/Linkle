"use server";
import { auth } from "@/auth";
import Club from "@/models/Club";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto-js";
import { Session } from "next-auth";

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
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
  const response = await fetch(
    `${endpoint}/clubs?${query ? `&search=${query}` : ""}&order=created_at,desc`
  );
  const resultRaw = await response.json();
  const result = resultRaw.records as Club[];
  const filteredClubs = result.filter((club) => {
    if (session) {
      return (club.visible & 0x1) === 0x1;
    } else {
      return (club.visible & 0x2) === 0x2;
    }
  });

  return NextResponse.json(filteredClubs);
};
