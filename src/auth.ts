import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                return profile?.email_verified && profile?.email?.endsWith("@nnn.ed.jp") ? true : false;
            }
            return true;
        },
    },
})