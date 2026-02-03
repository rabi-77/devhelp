import api from "./axios.config";

// ... existing code ...

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

export interface GetCompanyUsersResponse {
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

export const getCompanyUsers = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    role?: string,
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (role) params.append("role", role);

    const response = await api.get<GetCompanyUsersResponse>(
        `/company/users?${params.toString()}`,
    );
    return response.data;
};

export const updateUserStatus = async (userId: string, status: "active" | "blocked") => {
    const response = await api.patch(`/company/users/${userId}/status`, { status });
    return response.data;
};
