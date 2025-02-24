import { Theme } from "@radix-ui/themes";
import { type Metadata } from "next";
import "./../styles/global.css";

export const metadata: Metadata = {
  title: "JFCA Backoffice Dashboard",
  description: "JFCA attendance backoffice dashboard",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme scaling="90%">{props.children}</Theme>
      </body>
    </html>
  );
}
