import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users as UsersIcon,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,

  ShieldBan,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyUsers, updateUserStatus } from "@/api/company.api";
import { useState } from "react";
import { toast } from "react-hot-toast";

const TeamMembers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company-users", page, limit, search, role, status],
    queryFn: () => getCompanyUsers(page, limit, search, status, role),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "blocked";
    }) => updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
      toast.success("User status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("search", searchInput);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value && value !== "all") {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const statusVariants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    invited: "secondary",
    blocked: "destructive",
    inactive: "outline",
  };

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading team members. Please try again.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team Members
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your team, invite users, and control access.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/members/invite")}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </form>
        <div className="flex gap-4 w-full md:w-auto">
          {/* Native Select for Roles */}
          <select
            value={role || "all"}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>

          {/* Native Select for Status */}
          <select
            value={status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="blocked">Blocked</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : data?.data.users.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 mb-4">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No team members found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              {search || role || status
                ? "Try adjusting your filters or search terms."
                : "Get started by inviting your first team member."}
            </p>
            {!search && !role && !status && (
              <Button
                onClick={() => navigate("/admin/members/invite")}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Invite Member
              </Button>
            )}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="font-medium">User</TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Joined</TableHead>
                  <TableHead className="font-medium text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.users.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-100 capitalize"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariants[user.status] || "secondary"}
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.status === "invited" ? (
                        <span className="text-sm text-gray-500 italic">
                          Pending acceptance
                        </span>
                      ) : user.status === "blocked" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              userId: user.id,
                              status: "active",
                            })
                          }
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              userId: user.id,
                              status: "blocked",
                            })
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={user.role === "admin"}
                        >
                          <ShieldBan className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Page {data?.data.pagination.currentPage} of{" "}
                {data?.data.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!data?.data.pagination.hasPrevPage}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!data?.data.pagination.hasNextPage}
                  className="h-8 px-3"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
