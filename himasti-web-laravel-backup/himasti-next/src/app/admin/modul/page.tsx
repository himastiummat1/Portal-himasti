import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LearningHubClient from "./LearningHubClient";

export const metadata = {
  title: "Learning Hub - HIMASTI",
};

export default async function ModulPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <LearningHubClient userName={session.user.name || "Kader"} />;
}
