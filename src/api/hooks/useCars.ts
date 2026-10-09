import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createVehicle,
  getVehicleById,
  getVehicleByPlate,
  VehicleParams,
} from "../services/carsService";

export const useCreateVehicle = () =>
  useMutation({
    mutationFn: (params: VehicleParams) => createVehicle(params),
  });

export const useVehicleById = (vehicleId: string) =>
  useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => getVehicleById(vehicleId),
    enabled: !!vehicleId,
  });

export const useVehicleByPlate = (
  licensePlate: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["vehicleByPlate", licensePlate],
    queryFn: () => getVehicleByPlate(licensePlate),
    enabled: options?.enabled ?? !!licensePlate,
  });
