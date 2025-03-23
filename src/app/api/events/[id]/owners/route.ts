const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user_clubRes = await fetch(`${endpoint}/event_managers/?filter1=club,eq,${id}`);
  const res = (await user_clubRes.json()) as { records: [{ club: number }] };
  const user_clubData = res.records.map((record) => record.club);
  return Response.json(user_clubData);
}
