import React from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import TokenMonitor from "../components/shared/TokenMonitor";

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TokenMonitor />
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
