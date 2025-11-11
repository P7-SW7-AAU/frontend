import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import CreateTeamModal from "@/components/modals/CreateTeamModal";
import DeleteTeamModal from "@/components/modals/DeleteTeamModal";
import EditTeamModal from "@/components/modals/EditTeamModal";
import CreateLeagueModal from "@/components/modals/CreateLeagueModal";
import DeleteLeagueModal from "@/components/modals/DeleteLeagueModal";
import EditLeagueModal from "@/components/modals/EditLeagueModal";
import JoinLeagueModal from "@/components/modals/JoinLeagueModal";
import LeaveLeagueModal from "@/components/modals/LeaveLeagueModal";
import SelectTeamModal from "@/components/modals/SelectTeamModal";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FantasyPro",
  description: "Your ultimate fantasy sports platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Toaster />
            <CreateTeamModal />
            <DeleteTeamModal teamId={null} />
            <EditTeamModal teamId={null} />
            <CreateLeagueModal />
            <DeleteLeagueModal leagueId={null} />
            <EditLeagueModal leagueId={null} />
            <JoinLeagueModal />
            <LeaveLeagueModal leagueId={null} teamId={null} userId={null} />
            <SelectTeamModal leagueId={null} teams={[]} />
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
