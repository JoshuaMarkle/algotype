"use client";

import Button from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { logout } from "@/lib/auth";

export default function ClientAccountPanel({ user }) {
  return (
    <>
      {/* Profile */}
      <div className="flex flex-row gap-4 justify-center align-items-center mt-12">
        <Avatar className="size-16 rounded-full">
          <AvatarImage
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
          />
          <AvatarFallback>{user.user_metadata.full_name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-xl leading-tight">
          <span className="truncate">{user.user_metadata.full_name}</span>
          <span className="truncate text-md text-fg-2">{user.email}</span>
        </div>
      </div>

      {/* Account Information */}
      <h3 className="text-xl mt-8">Message</h3>
      <p className="text-fg-2 mb-4">
        This is an account. To see this page, you must have authenticated!
      </p>

      {/* Actions */}
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
