import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";

export default function PlayButton() {
  return (
    <Button size="lg" asChild>
      <Link href="/">
        Play Now
        <ArrowRight />
      </Link>
    </Button>
  );
}
