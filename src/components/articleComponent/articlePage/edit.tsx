import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import ArticleEdit from "./editComponent";
import { getArticleById } from "@/lib/server/article";

export default function EditArtucle({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const article = use(getArticleById(id, apiBase, sessionID));
  if (typeof article == "string") {
    switch (article) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
      case "unauthorized":
        unauthorized();
    }
  }
  if (!article.authors) {
    forbidden();
  }
  return <ArticleEdit article={article} />;
}
