import api from "../axios";

export const getCustomerData = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const response = await api.get("/customers", {
    params: { page, pageSize },
  });

  return response.data;
};

export const getCustomerById = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}`);
  console.log(response.data);

  return response.data;
};
