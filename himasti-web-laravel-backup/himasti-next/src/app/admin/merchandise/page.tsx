import { prisma } from "@/lib/prisma";
import MerchClient from "./MerchClient";
export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const data = await prisma.merchandise.findMany({ orderBy: { created_at: 'desc' } });
  return <MerchClient records={data} />;
}
