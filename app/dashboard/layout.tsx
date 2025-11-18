import React from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <Sidebar />
      <div className="page-wrapper">{children}</div>
    </>
  );
}

export default Layout;
