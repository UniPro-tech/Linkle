import { auth, signOut } from "@/auth"

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default auth(async (req) => {
    if (!req.auth && req.nextUrl.pathname !== "/signin") {
        const newUrl = new URL("/signin", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})