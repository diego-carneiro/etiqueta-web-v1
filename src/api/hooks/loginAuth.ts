import { useMutation } from "@tanstack/react-query";
import { employeeLogin, adminLogin } from "../services/loginService";

export const useEmployeeLogin = () =>
  useMutation({
    mutationFn: employeeLogin,
  });

export const useAdminLogin = () =>
  useMutation({
    mutationFn: adminLogin,
  });
