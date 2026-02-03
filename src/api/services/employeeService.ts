import api from "../api/axios";
import { PaginatedEmployeeResponse } from "@/api/hooks/useEmployee";

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  password: string;
  taxId: string;
  serviceCenterId: string;
}

export const createEmployee = async (
  employee: CreateEmployeeDTO
): Promise<void> => {
  await api.post("/employees", employee);
};

export const getEmployees = async (): Promise<PaginatedEmployeeResponse> => {
  const response = await api.get("/employees");
  return response.data;
};

export const updateEmployee = async (
  employeeId: string,
  data: Partial<CreateEmployeeDTO>
): Promise<void> => {
  await api.put(`/employees/${employeeId}`, data);
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  await api.delete(`/employees/${employeeId}`);
};
