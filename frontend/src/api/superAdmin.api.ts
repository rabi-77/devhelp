import api from "./axios.config";

export interface SuperAdminUser {
  id: string;
  email: string;
  role: "super_admin";
  firstName?: string; // Optional for compatibility
  lastName?: string;  // Optional for compatibility
}

export const getAllCompanies = async (params: any) => {
  const response = await api.get("/super-admin/companies", { params });
  return response.data;
};

export const getCompany = async (id: string) => {
  const response = await api.get(`/super-admin/companies/${id}`);
  return response.data;
};

export const updateCompanyStatus = async (
  companyId: string,
  status: "active" | "suspended" | "inactive",
) => {
  const response = await api.patch(`/super-admin/companies/${companyId}/status`, {
    status,
  });
  return response.data;
};

export const superAdminLogin = async (data: any) => {
  const response = await api.post("/super-admin/login", data);
  return response.data;
};

export const superAdminApi = {
  getAllCompanies,
  getCompany,
  updateCompanyStatus,
  superAdminLogin,
};
