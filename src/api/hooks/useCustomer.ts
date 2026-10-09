import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getCustomerById,
  getCustomerData,
  type GetCustomersParams,
} from "../services/customerService";

export const useCustomer = ({ page, pageSize }: GetCustomersParams) =>
  useQuery({
    queryKey: ["customers", page, pageSize],
    queryFn: () => getCustomerData({ page, pageSize }),
    placeholderData: keepPreviousData,
  });

export const useCustomerById = (customerId: string) =>
  useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });
