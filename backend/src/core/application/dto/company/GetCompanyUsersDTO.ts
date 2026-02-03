export interface GetCompanyUsersRequestDTO {
    companyId: string;
    page: number;
    limit: number;
    search?: string;
    status?: string;
    role?: string;
}

export interface UserSummary {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
    createdAt: string;
}

export interface GetCompanyUsersResponseDTO {
    success: boolean;
    data: {
        users: UserSummary[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}
