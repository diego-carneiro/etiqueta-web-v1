import api from "../axios";

export type Company = {
  id: string;
  legalName: string;
  tradeName: string;
  taxId: string;
  email: string;
  isActive: boolean;
  approvalStatus: number;
};

export type GetCompaniesResponse = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: Company[];
};

export const getCompanies = async (): Promise<GetCompaniesResponse> => {
  const response = await api.get("/companies");
  console.log(response.data);

  return response.data;
};
