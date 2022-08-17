import Link from "next/link";
import { env } from "../env/client.mjs";

type Post = {
  title: string;
  description: string;
  content: string;
  image: string;
};

const PostDisplay = ({ post }: { post: Post }) => {
  return (
    <div className="w-full h-full flex p-4 bg-gray-50 rounded-lg">
      <div className="w-1/3">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="w-2/3 pl-4">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </div>
    </div>
  );
};

const Dahsboard = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <div className="mb-16">
        <h1 className="flex items-center justify-center mt-16 text-3xl font-bold">
          Dashboard
        </h1>
        <div className="max-w-3xl mt-8 m-auto">
          {posts.map((post) => (
            <div key={post.title} className="mt-2">
              <PostDisplay post={post} />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 right-1/2 transform translate-x-1/2">
        <Link href={"/add_post"}>
          <button className="bg-purple-300 px-4 py-2 rounded text-purple-900 font-semibold text-xl">
            Add post
          </button>
        </Link>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  let posts: Post[] = [];
  try {
    const res = await fetch(env.NEXT_PUBLIC_BACKEND_URL + "/posts");
    posts = await res.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      posts,
    },
  };
}
export default Dahsboard;
