import Link from "next/link";
import { CircleUser, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { NavigationMenuLink } from "@/components/ui/NavigationMenu";
import {
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/NavigationMenu";
import { logout } from "@/lib/auth";

export default function NavbarAccount({ user }) {
  if (!user) {
    return (
      <NavigationMenuLink asChild>
        <Link href="/login">Login</Link>
      </NavigationMenuLink>
    );
  }

  return (
    <>
      <NavigationMenuTrigger className="space-x-2">
        <Avatar className="size-6">
          <AvatarImage
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
          />
          <AvatarFallback>{user.user_metadata.full_name?.[0]}</AvatarFallback>
        </Avatar>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid divide-y-1 divide-border">
          <li className="p-2 pb-4">
            <div>{user.user_metadata.full_name}</div>
            <div className="text-sm text-fg-2">{user.user_metadata.email}</div>
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
    </>
  );
}
