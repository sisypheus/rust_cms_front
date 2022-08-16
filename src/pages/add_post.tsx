import axios from "axios";
import { env } from "../env/client.mjs";
import { useState } from "react";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [post, setPost] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [error, setError] = useState("");

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
    console.log(formData);

    fetch(env.NEXT_PUBLIC_BACKEND_URL + "/posts/save", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
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
        className="flex-col flex flex-col space-y-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="image">Image</label>
        <input type="file" name="image" onChange={imageUpload} />
        <label htmlFor="post">Post</label>
        <input type="file" name="post" onChange={postUpload} />
        {error && <p className="text-red-500 font-bold">{error}</p>}
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Add post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
