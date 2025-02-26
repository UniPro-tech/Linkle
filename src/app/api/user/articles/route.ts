import CryptoJS from "crypto-js";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Article from "@/models/Article";

const endpoint = process.env.DB_API_ENDPOINT;

export async function GET(req: NextRequest) {
  const session = await auth();
  const headers = req.headers;
  const apiKey = headers.get("X-Api-Key") ?? undefined;
  const sessionEmail = apiKey
    ? CryptoJS.AES.decrypt(apiKey, process.env.API_ROUTE_SECRET as string).toString(
        CryptoJS.enc.Utf8
      )
    : "";
  const emailCheck =
    sessionEmail &&
    (sessionEmail.endsWith("@nnn.ed.jp") ||
      sessionEmail.endsWith("@nnn.ac.jp") ||
      sessionEmail.endsWith("@n-jr.jp"));
  if (!(session || emailCheck)) {
    unauthorized();
  }
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");
  const ownClubApiRes = await fetch(
    `${endpoint}/article_managers?filter1=author,eq,${email}&join=article,articles`
  );
  const ownClubData = (
    (await ownClubApiRes.json()) as { records: [{ article: Article }] }
  ).records.map((record) => record.article);
  return NextResponse.json(ownClubData);
}
