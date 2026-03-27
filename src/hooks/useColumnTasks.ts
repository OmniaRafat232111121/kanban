"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTasksPage, PAGE_SIZE } from "@/lib/api";
import type { TaskColumn } from "@/types/task";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchStore } from "@/store/searchStore";

export function useColumnTasks(column: TaskColumn) {
  const search = useSearchStore((s) => s.search);
  const debouncedSearch = useDebouncedValue(search, 300);

  return useInfiniteQuery({
    queryKey: ["tasks", column, debouncedSearch],
    queryFn: ({ pageParam }) =>
      fetchTasksPage({
        column,
        page: pageParam,
        limit: PAGE_SIZE,
        q: debouncedSearch,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
  });
}
