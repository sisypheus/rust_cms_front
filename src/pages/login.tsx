import {
  type GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { getProviders, getCsrfToken } from "next-auth/react";
import { authOptions as nextAuthOptions } from "./api/auth/[...nextauth]";

interface SigninPageProps {
  providers: Awaited<ReturnType<typeof getProviders>> | null;
  csrfToken: Awaited<ReturnType<typeof getCsrfToken>> | null;
}

export const getServerSideProps: GetServerSideProps<SigninPageProps> = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const providers = await getProviders();
  const csrfToken = await getCsrfToken();

  return {
    props: { providers, csrfToken: csrfToken ?? null },
  };
};

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-1">
      <div className="mt-32">
        <h1 className="text-3xl leading-normal font-extrabold text-gray-700 font-bold text-center">
          Blog CMS
        </h1>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="flex flex-col"
        >
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken as string}
          />
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input name="username" type="text" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input name="password" type="password" />
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
