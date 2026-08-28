import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Pendaftaran sekarang ditangani langsung di dalam AuthContainer di halaman /login
  redirect("/login");
}
