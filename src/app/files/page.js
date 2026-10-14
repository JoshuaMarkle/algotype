import ModeIndexPage from "@/components/layouts/ModeIndexPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Type Real Source Files | AlgoType",
  description:
    "Practice typing full source files and real-world feature implementations, not random words. Typing practice for programmers on AlgoType.",
  path: "/files",
});

export default function FilesPage() {
  return (
    <ModeIndexPage
      title="Files"
      description="Practice typing full source files in the language of your choice"
      mode="files"
    />
  );
}
