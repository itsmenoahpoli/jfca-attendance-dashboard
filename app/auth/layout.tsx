import { AuthLayout } from "@/layouts";

export default function AuthRootLayout(props: { children: React.ReactNode }) {
  console.log("AuthRootLayout");
  return <AuthLayout>{props.children}</AuthLayout>;
}
