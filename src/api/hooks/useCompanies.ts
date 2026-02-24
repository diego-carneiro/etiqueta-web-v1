import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../services/companiesService";

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });
