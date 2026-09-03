import { Outlet } from "@tanstack/react-router";
import { useState } from "react";

import { Footer } from "./Footer";
import { MobileSidebar } from "./MobileSidebar";
import { Navbar } from "./Navbar";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
