import { signOut } from "@/auth";
import { Button, Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "サインアウト - Linkle",
  description: "Linkleからサインアウトしました。",
};

export default function SignOutPage() {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      spacing={2}
      p={{ xs: 2, lg: 0 }}
      justifyItems={"center"}
      height={"100vh"}
      textAlign={"center"}
    >
      <Typography variant="h3">
        Linkleから
        <wbr />
        サインアウト
      </Typography>
      <Typography variant="body1">
        サインアウトしますか？サインアウトした場合、もう一度サインインし直さなければなりません。
      </Typography>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signouted" });
        }}
      >
        <Button
          type="submit"
          variant="outlined"
        >
          サインアウト
        </Button>
      </form>
    </Stack>
  );
}
