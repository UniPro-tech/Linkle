import { auth, signOut } from "@/auth"

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signouted|error/|tos|cookie|privacy).*)"],
}

export default auth(async (req) => {
    if (!req.auth && req.nextUrl.pathname !== "/signin") {
        const newUrl = new URL(`/signin?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})