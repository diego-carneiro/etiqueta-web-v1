import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type CreateEmployeeDTO,
  type GetEmployeesPaginationHeaders,
  type GetEmployeesParams,
  type PaginatedEmployeeResponse,
} from "../services/employeeService";

export interface UseEmployeesParams {
  params?: GetEmployeesParams;
  paginationHeaders: GetEmployeesPaginationHeaders;
}

export const useEmployees = ({
  params,
  paginationHeaders,
}: UseEmployeesParams) =>
  useQuery<PaginatedEmployeeResponse>({
    queryKey: ["employees", params, paginationHeaders],
    queryFn: () => getEmployees(params, paginationHeaders),
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEmployeeDTO>;
    }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(employeeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
