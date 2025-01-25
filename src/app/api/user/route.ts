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

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const res = await fetch(`${endpoint}/users?search=${body.email}`);
    const data = await res.json();
    const user = data.records[0];
    const payload = {
        slack_name: body.name,
    }
    const apiRes = await fetch(`${endpoint}/users/${user.id}`, {
        method: "PUT",
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