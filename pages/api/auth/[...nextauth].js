import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  //   pages: {
  //     signIn: "/auth",
  //   },
  //   database: process.env.DB_URL,
  //   session: {
  //     jwt: true,
  //   },
  //   jwt: {
  //     secret: "faewryhrsth",
  //   },
});
