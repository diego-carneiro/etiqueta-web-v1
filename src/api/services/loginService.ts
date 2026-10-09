import api from "../axios";

type LoginParams = {
  email: string;
  password: string;
};

export const companyLogin = async (params: LoginParams) => {
  const response = await api.post("/companies/login", params);
  console.log(response.data);
  
  return response.data;
};

export const adminLogin = async (params: LoginParams) => {
  const response = await api.post("/admins/login", params);
  return response.data;
};
