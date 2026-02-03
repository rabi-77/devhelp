export interface SuperAdminPermissions {
    managePlatform: boolean;
    manageCompanies: boolean;
    viewAllData: boolean;
}

export interface SuperAdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "super_admin";
    status: "active";
    permissions: SuperAdminPermissions;
}
