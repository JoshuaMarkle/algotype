"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Keyboard, LogIn, Settings } from "lucide-react";

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
import { gotoRandomTest } from "@/components/typing/utils/randomTest";
import { getCurrentProfile } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Navbar({ className = "", ...props }) {
  // Immediately get user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentProfile();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // Render navbar
  return (
    <div
      {...props}
      className={cn(
        "fixed top-0 left-0 w-full flex flex-row justify-between px-4 py-2 border-b border-border bg-background z-100",
        className,
      )}
    >
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="flex flex-row gap-2 font-semibold">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-blue size-5"
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
                </svg>{" "}
                AlgoType
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Gamemodes</NavigationMenuTrigger>
            <NavigationMenuContent className="absolute top-full translate-y-2">
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/algorithms">
                      <div className="font-medium">Algorithms</div>
                      <div className="text-muted-foreground">
                        Type out popular algorithms and leetcode solutions
                      </div>
                    </Link>
                  </NavigationMenuLink>
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
                    <div>
                      <div className="text-fg-3">Snippets</div>
                      <div className="text-fg-3">
                        Practice specific language features
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Random Button */}
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={gotoRandomTest}
              className="flex flex-row justify-center items-center gap-2"
            >
              <Keyboard className="size-4" /> Play
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {/* Account */}
          {!loading ? (
            user ? (
              <NavbarAccount user={user} />
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/login"
                      className="flex flex-row justify-center items-center gap-2"
                    >
                      <LogIn className="size-4" /> Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/settings"
                      className="flex flex-row justify-center items-center gap-2"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )
          ) : (
            <Skeleton className="size-6 rounded-full mr-8" />
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
