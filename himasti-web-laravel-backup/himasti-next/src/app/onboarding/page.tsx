import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const kader = await prisma.dataKader.findUnique({
    where: { user_id: parseInt(session.user.id || "0") }
  });

  if (!kader?.nim?.startsWith("GGL-")) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 relative mx-auto mb-4 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white p-1 flex items-center justify-center">
            <Image 
              src="/images/logo_himasti.jpg" 
              alt="Logo HIMASTI" 
              width={52} 
              height={52} 
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lengkapi Profil</h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan lengkapi data kader dan setel password baru agar Anda bisa login manual tanpa Google di kemudian hari.
          </p>
        </div>
        <OnboardingForm 
           userId={session.user.id || ""} 
           defaultName={session.user.name || ""} 
           defaultEmail={session.user.email || ""} 
        />
      </div>
    </div>
  );
}
