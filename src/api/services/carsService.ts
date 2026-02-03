import api from "@/api/axios";

export type VehicleParams = {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  isMain: boolean;
};

export type Vehicle = {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  isMain: boolean;
  createdAt: string;
};

export const createVehicle = async (params: VehicleParams) => {
  const response = await api.post("/vehicles", params);
  return response.data;
};

export const getVehicleById = async (vehicleId: string): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${vehicleId}`);
  return response.data;
};

export const getVehicleByPlate = async (
  licensePlate: string
): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${licensePlate}`);
  console.log(response.data);

  return response.data;
};
