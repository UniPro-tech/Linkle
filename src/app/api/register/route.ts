import { NextRequest, NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);
    const payload = {
        email: body.email,
        slack_name: body.slackName,
    }
    const apiRes = await fetch(`${endpoint}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (apiRes.ok) {
        return NextResponse.json({ status: 200 });;
    } else {
        return NextResponse.error();
    }
}