import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: String;
    user: {
      email?: string;
      name?: string;
      image?: string;
    };
  }
}
