import { useMutation } from "@tanstack/react-query";
import { registerCompany } from "../services/registerService";

export const useRegisterCompany = () =>
  useMutation({
    mutationFn: registerCompany,
  });
