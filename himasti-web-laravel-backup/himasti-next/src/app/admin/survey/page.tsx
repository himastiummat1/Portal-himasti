import { prisma } from "@/lib/prisma";
import SurveyClient from "./SurveyClient";
export const dynamic = "force-dynamic";

export default async function SurveyPage() {
  const data = await prisma.survey.findMany({ orderBy: { created_at: 'desc' } });
  return <SurveyClient records={data} />;
}
