import { useMutation } from "@tanstack/react-query";
import { companyLogin, adminLogin } from "../services/loginService";
import { authStorage } from "../authStorage";

export const useCompanyLogin = () =>
  useMutation({
    mutationFn: companyLogin,
    onSuccess: (data) => {
      authStorage.setToken(data.token);
    },
  });

export const useAdminLogin = () =>
  useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      authStorage.setToken(data.token);
    },
  });
