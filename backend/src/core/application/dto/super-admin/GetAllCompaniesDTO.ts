export interface GetAllCompaniesRequestDTO {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface CompanySummary {
  id: string;
  name: string;
  email: string;
  status: string;
  totalUsers: number;
  totalProjects: number;
  monthlyRevenue: number;
  lastActiveAt: string;
  createdAt: string;
}

export interface GetAllCompaniesResponseDTO {
  success: boolean;
  data: {
    companies: CompanySummary[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    stats: {
      totalCompanies: number;
      activeCompanies: number;
      inactiveCompanies: number;
      suspendedCompanies: number;
      trialCompanies: number;
      totalUsers: number;
      totalProjects: number;
    };
  };
}
