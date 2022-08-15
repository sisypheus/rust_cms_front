import axios from "axios";

export default async (req: any, res: any) => {
  try {
    const response = await axios.get("http://localhost:8080/protected", {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
