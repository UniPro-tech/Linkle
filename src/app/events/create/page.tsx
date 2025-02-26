import { auth } from "@/auth";
import CreateArticle from "./createArticleComponent";
import { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { Suspense, use } from "react";
import { fetchErrorResponse } from "@/lib/server/error";
import Club from "@/models/Club";
import { headers } from "next/headers";
import CryptoJS from "crypto-js";

export const metadata: Metadata = {
  title: "同好会を登録 - Linkle",
  description: "同好会を登録します。",
};

export default async function Page() {
  const session = await auth();
  if (!session) unauthorized();
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost") ? "http" : "https";
  const cookie =
    headersData
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("authjs.session-token=")) ||
    headersData
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("__Secure-authjs.session-token="))
      ?.replace("__Secure-", "");
  if (!cookie) unauthorized();
  const apiBase = `${protocol}://${host}`;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateArticleWrapper
        apiBase={apiBase}
        cookie={cookie}
        email={session?.user?.email as string}
      />
    </Suspense>
  );
}

const getMyClubs = async (
  apiBase: string,
  cookie: string | undefined,
  email: string
): Promise<Club[] | fetchErrorResponse> => {
  if (!cookie) return "unauthorized";
  try {
    const key =
      CryptoJS.AES.encrypt(
        (email as string) || "No Auth",
        process.env.API_ROUTE_SECRET as string
      ).toString() || "";
    const res = await fetch(`${apiBase}/api/user?email=${email}`, {
      headers: new Headers({
        Cookie: cookie,
        "X-Api-Key": key,
      }),
    });
    if (res.status == 403) return "forbidden";
    if (res.status == 404) return "notfound";
    if (res.status == 401) return "unauthorized";
    const club = (await res.json()).clubs;
    if (!club) return "notfound";
    return club;
  } catch (e) {
    throw new Error(e as string);
  }
};

function CreateArticleWrapper({
  apiBase,
  cookie,
  email,
}: {
  apiBase: string;
  cookie: string;
  email: string;
}) {
  const clubs = use(getMyClubs(apiBase, cookie, email));
  if (typeof clubs === "string") {
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
  }
  return <CreateArticle ownClubs={clubs} />;
}
