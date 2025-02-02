"use server";
import { auth } from "@/auth";
import Club from "@/models/Club";
import { NextRequest, NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async (
    req: NextRequest
) => {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query");
    const session = await auth();
    console.log(`${endpoint}/clubs?${query ? `&search=${query}` : ""}&order=created_at,desc`);
    const response = await fetch(`${endpoint}/clubs?${query ? `&search=${query}` : ""}&order=created_at,desc`);
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