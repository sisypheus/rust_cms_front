import { env } from "../env/client.mjs";
import { useState } from "react";
import { useRouter } from "next/router.js";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [post, setPost] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [error, setError] = useState("");
  const router = useRouter();

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post || !image || !title || !description) {
      setError("Please fill out all fields");
      return;
    } else {
      setError("");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", (await toBase64(image as File)) as string);
    formData.append("post", post!);

    fetch(env.NEXT_PUBLIC_BACKEND_URL + "/posts/save", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(err.message);
        console.log(err);
      });
  };

  const postUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPost(e.target.files[0]);
    }
  };

  const imageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      <h1 className="flex items-center justify-center my-16 text-3xl font-bold">
        Add a new post
      </h1>
      <form
        className="flex-col flex flex-col"
        onSubmit={handleSubmit}
      >
        <input
          className="block p-2 mb-2  w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 
          focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          id="description"
          className="block p-2 mb-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 
          focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label
          className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300"
          htmlFor="image"
        >
          Image
        </label>
        <input
          className="block w-full mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400
          focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          onChange={imageUpload}
          name="image"
        />
        <label
          className="block text-md mb-2 font-medium text-gray-900 dark:text-gray-300"
          htmlFor="post"
        >
          Post
        </label>
        <input
          className="block w-full mb-12 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 
          focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          onChange={postUpload}
        />
        {error && <p className="-mt-10 text-red-500 font-bold">{error}</p>}
        <button
          type="submit"
          className="bg-purple-500 mb-2 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Add post
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/dashboard");
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPost;
