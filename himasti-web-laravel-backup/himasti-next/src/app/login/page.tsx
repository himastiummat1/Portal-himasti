import LoginContainer from "./LoginContainer";
import { getDict } from "../i18n";

export const metadata = {
  title: "Sistem Informasi HIMASTI",
  description: "Portal Ekosistem Digital Mahasiswa HIMASTI",
};

export default async function LoginPage() {
  const dict = await getDict();
  return <LoginContainer dict={dict} />;
}
