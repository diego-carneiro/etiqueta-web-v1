import api from "../axios";

export type CompanyRegisterParams = {
  legalName: string;
  tradeName: string;
  taxId: string;
  email: string;
  password: string;
  socialMedia: string;
  websiteUrl: string;
  address: {
    postalCode: string;
    street: string;
    number: number;
    additionalInfo: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  phoneNumbers: {
    countryCode: number;
    nationalNumber: number;
    extension: number;
    phoneNumber: string;
  }[];
  providedServiceIds: number[];
  openingHours: {
    day: number;
    start: string;
    end: string;
    description: string;
  }[];
};

export const registerCompany = async (params: CompanyRegisterParams) => {
  const { data } = await api.post("/companies", params);
  return data;
};
