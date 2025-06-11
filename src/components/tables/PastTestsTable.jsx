"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { ArrowUpDown, Settings2, ExternalLink } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { supabase } from "@/lib/supabaseClient";

export default function ProblemsTable() {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Fetch data
  useEffect(() => {
    const fetchProblems = async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("id, title, description, lines, source, language, slug, mode")
        .eq("mode", "files")
        .limit(1000);

      if (error) setError(error.message);
      else setProblems(data);

      setLoading(false);
    };

    fetchProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        if (selectedLanguage === "all") return true;
        return p.language === selectedLanguage;
      })
      .filter((p) => {
        return (
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [problems, selectedLanguage, search]);

  const allLanguages = useMemo(() => {
    const langs = new Set(problems.map((p) => p.language));
    return ["all", ...Array.from(langs).sort()];
  }, [problems]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "lines",
        header: "Lines",
      },
      {
        accessorKey: "language",
        header: "Language",
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ getValue }) => {
          const url = getValue();
          return url ? (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent row click
              className="inline-flex items-center text-fg-2 hover:text-primary"
            >
              <ExternalLink className="size-4" />
            </Link>
          ) : null;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredProblems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 100, pageIndex: 0 },
    },
  });

  if (loading) {
    return (
      <div>
        <div className="flex flex-row gap-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-8 w-24 mb-4 ml-auto" />
          <Skeleton className="h-8 w-24 mb-4" />
        </div>
        <div className="border border-border rounded-sm p-8 pb-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 mb-8" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search title or description..."
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
            {table.getRowModel().rows.length ? (
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
            table.getState().pagination.pageIndex * 100}{" "}
          of {filteredProblems.length} problems
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
