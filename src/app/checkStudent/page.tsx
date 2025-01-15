"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CheckStudent({
    searchParams,
}: {
    searchParams: { redirect?: string };
}) {
    const session = await auth();

    const isStudentEmail =
        session?.user?.email?.endsWith("@nnn.ed.jp") ||
        session?.user?.email?.endsWith("@n-jr.jp") ||
        session?.user?.email?.endsWith("@nnn.ac.jp");

    if (isStudentEmail) {
        redirect(searchParams.redirect ?? "/");
    } else {
        redirect("/api/checkStudent");
    }
}