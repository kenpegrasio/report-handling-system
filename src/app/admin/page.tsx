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
import { useState, useEffect } from "react";

interface User {
  id: string;
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "resolved" | "unresolved"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "review" | "user" | "business" | "service" | "other"
  >("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const url = new URL("/api/reports", window.location.origin);
        url.searchParams.set("status", statusFilter);
        if (typeFilter !== "all") {
          url.searchParams.set("type", typeFilter);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [statusFilter, typeFilter]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Report Management
            </CardTitle>
            <div className="flex gap-4">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-background border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="review">Review</option>
                <option value="user">User</option>
                <option value="business">Business</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {isLoading ||
                `Showing ${reports.length} reports (${statusFilter}${
                  typeFilter !== "all" ? ` · ${typeFilter}` : ""
                })`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <svg
                      className="mx-auto h-6 w-6 text-gray-500 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
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
                              by {report.resolver.name || report.resolver.email}
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
