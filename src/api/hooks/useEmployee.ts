import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  CreateEmployeeDTO,
} from "../services/employeeService";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: number;
  serviceCenterId: string;
  isActive: boolean;
};

export type PaginatedEmployeeResponse = {
  data: Employee[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const useEmployees = () =>
  useQuery<PaginatedEmployeeResponse>({
    queryKey: ["employees"],
    queryFn: getEmployees,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
