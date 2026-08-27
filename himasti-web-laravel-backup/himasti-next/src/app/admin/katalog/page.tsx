import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KatalogClient from "./KatalogClient";

export const metadata = {
  title: "Katalog Karya - HIMASTI",
};

export default async function KatalogPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <KatalogClient />;
}
