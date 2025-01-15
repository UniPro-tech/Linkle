import { signOut } from "@/auth";

export async function GET(req: Request) {
    await signOut({ redirectTo: "/error/notStudent" });
    return new Response(null, { status: 200 });
}