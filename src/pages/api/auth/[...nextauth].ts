import axios from "axios";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../../env/server.mjs";

const nextAuthOptions = (req: any, res: any) => {
  return {
    callbacks: {
      jwt: ({ token, user }: { token: any; user: any }) => {
        if (user) token.id = user.id;

        return token;
      },
      session: ({ session, token }: { session: any; token: any }) => {
        if (token) session.id = token.id;

        return token;
      },
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      CredentialsProvider({
        credentials: {
          username: {
            label: "Username",
            type: "text",
            placeholder: "Username",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const response = await axios.post(env.BACKEND_URL + "/login", {
              username: credentials?.username,
              password: credentials?.password,
            });

            const cookies = response.headers["set-cookie"];

            res.setHeader("Set-Cookie", cookies);
            return response.data;
          } catch (error) {
            console.log(error);
            return null;
          }
        },
      }),
    ],
  };
};

export default (req: any, res: any) => {
  return NextAuth(req, res, nextAuthOptions(req, res) as NextAuthOptions);
};
