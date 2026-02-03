export interface GetCompanyResponseDTO {
  success: boolean;
  data: {
    company: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      website: string | null;
      address: any | null;
      status: string;
      monthlyRevenue: number;
      totalUsers: number;
      activeUsers: number;
      totalProjects: number;
      activeProjects: number;
      storageUsed: number;
      storageLimit: number;
      admin: {
        id: string;
        name: string;
        email: string;
        lastLogin: string;
      } | null;
      stats: {
        totalTasks: number;
        completedTasks: number;
      };
      billing: {
        monthlyRevenue: number;
        lastPaymentDate: string | null;
        nextBillingDate: string | null;
      };
      createdAt: string;
      lastActiveAt: string;
    };
  };
}
