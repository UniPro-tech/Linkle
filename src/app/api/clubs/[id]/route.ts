export const dynamic = 'force-static'

const endpoint = process.env.DB_API_ENDPOINT;

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const apiRes = await fetch(`${endpoint}/clubs/${id}`, {
        method: "DELETE",
    });
    return Response.json({ status: apiRes.status });
}