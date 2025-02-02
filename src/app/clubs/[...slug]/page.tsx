import { notFound, unauthorized } from "next/navigation";

import ClubPage from "@/components/clubPage/main";
import EditClub from "@/components/clubPage/edit";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import { headers } from "next/headers";

import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost")) ? "http" : "https";
  const apiBase = `${protocol}://${host}`;
  const { slug } = await params;
  const res = await fetch(`${apiBase}/api/clubs/${slug[0]}`);
  if (res.status === 200) {
    const data = await res.json();
    const imageFinalURL = data.image ? (await fetch(data.image)).url : undefined;

    return {
      title: `${data.name} - Linkle`,
      description: `${data.short_description}`,
      openGraph: {
        title: `${data.name} - Linkle`,
        description: `${data.short_description}`,
        type: "website",
        url: `${apiBase}/clubs/${slug[0]}`,
        images: imageFinalURL ?? undefined,
      },
      twitter: {
        card: "summary_large_image",
        site: "@UniPro_digital",
        title: `${data.name} - Linkle`,
        description: `${data.short_description}`,
      },
    };
  } else if (res.status === 404) {
    return {
      title: "404 - Not Found - Linkle",
      description: "404 - Not Found",
    };
  } else if (res.status === 403) {
    console.log("403");
    return {
      title: "403 - Unauthorized - Linkle",
      description: "403 - Unauthorized",
    };
  } else {
    return {
      title: "500 - Internal Server Error - Linkle",
      description: "500 - Internal Server Error",
    };
  }
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  switch (slug[1]) {
    case "edit":
      const session = await auth();
      if (!session) return unauthorized();
      return (
        <SessionProvider session={session}>
          <EditClub id={slug[0]} />
        </SessionProvider>
      );
    case undefined:
      return <ClubPage id={slug[0]} />;
    default:
      notFound();
  }
}
