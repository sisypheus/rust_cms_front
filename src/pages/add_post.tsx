import { useState } from "react";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <div>
      <h1 className="flex items-center justify-center mt-16 text-3xl font-bold">
        Add a new post
      </h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
      </form>
    </div>
  );
};

export default AddPost;
