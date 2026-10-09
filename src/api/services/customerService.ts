import api from "../axios";
import type { PaginatedResponse } from "../types/paginated-response";

export interface CustomerVehicle {
  id: string;
  customerId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  approvalStatus: number;
  approvalStatusDescription: string;
  approvedByEmployeeId: string;
  approvalDate: string;
  createdAt: string;
  lastEvaluationDate: string;
  lastEvaluationMileage: number;
  isMain: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  approvalStatus: number;
  approvalStatusDescription: string;
  vehicles: CustomerVehicle[];
}

export interface CustomersResponse extends PaginatedResponse<Customer> {
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface GetCustomersParams {
  page: number;
  pageSize: number;
}

export interface ListCustomersParams {
  query: string;
  queryParam?: string;
}

export const getCustomerData = async ({
  page,
  pageSize,
}: GetCustomersParams): Promise<CustomersResponse> => {
  const response = await api.get("/customers", {
    params: { page, pageSize },
  });

  return response.data;
};

export const getCustomerById = async (
  customerId: string,
): Promise<Customer> => {
  const response = await api.get(`/customers/${customerId}`);

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

export const listCustomers = async ({
  query,
  queryParam = "name",
}: ListCustomersParams): Promise<Customer[]> => {
  const response = await api.get("/customers/list", {
    params: {
      [queryParam]: query,
    },
  });
  console.log(response.data);

  return normalizeListResponse<Customer>(response.data);
};
