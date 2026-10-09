import api from "../axios";
import type { PaginatedResponse } from "../types/paginated-response";

export interface Label {
  id: string;
  vehicleId: string;
  name: string;
  type: string;
  brand: string;
  specification: string;
  lastChangeDate?: string;
  nextChangeDate?: string;
  nextChangeInKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelParams {
  vehicleId: string;
  name: string;
  type: string;
  brand: string;
  specification: string;
  lastChangeDate?: string;
  nextChangeDate?: string;
  nextChangeInKm?: number;
}

export interface ItemApplied {
  id: string;
  labelId: string;
  providedServiceId: number;
  lastChangeDate: string;
  lastChangeInKm: number;
  nextChangeDate: string;
  nextChangeInKm: number;
  brand: string;
  specification: string;
  viscosity: number;
  composition: number;
  packageType: string;
}

export interface LabelsRecord {
  id: string;
  vehicleId: string;
  employeeId: string;
  companyId: string;
  vehicleLicensePlate: string;
  employeeName: string;
  companyName: string;
  createdAt: string;
  mileage: number;
  itemsApplied: ItemApplied[];
}

export interface LabelsParams {
  employeeName?: string;
  vehicleLicensePlate?: string;
  limit?: number;
}

export interface LabelsPaginationHeaders {
  page?: number;
  pageSize?: number;
}

export const createLabel = async (
  params: CreateLabelParams,
): Promise<Label> => {
  const response = await api.post("/labels", params);
  return response.data;
};

export const getLabelsByVehicleId = async (
  vehicleId: string,
): Promise<Label[]> => {
  const response = await api.get(`/labels/${vehicleId}`);
  return response.data;
};

export const getLabelsByEmployeeId = async (
  employeeId: string,
): Promise<LabelsRecord[]> => {
  const response = await api.get(`/labels/${employeeId}`);
  return response.data;
};

export const getLabels = async (
  params: LabelsParams = {},
  paginationHeaders?: LabelsPaginationHeaders,
): Promise<PaginatedResponse<LabelsRecord>> => {
  const response = await api.get("/labels", {
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
  console.log(response.data);

  return response.data;
};
