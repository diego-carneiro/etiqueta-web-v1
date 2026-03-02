import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCustomerData, getCustomerById } from "../services/customerService";

interface CustomerQueryParams {
  page: number;
  pageSize: number;
}

export const useCustomer = ({ page, pageSize }: CustomerQueryParams) =>
  useQuery({
    queryKey: ["customer", page, pageSize],
    queryFn: () => getCustomerData({ page, pageSize }),
    placeholderData: keepPreviousData,
  });

export const useCustomerById = (customerId: string) =>
  useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });
