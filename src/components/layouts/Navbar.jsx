"use client";

import { React, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import Skeleton from "@/components/ui/Skeleton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import NavbarAccount from "@/components/layouts/NavbarAccount";

export default function Navbar() {
  // Immediately get user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // Render navbar
  return (
    <div className="flex flex-row justify-between px-4 py-2 border-b border-border bg-background">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                      href="/"
                    >
                      <div className="flex flex-row justify-start items-center gap-2 mt-4 mb-2 text-lg font-medium">
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-blue size-4"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.5858 5.29291C14.1953 5.68343 14.1953 6.3166 14.5858 6.70712L19.8787 12L14.5858 17.2929C14.1953 17.6834 14.1953 18.3166 14.5858 18.7071L15.2929 19.4142C15.6834 19.8048 16.3166 19.8048 16.7071 19.4142L23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9394L16.7071 4.5858C16.3166 4.19528 15.6834 4.19528 15.2929 4.5858L14.5858 5.29291Z"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.41421 5.29291C9.80474 5.68343 9.80474 6.3166 9.41421 6.70712L4.12132 12L9.41421 17.2929C9.80474 17.6834 9.80474 18.3166 9.41421 18.7071L8.70711 19.4142C8.31658 19.8048 7.68342 19.8048 7.29289 19.4142L0.93934 13.0607C0.353553 12.4749 0.353553 11.5251 0.93934 10.9394L7.29289 4.5858C7.68342 4.19528 8.31658 4.19528 8.70711 4.5858L9.41421 5.29291Z"
                          />
                        </svg>
                        AlgoType.net
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Typing practice for programmers
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Files">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Gamemodes</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/files">
                      <div className="font-medium">Files</div>
                      <div className="text-muted-foreground">
                        Type full implementations of real-world features &
                        software
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/algorithms">
                      <div className="font-medium">Algorithms</div>
                      <div className="text-muted-foreground">
                        Type out popular algorithms
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/syntax">
                      <div className="font-medium">Snippets</div>
                      <div className="text-muted-foreground">
                        Practice specific language features
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {!loading ? (
              <NavbarAccount user={user} />
            ) : (
              <div className="flex items-center space-x-4">
                <Skeleton className="size-6 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
