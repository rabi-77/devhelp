export interface UpdateUserStatusRequestDTO {
    userId: string;
    status: "active" | "blocked";
    companyId: string; // To ensure user belongs to the requester's company
}

export interface UpdateUserStatusResponseDTO {
    success: boolean;
    message: string;
    data: {
        id: string;
        status: string;
    };
}
