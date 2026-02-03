import api from "../axios";

type LoginParams = {
  email: string;
  password: string;
};

export const employeeLogin = async (params: LoginParams) => {
  const response = await api.post("/company/login", params);
  return response.data;
};

export const adminLogin = async (params: LoginParams) => {
  const response = await api.post("/admins/login", params);
  return response.data;
};
