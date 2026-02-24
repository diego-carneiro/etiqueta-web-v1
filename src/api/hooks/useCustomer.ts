import { useQuery } from "@tanstack/react-query";
import { getCustomerData, getCustomerById } from "../services/customerService";

export const useCustomer = () =>
  useQuery({
    queryKey: ["customer"],
    queryFn: getCustomerData,
  });

export const useCustomerById = (customerId: string) =>
  useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });
