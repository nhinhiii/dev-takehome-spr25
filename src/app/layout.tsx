import { NP } from "@/lib/constants/strings";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export const metadata = {
  title: NP.NAME,
  description: NP.TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
