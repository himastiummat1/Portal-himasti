import RegisterContainer from "./RegisterContainer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDict } from "../i18n";

export const metadata = {
  title: "Sistem Informasi HIMASTI",
  description: "Portal Ekosistem Digital Mahasiswa HIMASTI",
};

export default async function RegisterPage() {
  const session = await auth();
  
  if (session) {
    redirect("/admin");
  }

  const dict = await getDict();
  return <RegisterContainer dict={dict} />;
}
