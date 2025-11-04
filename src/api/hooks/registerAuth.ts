import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/registerService";

export const useRegister = () =>
  useMutation({
    mutationFn: register,
  });
