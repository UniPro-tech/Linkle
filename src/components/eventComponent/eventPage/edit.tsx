import { forbidden, notFound, unauthorized } from "next/navigation";
import { use } from "react";
import ArticleEdit from "./editComponent";
import { getArticleById } from "@/lib/server/event";

export default function EditArtucle({
  id,
  apiBase,
  sessionID,
}: {
  id: string;
  apiBase: string;
  sessionID: string | undefined;
}) {
  const event = use(getArticleById(id, apiBase, sessionID));
  if (typeof event == "string") {
    switch (event) {
      case "forbidden":
        forbidden();
      case "notfound":
        notFound();
      case "unauthorized":
        unauthorized();
    }
  }
  if (!event.authors) {
    forbidden();
  }
  return <ArticleEdit event={event} />;
}
