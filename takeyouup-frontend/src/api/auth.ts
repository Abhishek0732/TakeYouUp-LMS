import axios from "axios";

export const loginUser = async (email: string, password: string) => {

  const API = import.meta.env.VITE_API_URL;

  const response = await axios.post(
    `${API}/api/auth/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};