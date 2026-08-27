import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DevToolsClient from "./DevToolsClient";

export const metadata = {
  title: "Developer Tools - HIMASTI",
};

export default async function DevToolsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <DevToolsClient />;
}
