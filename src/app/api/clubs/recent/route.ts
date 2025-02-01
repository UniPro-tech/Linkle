import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async (req: NextRequest) => {
    const session = await auth();
    const apiRes = await fetch(`${endpoint}/clubs?size=8&order=created_at,desc&filter1=visible,ge,${session ? 0x1 : 0x2}`);
    if (apiRes.ok) {
        const data = await apiRes.json();
        return NextResponse.json(data.records);
    } else {
        return NextResponse.error();
    }
}