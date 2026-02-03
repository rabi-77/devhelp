import { superAdminApi } from "@/api/superAdmin.api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Building2,
  Users,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
const SuperAdminGetAllCompanies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["companies", page, limit, search, status],
    queryFn: () =>
      superAdminApi.getAllCompanies({
        page,
        limit,
        search,
        status,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });
  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("search", searchInput);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };
  const handleFilterChange = (filterType: string, value: string) => {
    if (value) {
      searchParams.set(filterType, value);
    } else {
      searchParams.delete(filterType);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };
  const clearFilters = () => {
    searchParams.delete("status");
    searchParams.delete("search");
    setSearchInput("");
    setSearchParams(searchParams);
  };
  const activeFiltersCount = [status].filter(Boolean).length;
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive font-medium">
            Error fetching companies
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
  const { companies, pagination, stats } = data!.data;
  return (
    <div className="p-8 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
        <p className="text-slate-600 mt-1">
          Manage all companies on the platform
        </p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalCompanies}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              <span className="text-green-600 font-medium">
                {stats.activeCompanies}
              </span>{" "}
              active
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-slate-600 mt-1">Across all companies</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹
              {companies
                .reduce((acc: number, c: any) => acc + c.monthlyRevenue, 0)
                .toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Total recurring revenue
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Trial Users
            </CardTitle>
            <Building2 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.trialCompanies}
            </div>
            <p className="text-xs text-slate-600 mt-1">On trial period</p>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filters */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search companies by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              <Button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-slate-300 text-slate-700 hover:bg-slate-50 ${showFilters ? "bg-slate-100" : ""}`}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      {/* Companies Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">All Companies</CardTitle>
          <CardDescription className="text-slate-600">
            Showing {companies.length} of {pagination.totalItems} companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700">Company</TableHead>
                <TableHead className="text-slate-700">Users</TableHead>
                <TableHead className="text-slate-700">Projects</TableHead>
                <TableHead className="text-slate-700">Revenue</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-right text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company: any) => (
                <TableRow
                  key={company.id}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">
                        {company.name}
                      </p>
                      <p className="text-sm text-slate-500">{company.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="h-4 w-4 text-slate-400" />
                      {company.totalUsers}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {company.totalProjects}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    ₹{company.monthlyRevenue.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/super-admin/companies/${company.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(page - 1)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(page + 1)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default SuperAdminGetAllCompanies;
