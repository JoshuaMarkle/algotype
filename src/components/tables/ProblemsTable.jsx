"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { Settings2 } from "lucide-react";
import { getColumns } from "@/components/tables/utils/getColumns";
import { useDebounce } from "@/lib/useDebounce";
import { supabase } from "@/lib/supabaseClient";

export default function GenericProblemsTable({ mode }) {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [allLanguages, setAllLanguages] = useState(["all"]);

  const [pageIndex, setPageIndex] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 50;

  const columns = getColumns(mode);

  // Fetch data and filter/search
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);

      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("challenges")
        .select("id, title, lines, source, language, slug, mode", {
          count: "exact",
        })
        .eq("mode", mode);

      if (selectedLanguage !== "all") {
        query = query.eq("language", selectedLanguage);
      }

      if (debouncedSearch.trim()) {
        query = query.ilike("title", `%${debouncedSearch.trim()}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) {
        setError(error.message);
        setProblems([]);
        setTotalRows(0);
      } else {
        setProblems(data || []);
        setTotalRows(count || 0);
      }

      setLoading(false);
    };

    fetchProblems();
  }, [pageIndex, debouncedSearch, selectedLanguage, mode]);

  // A filter/search will reset the page index to 0
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, selectedLanguage, mode]);

  // Get all the languages
  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("language")
        .eq("mode", mode);

      if (!error && data) {
        const langs = Array.from(new Set(data.map((d) => d.language))).sort();
        setAllLanguages(["all", ...langs]);
      }
    };

    fetchLanguages();
  }, [mode]);

  // Create the table
  const table = useReactTable({
    data: problems,
    columns,
    pageCount: -1,
    state: {
      pagination: { pageIndex, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Check for errors
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search for a title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
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
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing{" "}
          {table.getRowModel().rows.length +
            table.getState().pagination.pageIndex * pageSize}{" "}
          of {totalRows} problems
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
            disabled={problems.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
