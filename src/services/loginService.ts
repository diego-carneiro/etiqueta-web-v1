import api from "../api/axios";

type LoginParams = {
  email: string;
  password: string;
};

export const login = async (params: LoginParams) => {
  const response = await api.post("/login", params);
  return response.data;
};
