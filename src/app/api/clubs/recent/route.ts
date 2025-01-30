import { NextRequest, NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export const GET = async (req: NextRequest) => {
    const apiRes = await fetch(`${endpoint}/clubs?size=8&order=created_at&filter1=visible,eq,1`);
    if (apiRes.ok) {
        const data = await apiRes.json();
        return NextResponse.json(data.records);
    } else {
        return NextResponse.error();
    }
}