import api from "../axios";
import type { PaginatedResponse } from "../types/paginated-response";

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  password: string;
  taxId: string;
  companyId: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: number;
  companyName?: string;
  serviceCenterId: string;
  isActive: boolean;
}

export type PaginatedEmployeeResponse = PaginatedResponse<Employee>;

export interface GetEmployeesPaginationHeaders {
  page: number;
  pageSize: number;
}

export interface GetEmployeesParams {
  name?: string;
  serviceCenterId?: string;
}

export interface ListEmployeesParams {
  name?: string;
}

export const createEmployee = async (
  employee: CreateEmployeeDTO,
): Promise<void> => {
  await api.post("/employees", employee);
};

export const getEmployees = async (
  params: GetEmployeesParams = {},
  paginationHeaders?: GetEmployeesPaginationHeaders,
): Promise<PaginatedEmployeeResponse> => {
  const response = await api.get("/employees", {
    params,
    headers: {
      ...(paginationHeaders?.page !== undefined
        ? { page: String(paginationHeaders.page) }
        : {}),
      ...(paginationHeaders?.pageSize !== undefined
        ? { pageSize: String(paginationHeaders.pageSize) }
        : {}),
    },
  });

  return response.data;
};

function normalizeListResponse<T>(responseData: unknown): T[] {
  if (Array.isArray(responseData)) {
    return responseData as T[];
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    Array.isArray((responseData as { data?: unknown }).data)
  ) {
    return (responseData as { data: T[] }).data;
  }

  return [];
}

export const listEmployees = async ({
  name,
}: ListEmployeesParams): Promise<Employee[]> => {
  const response = await api.get("/employees/list", {
    params: {
      ...(name ? { name } : {}),
    },
  });

  return normalizeListResponse<Employee>(response.data);
};

export const updateEmployee = async (
  employeeId: string,
  data: Partial<CreateEmployeeDTO>,
): Promise<void> => {
  await api.put(`/employees/${employeeId}`, data);
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  await api.delete(`/employees/${employeeId}`);
};
