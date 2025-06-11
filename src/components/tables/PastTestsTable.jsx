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
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { getUserHistoryPaginated } from "@/lib/history";

export default function PastTestsTable() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // Fetch data at start and page change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await getUserHistoryPaginated({
          page: pageIndex,
          pageSize,
        });
        setTests(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
        setTests([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIndex]);

  const allLanguages = useMemo(() => {
    const langs = new Set(tests.map((p) => p.language));
    return ["all", ...Array.from(langs).sort()];
  }, [tests]);

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
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Language: {selectedLanguage}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {allLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onSelect={() => setSelectedLanguage(lang)}
              >
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

              if (row) {
                return (
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
                );
              } else {
                return (
                  <TableRow key={`empty-${i}`} className="opacity-30">
                    {columns.map((col) => (
                      <TableCell key={col.accessorKey}>-</TableCell>
                    ))}
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {pageIndex * pageSize + 1}–
          {pageIndex * pageSize + tests.length} of {total || "?"} tests
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
            disabled={tests.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
