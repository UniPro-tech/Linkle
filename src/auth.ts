import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error/notStudent",
  },
  callbacks: {
    signIn({ user, profile }) {
      if (user.email?.endsWith("@nnn.ed.jp") || profile?.email?.endsWith("@nnn.ed.jp")) {
        return true;
      }
      if (user.email?.endsWith("@nnn.ac.jp") || profile?.email?.endsWith("@nnn.ac.jp")) {
        return true;
      }
      if (user.email?.endsWith("@n-jr.jp") || profile?.email?.endsWith("@n-jr.jp")) {
        return true;
      }
      return false;
    },
  },
});
