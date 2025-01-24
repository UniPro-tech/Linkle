import { NextRequest, NextResponse } from "next/server";

const endpoint = process.env.DB_API_ENDPOINT;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const payload = {
        name: body.name,
        slack_name: body.slack_name,
        slack_link: body.slack_link,
        available_on: body.available_on,
        visible: 0,
        short_description: body.short_description,
    }
    console.log(payload);
    const apiRes = await fetch(`${endpoint}/clubs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (apiRes.ok) {
        const id = await apiRes.text();
        return NextResponse.json({ status: 200, id: id });;
    } else {
        console.error(apiRes.statusText);
        console.error(apiRes.status);
        console.error(await apiRes.text());
        return NextResponse.error();
    }
}