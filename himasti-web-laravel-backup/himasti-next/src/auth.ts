import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "himasti-super-secret-auth-key-2026",
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email/NIM", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return user as any;
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        
        if (existingUser) {
          user.id = existingUser.id.toString();
          return true;
        }

        const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
        const newUser = await prisma.user.create({
          data: {
            name: user.name || "Kader HIMASTI",
            email: user.email,
            password: hashedPassword,
          }
        });

        await prisma.dataKader.create({
          data: {
            user_id: newUser.id,
            nim: "GGL-" + Math.floor(Math.random() * 1000000),
            angkatan: new Date().getFullYear().toString(),
            status_kaderisasi: "Aktif"
          }
        });

        const role = await prisma.role.findFirst({ where: { name: "kader" } });
        if (role) {
          await prisma.modelHasRole.create({
            data: { role_id: role.id, model_type: "App\\Models\\User", model_id: newUser.id }
          });
        }
        
        user.id = newUser.id.toString();
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      
      // Impersonation Logic: Allow Super Admin to temporarily hijack another user's session without changing DB roles
      try {
        const cookieStore = await cookies();
        const impersonatedId = cookieStore.get("impersonated_user_id")?.value;
        
        if (impersonatedId && token.id) {
          const realRoles = await prisma.modelHasRole.findMany({ 
            where: { model_id: parseInt(token.id as string) }, 
            include: { role: true } 
          });
          const isSuperAdmin = realRoles.some((r: any) => r.role.name === "super_admin");
          
          if (isSuperAdmin) {
            const targetUser = await prisma.user.findUnique({ where: { id: parseInt(impersonatedId) } });
            if (targetUser) {
              session.user.id = targetUser.id.toString();
              session.user.name = targetUser.name;
              session.user.email = targetUser.email;
              (session.user as any).isImpersonating = true;
              (session.user as any).originalAdminId = token.id;
            }
          }
        }
      } catch (e) {
        // Ignored
      }
      
      return session;
    },
  },
});
