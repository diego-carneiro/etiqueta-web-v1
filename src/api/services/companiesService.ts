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
  verifiedCount: number;
  pendingCount: number;
  data: Company[];
};

export type CompanyDashboardSummary = {
  companyId: string;
  companyName: string;
  labelCount: number;
  lastLabelDate: string;
};

export type CompaniesDashboardResponse = {
  totalLabelsInSystem: number;
  labelsGeneratedThisMonth: number;
  totalCompanies: number;
  companySummaries: CompanyDashboardSummary[];
};

export const getCompanies = async (
  page: number,
  pageSize: number,
): Promise<GetCompaniesResponse> => {
  const response = await api.get("/companies", {
    headers: {
      page: String(page),
      pageSize: String(pageSize),
    },
  });
  return response.data;
};

export const approveCompany = async (companyId: string): Promise<void> => {
  await api.post(`/companies/${companyId}/approve`);
};

export const getCompaniesDashboard =
  async (): Promise<CompaniesDashboardResponse> => {
    const response = await api.get("/companies/dashboard");
    return response.data;
  };
