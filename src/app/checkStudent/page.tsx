"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CheckStudent(
    props: {
        searchParams: Promise<{ redirect?: string }>;
    }
) {
    const searchParams = await props.searchParams;
    let redirectURL = searchParams?.redirect ?? "/";
    if (redirectURL == "") redirectURL = "/";

    const session = await auth();

    const isStudentEmail =
        session?.user?.email?.endsWith("@nnn.ed.jp") ||
        session?.user?.email?.endsWith("@n-jr.jp") ||
        session?.user?.email?.endsWith("@nnn.ac.jp");

    if (isStudentEmail) {
        redirect(redirectURL);
    } else {
        redirect("/error/notStudent");
    }
}