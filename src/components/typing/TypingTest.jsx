"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ListFilter, CircleUser, Ruler, Languages, X } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import TypingRenderer from "@/components/typing/TypingRenderer";
import TypingResults from "@/components/typing/TypingResults";
import { useTypingState } from "@/components/typing/hooks/useTypingState";
import { useAutoScroll } from "@/components/typing/hooks/useAutoScroll";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import { gotoRandomTest } from "@/components/typing/utils/randomTest";
import { submitTestHistory } from "@/lib/history";
import { cn, capitalize, langToNatural, naturalToLang } from "@/lib/utils";

export default function TypingTest({ challenge, slug }) {
  // Extract info from challenge
  const tokens = challenge.tokens;
  const mode = challenge.mode;
  const language = challenge.language;
  const source = challenge.source;

  // Stats reference
  const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });
  let wpmOverTime = useRef([]);
  const [ended, setEnded] = useState(null);

  const {
    lineIdx,
    tokenIdx,
    typed,
    wrong,
    started,
    done,
    currToken,
    cursorTokenIndices,
    lastWordIdx,
    textareaRef,
    handleKey,
    shouldShowCursor,
  } = useTypingState(tokens, stats);

  // Scrolling
  const currentLineRef = useRef(null);
  useAutoScroll(started, done, currentLineRef, tokenIdx, typed);

  // Prevent scrolling while typing
  useEffect(() => {
    if (started && !done) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [started, done]);

  // Auto-focus the hidden textarea
  useEffect(() => textareaRef.current?.focus(), [textareaRef]);

  // Store wpm data every 1 seconds
  useEffect(() => {
    if (!started || done) return;

    const interval = setInterval(() => {
      const { wpm, acc, time } = calculateStats(started, null, stats); // expect ended == null
      wpmOverTime.current.push({ wpm, acc, time });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, done, stats, ended]);

  // Return results when done
  useEffect(() => {
    if (started && done && !ended) {
      const now = performance.now();
      setEnded(now);

      const { wpm, acc, time } = calculateStats(started, now, stats);
      submitTestHistory({ wpm, acc, time, language, mode, slug });
    }
  }, [started, done, ended, language, mode, slug]);

  // Go to random test if TAB is pressed
  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        gotoRandomTest();
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, []);

  // --- Filter state + handlers ---
  const [filters, setFilters] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("filters");
      return stored
        ? JSON.parse(stored)
        : {
            language: null,
            minLength: null,
            maxLength: null,
          };
    }
    return {
      language: null,
      minLength: null,
      maxLength: null,
    };
  });

  // Persist filters across session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("filters", JSON.stringify(filters));
    }
  }, [filters]);

  const handleAddFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  const clearFilters = () => {
    setFilters({ language: null, minLength: null, maxLength: null });
  };

  const applyFilter = () => {
    gotoRandomTest(filters);
  };

  const SIZE_FILTERS = {
    large: { minLength: 100, maxLength: null },
    medium: { minLength: 50, maxLength: 100 },
    small: { minLength: null, maxLength: 50 },
  };

  const handleAddSizeFilter = (key) => {
    const size = SIZE_FILTERS[key];
    if (!size) return;

    // Clear both length filters before applying new ones
    setFilters((prev) => ({
      ...prev,
      minLength: null,
      maxLength: null,
      ...size,
    }));
  };

  return (
    <div className="relative select-none flex flex-col flex-1 max-w-5xl w-full mx-auto">
      <div
        className="fixed top-0 left-0 w-full h-full"
        onClick={() => textareaRef.current?.focus()}
      ></div>
      <textarea
        ref={textareaRef}
        onKeyDown={handleKey}
        className="absolute w-0 h-0 opacity-0"
      />

      {/* Navbar */}
      <div
        className={cn(
          "w-full z-50 transition-all duration-500 ease-in-out",
          "flex flex-row justify-between px-4 pt-4 pb-4 bg-background",
        )}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <button
                className="text-sm font-medium text-muted-foreground hover:text-fg transition"
                onClick={() => gotoRandomTest({ ...filters })}
              >
                {capitalize(mode)}
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <button
                className="text-sm font-medium text-muted-foreground hover:text-fg transition"
                onClick={() => {
                  const updatedFilters = { ...filters, language };
                  setFilters(updatedFilters);
                  sessionStorage.setItem(
                    "filters",
                    JSON.stringify(updatedFilters),
                  );
                  gotoRandomTest(updatedFilters);
                }}
              >
                {langToNatural(language)}
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row gap-6">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ListFilter className="size-4 text-fg-2 hover:text-fg cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>

              {/* Dynamic Filter Badges */}
              <div className="px-2 pb-1 space-x-1 space-y-1">
                {filters.language && (
                  <Badge
                    variant="secondary"
                    className="group cursor-pointer"
                    onClick={() => handleRemoveFilter("language")}
                  >
                    <Languages className="size-4 group-hover:hidden" />
                    <X className="size-4 hidden group-hover:inline" />
                    {filters.language}
                  </Badge>
                )}
                {filters.minLength && (
                  <Badge
                    variant="secondary"
                    className="group cursor-pointer"
                    onClick={() => handleRemoveFilter("minLength")}
                  >
                    <Ruler className="size-4 group-hover:hidden" />
                    <X className="size-4 hidden group-hover:inline" />
                    Min {filters.minLength}
                  </Badge>
                )}
                {filters.maxLength && (
                  <Badge
                    variant="secondary"
                    className="group cursor-pointer"
                    onClick={() => handleRemoveFilter("maxLength")}
                  >
                    <Ruler className="size-4 group-hover:hidden" />
                    <X className="size-4 hidden group-hover:inline" />
                    Max {filters.maxLength}
                  </Badge>
                )}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Size</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handleAddSizeFilter("large")}
                      >
                        Large
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddSizeFilter("medium")}
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddSizeFilter("small")}
                      >
                        Small
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled className="text-fg-2">
                          Custom
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuLabel>Bounds</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="flex flex-row gap-2">
                              <Input
                                placeholder="Lower"
                                type="number"
                                className="w-24"
                                onChange={(e) =>
                                  handleAddFilter(
                                    "minLength",
                                    Number(e.target.value),
                                  )
                                }
                              />
                              <Input
                                placeholder="Upper"
                                type="number"
                                className="w-24"
                                onChange={(e) =>
                                  handleAddFilter(
                                    "maxLength",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Language</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {["Python", "C++", "JavaScript", "Java", "Rust"].map(
                        (lang) => (
                          <DropdownMenuItem
                            key={lang}
                            onClick={() =>
                              handleAddFilter("language", naturalToLang(lang))
                            }
                          >
                            {lang}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                Clear filters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={applyFilter}>Apply</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/account">
            <CircleUser className="size-4 text-fg-2 hover:text-fg" />
          </Link>
        </div>
      </div>

      {/* Test / Results */}
      <div
        className={cn(
          "transition-opacity duration-500",
          done
            ? "opacity-0 pointer-events-none absolute"
            : "opacity-100 relative",
        )}
      >
        <TypingRenderer
          tokens={tokens}
          lineIdx={lineIdx}
          tokenIdx={tokenIdx}
          currToken={currToken}
          typed={typed}
          wrong={wrong}
          currentLineRef={currentLineRef}
          shouldShowCursor={shouldShowCursor}
          cursorTokenIndices={cursorTokenIndices}
          lastWordIdx={lastWordIdx}
        />
      </div>
      <div
        className={cn(
          "flex-1 flex transition-opacity duration-500",
          done
            ? "opacity-100 relative"
            : "opacity-0 pointer-events-none absolute",
        )}
      >
        <TypingResults
          started={started}
          ended={ended}
          stats={stats}
          data={wpmOverTime.current}
          source={source}
        />
      </div>
    </div>
  );
}
