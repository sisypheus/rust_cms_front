import { type GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SigninPageProps {
  csrfToken: Awaited<ReturnType<typeof getCsrfToken>> | null;
}

export const getServerSideProps: GetServerSideProps<
  SigninPageProps
> = async () => {
  const csrfToken = await getCsrfToken();

  return {
    props: { csrfToken: csrfToken ?? null },
  };
};

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", { username, password });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-1">
      <div className="mt-32">
        <h1 className="text-3xl leading-normal font-extrabold text-gray-700 font-bold text-center">
          Blog CMS
        </h1>
        <form method="POST" onSubmit={handleSubmit} className="flex flex-col">
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken as string}
          />
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              className="block p-2 mb-2  w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 
          focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              className="block p-2 mb-8  w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 
          focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-purple-300 text-purple-900 font-bold rounded-lg"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
