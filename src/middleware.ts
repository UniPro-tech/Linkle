import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|error/|tos|cookie|privacy|pls-wait).*)"],
}

export function middleware(request: NextRequest) {
    const specificDate = new Date("2025-01-31T04:00:00Z");
    const currentDate = new Date();
    const jstOffset = 9 * 60;
    const utcDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000));

    console.log("JST Date: ", utcDate);
    console.log("Specific Date: ", specificDate);
    
    if (utcDate < specificDate) {
        return NextResponse.redirect(new URL("/pls-wait", request.url));
    }
}