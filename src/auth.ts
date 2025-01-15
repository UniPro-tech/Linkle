import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"

import Google from "next-auth/providers/google"

const providers: Provider[] = [
    Google
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