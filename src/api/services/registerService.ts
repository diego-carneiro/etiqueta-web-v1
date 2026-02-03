import api from "../api/axios";

type RegisterParams = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  customerTaxId: string;
};

export const register = async (params: RegisterParams) => {
  const response = await api.post("/customers", params);
  return response.data;
};
