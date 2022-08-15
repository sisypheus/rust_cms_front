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
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
