import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KatalogKaryaClient from "./KaryaClient";

export const metadata = {
  title: "Katalog Karya - HIMASTI",
};

export default async function KaryaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <KatalogKaryaClient />;
}
