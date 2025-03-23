import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import type { CookiesOptions } from "@auth/core/types";

import Google from "next-auth/providers/google";

const providers: Provider[] = [Google];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

const cookieOptions = (): Partial<CookiesOptions> | undefined => {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return {
      sessionToken: {
        name: `__Secure-authjs.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
        },
      },
      csrfToken: {
        name: `__Secure-next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          domain: "linkle.nnn.uniproject.jp",
        },
      },
    };
  } else return undefined;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {},
  cookies: cookieOptions(),
});
