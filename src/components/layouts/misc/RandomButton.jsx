"use client";

import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";
import { gotoRandomTest } from "@/components/typing/utils/randomTest";

export default function ClientGotoButton() {
  return (
    <Button onClick={gotoRandomTest}>
      Try Now
      <ArrowRight />
    </Button>
  );
}
