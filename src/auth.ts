import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"

import Google from "next-auth/providers/google"
import { getInvite } from "./libs/invite"

const providers: Provider[] = [
    Google,
    Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            let user = null
            user = await getInvite(credentials.email as string, credentials.password as string)
            if (!user) {
                throw new Error("Invalid credentials.")
            }
            return user
        },
    }),
]

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    pages: {
        signIn: "/signin",
        signOut: "/signout",
    },
    callbacks: {
    },
})