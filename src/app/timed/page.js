import { redirect } from "next/navigation";

import { DEFAULT_TIMED, timedSlug } from "@/lib/timed";

export default function TimedIndex() {
  redirect(
    `/timed/${timedSlug(DEFAULT_TIMED.language, DEFAULT_TIMED.seconds)}`,
  );
}
