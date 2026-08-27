import RegisterContainer from "./RegisterContainer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  
  if (session) {
    redirect("/admin");
  }

  return <RegisterContainer />;
}
