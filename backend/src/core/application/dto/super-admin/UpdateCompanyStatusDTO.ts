export interface UpdateCompanyStatusRequestDTO {
    companyId: string;
    status: "active" | "suspended" | "inactive";
}

export interface UpdateCompanyStatusResponseDTO {
    success: boolean;
    message: string;
    data: {
        id: string;
        status: string;
    };
}
