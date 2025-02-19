import CryptoJS from "crypto-js";
import { auth } from "@/auth";
import { fetchErrorResponse } from "@/lib/server/error";
import Article from "@/models/Article";

export const getArticleById = async (
  id: string,
  apiBase: string,
  sessionID: string | undefined
): Promise<Article | fetchErrorResponse> => {
  try {
    const email = (await auth())?.user?.email;
    if (!email) return "unauthorized";
    const apiKey = CryptoJS.AES.encrypt(email, process.env.API_ROUTE_SECRET as string).toString();
    const res = await fetch(`${apiBase}/api/articles/${id}`, {
      headers: new Headers({
        Cookie: sessionID ?? "",
        "X-Api-Key": apiKey,
      }),
    });
    if (res.status == 403) return "forbidden";
    const article = (await res.json()) as Article;
    if (!article) return "notfound";
    return article;
  } catch (e) {
    throw new Error(e as string);
  }
};
