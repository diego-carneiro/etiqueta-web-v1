import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLabel,
  getLabelsByVehicleId,
  getLabelsHistoryByEmployeeId,
  getLabelsHistory,
  CreateLabelParams,
} from "../services/labelsService";

export const useCreateLabel = () =>
  useMutation({
    mutationFn: (params: CreateLabelParams) => createLabel(params),
  });

export const useLabelsByVehicleId = (vehicleId: string) =>
  useQuery({
    queryKey: ["labels", vehicleId],
    queryFn: () => getLabelsByVehicleId(vehicleId),
    enabled: !!vehicleId,
  });

export const useLabelsHistoryByEmployeeId = (employeeId: string) =>
  useQuery({
    queryKey: ["labelsHistory", "employee", employeeId],
    queryFn: () => getLabelsHistoryByEmployeeId(employeeId),
    enabled: !!employeeId,
  });

export const useLabelsHistory = () =>
  useQuery({
    queryKey: ["labelsHistory"],
    queryFn: () => getLabelsHistory(),
  });
