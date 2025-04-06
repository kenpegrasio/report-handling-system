"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

const reportTypeOptions = [
  "review",
  "user",
  "business",
  "service",
  "other",
] as const;

const formSchema = z.object({
  type: z.enum(reportTypeOptions),
  target_id: z.number().min(1, "Target ID must be at least 1"),
  reason: z.string().min(1, "Reason is required").max(255),
  description: z.string().max(500).optional(),
});

export default function ReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "other",
      target_id: undefined,
      reason: "",
      description: "",
    },
  });
  const [mounted, setMounted] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getCurrentUser();
    if (!user) return;
  
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          submitted_by: user.userId.toString()
        }),
      });
  
      if (response.ok) {
        alert("Report submitted successfully.");
        window.location.href = "/";
      } else {
        alert("Failed to submit report.");
      }
    } catch (error: any) {
      alert("An unexpected error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
            Submit a Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Report Type
                      <span className="ml-1 text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {reportTypeOptions.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Target ID
                      <span className="ml-1 text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the ID you're reporting"
                        value={field.value || ""}
                        onChange={(e) => {
                          const num = parseInt(
                            e.target.value.replace(/\D/g, "")
                          );
                          field.onChange(isNaN(num) ? undefined : num);
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reason
                      <span className="ml-1 text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Briefly describe the reason for your report"
                        {...field}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Additional Details (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide any additional information that might help us understand your report"
                        className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
