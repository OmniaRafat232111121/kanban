"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTaskStats } from "@/lib/api";

export function useTaskStats() {
  return useQuery({
    queryKey: ["task-stats"],
    queryFn: fetchTaskStats,
  });
}
