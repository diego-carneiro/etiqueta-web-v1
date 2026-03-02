import api from "../axios";

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
  type: number;
  typeDescription: string;
  brand: string;
  specification: string;
  nextChangeInKm: number;
  nextChangeDate: string;
}

export interface LabelsHistoryRecord {
  vehicleId: string;
  vehicleLicensePlate: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
  mileage: number;
  itemsApplied: ItemApplied[];
}

export interface LabelsHistoryParams {
  employeeName?: string;
  page?: number;
  limit?: number;
}

export interface LabelsHistoryResponse {
  data: LabelsHistoryRecord[];
  total: number;
  page: number;
  totalPages: number;
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

export const getLabelsHistoryByEmployeeId = async (
  employeeId: string,
): Promise<LabelsHistoryRecord[]> => {
  const response = await api.get(`/labels/history/${employeeId}`);
  return response.data;
};

export const getLabelsHistory = async (): Promise<LabelsHistoryRecord[]> => {
  const response = await api.get("/labels/history");
  console.log(response, "cu");

  return response.data.data;
};
