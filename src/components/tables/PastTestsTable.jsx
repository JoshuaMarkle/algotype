"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Settings2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/DropdownMenu";
import { getUserHistoryPaginated } from "@/lib/history";

// history: the cached most recent results (newest first); total: number of
// results on the account. Pages past the cached rows are fetched on demand.
export default function PastTestsTable({
  history = [],
  total = 0,
  loading: loadingHistory = false,
}) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const from = pageIndex * pageSize;
  const cached = from + pageSize <= history.length || history.length >= total;

  const [remote, setRemote] = useState({ page: null, tests: [] });
  const [error, setError] = useState(null);

  // Fetch pages that are not in the cache
  useEffect(() => {
    setError(null);
    if (loadingHistory || cached) return;
    let alive = true;

    getUserHistoryPaginated({ page: pageIndex, pageSize })
      .then(({ data }) => alive && setRemote({ page: pageIndex, tests: data }))
      .catch((err) => {
        console.error(err);
        if (alive) setError(err.message || "Something went wrong.");
      });

    return () => {
      alive = false;
    };
  }, [pageIndex, cached, loadingHistory]);

  const tests = useMemo(
    () =>
      cached
        ? history.slice(from, from + pageSize)
        : remote.page === pageIndex
          ? remote.tests
          : [],
    [cached, history, from, remote, pageIndex],
  );
  const loading =
    loadingHistory || (!cached && remote.page !== pageIndex && !error);
  const totalRows = Math.max(total, history.length);

  const columns = useMemo(
    () => [
      { accessorKey: "wpm", header: "WPM" },
      { accessorKey: "acc", header: "Accuracy" },
      { accessorKey: "time", header: "Time" },
      { accessorKey: "language", header: "Language" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "mode", header: "Mode" },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tests,
    columns,
    pageCount: -1,
    state: {
      pagination: { pageIndex, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div>
        <div className="flex flex-row gap-4">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-6 w-24 mb-6" />
        </div>
        <div className="border border-border rounded-sm p-8 pb-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 mb-6" />
          ))}
        </div>
        <div className="flex flex-row gap-4">
          <Skeleton className="h-6 w-32 mt-6" />
          <Skeleton className="h-6 w-16 ml-auto mt-6" />
          <Skeleton className="h-6 w-16 mt-6" />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Column controls */}
      <div className="flex flex-wrap items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings2 className="h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={() => column.toggleVisibility()}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {[...Array(pageSize)].map((_, i) => {
              const row = table.getRowModel().rows[i];

              return row ? (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    const { slug, mode } = row.original;
                    router.push(`/${mode}/${slug}`);
                  }}
                  className="cursor-pointer hover:bg-bg-3"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                <TableRow key={`empty-${i}`} className="opacity-30">
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey}>-</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {totalRows > 0
            ? `Showing ${pageIndex * pageSize + 1}–${pageIndex * pageSize + tests.length} of ${totalRows} tests`
            : "No tests yet"}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={(pageIndex + 1) * pageSize >= totalRows}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
