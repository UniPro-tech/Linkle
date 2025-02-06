"use client";

import { Metadata } from "next";

export default function UpdateMetadata({ metadata }: { metadata: Metadata }) {
  if (typeof document === "undefined") return null;
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
  if (metadata.openGraph) {
    const title = metadata.openGraph.title || metadata.title;
    if (title) {
      const titleTag = document.querySelector('meta[property="og:title"]');
      if (titleTag) {
        titleTag.setAttribute("content", title as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "og:title";
        meta.content = title as string;
        document.head.appendChild(meta);
      }
    }
    const description = metadata.openGraph.description || metadata.description;
    if (description) {
      const descriptionTag = document.querySelector('meta[property="og:description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute("content", description as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "og:description";
        meta.content = description as string;
        document.head.appendChild(meta);
      }
    }
    const url = metadata.openGraph.url;
    if (url) {
      const urlTag = document.querySelector('meta[property="og:url"]');
      if (urlTag) {
        urlTag.setAttribute("content", url as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "og:url";
        meta.content = url as string;
        document.head.appendChild(meta);
      }
    }
    const siteNameTag = document.querySelector('meta[property="og:site_name"]');
    if (siteNameTag) {
      siteNameTag.setAttribute("content", "同好会ポータル Linkle");
    } else {
      const meta = document.createElement("meta");
      meta.name = "og:site_name";
      meta.content = "同好会ポータル Linkle";
      document.head.appendChild(meta);
    }
    const image = metadata.openGraph.images;
    if (image) {
      const imageTag = document.querySelector('meta[property="og:image"]');
      if (imageTag) {
        imageTag.setAttribute("content", image as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "og:image";
        meta.content = image as string;
        document.head.appendChild(meta);
      }
    }
  }
  if (metadata.twitter) {
    const card = metadata.twitter.card;
    if (card) {
      const cardTag = document.querySelector('meta[name="twitter:card"]');
      if (cardTag) {
        cardTag.setAttribute("content", card as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "twitter:card";
        meta.content = card as string;
        document.head.appendChild(meta);
      }
    }
    const site = metadata.twitter.site;
    if (site) {
      const siteTag = document.querySelector('meta[name="twitter:site"]');
      if (siteTag) {
        siteTag.setAttribute("content", site as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "twitter:site";
        meta.content = site as string;
        document.head.appendChild(meta);
      }
    }
    const title = metadata.twitter.title || metadata.title;
    if (title) {
      const titleTag = document.querySelector('meta[name="twitter:title"]');
      if (titleTag) {
        titleTag.setAttribute("content", title as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "twitter:title";
        meta.content = title as string;
        document.head.appendChild(meta);
      }
    }
    const description = metadata.twitter.description || metadata.description;
    if (description) {
      const descriptionTag = document.querySelector('meta[name="twitter:description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute("content", description as string);
      } else {
        const meta = document.createElement("meta");
        meta.name = "twitter:description";
        meta.content = description as string;
        document.head.appendChild(meta);
      }
    }
  }
  return null;
}
