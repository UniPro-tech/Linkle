import { auth, signOut } from "@/auth"

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|signouted|error/|tos|cookie|privacy|api/auth|api/register|clubs|).*)"],
}

export default auth(async (req) => {
})