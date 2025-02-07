const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user_clubRes = await fetch(`${endpoint}/user_club/?filter1=club,eq,${id}`);
  const res = (await user_clubRes.json()) as { records: [{ user: string }] };
  const user_clubData = res.records.map((record) => record.user);
  return Response.json(user_clubData);
}
