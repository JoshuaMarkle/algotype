"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import { SidebarProvider } from "@/components/ui/Sidebar";
import SettingsSidebar from "@/components/layouts/SettingsSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { getCurrentProfile, deleteAccount } from "@/lib/auth";
import { formatIsoDate, langToNatural } from "@/lib/utils";
import { getSettings, setSetting } from "@/lib/settings";

export default function SettingsPage() {
  const [tab, setTab] = useState("account");
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(() => getSettings());

  useEffect(() => {
    async function fetchUser() {
      const u = await getCurrentProfile();
      if (!u) setTab("appearance");
      setUser(u);
    }

    fetchUser();
  }, []);

  const updateSetting = (key, value) => {
    const next = setSetting(key, value);
    setSettings(next);
  };

  return (
    <>
      <Navbar />
      <SidebarProvider>
        <SettingsSidebar
          active={tab}
          onChange={setTab}
          user={user}
          className="pt-[52px]"
        />
        <main className="flex-1 space-y-6 mt-[52px] settings">
          <div className="max-w-5xl mx-auto py-16 px-4">
            {tab === "account" && <AccountSettings user={user} />}
            {tab === "appearance" && (
              <AppearanceSettings
                settings={settings}
                onUpdate={updateSetting}
              />
            )}
            {tab === "theme" && <ThemeSettings />}
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </>
  );
}

function AccountSettings({ user }) {
  if (!user) return <div />;

  // Account
  const id = user.id;
  const username = user.username;
  const email = user.email;
  const created_at = user.created_at;
  const avatar_url = user.avatar_url;

  // Providers
  const providers = user.providers;
  const providerEmail = providers.includes("email");
  const providerGithub = providers.includes("github");
  const providerGoogle = providers.includes("google");

  return (
    <section>
      {/* Avatar + Stats */}
      <div>
        <div className="flex flex-row justify-center gap-8">
          <Avatar className="size-24 rounded-sm">
            <AvatarImage src={avatar_url} alt={username} />
            <AvatarFallback className="text-6xl">
              {username?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="truncate flex-1 flex flex-col justify-center text-left text-xl leading-tight">
            <div className="flex flex-col">
              <h2 className="truncate text-2xl">{username}</h2>
              <p className="truncate text-sm text-fg-2">{id}</p>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl mt-16">Account</h2>
      <table className="table-fixed w-full">
        <colgroup>
          <col className="w-64"></col>
        </colgroup>
        <tbody>
          <tr>
            <td className="text-fg-2">Username</td>
            {username ? (
              <td>{username}</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
          <tr>
            <td className="text-fg-2">Email</td>
            {email ? (
              <td>{email}</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
          <tr>
            <td className="text-fg-2">Created At</td>
            {created_at ? (
              <td>{formatIsoDate(created_at)}</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
        </tbody>
      </table>
      <h2 className="text-2xl mt-16">Providers</h2>
      <table className="w-full">
        <colgroup>
          <col className="w-64"></col>
        </colgroup>
        <tbody>
          <tr>
            <td className="text-fg-2">Email/Password</td>
            {providerEmail ? (
              <td>Connected</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
          <tr>
            <td className="text-fg-2">Github</td>
            {providerGithub ? (
              <td>Connected</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
          <tr>
            <td className="text-fg-2">Created At</td>
            {providerGoogle ? (
              <td>Connected</td>
            ) : (
              <td className="text-fg-2">Not Provided</td>
            )}
          </tr>
        </tbody>
      </table>
      <Button variant="destructive" onClick={deleteAccount} className="mt-16">
        Delete Account
      </Button>
    </section>
  );
}

function AppearanceSettings({ settings, onUpdate }) {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl">Appearance</h3>
        <p className="text-fg-2">General changes to the typing test.</p>
      </div>
      <table className="table-fixed w-full">
        <colgroup>
          <col></col>
          <col className="w-64 lg:w-96"></col>
        </colgroup>
        <tbody>
          <tr>
            <td>Show Line Numbers</td>
            <td>
              <ToggleGroup
                variant="outline"
                type="single"
                size="lg"
                className="w-full"
              >
                <ToggleGroupItem value="true" aria-label="Toggle bold">
                  true
                </ToggleGroupItem>
                <ToggleGroupItem value="false" aria-label="Toggle italic">
                  false
                </ToggleGroupItem>
              </ToggleGroup>
            </td>
          </tr>
          <tr>
            <td>Syntax Highlighting</td>
            <td>
              <ToggleGroup
                variant="outline"
                type="single"
                size="lg"
                className="w-full"
              >
                <ToggleGroupItem value="off" aria-label="Toggle bold">
                  off
                </ToggleGroupItem>
                <ToggleGroupItem value="char" aria-label="Toggle italic">
                  char
                </ToggleGroupItem>
                <ToggleGroupItem value="token" aria-label="Toggle italic">
                  token
                </ToggleGroupItem>
              </ToggleGroup>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function ThemeSettings() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl">Themes</h2>
        <p className="text-fg-2">
          Themes are currently under development. For now there is only the
          default dark theme.
        </p>
      </div>
    </section>
  );
}
