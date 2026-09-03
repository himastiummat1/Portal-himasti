import { auth } from "@/auth";
import { redirect } from "next/navigation";
import McpHubClient from "./McpHubClient";

export const metadata = {
  title: "MCP & Prompt Engineering Hub - HIMASTI Digital",
  description: "Standardisasi Model Context Protocol (MCP) dan System Prompts untuk AI Agents Mahasiswa IT.",
};

export default async function McpHubPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <McpHubClient />;
}
