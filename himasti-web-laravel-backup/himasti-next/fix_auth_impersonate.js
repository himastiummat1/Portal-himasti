const fs = require('fs');

const newAuthCode = `import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "supersecret_himasti_key_replace_me_in_production",
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
`;

fs.writeFileSync('src/auth.ts', newAuthCode);
console.log("auth.ts updated with impersonation logic!");
