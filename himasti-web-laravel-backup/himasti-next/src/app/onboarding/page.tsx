import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const kader = await prisma.dataKader.findUnique({
    where: { user_id: parseInt(session.user.id) }
  });

  if (!kader?.nim?.startsWith("GGL-")) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm mx-auto mb-4">
            H
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lengkapi Profil</h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan lengkapi data kader dan setel password baru agar Anda bisa login manual tanpa Google di kemudian hari.
          </p>
        </div>
        <OnboardingForm 
           userId={session.user.id} 
           defaultName={session.user.name || ""} 
           defaultEmail={session.user.email || ""} 
        />
      </div>
    </div>
  );
}
