"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RedirectPath from "./component";

const endpoint = process.env.DB_API_ENDPOINT;

export default async function CheckAuthentication(
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
        await checkNewUser(session?.user?.email);
        console.log("redirecting to", redirectURL);
        return (<RedirectPath redirect={redirectURL} />);
    } else {
        redirect("/api/authErrorSignout");
    }
}

const checkNewUser = async (email?: string | null) => {
    console.log(email);
    const response = await fetch(`${endpoint}/users?filter1=email,eq,${email}`);
    const resultRaw = await response.json();
    const result = resultRaw.records;
    console.log(result);
    if (result.length != 0) {
        return;
    }
    redirect("/register");
}