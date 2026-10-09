import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createLabel,
  getLabelsByVehicleId,
  getLabelsByEmployeeId,
  getLabels,
  type CreateLabelParams,
  type LabelsPaginationHeaders,
  type LabelsParams,
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

export const useLabelsByEmployeeId = (employeeId: string) =>
  useQuery({
    queryKey: ["labels", "employee", employeeId],
    queryFn: () => getLabelsByEmployeeId(employeeId),
    enabled: !!employeeId,
  });

export interface UseLabelsParams {
  params?: LabelsParams;
  paginationHeaders?: LabelsPaginationHeaders;
}

export const useLabels = (options?: UseLabelsParams) =>
  useQuery({
    queryKey: ["labels", options?.params, options?.paginationHeaders],
    queryFn: () => getLabels(options?.params, options?.paginationHeaders),
  });
