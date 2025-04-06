"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
  created_at: Date;
}

interface Report {
  id: string;
  type: "review" | "user" | "business" | "service" | "other";
  target_id: string;
  reason: string;
  description: string | null;
  submitted_by: string | null;
  resolved_by: string | null;
  resolved_at: Date | null;
  created_at: Date;
  submitter: User | null;
  resolver: User | null;
}

export default function ReportTable() {
  const { theme } = useTheme();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "resolved" | "unresolved"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "review" | "user" | "business" | "service" | "other"
  >("all");
  const [sortBy, setSortBy] = useState<keyof Report>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleResolveReport = async (reportId: string) => {
    const user = await getCurrentUser();
    if (!user) return;

    try {
      const response = await fetch(`/api/reports`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reportId,
          user_id: user.userId,
        }),
      });

      if (!response.ok) throw new Error("Failed to resolve report");

      alert("Report successfully resolved!");
      window.location.reload();
    } catch (error) {
      toast.error("Error resolving report!", {
        position: "top-left",
        style: {
          background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "white",
          color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
          borderColor:
            theme === "dark"
              ? "hsl(217.2 32.6% 17.5%)"
              : "hsl(214.3 31.8% 91.4%)",
        },
      });
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const url = new URL("/api/reports", window.location.origin);
        url.searchParams.set("status", statusFilter);
        url.searchParams.set("type", typeFilter);
        url.searchParams.set("sortBy", sortBy);
        url.searchParams.set("sortOrder", sortOrder);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", "10");

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();

        setReports(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [statusFilter, typeFilter, sortBy, sortOrder, page]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Report Management
            </CardTitle>
            <div className="flex flex-wrap gap-4">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as any);
                  setPage(1);
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm rounded-md border bg-background text-foreground border-input"
              >
                <option value="all">All Types</option>
                <option value="review">Review</option>
                <option value="user">User</option>
                <option value="business">Business</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Sort by:
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as keyof Report)
                      }
                      className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border bg-background text-foreground border-input"
                    >
                      <option value="id">Report ID</option>
                      <option value="created_at">Created At</option>
                      <option value="resolved_at">Resolved At</option>
                      <option value="type">Type</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.976a.75.75 0 111.08 1.04l-4.25 4.56a.75.75 0 01-1.08 0l-4.25-4.56a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "asc" | "desc")
                      }
                      className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border bg-background text-foreground border-input"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.976a.75.75 0 111.08 1.04l-4.25 4.56a.75.75 0 01-1.08 0l-4.25-4.56a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {isLoading
                ? "Loading..."
                : `Showing ${reports.length} reports (Page ${page} of ${totalPages})`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin h-6 w-6 mx-auto text-gray-500 border-4 border-t-transparent rounded-full" />
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">#{report.id}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                        {report.type}
                      </span>
                    </TableCell>
                    <TableCell>{report.target_id}</TableCell>
                    <TableCell>
                      {report.submitter?.name ||
                        report.submitter?.email ||
                        "Unknown"}
                    </TableCell>
                    <TableCell>
                      {report.resolved_at ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Resolved
                          {report.resolver && (
                            <span className="ml-1 text-green-600">
                              by {report.resolver.email || report.resolver.name}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unresolved
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell className="text-right">
                      <p
                        className="line-clamp-1"
                        title={report.description || undefined}
                      >
                        {report.description || "No description"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      {!report.resolved_at ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-green-50 hover:text-green-600 transition-colors"
                          onClick={() => handleResolveReport(report.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Resolved
                        </Button>
                      ) : (
                        <div className="flex items-center justify-end text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Resolved</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="mt-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
