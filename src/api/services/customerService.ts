import api from "../axios";

export const getCustomerData = async () => {
  const response = await api.get("/customers");
  console.log(response.data);

  return response.data;
};

export const getCustomerById = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}`);
  console.log(response.data);

  return response.data;
};
