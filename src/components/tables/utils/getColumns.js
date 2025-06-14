import Link from "next/link";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

export function getColumns(mode) {
  const commonColumns = {
    title: {
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
    lines: { accessorKey: "lines", header: "Lines" },
    language: { accessorKey: "language", header: "Language" },
    source: {
      accessorKey: "source",
      header: "Source",
      cell: ({ getValue }) => {
        const url = getValue();
        return url ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-fg-2 hover:text-primary"
          >
            <ExternalLink className="size-4" />
          </Link>
        ) : null;
      },
    },
  };

  switch (mode) {
    default: // Files + Algorithms
      return [
        commonColumns.title,
        commonColumns.lines,
        commonColumns.language,
        commonColumns.source,
      ];
  }
}
