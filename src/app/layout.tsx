import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/primary";
import { Grid2 } from "@mui/material";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { GoogleTagManager } from "@next/third-parties/google";

const notoSans = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
      <body className={`${notoSans.variable} antialiased w-full`}>
        <AppRouterCacheProvider>
          <Sidebar>
            <ThemeProvider theme={theme}>
              <Grid2
                bgcolor={"background.default"}
                minHeight={"100vh"}
                width={"100%"}
                sx={{
                  "& ::-webkit-scrollbar": {
                    display: "none",
                  },
                  "& :hover": {
                    "::-webkit-scrollbar": {
                      display: "inline",
                    },
                  },
                }}
              >
                {children}
              </Grid2>
            </ThemeProvider>
            <Footer />
          </Sidebar>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
