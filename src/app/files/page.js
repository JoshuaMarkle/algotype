import ModeIndexPage from "@/components/layouts/ModeIndexPage";

export const metadata = {
  title: "Files | AlgoType",
  description:
    "Practice typing full source files and real-world feature implementations on AlgoType",
  alternates: { canonical: "https://algotype.net/files" },
};

export default function FilesPage() {
  return (
    <ModeIndexPage
      title="Files"
      description="Practice typing full source files in the language of your choice"
      mode="files"
    />
  );
}
