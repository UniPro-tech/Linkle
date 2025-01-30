export const dynamic = 'force-dynamic';

const endpoint = process.env.DB_API_ENDPOINT;

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