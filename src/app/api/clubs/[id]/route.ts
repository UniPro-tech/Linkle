import Club from "@/models/Club";

export const dynamic = 'force-dynamic';

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const clubRes = await fetch(`${endpoint}/clubs/${id}`);
    const clubData = (await clubRes.json()) as Club;
    const user_clubRes = await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`);
    const user_clubData = ((await user_clubRes.json()) as { records: [{ user: string }] }).records.map((record) => record.user);
    clubData.owner = user_clubData;
    return Response.json(clubData);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
        method: "DELETE",
    });
    return Response.json({ status: apiRes.status });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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