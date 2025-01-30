import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|error/|tos|cookie|privacy|pls-wait).*)"],
}

export function middleware(request: NextRequest) {
    const specificDate = new Date("2025-01-31T04:00:00Z");
    const currentDate = new Date();
    const jstOffset = 9 * 60;
    const jstDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() + jstOffset) * 60000);
    
    if (jstDate < specificDate) {
        return NextResponse.redirect(new URL("/pls-wait", request.url));
    }
}