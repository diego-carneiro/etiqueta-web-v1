import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/loginService";

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
