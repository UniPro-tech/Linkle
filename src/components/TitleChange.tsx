"use client";

import { Metadata } from "next";

export default function UpdateMetadata({ metadata }: { metadata: Metadata }) {
  document.title = `${metadata.title} - Linkle`;
  if (metadata.description) {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", metadata.description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = metadata.description;
      document.head.appendChild(meta);
    }
  }
  return null;
}
