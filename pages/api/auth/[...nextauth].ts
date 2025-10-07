import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/data/users";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user) return { ...user, id: user.id.toString() }; // id must be string
        return null;
      },
    }),
  ],

  // Use JWT session
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rememberMe = (user as any).rememberMe || false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  // Dynamic session maxAge based on rememberMe
  events: {
    async signIn(message) {
      
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "secret-key",
});
