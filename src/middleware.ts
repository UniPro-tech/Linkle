import { auth, signOut } from "@/auth"

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|signouted|error/|tos|cookie|privacy|api/auth).*)"],
}

export default auth(async (req) => {
    if (!req.auth && req.nextUrl.pathname !== "/signin") {
        const newUrl = new URL(`/signin?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})