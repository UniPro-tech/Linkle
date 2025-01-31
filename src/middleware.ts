import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|error/|tos|cookie|privacy|pls-wait).*)"],
}

export function middleware(request: NextRequest) {
    const specificDate = new Date("2025-01-31T13:00:00+09:00");
    const currentDate = new Date();
    const jstOffset = 9 * 60;
    const jstDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() + jstOffset) * 60000);

    console.log("JST Date: ", jstDate);
    console.log("Specific Date: ", specificDate);
    
    if (jstDate < specificDate) {
        return NextResponse.redirect(new URL("/pls-wait", request.url));
    }
}