import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Stack, Typography } from "@mui/material";
import ThirdPartySigninSection from "@/components/ThirdPartySigninSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "サインイン - Linkle",
    description: "Linkleにサインインします。",
}

export default async function SignInPage({
    searchParams,
}: {
    searchParams: { callbackUrl?: string };
}) {
    const searchParamsTemp = await searchParams;
    const callbackUrl = (await searchParamsTemp?.callbackUrl) ?? "";

    return (
        <Stack flex={1} spacing={4} minHeight={"100vh"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} p={{ xs: 2, lg: 0 }}>
            <Stack justifyContent="center" alignItems="center" spacing={2} justifyItems={"center"}>
                <Typography variant="h3">Linkleにサインイン</Typography>
                <Typography variant="body1">
                    Linkleにサインインするには、以下のいずれかの方法でサインインしてください。
                </Typography>
            </Stack>
            <Stack justifyContent="center" justifyItems={"center"}>
                {Object.values(providerMap).map((provider) => (
                    <form
                        action={async () => {
                            "use server";
                            try {
                                await signIn(provider.id, { redirectTo: `/checkAuth?redirect=${callbackUrl}` });
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    return redirect(`?error=${error.type}`);
                                }
                                throw error;
                            }
                        }}
                        key={provider.id}
                    >
                        <ThirdPartySigninSection provider={provider.id} />
                    </form>
                ))}
            </Stack>
        </Stack>
    );
}