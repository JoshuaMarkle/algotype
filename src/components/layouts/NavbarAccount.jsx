import Link from "next/link";
import { CircleUser, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { NavigationMenuLink } from "@/components/ui/NavigationMenu";
import {
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuItem,
} from "@/components/ui/NavigationMenu";
import { getCurrentProfile } from "@/lib/auth";
import { logout } from "@/lib/auth";

export default function NavbarAccount({ user }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="space-x-2">
        <Link href="/account">
          <Avatar className="size-6">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback>{user.username?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="right-0 left-auto origin-top-right absolute top-full translate-y-2">
        <ul className="grid divide-y-1 divide-border w-[250px]">
          <li className="p-2 pb-4">
            <div className="text-fg truncate">{user.username}</div>
            <div className="truncate text-sm text-fg-2">{user.email}</div>
          </li>
          <li className="py-2">
            <NavigationMenuLink asChild>
              <Link
                href="/account"
                className="flex flex-row items-center gap-2"
              >
                <CircleUser className="size-4" /> Account
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/settings"
                className="flex flex-row items-center gap-2"
              >
                <Settings className="size-4" /> Settings
              </Link>
            </NavigationMenuLink>
          </li>
          <li className="pt-2">
            <NavigationMenuLink asChild>
              <div
                onClick={logout}
                className="flex flex-row items-center gap-2"
              >
                <LogOut className="size-4" /> Logout
              </div>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
