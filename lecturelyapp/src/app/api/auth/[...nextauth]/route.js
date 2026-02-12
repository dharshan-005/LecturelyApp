import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/userModel.js";
import { connectToDB } from "@/utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        const checkEmail = await User.find({ email: user.email });

        if (checkEmail.length === 0) {
          await User.insertMany({ name: user.name, email: user.email });
        }
        return true;
      } catch (error) {
        console.log("Error checking user in DB: ", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
