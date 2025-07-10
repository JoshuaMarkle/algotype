"use client";

import { Settings2, Brush, Palette, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import { cn } from "@/lib/utils";

export default function SettingsSidebar({ active, onChange, user, className }) {
  const sections = [
    ...(user ? [{ id: "account", label: "Account", icon: User2 }] : []),
    { id: "appearance", label: "Appearance", icon: Brush },
    { id: "theme", label: "Theming", icon: Palette },
  ];
  return (
    <Sidebar className={cn("mt-2 px-2 w-64", className)} collapsible="icon">
      <SidebarHeader className="px-4 pt-4 pb-0 group-data-[collapsible=icon]:hidden">
        <h1 className="font-semibold truncate">Settings</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {sections.map(({ id, label, icon: Icon }) => (
              <SidebarMenuItem
                key={id}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 rounded transition-colors",
                  id === active && "bg-muted text-foreground",
                )}
              >
                <button
                  type="button"
                  onClick={() => onChange(id)}
                  className="flex w-full items-center gap-2"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {label}
                  </span>
                </button>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 p-3">
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          AlgoType v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
