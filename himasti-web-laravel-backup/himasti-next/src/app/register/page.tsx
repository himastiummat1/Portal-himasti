export const dynamic = "force-dynamic";
import AuthContainer from "../login/AuthContainer";
import { getDict } from "../i18n";

export const metadata = {
  title: "Registrasi Kader - HIMASTI",
  description: "Portal Registrasi Anggota & Ekosistem Digital HIMASTI",
};

export default async function RegisterPage() {
  const dict = await getDict();
  return <AuthContainer dict={dict} initialMode="register" />;
}
