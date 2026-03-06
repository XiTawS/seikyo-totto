import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./mongodb";
import Content from "./models/Content";

const SITE_ID = process.env.SITE_ID || "coiffure-ayme";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const authDoc = await Content.findOne({
          siteId: SITE_ID,
          type: "auth",
        }).lean();

        if (
          authDoc &&
          credentials?.username === (authDoc as any).username &&
          credentials?.password === (authDoc as any).password
        ) {
          return {
            id: "1",
            name: "Admin",
            email: (authDoc as any).email || "admin@seikyo.fr",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
