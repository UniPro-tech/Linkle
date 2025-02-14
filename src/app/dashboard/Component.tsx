import { fetchErrorResponse } from "@/lib/server/club";
import Club from "@/models/Club";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import DashboardContent from "./Client";
import { Alert, Button, Stack, Typography } from "@mui/material";

export default function Dashboard({
  apiBase,
  sessionID,
  email,
}: {
  apiBase: string;
  sessionID: string;
  email: string;
}) {
  const getMyClubs = async (
    apiBase: string,
    cookie: string,
    email: string
  ): Promise<Club[] | fetchErrorResponse> => {
    if (!sessionID) return "unauthorized";
    try {
      const res = await fetch(`${apiBase}/api/user?email=${email}`, {
        headers: new Headers({ Cookie: cookie }),
      });
      if (res.status == 403) return "forbidden";
      if (res.status == 404) return "notfound";
      if (res.status == 401) return "unauthorized";
      const club = (await res.json()).clubs;
      if (club.length == 0) throw new Error(club);
      if (!club) return "notfound";
      return club;
    } catch (e) {
      throw new Error(e as string);
    }
  };

  const clubs = use(getMyClubs(apiBase, sessionID, email));
  switch (clubs) {
    case "forbidden":
      forbidden();
    case "notfound":
      notFound();
    case "unauthorized":
      unauthorized();
    default:
      break;
  }
  if (clubs instanceof Error) throw clubs;
  if (clubs.length) return <DashboardContent clubs={clubs} />;
  else
    return (
      <Stack>
        <Typography variant="h3">ダッシュボード</Typography>
        <Typography variant="body1">あなたが管理しているクラブの一覧です。</Typography>
        <Button
          variant="contained"
          color="primary"
          href="/clubs/create"
        >
          新しいクラブを作成
        </Button>
        <Alert severity="error">エラーが発生しました。</Alert>
      </Stack>
    );
}
