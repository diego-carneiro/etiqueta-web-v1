import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveCompany,
  getCompanies,
  getCompaniesDashboard,
} from "../services/companiesService";

export const useCompanies = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["companies", page, pageSize],
    queryFn: () => getCompanies(page, pageSize),
  });

export const useApproveCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useCompaniesDashboard = () =>
  useQuery({
    queryKey: ["companies", "dashboard"],
    queryFn: getCompaniesDashboard,
  });
